import { expect } from "chai";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { instructor } from "../../src/db/schema";

describe("Instructor Controller", () => {
  before(async () => {
    await db.delete(instructor);
  });

  after(async () => {
    await db.delete(instructor);
  });

  it("should create a new instructor", async () => {
    const res = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "2023-01-01",
      office: "Room 101",
    });
    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("instructorId");
  });

  it("should get all instructors", async () => {
    const res = await request(app).get("/api/instructors");
    expect(res.status).to.equal(200);
    expect(res.body).to.be.an("array");
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
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("lastName", "Smith");
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
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("firstName", "Robert");
    expect(updateRes.body).to.have.property("office", "Room 104");
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
    expect(deleteRes.status).to.equal(200);

    const getRes = await request(app).get(`/api/instructors/${instructorId}`);
    expect(getRes.status).to.equal(404);
  });
});
