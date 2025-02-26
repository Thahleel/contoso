import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { course } from "../../src/db/schema";

test.before(async () => {
  await db.delete(course);
});

test.after(async () => {
  await db.delete(course);
});

test("POST /api/courses creates a new course", async (t) => {
  const res = await request(app).post("/api/courses").send({
    number: "CS101",
    title: "Introduction to Computer Science",
    credits: 3,
    department: "Computer Science",
  });

  t.is(res.status, 201);
  t.truthy(res.body.courseId);
});

test("GET /api/courses returns all courses", async (t) => {
  const res = await request(app).get("/api/courses");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/courses/:id returns a specific course", async (t) => {
  const createRes = await request(app).post("/api/courses").send({
    number: "MATH101",
    title: "Calculus I",
    credits: 4,
    department: "Mathematics",
  });

  const res = await request(app).get(`/api/courses/${createRes.body.courseId}`);

  t.is(res.status, 200);
  t.is(res.body.title, "Calculus I");
});

test("PUT /api/courses/:id updates a course", async (t) => {
  const createRes = await request(app).post("/api/courses").send({
    number: "PHYS101",
    title: "Introduction to Physics",
    credits: 3,
    department: "Physics",
  });

  const res = await request(app)
    .put(`/api/courses/${createRes.body.courseId}`)
    .send({
      number: "PHYS101",
      title: "Fundamentals of Physics",
      credits: 4,
      department: "Physics",
    });

  t.is(res.status, 200);
  t.is(res.body.title, "Fundamentals of Physics");
  t.is(res.body.credits, 4);
});

test("DELETE /api/courses/:id deletes a course", async (t) => {
  const createRes = await request(app).post("/api/courses").send({
    number: "CHEM101",
    title: "General Chemistry",
    credits: 3,
    department: "Chemistry",
  });

  const deleteRes = await request(app).delete(
    `/api/courses/${createRes.body.courseId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(
    `/api/courses/${createRes.body.courseId}`
  );
  t.is(getRes.status, 404);
});
