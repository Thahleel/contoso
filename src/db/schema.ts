import { pgTable, serial, text, integer, date } from "drizzle-orm/pg-core";

export const instructor = pgTable("instructor", {
  instructorId: serial("instructor_id").primaryKey(),
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  hireDate: date("hire_date", { mode: "date" }).notNull(),
  office: text("office").notNull(),
});

export const student = pgTable("student", {
  studentId: serial("student_id").primaryKey(),
  lastName: text("last_name").notNull(),
  firstName: text("first_name").notNull(),
  enrolmentDate: date("enrolment_date", { mode: "date" }).notNull(),
});

export const course = pgTable("course", {
  courseId: serial("course_id").primaryKey(),
  number: text("number").notNull(),
  title: text("title").notNull(),
  credits: integer("credits").notNull(),
  department: text("department").notNull(),
});

export const enrolment = pgTable("enrolment", {
  enrolmentId: serial("enrolment_id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => student.studentId),
  courseId: integer("course_id")
    .notNull()
    .references(() => course.courseId),
  grade: text("grade"),
});

export const tutor = pgTable("tutor", {
  icId: serial("ic_id").primaryKey(),
  instructorId: integer("instructor_id")
    .notNull()
    .references(() => instructor.instructorId),
  courseId: integer("course_id")
    .notNull()
    .references(() => course.courseId),
});

export const department = pgTable("department", {
  departmentId: serial("department_id").primaryKey(),
  name: text("name").notNull(),
  budget: integer("budget").notNull(),
  startDate: date("start_date", { mode: "date" }).notNull(),
  administratorId: integer("administrator_id")
    .notNull()
    .references(() => instructor.instructorId),
});
