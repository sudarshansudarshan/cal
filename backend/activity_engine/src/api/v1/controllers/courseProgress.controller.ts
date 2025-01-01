import { Request, Response, NextFunction } from 'express';


import { CourseProgressData, CourseProgressService } from '../../../services/courseProgress.service';

const courseProgressService = new CourseProgressService();

export class CourseProgressController {

  static updateSectionItemProgress = async (
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
  static initializeProgressController = async (
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


  static getCourseProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courseInstanceId: string = req.query.courseInstanceId as string;
      const studentId: string = req.query.studentId as string;
      
      const progress = await courseProgressService.getCourseProgress(
        courseInstanceId,
        studentId
      );

      res.status(200).json(progress);
    } catch (error) {
      next(error); // Forward to error handling middleware
    }
  }

  static getModuleProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courseInstanceId: string = req.query.courseInstanceId as string;
      const studentId: string = req.query.studentId as string;
      const moduleId: string = req.query.moduleId as string;

      const progress = await courseProgressService.getModuleProgress(
        courseInstanceId,
        studentId,
        moduleId
      );

      res.status(200).json(progress);
    } catch (error) {
      next(error); // Forward to error handling middleware
    }
  }

  static getSectionProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courseInstanceId: string = req.query.courseInstanceId as string;
      const studentId: string = req.query.studentId as string;
      const sectionId: string = req.query.sectionId as string

      const progress = await courseProgressService.getSectionProgress(
        courseInstanceId,
        studentId,
        sectionId
      );

      res.status(200).json(progress);
    } catch (error) {
      next(error); // Forward to error handling middleware
    }
  }

  static getSectionItemProgress = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const courseInstanceId: string = req.query.courseInstanceId as string;
      const studentId: string = req.query.studentId as string;
      const sectionItemId: string = req.query.sectionItemId as string
      

      const progress = await courseProgressService.getSectionItemProgress(
        courseInstanceId,
        studentId,
        sectionItemId
      );

      res.status(200).json(progress);
    } catch (error) {
      next(error); // Forward to error handling middleware
    }
  }


}

