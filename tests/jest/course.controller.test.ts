import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { course } from "../../src/db/schema";
import { describe, beforeAll, afterAll, it, expect } from "@jest/globals";

describe("Course Controller", () => {
  beforeAll(async () => {
    await db.delete(course);
  });

  afterAll(async () => {
    await db.delete(course);
  });

  it("should create a new course", async () => {
    const res = await request(app).post("/api/courses").send({
      number: "CS101",
      title: "Introduction to Computer Science",
      credits: 3,
      department: "Computer Science",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("courseId");
  });

  it("should get all courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific course", async () => {
    const createRes = await request(app).post("/api/courses").send({
      number: "MATH101",
      title: "Calculus I",
      credits: 4,
      department: "Mathematics",
    });
    const courseId = createRes.body.courseId;

    const getRes = await request(app).get(`/api/courses/${courseId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("title", "Calculus I");
  });

  it("should update a course", async () => {
    const createRes = await request(app).post("/api/courses").send({
      number: "PHYS101",
      title: "Introduction to Physics",
      credits: 3,
      department: "Physics",
    });
    const courseId = createRes.body.courseId;

    const updateRes = await request(app).put(`/api/courses/${courseId}`).send({
      number: "PHYS101",
      title: "Fundamentals of Physics",
      credits: 4,
      department: "Physics",
    });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("title", "Fundamentals of Physics");
    expect(updateRes.body).toHaveProperty("credits", 4);
  });

  it("should delete a course", async () => {
    const createRes = await request(app).post("/api/courses").send({
      number: "CHEM101",
      title: "General Chemistry",
      credits: 3,
      department: "Chemistry",
    });
    const courseId = createRes.body.courseId;

    const deleteRes = await request(app).delete(`/api/courses/${courseId}`);
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/courses/${courseId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
