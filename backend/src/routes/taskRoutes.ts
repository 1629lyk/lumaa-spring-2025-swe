import express from "express";
import { getTasks, createTask, updateTask, deleteTask } from "../controllers/taskController";
import { authMiddleware } from "../middlerware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);
router.put("/:taskId", authMiddleware, updateTask);
router.delete("/:taskId", authMiddleware, deleteTask)

export default router;