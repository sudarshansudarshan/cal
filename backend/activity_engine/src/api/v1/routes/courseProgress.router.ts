import { Router } from "express";
import { CourseProgressController } from "../controllers/courseProgress.controller";

const router = Router();

router.post("/update-section-item-progress", CourseProgressController.updateSectionItemProgress);
router.post("/initialize-progress", CourseProgressController.initializeProgressController);
router.post("/course", CourseProgressController.getCourseProgress);
router.post("/module", CourseProgressController.getModuleProgress);
router.post("/section", CourseProgressController.getSectionProgress);
router.post("/section-item", CourseProgressController.getSectionItemProgress);

export default router;