import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { enrolment, student, course } from "../../src/db/schema";

describe("Enrolment Controller", () => {
  let studentId: number;
  let courseId: number;

  beforeAll(async () => {
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

  afterAll(async () => {
    await db.delete(enrolment);
    await db.delete(student);
    await db.delete(course);
  });

  it("should create a new enrolment", async () => {
    const res = await request(app).post("/api/enrolments").send({
      studentId,
      courseId,
      grade: "A",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("enrolmentId");
  });

  it("should get all enrolments", async () => {
    const res = await request(app).get("/api/enrolments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific enrolment", async () => {
    const createRes = await request(app).post("/api/enrolments").send({
      studentId,
      courseId,
      grade: "B",
    });
    const enrolmentId = createRes.body.enrolmentId;

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("grade", "B");
  });

  it("should update an enrolment", async () => {
    const createRes = await request(app).post("/api/enrolments").send({
      studentId,
      courseId,
      grade: "C",
    });
    const enrolmentId = createRes.body.enrolmentId;

    const updateRes = await request(app)
      .put(`/api/enrolments/${enrolmentId}`)
      .send({
        studentId,
        courseId,
        grade: "B+",
      });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("grade", "B+");
  });

  it("should delete an enrolment", async () => {
    const createRes = await request(app).post("/api/enrolments").send({
      studentId,
      courseId,
      grade: "A-",
    });
    const enrolmentId = createRes.body.enrolmentId;

    const deleteRes = await request(app).delete(
      `/api/enrolments/${enrolmentId}`
    );
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
