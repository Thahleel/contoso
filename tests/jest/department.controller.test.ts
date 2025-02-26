import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { department, instructor } from "../../src/db/schema";

describe("Department Controller", () => {
  let administratorId: number;

  beforeAll(async () => {
    await db.delete(department);
    await db.delete(instructor);

    const instructorRes = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "2023-01-01",
      office: "Room 101",
    });
    administratorId = instructorRes.body.instructorId;
  });

  afterAll(async () => {
    await db.delete(department);
    await db.delete(instructor);
  });

  it("should create a new department", async () => {
    const res = await request(app).post("/api/departments").send({
      name: "Computer Science",
      budget: 500000,
      startDate: "2023-01-01",
      administratorId,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("departmentId");
  });

  it("should get all departments", async () => {
    const res = await request(app).get("/api/departments");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it("should get a specific department", async () => {
    const createRes = await request(app).post("/api/departments").send({
      name: "Mathematics",
      budget: 400000,
      startDate: "2023-01-02",
      administratorId,
    });
    const departmentId = createRes.body.departmentId;

    const getRes = await request(app).get(`/api/departments/${departmentId}`);
    expect(getRes.statusCode).toBe(200);
    expect(getRes.body).toHaveProperty("name", "Mathematics");
  });

  it("should update a department", async () => {
    const createRes = await request(app).post("/api/departments").send({
      name: "Physics",
      budget: 450000,
      startDate: "2023-01-03",
      administratorId,
    });
    const departmentId = createRes.body.departmentId;

    const updateRes = await request(app)
      .put(`/api/departments/${departmentId}`)
      .send({
        name: "Physics and Astronomy",
        budget: 500000,
        startDate: "2023-01-03",
        administratorId,
      });
    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body).toHaveProperty("name", "Physics and Astronomy");
    expect(updateRes.body).toHaveProperty("budget", 500000);
  });

  it("should delete a department", async () => {
    const createRes = await request(app).post("/api/departments").send({
      name: "Chemistry",
      budget: 425000,
      startDate: "2023-01-04",
      administratorId,
    });
    const departmentId = createRes.body.departmentId;

    const deleteRes = await request(app).delete(
      `/api/departments/${departmentId}`
    );
    expect(deleteRes.statusCode).toBe(200);

    const getRes = await request(app).get(`/api/departments/${departmentId}`);
    expect(getRes.statusCode).toBe(404);
  });
});
