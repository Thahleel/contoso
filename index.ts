import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
// import xss from "xss-clean";
import compression from "compression";
import cors from "cors";

import routes from "./src/routes";

// Safely parse the PORT as a number, fallback to 5000
const port: number = Number(process.env.PORT) || 5000;

const app = express();

// Set security HTTP headers
app.use(helmet());

// Parse JSON request body
app.use(express.json());

// Parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// Sanitize request data
// app.use(xss());

// Gzip compression
app.use(compression());

// Enable CORS
app.use(cors());
app.options("*", cors());

// Routes
app.use("/api/instructors", routes.instructorRouter);
app.use("/api/students", routes.studentRouter);
app.use("/api/courses", routes.courseRouter);
app.use("/api/enrolments", routes.enrolmentRouter);
app.use("/api/tutors", routes.tutorRouter);
app.use("/api/departments", routes.departmentRouter);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`\n*** Server listening on port ${port} ***\n`);
  });
}

// Export the app for testing or external usage
export default app;
