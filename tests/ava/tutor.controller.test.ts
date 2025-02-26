import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { tutor, instructor, course } from "../../src/db/schema";

let instructorId: number;
let courseId: number;

test.before(async () => {
  await db.delete(tutor);
  await db.delete(instructor);
  await db.delete(course);

  const instructorRes = await request(app).post("/api/instructors").send({
    lastName: "Doe",
    firstName: "John",
    hireDate: "2023-01-01",
    office: "Room 101",
  });
  instructorId = instructorRes.body.instructorId;

  const courseRes = await request(app).post("/api/courses").send({
    number: "CS101",
    title: "Introduction to Computer Science",
    credits: 3,
    department: "Computer Science",
  });
  courseId = courseRes.body.courseId;
});

test.after(async () => {
  await db.delete(tutor);
  await db.delete(instructor);
  await db.delete(course);
});

test("POST /api/tutors creates a new tutor", async (t) => {
  const res = await request(app).post("/api/tutors").send({
    instructorId,
    courseId,
  });

  t.is(res.status, 201);
  t.truthy(res.body.icId);
});

test("GET /api/tutors returns all tutors", async (t) => {
  const res = await request(app).get("/api/tutors");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/tutors/:id returns a specific tutor", async (t) => {
  const createRes = await request(app).post("/api/tutors").send({
    instructorId,
    courseId,
  });

  const res = await request(app).get(`/api/tutors/${createRes.body.icId}`);

  t.is(res.status, 200);
  t.is(res.body.instructorId, instructorId);
  t.is(res.body.courseId, courseId);
});

test("PUT /api/tutors/:id updates a tutor", async (t) => {
  const createRes = await request(app).post("/api/tutors").send({
    instructorId,
    courseId,
  });

  const newCourseRes = await request(app).post("/api/courses").send({
    number: "CS102",
    title: "Data Structures",
    credits: 3,
    department: "Computer Science",
  });
  const newCourseId = newCourseRes.body.courseId;

  const res = await request(app)
    .put(`/api/tutors/${createRes.body.icId}`)
    .send({
      instructorId,
      courseId: newCourseId,
    });

  t.is(res.status, 200);
  t.is(res.body.courseId, newCourseId);
});

test("DELETE /api/tutors/:id deletes a tutor", async (t) => {
  const createRes = await request(app).post("/api/tutors").send({
    instructorId,
    courseId,
  });

  const deleteRes = await request(app).delete(
    `/api/tutors/${createRes.body.icId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(`/api/tutors/${createRes.body.icId}`);
  t.is(getRes.status, 404);
});
