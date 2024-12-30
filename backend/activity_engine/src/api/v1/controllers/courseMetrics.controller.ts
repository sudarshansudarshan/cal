import {Request, Response, NextFunction} from 'express';


export class CourseMetricsController {
    static async getCourseMetrics(req: Request, res: Response, next: NextFunction) {
        try {
        res.json({});
        } catch (error) {
        next(error);
        }
    }
    
    static async updateCourseMetrics(req: Request, res: Response, next: NextFunction) {
        try {
        res.json({status: "updated", data: {}});
        } catch (error) {
        next(error);
        }
    }
}