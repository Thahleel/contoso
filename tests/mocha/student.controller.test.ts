import { expect } from "chai";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { student } from "../../src/db/schema";

describe("Student Controller", () => {
  before(async () => {
    await db.delete(student);
  });

  after(async () => {
    await db.delete(student);
  });

  it("should create a new student", async () => {
    const res = await request(app).post("/api/students").send({
      lastName: "Doe",
      firstName: "Jane",
      enrolmentDate: "2023-09-01",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("studentId");
  });

  it("should get all students", async () => {
    const res = await request(app).get("/api/students");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
  });

  it("should get a specific student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Smith",
      firstName: "John",
      enrolmentDate: "2023-09-02",
    });
    const studentId = createRes.body.studentId;

    const getRes = await request(app).get(`/api/students/${studentId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("lastName", "Smith");
  });

  it("should update a student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Johnson",
      firstName: "Bob",
      enrolmentDate: "2023-09-03",
    });
    const studentId = createRes.body.studentId;

    const updateRes = await request(app)
      .put(`/api/students/${studentId}`)
      .send({
        lastName: "Johnson",
        firstName: "Robert",
        enrolmentDate: "2023-09-03",
      });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("firstName", "Robert");
  });

  it("should delete a student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Brown",
      firstName: "Alice",
      enrolmentDate: "2023-09-04",
    });
    const studentId = createRes.body.studentId;

    const deleteRes = await request(app).delete(`/api/students/${studentId}`);
    expect(deleteRes.status).to.equal(200);

    const getRes = await request(app).get(`/api/students/${studentId}`);
    expect(getRes.status).to.equal(404);
  });
});
