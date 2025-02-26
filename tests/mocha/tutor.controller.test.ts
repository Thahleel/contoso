import { expect } from "chai";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { tutor, instructor, course } from "../../src/db/schema";

describe("Tutor Controller", () => {
  let instructorId: number;
  let courseId: number;

  before(async () => {
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

  after(async () => {
    await db.delete(tutor);
    await db.delete(instructor);
    await db.delete(course);
  });

  it("should create a new tutor", async () => {
    const res = await request(app).post("/api/tutors").send({
      instructorId,
      courseId,
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("icId");
  });

  it("should get all tutors", async () => {
    const res = await request(app).get("/api/tutors");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should get a specific tutor", async () => {
    const createRes = await request(app).post("/api/tutors").send({
      instructorId,
      courseId,
    });
    const tutorId = createRes.body.icId;

    const getRes = await request(app).get(`/api/tutors/${tutorId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("instructorId", instructorId);
    expect(getRes.body).to.have.property("courseId", courseId);
  });

  it("should update a tutor", async () => {
    const createRes = await request(app).post("/api/tutors").send({
      instructorId,
      courseId,
    });
    const tutorId = createRes.body.icId;

    const newCourseRes = await request(app).post("/api/courses").send({
      number: "CS102",
      title: "Data Structures",
      credits: 3,
      department: "Computer Science",
    });
    const newCourseId = newCourseRes.body.courseId;

    const updateRes = await request(app).put(`/api/tutors/${tutorId}`).send({
      instructorId,
      courseId: newCourseId,
    });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("courseId", newCourseId);
  });

  it("should delete a tutor", async () => {
    const createRes = await request(app).post("/api/tutors").send({
      instructorId,
      courseId,
    });
    const tutorId = createRes.body.icId;

    const deleteRes = await request(app).delete(`/api/tutors/${tutorId}`);
    expect(deleteRes.status).to.equal(200);

    const getRes = await request(app).get(`/api/tutors/${tutorId}`);
    expect(getRes.status).to.equal(404);
  });
});
