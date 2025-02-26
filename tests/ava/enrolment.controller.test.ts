import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { enrolment, student, course } from "../../src/db/schema";

let studentId: number;
let courseId: number;

test.before(async () => {
  await db.delete(enrolment);
  await db.delete(student);
  await db.delete(course);

  const studentRes = await request(app).post("/api/students").send({
    lastName: "Doe",
    firstName: "Jane",
    enrolmentDate: "2023-09-01",
  });
  studentId = studentRes.body.studentId;

  const courseRes = await request(app).post("/api/courses").send({
    number: "CS101",
    title: "Introduction to Computer Science",
    credits: 3,
    department: "Computer Science",
  });
  courseId = courseRes.body.courseId;
});

test.after(async () => {
  await db.delete(enrolment);
  await db.delete(student);
  await db.delete(course);
});

test("POST /api/enrolments creates a new enrolment", async (t) => {
  const res = await request(app).post("/api/enrolments").send({
    studentId,
    courseId,
    grade: "A",
  });

  t.is(res.status, 201);
  t.truthy(res.body.enrolmentId);
});

test("GET /api/enrolments returns all enrolments", async (t) => {
  const res = await request(app).get("/api/enrolments");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/enrolments/:id returns a specific enrolment", async (t) => {
  const createRes = await request(app).post("/api/enrolments").send({
    studentId,
    courseId,
    grade: "B",
  });

  const res = await request(app).get(
    `/api/enrolments/${createRes.body.enrolmentId}`
  );

  t.is(res.status, 200);
  t.is(res.body.grade, "B");
});

test("PUT /api/enrolments/:id updates an enrolment", async (t) => {
  const createRes = await request(app).post("/api/enrolments").send({
    studentId,
    courseId,
    grade: "C",
  });

  const res = await request(app)
    .put(`/api/enrolments/${createRes.body.enrolmentId}`)
    .send({
      studentId,
      courseId,
      grade: "B+",
    });

  t.is(res.status, 200);
  t.is(res.body.grade, "B+");
});

test("DELETE /api/enrolments/:id deletes an enrolment", async (t) => {
  const createRes = await request(app).post("/api/enrolments").send({
    studentId,
    courseId,
    grade: "A-",
  });

  const deleteRes = await request(app).delete(
    `/api/enrolments/${createRes.body.enrolmentId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(
    `/api/enrolments/${createRes.body.enrolmentId}`
  );
  t.is(getRes.status, 404);
});
