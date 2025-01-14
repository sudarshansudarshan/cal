// src/services/assessment.service.ts

import { AssessmentRepository } from '../repositories/assessment.repository';
import { AnswersRepository } from '../repositories/answers.repository';
import { SubmissionAnswers, GradingResult, QuestionSolution, NATSolution, MCQSolution, MSQSolution, DescriptiveSolution } from '../types/assessment.types';
import { AssessmentAttemptStatusEnum, AssessmentStatusEnum } from '@prisma/client';
import { retry } from '../utils/retry';
import { init } from 'express-oas-generator';

const assessmentRepo = new AssessmentRepository();
const answersRepo = new AnswersRepository();

interface LoginResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  scope: string;
  user_id: number;
}

interface DjangoSolutionResponse {
  question_type: 'NAT' | 'MCQ' | 'MSQ' | 'DESC';
  solution: {
    // NAT solution fields
    value?: number;
    tolerance_max?: number;
    tolerance_min?: number;
    decimal_precision?: number;
    // MCQ solution fields
    choice?: string;
    // MSQ solution fields
    choices?: string[];
    // Descriptive solution fields
    model_solution?: string;
    max_word_limit?: number;
    min_word_limit?: number;
    // Common field
    solution_explanation: string;
  };
}


export class AssessmentService {
  /**
   * Submits an assessment, stores the answers, and triggers grading immediately.
   * @param studentId - The ID of the student submitting the assessment.
   * @param courseInstanceId - The ID of the course instance.
   * @param assessmentId - The ID of the assessment.
   * @param answers - The submitted answers for the assessment.
   * @returns The attempt ID and the grading status (PASSED/FAILED).
   */

  public async startAssessment(studentId: string, courseInstanceId: string, assessmentId:string):Promise<{
    attemptId: number
  }> {

    await assessmentRepo.createAssessmentProgress(studentId, courseInstanceId, assessmentId);
    const { attemptId } = await assessmentRepo.createAttempt(studentId, courseInstanceId, assessmentId);
    return {attemptId}
  }

  public async submitAssessment(
    studentId: string,
    courseInstanceId: string,
    assessmentId: string,
    attemptId: number,
    answers: SubmissionAnswers
  ): Promise<{ attemptId: number; gradingStatus: AssessmentAttemptStatusEnum; assessmentGradingStatus: AssessmentStatusEnum;  correctAnswers: number; totalQuestions: number }> {
    // Step 1: Create a new assessment attempt

    // // Step 2: Ensure assessment progress exists
    // await assessmentRepo.createAssessmentProgress(studentId, assessmentId, courseInstanceId);
  
    // Step 3: Store the submitted answers in the database
    await answersRepo.storeAnswers(attemptId, studentId, courseInstanceId, answers);
  
    // Step 4: Update the attempt status to IN_PROGRESS
    await assessmentRepo.updateAttemptStatus(attemptId, AssessmentAttemptStatusEnum.IN_PROGRESS);
  
    // Step 5: Perform grading immediately
    const gradingResult: GradingResult = await this.gradeAssessmentAttempt(attemptId);
    const correctAnswers: number = gradingResult.correctAnswers;
    const totalQuestions: number = gradingResult.totalQuestions;
  
    // Step 6: Update the overall assessment status (PASSED/FAILED)
    const assessmentGradingResult =
      gradingResult.status === AssessmentAttemptStatusEnum.SUCCESS
        ? AssessmentStatusEnum.PASSED
        : AssessmentStatusEnum.FAILED;
    
    const gradingStatus = gradingResult.status;
  
    await assessmentRepo.updateAssessmentStatus(studentId, assessmentId, courseInstanceId, assessmentGradingResult);

    const assessmentGradingStatus = await assessmentRepo.getAssessmentProgress(studentId, assessmentId, courseInstanceId);
  
    return { attemptId, gradingStatus, assessmentGradingStatus,  correctAnswers, totalQuestions };
  }

  /**
   * Queues a grading job for an assessment attempt with retry logic.
   * @param attemptId - The ID of the assessment attempt.
   * @param studentId - The ID of the student.
   * @param assessmentId - The ID of the assessment.
   * @param courseInstanceId - The ID of the course instance.
   */
  private async queueGradingJob(attemptId: number, studentId: string, assessmentId: string, courseInstanceId: string): Promise<void> {
    try {
      await retry(async () => {
        // Perform grading for the attempt
        const gradingResult = await this.gradeAssessmentAttempt(attemptId);

        // Update the attempt's status based on the grading result
        await assessmentRepo.updateAttemptStatus(attemptId, gradingResult.status);

        // If the grading result is PASSED, update the overall assessment status
        if (gradingResult.status === AssessmentAttemptStatusEnum.SUCCESS) {
          await assessmentRepo.updateAssessmentStatus(studentId, assessmentId, courseInstanceId, AssessmentStatusEnum.PASSED);
        }
      }, 3, 2000); // Retry grading up to 3 times with a delay of 2000ms between attempts
    } catch (error) {
      console.error(`Grading failed for attempt ${attemptId}:`, error);
    }
  }

  /**
   * Grades an assessment attempt by comparing submitted answers with correct solutions.
   * @param attemptId - The ID of the assessment attempt.
   * @returns A grading result containing the number of correct answers, total questions, and grading status.
   */
  private async gradeAssessmentAttempt(attemptId: number): Promise<GradingResult> {
    // Retrieve the submitted answers for the attempt
    const answers = await assessmentRepo.getAttempt(attemptId);

    // Fetch the correct solutions for the submitted questions
    const solutions = await this.fetchSolutionsFromDjango(answers);

    // Calculate grades based on submitted answers and correct solutions
    return this.calculateGrades(answers, solutions);
  }

