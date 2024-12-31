import {Request, Response, NextFunction} from 'express';


import { CourseProgressData, CourseProgressService } from '../../../services/courseProgress.service';

const courseProgressService = new CourseProgressService();

export const updateSectionItemProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { courseInstanceId, studentId, sectionItemId, cascade } = req.body;

        const updatedEntities = await courseProgressService.updateSectionItemProgress(
            courseInstanceId,
            studentId,
            sectionItemId,
            cascade ?? true
        );

        res.status(200).json(updatedEntities);
    } catch (error) {
        next(error); // Forward to error handling middleware
    }
};
/**
 * Initializes progress for all students in a course instance.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 */
export const initializeProgressController = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Extract and validate the request body
      const courseData: CourseProgressData = req.body;
  
      // Validate required fields
      if (!courseData.courseInstanceId || !courseData.studentIds || !courseData.modules) {
        res.status(400).json({
          error: "Missing required fields: courseInstanceId, studentIds, or modules.",
        });
        return Promise.resolve();
      }
  
      // Call the service function
      const result = await courseProgressService.initializeStudentProgress(courseData);
  
      // Respond with success
      res.status(200).json({
        message: "Progress initialization successful.",
        studentCount: result.studentCount,
        totalRecords: result.totalRecords,
      });
    } catch (error) {
      console.error("Error in initializeProgressController:", error);
      next(error); // Forward to error-handling middleware
    }
  };