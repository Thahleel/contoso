import test from "ava";
import request from "supertest";
import app from "../..";
import { db } from "../../src/db";
import { department, instructor } from "../../src/db/schema";

let administratorId: number;

test.before(async () => {
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

test.after(async () => {
  await db.delete(department);
  await db.delete(instructor);
});

test("POST /api/departments creates a new department", async (t) => {
  const res = await request(app).post("/api/departments").send({
    name: "Computer Science",
    budget: 500000,
    startDate: "2023-01-01",
    administratorId,
  });

  t.is(res.status, 201);
  t.truthy(res.body.departmentId);
});

test("GET /api/departments returns all departments", async (t) => {
  const res = await request(app).get("/api/departments");

  t.is(res.status, 200);
  t.true(Array.isArray(res.body));
});

test("GET /api/departments/:id returns a specific department", async (t) => {
  const createRes = await request(app).post("/api/departments").send({
    name: "Mathematics",
    budget: 400000,
    startDate: "2023-01-02",
    administratorId,
  });

  const res = await request(app).get(
    `/api/departments/${createRes.body.departmentId}`
  );

  t.is(res.status, 200);
  t.is(res.body.name, "Mathematics");
});

test("PUT /api/departments/:id updates a department", async (t) => {
  const createRes = await request(app).post("/api/departments").send({
    name: "Physics",
    budget: 450000,
    startDate: "2023-01-03",
    administratorId,
  });

  const res = await request(app)
    .put(`/api/departments/${createRes.body.departmentId}`)
    .send({
      name: "Physics and Astronomy",
      budget: 500000,
      startDate: "2023-01-03",
      administratorId,
    });

  t.is(res.status, 200);
  t.is(res.body.name, "Physics and Astronomy");
  t.is(res.body.budget, 500000);
});

test("DELETE /api/departments/:id deletes a department", async (t) => {
  const createRes = await request(app).post("/api/departments").send({
    name: "Chemistry",
    budget: 425000,
    startDate: "2023-01-04",
    administratorId,
  });

  const deleteRes = await request(app).delete(
    `/api/departments/${createRes.body.departmentId}`
  );
  t.is(deleteRes.status, 200);

  const getRes = await request(app).get(
    `/api/departments/${createRes.body.departmentId}`
  );
  t.is(getRes.status, 404);
});
