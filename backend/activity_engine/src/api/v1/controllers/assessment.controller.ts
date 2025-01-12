import {Request, Response, NextFunction} from 'express';
import {AssessmentService} from '../../../services/assessment.service';

const assessmentService = new AssessmentService();

export class AssessmentController {
    static async submitAssessment(req: Request, res: Response, next: NextFunction) {
        try {

            const {attemptId, studentId, assessmentId, courseInstanceId, answers} = req.body;

            // Submit the assessment (store answers and grade)
            const {
                gradingStatus,
                assessmentGradingStatus,
                correctAnswers,
                totalQuestions
            } = await assessmentService.submitAssessment(
                studentId,
                courseInstanceId,
                assessmentId,
                attemptId,
                answers
            );

            res.status(200).json({
                status: 'grading_completed',
                attemptId,
                gradingStatus, // SUCCESS or FAILED
                assessmentGradingStatus, // PASSED or FAILED
                correctAnswers,
                totalQuestions
            });
        } catch (error) {
            next(error);
        }
    }

    static async startAssessment(req: Request, res: Response, next: NextFunction) {
        try {
            const {studentId, assessmentId, courseInstanceId} = req.body;
            const {attemptId} = await assessmentService.startAssessment(studentId, courseInstanceId, assessmentId);
            res.status(200).json({
                status: 'started',
                attemptId
            });
        } catch (error) {
            next(error);
        }
    }
}
  