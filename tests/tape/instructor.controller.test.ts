import test from "tape";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { instructor } from "../../src/db/schema";

test("Instructor Controller", async (t) => {
  t.test("setup", async (t) => {
    await db.delete(instructor);
    t.end();
  });

  t.test("should create a new instructor", async (t) => {
    const res = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "2023-01-01",
      office: "Room 101",
    });
    t.equal(res.status, 201);
    t.ok(res.body.instructorId);
    t.end();
  });

  t.test("should get all instructors", async (t) => {
    const res = await request(app).get("/api/instructors");
    t.equal(res.status, 200);
    t.ok(Array.isArray(res.body));
    t.end();
  });

  t.test("should get a specific instructor", async (t) => {
    const createRes = await request(app).post("/api/instructors").send({
      lastName: "Smith",
      firstName: "Jane",
      hireDate: "2023-02-01",
      office: "Room 102",
    });
    const instructorId = createRes.body.instructorId;

    const getRes = await request(app).get(`/api/instructors/${instructorId}`);
    t.equal(getRes.status, 200);
    t.equal(getRes.body.lastName, "Smith");
    t.end();
  });

  t.test("should update an instructor", async (t) => {
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
    t.equal(updateRes.status, 200);
    t.equal(updateRes.body.firstName, "Robert");
    t.equal(updateRes.body.office, "Room 104");
    t.end();
  });
});
