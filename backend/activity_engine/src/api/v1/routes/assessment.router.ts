import { Router } from "express";
import { AssessmentController } from "../controllers/assessment.controller";

const router = Router();

router.post("/submit", AssessmentController.submitAssessment);

export default router;