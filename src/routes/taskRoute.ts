import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from "../controllers/taskController";

// router
const router = express.Router();
router.post("/task/create", createTask);
router.get("/task/pagination", getTasks);
router.get("/task/id/:task_id", getTaskById);
router.put("/task/update/:task_id", updateTask);
router.delete("/task/delete/:task_id", deleteTask);
module.exports = router;