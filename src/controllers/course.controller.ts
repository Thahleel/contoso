import type { Request, Response } from "express";
import { db } from "../db";
import { course } from "../db/schema";
import { eq } from "drizzle-orm";

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { number, title, credits, department } = req.body;
    const newCourse = await db
      .insert(course)
      .values({ number, title, credits, department })
      .returning();
    res.status(201).json(newCourse[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating course" });
  }
};

export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await db.select().from(course);
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching courses" });
  }
};

export const getCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(course)
      .where(eq(course.courseId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching course" });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { number, title, credits, department } = req.body;
    const updatedCourse = await db
      .update(course)
      .set({ number, title, credits, department })
      .where(eq(course.courseId, Number.parseInt(id)))
      .returning();
    if (updatedCourse.length === 0) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(200).json(updatedCourse[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating course" });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCourse = await db
      .delete(course)
      .where(eq(course.courseId, Number.parseInt(id)))
      .returning();
    if (deletedCourse.length === 0) {
      res.status(404).json({ error: "Course not found" });
    } else {
      res.status(200).json({ message: "Course deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting course" });
  }
};
