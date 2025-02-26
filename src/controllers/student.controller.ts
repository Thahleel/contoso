import type { Request, Response } from "express";
import { db } from "../db";
import { student } from "../db/schema";
import { eq } from "drizzle-orm";

export const createStudent = async (req: Request, res: Response) => {
  try {
    const { lastName, firstName, enrolmentDate } = req.body;
    const newStudent = await db
      .insert(student)
      .values({ lastName, firstName, enrolmentDate })
      .returning();
    res.status(201).json(newStudent[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating student" });
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const students = await db.select().from(student);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: "Error fetching students" });
  }
};

export const getStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(student)
      .where(eq(student.studentId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching student" });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lastName, firstName, enrolmentDate } = req.body;
    const updatedStudent = await db
      .update(student)
      .set({ lastName, firstName, enrolmentDate })
      .where(eq(student.studentId, Number.parseInt(id)))
      .returning();
    if (updatedStudent.length === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json(updatedStudent[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
};

export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedStudent = await db
      .delete(student)
      .where(eq(student.studentId, Number.parseInt(id)))
      .returning();
    if (deletedStudent.length === 0) {
      res.status(404).json({ error: "Student not found" });
    } else {
      res.status(200).json({ message: "Student deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
};
