import type { Request, Response } from "express";
import { db } from "../db";
import { instructor } from "../db/schema";
import { eq } from "drizzle-orm";

export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { lastName, firstName, hireDate, office } = req.body;
    const newInstructor = await db
      .insert(instructor)
      .values({ lastName, firstName, hireDate, office })
      .returning();
    res.status(201).json(newInstructor[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating instructor" });
  }
};

export const getAllInstructors = async (req: Request, res: Response) => {
  try {
    const instructors = await db.select().from(instructor);
    res.status(200).json(instructors);
  } catch (error) {
    res.status(500).json({ error: "Error fetching instructors" });
  }
};

export const getInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(instructor)
      .where(eq(instructor.instructorId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Instructor not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching instructor" });
  }
};

export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lastName, firstName, hireDate, office } = req.body;
    const updatedInstructor = await db
      .update(instructor)
      .set({ lastName, firstName, hireDate, office })
      .where(eq(instructor.instructorId, Number.parseInt(id)))
      .returning();
    if (updatedInstructor.length === 0) {
      res.status(404).json({ error: "Instructor not found" });
    } else {
      res.status(200).json(updatedInstructor[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating instructor" });
  }
};

export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedInstructor = await db
      .delete(instructor)
      .where(eq(instructor.instructorId, Number.parseInt(id)))
      .returning();
    if (deletedInstructor.length === 0) {
      res.status(404).json({ error: "Instructor not found" });
    } else {
      res.status(200).json({ message: "Instructor deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting instructor" });
  }
};
