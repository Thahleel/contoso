import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { student } from "../../src/db/schema";

test.before(async () => {
  await db.delete(student);
});

test.after(async () => {
  await db.delete(student);
});

test("POST /api/students creates a new student", async (t) => {
  const res = await request(app).post("/api/students").send({
    lastName: "Doe",
    firstName: "Jane",
    enrolmentDate: "2023-09-01",
  });

  t.is(res.status, 201);
  t.truthy(res.body.studentId);
});

test("GET /api/students returns all students", async (t) => {
  const res = await request(app).get("/api/students");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/students/:id returns a specific student", async (t) => {
  const createRes = await request(app).post("/api/students").send({
    lastName: "Smith",
    firstName: "John",
    enrolmentDate: "2023-09-02",
  });

  const res = await request(app).get(
    `/api/students/${createRes.body.studentId}`
  );

  t.is(res.status, 200);
  t.is(res.body.lastName, "Smith");
});

test("PUT /api/students/:id updates a student", async (t) => {
  const createRes = await request(app).post("/api/students").send({
    lastName: "Johnson",
    firstName: "Bob",
    enrolmentDate: "2023-09-03",
  });

  const res = await request(app)
    .put(`/api/students/${createRes.body.studentId}`)
    .send({
      lastName: "Johnson",
      firstName: "Robert",
      enrolmentDate: "2023-09-03",
    });

  t.is(res.status, 200);
  t.is(res.body.firstName, "Robert");
});

test("DELETE /api/students/:id deletes a student", async (t) => {
  const createRes = await request(app).post("/api/students").send({
    lastName: "Brown",
    firstName: "Alice",
    enrolmentDate: "2023-09-04",
  });

  const deleteRes = await request(app).delete(
    `/api/students/${createRes.body.studentId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(
    `/api/students/${createRes.body.studentId}`
  );
  t.is(getRes.status, 404);
});
