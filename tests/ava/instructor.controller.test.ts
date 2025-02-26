import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { instructor } from "../../src/db/schema";

test.before(async () => {
  await db.delete(instructor);
});

test.after(async () => {
  await db.delete(instructor);
});

test("POST /api/instructors creates a new instructor", async (t) => {
  const res = await request(app).post("/api/instructors").send({
    lastName: "Doe",
    firstName: "John",
    hireDate: "2023-01-01",
    office: "Room 101",
  });

  t.is(res.status, 201);
  t.truthy(res.body.instructorId);
});

test("GET /api/instructors returns all instructors", async (t) => {
  const res = await request(app).get("/api/instructors");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/instructors/:id returns a specific instructor", async (t) => {
  const createRes = await request(app).post("/api/instructors").send({
    lastName: "Smith",
    firstName: "Jane",
    hireDate: "2023-02-01",
    office: "Room 102",
  });

  const res = await request(app).get(
    `/api/instructors/${createRes.body.instructorId}`
  );

  t.is(res.status, 200);
  t.is(res.body.lastName, "Smith");
});

test("PUT /api/instructors/:id updates an instructor", async (t) => {
  const createRes = await request(app).post("/api/instructors").send({
    lastName: "Johnson",
    firstName: "Bob",
    hireDate: "2023-03-01",
    office: "Room 103",
  });

  const res = await request(app)
    .put(`/api/instructors/${createRes.body.instructorId}`)
    .send({
      lastName: "Johnson",
      firstName: "Robert",
      hireDate: "2023-03-01",
      office: "Room 104",
    });

  t.is(res.status, 200);
  t.is(res.body.firstName, "Robert");
  t.is(res.body.office, "Room 104");
});

test("DELETE /api/instructors/:id deletes an instructor", async (t) => {
  const createRes = await request(app).post("/api/instructors").send({
    lastName: "Brown",
    firstName: "Alice",
    hireDate: "2023-04-01",
    office: "Room 105",
  });

  const deleteRes = await request(app).delete(
    `/api/instructors/${createRes.body.instructorId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(
    `/api/instructors/${createRes.body.instructorId}`
  );
  t.is(getRes.status, 404);
});
