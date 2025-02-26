import test from "tape";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { enrolment, student, course } from "../../src/db/schema";

test("Enrolment API", async (t) => {
  t.test("setup", async (t) => {
    await db.delete(enrolment);
    await db.delete(student);
    await db.delete(course);
    t.end();
  });

  t.test("should create a new enrolment", async (t) => {
    const studentRes = await request(app).post("/api/students").send({
      lastName: "Doe",
      firstName: "Jane",
      enrolmentDate: "2023-09-01",
    });

    const courseRes = await request(app).post("/api/courses").send({
      number: "CS101",
      title: "Introduction to Computer Science",
      credits: 3,
      department: "Computer Science",
    });

    const res = await request(app).post("/api/enrolments").send({
      studentId: studentRes.body.studentId,
      courseId: courseRes.body.courseId,
      grade: "A",
    });

    t.equal(res.status, 201);
    t.ok(res.body.enrolmentId);
    t.end();
  });

  t.test("should get all enrolments", async (t) => {
    const res = await request(app).get("/api/enrolments");
    t.equal(res.status, 200);
    t.ok(Array.isArray(res.body));
    t.end();
  });

  t.test("should get a specific enrolment", async (t) => {
    const studentRes = await request(app).post("/api/students").send({
      lastName: "Smith",
      firstName: "John",
      enrolmentDate: "2023-09-02",
    });

    const courseRes = await request(app).post("/api/courses").send({
      number: "MATH101",
      title: "Algebra",
      credits: 3,
      department: "Mathematics",
    });

    const createRes = await request(app).post("/api/enrolments").send({
      studentId: studentRes.body.studentId,
      courseId: courseRes.body.courseId,
      grade: "B",
    });

    const enrolmentId = createRes.body.enrolmentId;

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    t.equal(getRes.status, 200);
    t.equal(getRes.body.grade, "B");
    t.end();
  });

  t.test("should update an enrolment", async (t) => {
    const studentRes = await request(app).post("/api/students").send({
      lastName: "Johnson",
      firstName: "Bob",
      enrolmentDate: "2023-09-03",
    });

    const courseRes = await request(app).post("/api/courses").send({
      number: "PHYS101",
      title: "Physics I",
      credits: 4,
      department: "Physics",
    });

    const createRes = await request(app).post("/api/enrolments").send({
      studentId: studentRes.body.studentId,
      courseId: courseRes.body.courseId,
      grade: "C",
    });

    const enrolmentId = createRes.body.enrolmentId;

    const updateRes = await request(app)
      .put(`/api/enrolments/${enrolmentId}`)
      .send({
        studentId: studentRes.body.studentId,
        courseId: courseRes.body.courseId,
        grade: "B",
      });

    t.equal(updateRes.status, 200);
    t.equal(updateRes.body.grade, "B");
    t.end();
  });

  t.test("should delete an enrolment", async (t) => {
    const studentRes = await request(app).post("/api/students").send({
      lastName: "Brown",
      firstName: "Alice",
      enrolmentDate: "2023-09-04",
    });

    const courseRes = await request(app).post("/api/courses").send({
      number: "CHEM101",
      title: "Chemistry I",
      credits: 4,
      department: "Chemistry",
    });

    const createRes = await request(app).post("/api/enrolments").send({
      studentId: studentRes.body.studentId,
      courseId: courseRes.body.courseId,
      grade: "A",
    });

    const enrolmentId = createRes.body.enrolmentId;

    const deleteRes = await request(app).delete(
      `/api/enrolments/${enrolmentId}`
    );
    t.equal(deleteRes.status, 200);

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    t.equal(getRes.status, 404);
    t.end();
  });

  t.test("should return 404 for non-existent enrolment", async (t) => {
    const getRes = await request(app).get("/api/enrolments/999999");
    t.equal(getRes.status, 404);
    t.end();
  });

  t.test("should return 400 for invalid enrolment data", async (t) => {
    const res = await request(app).post("/api/enrolments").send({
      studentId: "invalid-id",
      courseId: "invalid-id",
      grade: "Z",
    });
    t.equal(res.status, 400);
    t.end();
  });

  t.test("teardown", async (t) => {
    await db.delete(enrolment);
    await db.delete(student);
    await db.delete(course);
    t.end();
  });
});
