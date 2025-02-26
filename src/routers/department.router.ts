import express from "express";
import {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller";

const router = express.Router();

router.post("/", createDepartment);
router.get("/", getAllDepartments);
router.get("/:id", getDepartment);
router.put("/:id", updateDepartment);
router.delete("/:id", deleteDepartment);

export { router as departmentRouter };
