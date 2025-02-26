import type { Request, Response } from "express";
import { db } from "../db";
import { enrolment } from "../db/schema";
import { eq } from "drizzle-orm";

export const createEnrolment = async (req: Request, res: Response) => {
  try {
    const { studentId, courseId, grade } = req.body;
    const newEnrolment = await db
      .insert(enrolment)
      .values({ studentId, courseId, grade })
      .returning();
    res.status(201).json(newEnrolment[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating enrolment" });
  }
};

export const getAllEnrolments = async (req: Request, res: Response) => {
  try {
    const enrolments = await db.select().from(enrolment);
    res.status(200).json(enrolments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching enrolments" });
  }
};

export const getEnrolment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(enrolment)
      .where(eq(enrolment.enrolmentId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Enrolment not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching enrolment" });
  }
};

export const updateEnrolment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { studentId, courseId, grade } = req.body;
    const updatedEnrolment = await db
      .update(enrolment)
      .set({ studentId, courseId, grade })
      .where(eq(enrolment.enrolmentId, Number.parseInt(id)))
      .returning();
    if (updatedEnrolment.length === 0) {
      res.status(404).json({ error: "Enrolment not found" });
    } else {
      res.status(200).json(updatedEnrolment[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating enrolment" });
  }
};

export const deleteEnrolment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedEnrolment = await db
      .delete(enrolment)
      .where(eq(enrolment.enrolmentId, Number.parseInt(id)))
      .returning();
    if (deletedEnrolment.length === 0) {
      res.status(404).json({ error: "Enrolment not found" });
    } else {
      res.status(200).json({ message: "Enrolment deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting enrolment" });
  }
};
