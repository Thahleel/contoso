import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { student } from "../../src/db/schema";

describe("Student Controller", () => {
  beforeAll(async () => {
    await db.delete(student);
  });

  afterAll(async () => {
    await db.delete(student);
  });

  it("should create a new student", async () => {
    const res = await request(app).post("/api/students").send({
      lastName: "Doe",
      firstName: "Jane",
      enrolmentDate: "2023-09-01",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("studentId");
  });

  it("should get all students", async () => {
    const res = await request(app).get("/api/students");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Smith",
      firstName: "John",
      enrolmentDate: "2023-09-02",
    });
    const studentId = createRes.body.studentId;

    const getRes = await request(app).get(`/api/students/${studentId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("lastName", "Smith");
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
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("firstName", "Robert");
  });

  it("should delete a student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Brown",
      firstName: "Alice",
      enrolmentDate: "2023-09-04",
    });
    const studentId = createRes.body.studentId;

    const deleteRes = await request(app).delete(`/api/students/${studentId}`);
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/students/${studentId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
