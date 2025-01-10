import { Router } from "express";
import { AssessmentController } from "../controllers/assessment.controller";

const router = Router();

router.post("/start",AssessmentController.startAssessment);
router.post("/submit", AssessmentController.submitAssessment);

export default router;