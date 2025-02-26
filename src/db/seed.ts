import { faker } from "@faker-js/faker";
import { db } from "./";
import {
  instructor,
  student,
  course,
  enrolment,
  tutor,
  department,
} from "./schema";

const INSTRUCTOR_COUNT = 20;
const STUDENT_COUNT = 100;
const COURSE_COUNT = 30;
const ENROLMENT_COUNT = 200;
const TUTOR_COUNT = 40;
const DEPARTMENT_COUNT = 10;

async function seed(): Promise<void> {
  console.log("Seeding database...");

  // Seed Instructors
  const instructors = await db
    .insert(instructor)
    .values(
      Array.from({ length: INSTRUCTOR_COUNT }, () => ({
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        hireDate: faker.date.past({ years: 10 }),
        office: `Room ${faker.number.int({ min: 100, max: 999 })}`,
      }))
    )
    .returning();
  console.log("Instructors seeded:", instructors.length);

  // Seed Students
  const students = await db
    .insert(student)
    .values(
      Array.from({ length: STUDENT_COUNT }, () => ({
        lastName: faker.person.lastName(),
        firstName: faker.person.firstName(),
        enrolmentDate: faker.date.past({ years: 5 }),
      }))
    )
    .returning();
  console.log("Students seeded:", students.length);

  // Seed Courses
  const departments = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ];
  const courses = await db
    .insert(course)
    .values(
      Array.from({ length: COURSE_COUNT }, () => ({
        number: `${faker.helpers.arrayElement([
          "CS",
          "MATH",
          "PHYS",
          "CHEM",
          "BIO",
        ])}${faker.number.int({ min: 100, max: 499 })}`,
        title: faker.lorem.words({ min: 3, max: 5 }),
        credits: faker.number.int({ min: 1, max: 5 }),
        department: faker.helpers.arrayElement(departments),
      }))
    )
    .returning();
  console.log("Courses seeded:", courses.length);

  // Seed Enrolments
  await db.insert(enrolment).values(
    Array.from({ length: ENROLMENT_COUNT }, () => ({
      studentId: faker.helpers.arrayElement(students).studentId,
      courseId: faker.helpers.arrayElement(courses).courseId,
      grade: faker.helpers.arrayElement(["A", "B", "C", "D", "F"]),
    }))
  );
  console.log("Enrolments seeded:", ENROLMENT_COUNT);

  // Seed Tutors
  await db.insert(tutor).values(
    Array.from({ length: TUTOR_COUNT }, () => ({
      instructorId: faker.helpers.arrayElement(instructors).instructorId,
      courseId: faker.helpers.arrayElement(courses).courseId,
    }))
  );
  console.log("Tutors seeded:", TUTOR_COUNT);

  // Seed Departments
  await db.insert(department).values(
    Array.from({ length: DEPARTMENT_COUNT }, () => ({
      name: faker.commerce.department(),
      budget: faker.number.int({ min: 100000, max: 1000000 }),
      // Insert a JS Date:
      startDate: faker.date.past({ years: 20 }),
      administratorId: faker.helpers.arrayElement(instructors).instructorId,
    }))
  );
  console.log("Departments seeded:", DEPARTMENT_COUNT);

  console.log("Database seeding completed");
}

seed()
  .catch((error) => {
    console.error("Error seeding database:", error);
  })
  .finally(() => {
    process.exit(0);
  });
