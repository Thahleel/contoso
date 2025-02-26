import { expect } from "chai";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { enrolment, student, course } from "../../src/db/schema";

describe("Enrolment Controller", () => {
  let studentId: number;
  let courseId: number;

  before(async () => {
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

  after(async () => {
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
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("enrolmentId");
  });

  it("should get all enrolments", async () => {
    const res = await request(app).get("/api/enrolments");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should get a specific enrolment", async () => {
    const createRes = await request(app).post("/api/enrolments").send({
      studentId,
      courseId,
      grade: "B",
    });
    const enrolmentId = createRes.body.enrolmentId;

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("grade", "B");
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
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("grade", "B+");
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
    expect(deleteRes.status).to.equal(200);

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    expect(getRes.status).to.equal(404);
  });
});
