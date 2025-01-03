import { Router } from 'express';

import metricsRouter from './metrics.router';
import courseProgressRouter from './courseProgress.router';
import assessmentRouter from './assessment.router';

const router = Router();


router.use('/metrics', metricsRouter);
router.use('/course-progress', courseProgressRouter);
router.use('/assessment', assessmentRouter);

export default router;
