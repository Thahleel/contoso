import { expect } from "chai";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { course } from "../../src/db/schema";

describe("Course Controller", () => {
  before(async () => {
    await db.delete(course);
  });

  after(async () => {
    await db.delete(course);
  });

  it("should create a new course", async () => {
    const res = await request(app).post("/api/courses").send({
      number: "CS101",
      title: "Introduction to Computer Science",
      credits: 3,
      department: "Computer Science",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("courseId");
  });

  it("should get all courses", async () => {
    const res = await request(app).get("/api/courses");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
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
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("title", "Calculus I");
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
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("title", "Fundamentals of Physics");
    expect(updateRes.body).to.have.property("credits", 4);
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
    expect(deleteRes.status).to.equal(200);

    const getRes = await request(app).get(`/api/courses/${courseId}`);
    expect(getRes.status).to.equal(404);
  });
});
