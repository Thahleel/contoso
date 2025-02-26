import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/course.controller";

const router = express.Router();

router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:id", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

export { router as courseRouter };
