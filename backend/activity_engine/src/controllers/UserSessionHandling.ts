// src/controllers/LoginSessionController.ts
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function createSession(
  req: Request,
  res: Response
): Promise<void> {
  const { user_id, access_token, expires_in } = req.body;
  console.log(user_id)
  try {
    const newSession = await prisma.loginSession.create({
      data: {
        user_id,
        access_token,
        expires_in,
      },
    });

    res.json(newSession);
  } catch (error) {
    console.error("Failed to create session:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    res
      .status(500)
      .send({ message: `Error creating session: ${errorMessage}` });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
    const { user_id } = req.params; // Get user_id from URL parameters

    try {
        // Locate the session to ensure it exists before attempting deletion
        const session = await prisma.loginSession.findFirst({
            where: { user_id: parseInt(user_id) },
        });

        if (!session) {
            res.status(404).send({ message: "Login session not found." });
            return;
        }

        // Perform the deletion using the `id`
        await prisma.loginSession.delete({
            where: { id: session.id },
        });

        res.status(204).send(); // Successful deletion with no content to return
    } catch (error) {
        console.error('Failed to delete login session:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).send({ message: `Error deleting login session: ${errorMessage}` });
    }
}


export async function updateUser(req: Request, res: Response): Promise<void> {
    const { user_id } = req.params;  // Assuming user_id is a number in the path
    const { access_token, expires_in } = req.body;  // Extracting data sent in the body

    try {
        // Check if the login session exists by filtering on `user_id` instead of using `findUnique`
        const session = await prisma.loginSession.findFirst({
            where: { user_id: parseInt(user_id) },
        });

        if (!session) {
            res.status(404).send({ message: "Login session not found." });
            return;
        }

        // Update the login session using the `id` from the session found
        const updatedSession = await prisma.loginSession.update({
            where: { id: session.id },
            data: {
                access_token,
                expires_in: parseInt(expires_in),
            },
        });

        res.json(updatedSession);
    } catch (error) {
        console.error('Failed to update login session:', error);
        const errorMessage = (error instanceof Error) ? error.message : "Unknown error";
        res.status(500).send({ message: `Error updating login session: ${errorMessage}` });
    }
}
// You might want to add more functionalities like deleting a session, finding a session by access_token, etc.
