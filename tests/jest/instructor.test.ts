import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { instructor } from "../../src/db/schema";

describe("Instructor API", () => {
  beforeAll(async () => {
    await db.delete(instructor);
  });

  afterAll(async () => {
    await db.delete(instructor);
  });

  it("should create a new instructor", async () => {
    const res = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "2023-01-01",
      office: "Room 101",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("instructorId");
  });

  it("should get all instructors", async () => {
    const res = await request(app).get("/api/instructors");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific instructor", async () => {
    const createRes = await request(app).post("/api/instructors").send({
      lastName: "Smith",
      firstName: "Jane",
      hireDate: "2023-02-01",
      office: "Room 102",
    });
    const instructorId = createRes.body.instructorId;

    const getRes = await request(app).get(`/api/instructors/${instructorId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("lastName", "Smith");
  });

  it("should update an instructor", async () => {
    const createRes = await request(app).post("/api/instructors").send({
      lastName: "Johnson",
      firstName: "Bob",
      hireDate: "2023-03-01",
      office: "Room 103",
    });
    const instructorId = createRes.body.instructorId;

    const updateRes = await request(app)
      .put(`/api/instructors/${instructorId}`)
      .send({
        lastName: "Johnson",
        firstName: "Robert",
        hireDate: "2023-03-01",
        office: "Room 104",
      });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("firstName", "Robert");
    expect(updateRes.body).toHaveProperty("office", "Room 104");
  });

  it("should delete an instructor", async () => {
    const createRes = await request(app).post("/api/instructors").send({
      lastName: "Brown",
      firstName: "Alice",
      hireDate: "2023-04-01",
      office: "Room 105",
    });
    const instructorId = createRes.body.instructorId;

    const deleteRes = await request(app).delete(
      `/api/instructors/${instructorId}`
    );
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/instructors/${instructorId}`);
    expect(getRes.statusCode).toBe(404);
  });

  it("should return 404 for non-existent instructor", async () => {
    const getRes = await request(app).get("/api/instructors/999999");
    expect(getRes.statusCode).toBe(404);
  });

  it("should return 400 for invalid instructor data", async () => {
    const res = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "invalid-date",
      office: "Room 101",
    });
    expect(res.statusCode).toBe(400);
  });
});
