import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  getAllUsers,
  updateUserRole,
  getAllTasks,
  deleteAnyTask,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.use(protect, authorizeRoles("admin"));
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.get("/tasks", getAllTasks);
router.delete("/task/:id", deleteAnyTask);

export default router;
