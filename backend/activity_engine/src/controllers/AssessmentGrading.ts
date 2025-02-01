import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createAttempt(req: Request, res: Response): Promise<void> {
  console.log("Original Request body:", req.body);
  const { assessmentId, courseInstanceId, studentId } = req.body;
  let attemptId = 1;

  const parsedAssessmentId = parseInt(assessmentId, 10);
  const parsedStudentId = parseInt(studentId, 10);

  try {
    const session = await prisma.loginSession.findFirst({
      where: {
        user_id: parsedStudentId,
      },
      select: {
        access_token: true,
      },
    });

    const session2 = await prisma.submitSession.findFirst({
      where: {
        assessmentId: parsedAssessmentId,
        studentId: parsedStudentId,
      },
      select: {
        attemptId: true,
      },
    });

    if (session) {
      console.log("Session:", session.access_token);
    } else {
      console.error("Session not found for user:", parsedStudentId);
      res.status(404).send({ message: "Session not found" });
      return;
    }

    if (session2) {
      console.log("Session:", session2.attemptId);
      attemptId = session2.attemptId + 1;
    } else {
      console.log("attempt Created")
      attemptId = 1;
    }

    res.status(201).json({ message: "Attempt created successfully", attemptId: attemptId });
  } catch (error) {
    console.error("Failed to create session:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).send({ message: `Error creating session: ${errorMessage}` });
  }
}