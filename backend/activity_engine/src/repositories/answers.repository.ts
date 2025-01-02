import prisma from '../config/prisma';
import { SubmissionAnswers } from '../types/assessment.types';

export class AnswersRepository {
  async storeAnswers(
    attemptId: number,
    studentId: string,
    courseInstanceId: string,
    answers: SubmissionAnswers
  ): Promise<void> {
    // Store NAT Answers
    for (const nat of answers.natAnswers) {
      await prisma.studentNATAnswer.create({
        data: {
          assessmentAttemptId: attemptId,
          studentId,
          courseInstanceId,
          questionId: nat.questionId,
          value: nat.value,
        },
      });
    }

    // Store Descriptive Answers
    for (const desc of answers.descriptiveAnswers) {
      await prisma.studentDescriptiveAnswer.create({
        data: {
          assessmentAttemptId: attemptId,
          studentId,
          courseInstanceId,
          questionId: desc.questionId,
          answerText: desc.answerText,
        },
      });
    }

    // Store MCQ Answers
    for (const mcq of answers.mcqAnswers) {
      await prisma.studentMCQAnswer.create({
        data: {
          assessmentAttemptId: attemptId,
          studentId,
          courseInstanceId,
          questionId: mcq.questionId,
          choiceId: mcq.choiceId,
        },
      });
    }

    // Store MSQ Answers
    for (const msq of answers.msqAnswers) {
      const data = msq.choiceIds.map(choiceId => ({
        assessmentAttemptId: attemptId,
        studentId,
        courseInstanceId,
        questionId: msq.questionId,
        choiceId,
      }));
      await prisma.studentMSQAnswer.createMany({ data });
    }
  }
}