  /**
   * Fetches correct solutions for the given questions from the Django backend.
   * (Currently mocked; replace with actual Django API calls.)
   * @param answers - The submitted answers for the assessment.
   * @returns An array of correct solutions for the questions.
   */
  private async fetchSolutionsFromDjango(answers: SubmissionAnswers): Promise<QuestionSolution[]> {
    const questionIds = [
      ...answers.natAnswers.map(a => a.questionId),
      ...answers.mcqAnswers.map(a => a.questionId),
      ...answers.msqAnswers.map(a => a.questionId),
      ...answers.descriptiveAnswers.map(a => a.questionId)
    ];
  
    try {
      const URLBASE = "https://calm-447804.el.r.appspot.com/api/v1/";
      const loginResponse = await fetch(`${URLBASE}auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "root@root.com",
          password: "root",
          client_id: "CBSb3npocDqJ2bDHv6DjbjwqS1voDcIroykgJBOi",
          scope: "read write",
        }),
      });

      if (!loginResponse.ok) {
        throw new Error(`Login failed: ${loginResponse.statusText}`);
      }

      // Ensure the response matches the expected structure
      const loginData = await loginResponse.json() as LoginResponse;

      // Extract the access token
      const accessToken = loginData.access_token;

      const solutions = await Promise.all(
        questionIds.map(async (questionId) => {
          const response = await fetch(`${URLBASE}assessment/solutions/${questionId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });

          console.log("This is the BODY",response.body);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch solution for question ${questionId}`);
          }
  
          const data = await response.json() as DjangoSolutionResponse;
          
          // Map Django response to QuestionSolution type
          switch (data.question_type) {
            case 'NAT':
              return {
                questionId,
                type: 'NAT',
                value: data.solution.value?.toString() ?? '0',
                toleranceMin: data.solution.tolerance_min ?? 0,
                toleranceMax: data.solution.tolerance_max ?? 0,
                decimalPrecision: data.solution.decimal_precision ?? 0,
              } as NATSolution;
  
            case 'MCQ':
              return {
                questionId,
                type: 'MCQ',
                correctChoiceId: data.solution.choice ?? '',
              } as MCQSolution;
  
            case 'MSQ':
              return {
                questionId,
                type: 'MSQ',
                correctChoiceIds: data.solution.choices ?? [],
              } as MSQSolution;
  
            case 'DESC':
              return {
                questionId,
                type: 'DESCRIPTIVE',
                minWordLimit: data.solution.min_word_limit ?? 0,
                maxWordLimit: data.solution.max_word_limit ?? Number.MAX_SAFE_INTEGER,
                modelSolution: data.solution.model_solution ?? '',
              } as DescriptiveSolution;
  
            default:
              throw new Error(`Unsupported question type: ${data.question_type}`);
          }
        })
      );
  
      return solutions;
    } catch (error) {
      console.error('Error fetching solutions from Django:', error);
      throw error;
    }
  }
  


  /**
   * Calculates the grades for an assessment based on submitted answers and correct solutions.
   * @param answers - The submitted answers for the assessment.
   * @param solutions - The correct solutions for the questions.
   * @returns A grading result containing the number of correct answers, total questions, and grading status.
   */
  private calculateGrades(answers: SubmissionAnswers, solutions: QuestionSolution[]): GradingResult {
    let correctAnswers = 0;
    const totalQuestions = solutions.length;

    // Iterate through each solution and compare with submitted answers
    solutions.forEach(solution => {
      switch (solution.type) {
        case 'NAT': {
          const answer = answers.natAnswers.find(a => a.questionId === solution.questionId);
          if (answer) {
            const studentValue = parseFloat(answer.value);
            const correctValue = parseFloat(solution.value);

            const withinTolerance =
              studentValue >= correctValue - solution.toleranceMin &&
              studentValue <= correctValue + solution.toleranceMax;

            const matchesPrecision =
              studentValue.toFixed(solution.decimalPrecision) === correctValue.toFixed(solution.decimalPrecision);

            if (withinTolerance && matchesPrecision) correctAnswers++;
          }
          break;
        }

        case 'DESCRIPTIVE': {
          const answer = answers.descriptiveAnswers.find(a => a.questionId === solution.questionId);
          if (answer) {
            const wordCount = answer.answerText.split(/\s+/).length; // Count words
            if (
              wordCount >= solution.minWordLimit &&
              wordCount <= solution.maxWordLimit
            ) {
              correctAnswers++;
            }
          }
          break;
        }

        case 'MCQ': {
          const answer = answers.mcqAnswers.find(a => a.questionId === solution.questionId);
          if (answer && answer.choiceId === solution.correctChoiceId) {
            correctAnswers++;
          }
          break;
        }

        case 'MSQ': {
          const answer = answers.msqAnswers.find(a => a.questionId === solution.questionId);
          if (answer) {
            const isCorrect =
              solution.correctChoiceIds.every(correctId => answer.choiceIds.includes(correctId)) &&
              answer.choiceIds.every(choiceId => solution.correctChoiceIds.includes(choiceId));
            if (isCorrect) {
              correctAnswers++;
            }
          }
          break;
        }

        default:
          console.warn(`Unsupported question type: ${solution}`);
          break;
      }
    });

    // Determine the grading status based on the number of correct answers
    const status =
      correctAnswers === totalQuestions
        ? AssessmentAttemptStatusEnum.SUCCESS
        : AssessmentAttemptStatusEnum.FAILED;

    return { correctAnswers, totalQuestions, status };
  }
}
