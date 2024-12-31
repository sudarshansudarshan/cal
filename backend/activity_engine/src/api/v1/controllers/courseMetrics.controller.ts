import {Request, Response, NextFunction} from 'express';


import { CourseProgressService } from '../../../services/courseProgress.service';

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
