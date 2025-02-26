import type { Request, Response } from "express";
import { db } from "../db";
import { tutor } from "../db/schema";
import { eq } from "drizzle-orm";

export const createTutor = async (req: Request, res: Response) => {
  try {
    const { instructorId, courseId } = req.body;
    const newTutor = await db
      .insert(tutor)
      .values({ instructorId, courseId })
      .returning();
    res.status(201).json(newTutor[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating tutor" });
  }
};

export const getAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await db.select().from(tutor);
    res.status(200).json(tutors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching tutors" });
  }
};

export const getTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(tutor)
      .where(eq(tutor.icId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Tutor not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching tutor" });
  }
};

export const updateTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { instructorId, courseId } = req.body;
    const updatedTutor = await db
      .update(tutor)
      .set({ instructorId, courseId })
      .where(eq(tutor.icId, Number.parseInt(id)))
      .returning();
    if (updatedTutor.length === 0) {
      res.status(404).json({ error: "Tutor not found" });
    } else {
      res.status(200).json(updatedTutor[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating tutor" });
  }
};

export const deleteTutor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedTutor = await db
      .delete(tutor)
      .where(eq(tutor.icId, Number.parseInt(id)))
      .returning();
    if (deletedTutor.length === 0) {
      res.status(404).json({ error: "Tutor not found" });
    } else {
      res.status(200).json({ message: "Tutor deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting tutor" });
  }
};
