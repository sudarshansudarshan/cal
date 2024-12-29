import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = Router();

router.route('/video')
    .get(MetricsController.getVideoMetrics)
    .post(MetricsController.updateVideoMetrics);

router.route('/violations')
    .get(MetricsController.getViolations)
    .post(MetricsController.recordViolation);

export default router;
