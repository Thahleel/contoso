import express from "express";
import {
  createEnrolment,
  getAllEnrolments,
  getEnrolment,
  updateEnrolment,
  deleteEnrolment,
} from "../controllers/enrolment.controller";

const router = express.Router();

router.post("/", createEnrolment);
router.get("/", getAllEnrolments);
router.get("/:id", getEnrolment);
router.put("/:id", updateEnrolment);
router.delete("/:id", deleteEnrolment);

export { router as enrolmentRouter };
