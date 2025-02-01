import { Router } from 'express';
import { CourseProgressController } from '../controllers/CourseProgressController';

const router = Router();

router.post("/course-progress/update-section-item-progress", CourseProgressController.updateSectionItemProgress);
router.post("/course-progress/initialize-progress", CourseProgressController.initializeProgressController);
router.get("/course", CourseProgressController.getCourseProgress);
router.get("/module", CourseProgressController.getModuleProgress);
router.get("/section", CourseProgressController.getSectionProgress);
router.get("/section-item", CourseProgressController.getSectionItemProgress);

export default router;