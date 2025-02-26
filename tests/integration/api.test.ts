import request from "supertest";
import { expect } from "chai";
import app from "../..";
import { db } from "../../src/db";
import {
  instructor,
  student,
  course,
  enrolment,
  tutor,
  department,
} from "../../src/db/schema";

describe("API Integration Tests", () => {
  before(async () => {
    await db.delete(enrolment);
    await db.delete(tutor);
    await db.delete(student);
    await db.delete(course);
    await db.delete(instructor);
    await db.delete(department);
  });

  after(async () => {
    await db.delete(enrolment);
    await db.delete(tutor);
    await db.delete(student);
    await db.delete(course);
    await db.delete(instructor);
    await db.delete(department);
  });

  let instructorId: number;
  let studentId: number;
  let courseId: number;
  let departmentId: number;
  let enrolmentId: number;
  let tutorId: number;

  it("should create and retrieve an instructor", async () => {
    const createRes = await request(app).post("/api/instructors").send({
      lastName: "Doe",
      firstName: "John",
      hireDate: "2023-01-01",
      office: "Room 101",
    });
    expect(createRes.status).to.equal(201);
    instructorId = createRes.body.instructorId;

    const getRes = await request(app).get(`/api/instructors/${instructorId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("lastName", "Doe");
  });

  it("should create and retrieve a student", async () => {
    const createRes = await request(app).post("/api/students").send({
      lastName: "Smith",
      firstName: "Jane",
      enrolmentDate: "2023-09-01",
    });
    expect(createRes.status).to.equal(201);
    studentId = createRes.body.studentId;

    const getRes = await request(app).get(`/api/students/${studentId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("lastName", "Smith");
  });

  it("should create and retrieve a course", async () => {
    const createRes = await request(app).post("/api/courses").send({
      number: "CS101",
      title: "Introduction to Computer Science",
      credits: 3,
      department: "Computer Science",
    });
    expect(createRes.status).to.equal(201);
    courseId = createRes.body.courseId;

    const getRes = await request(app).get(`/api/courses/${courseId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property(
      "title",
      "Introduction to Computer Science"
    );
  });

  it("should create and retrieve a department", async () => {
    const createRes = await request(app).post("/api/departments").send({
      name: "Computer Science",
      budget: 500000,
      startDate: "2000-01-01",
      administratorId: instructorId,
    });
    expect(createRes.status).to.equal(201);
    departmentId = createRes.body.departmentId;

    const getRes = await request(app).get(`/api/departments/${departmentId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("name", "Computer Science");
  });

  it("should create and retrieve an enrolment", async () => {
    const createRes = await request(app).post("/api/enrolments").send({
      studentId: studentId,
      courseId: courseId,
      grade: "A",
    });
    expect(createRes.status).to.equal(201);
    enrolmentId = createRes.body.enrolmentId;

    const getRes = await request(app).get(`/api/enrolments/${enrolmentId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("grade", "A");
  });

  it("should create and retrieve a tutor", async () => {
    const createRes = await request(app).post("/api/tutors").send({
      instructorId: instructorId,
      courseId: courseId,
    });
    expect(createRes.status).to.equal(201);
    tutorId = createRes.body.icId;

    const getRes = await request(app).get(`/api/tutors/${tutorId}`);
    expect(getRes.status).to.equal(200);
    expect(getRes.body).to.have.property("instructorId", instructorId);
  });

  it("should update an instructor", async () => {
    const updateRes = await request(app)
      .put(`/api/instructors/${instructorId}`)
      .send({
        lastName: "Doe",
        firstName: "Jane",
        hireDate: "2023-01-01",
        office: "Room 102",
      });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("firstName", "Jane");
    expect(updateRes.body).to.have.property("office", "Room 102");
  });

  it("should update a student", async () => {
    const updateRes = await request(app)
      .put(`/api/students/${studentId}`)
      .send({
        lastName: "Smith",
        firstName: "John",
        enrolmentDate: "2023-09-02",
      });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("firstName", "John");
  });

  it("should update a course", async () => {
    const updateRes = await request(app).put(`/api/courses/${courseId}`).send({
      number: "CS102",
      title: "Advanced Computer Science",
      credits: 4,
      department: "Computer Science",
    });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property(
      "title",
      "Advanced Computer Science"
    );
    expect(updateRes.body).to.have.property("credits", 4);
  });

  it("should update a department", async () => {
    const updateRes = await request(app)
      .put(`/api/departments/${departmentId}`)
      .send({
        name: "Computer Science and Engineering",
        budget: 600000,
        startDate: "2000-01-01",
        administratorId: instructorId,
      });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property(
      "name",
      "Computer Science and Engineering"
    );
    expect(updateRes.body).to.have.property("budget", 600000);
  });

  it("should update an enrolment", async () => {
    const updateRes = await request(app)
      .put(`/api/enrolments/${enrolmentId}`)
      .send({
        studentId: studentId,
        courseId: courseId,
        grade: "B",
      });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("grade", "B");
  });

  it("should update a tutor", async () => {
    const newCourseRes = await request(app).post("/api/courses").send({
      number: "CS201",
      title: "Data Structures",
      credits: 3,
      department: "Computer Science",
    });
    const newCourseId = newCourseRes.body.courseId;

    const updateRes = await request(app).put(`/api/tutors/${tutorId}`).send({
      instructorId: instructorId,
      courseId: newCourseId,
    });
    expect(updateRes.status).to.equal(200);
    expect(updateRes.body).to.have.property("courseId", newCourseId);
  });

  it("should delete all created entities", async () => {
    const deleteEnrolment = await request(app).delete(
      `/api/enrolments/${enrolmentId}`
    );
    expect(deleteEnrolment.status).to.equal(200);

    const deleteTutor = await request(app).delete(`/api/tutors/${tutorId}`);
    expect(deleteTutor.status).to.equal(200);

    const deleteStudent = await request(app).delete(
      `/api/students/${studentId}`
    );
    expect(deleteStudent.status).to.equal(200);

    const deleteCourse = await request(app).delete(`/api/courses/${courseId}`);
    expect(deleteCourse.status).to.equal(200);

    const deleteInstructor = await request(app).delete(
      `/api/instructors/${instructorId}`
    );
    expect(deleteInstructor.status).to.equal(200);

    const deleteDepartment = await request(app).delete(
      `/api/departments/${departmentId}`
    );
    expect(deleteDepartment.status).to.equal(200);
  });
});
