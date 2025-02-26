import type { Request, Response } from "express";
import { db } from "../db";
import { department } from "../db/schema";
import { eq } from "drizzle-orm";

export const createDepartment = async (req: Request, res: Response) => {
  try {
    const { name, budget, startDate, administratorId } = req.body;
    const newDepartment = await db
      .insert(department)
      .values({ name, budget, startDate, administratorId })
      .returning();
    res.status(201).json(newDepartment[0]);
  } catch (error) {
    res.status(500).json({ error: "Error creating department" });
  }
};

export const getAllDepartments = async (req: Request, res: Response) => {
  try {
    const departments = await db.select().from(department);
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: "Error fetching departments" });
  }
};

export const getDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db
      .select()
      .from(department)
      .where(eq(department.departmentId, Number.parseInt(id)));
    if (result.length === 0) {
      res.status(404).json({ error: "Department not found" });
    } else {
      res.status(200).json(result[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching department" });
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, budget, startDate, administratorId } = req.body;
    const updatedDepartment = await db
      .update(department)
      .set({ name, budget, startDate, administratorId })
      .where(eq(department.departmentId, Number.parseInt(id)))
      .returning();
    if (updatedDepartment.length === 0) {
      res.status(404).json({ error: "Department not found" });
    } else {
      res.status(200).json(updatedDepartment[0]);
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating department" });
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedDepartment = await db
      .delete(department)
      .where(eq(department.departmentId, Number.parseInt(id)))
      .returning();
    if (deletedDepartment.length === 0) {
      res.status(404).json({ error: "Department not found" });
    } else {
      res.status(200).json({ message: "Department deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting department" });
  }
};
