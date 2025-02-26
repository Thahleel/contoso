import express from "express";
import {
  createTutor,
  getAllTutors,
  getTutor,
  updateTutor,
  deleteTutor,
} from "../controllers/tutor.controller";

const router = express.Router();

router.post("/", createTutor);
router.get("/", getAllTutors);
router.get("/:id", getTutor);
router.put("/:id", updateTutor);
router.delete("/:id", deleteTutor);

export { router as tutorRouter };
