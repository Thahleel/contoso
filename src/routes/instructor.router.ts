import express from "express";
import {
  createInstructor,
  getAllInstructors,
  getInstructor,
  updateInstructor,
  deleteInstructor,
} from "../controllers/instructor.controller";

const router = express.Router();

router.post("/", createInstructor);
router.get("/", getAllInstructors);
router.get("/:id", getInstructor);
router.put("/:id", updateInstructor);
router.delete("/:id", deleteInstructor);

export { router as instructorRouter };
