import express from "express";
import { getTasks, createTask } from "../controllers/taskController";
import { authMiddleware } from "../middlerware/authMiddleware";

const router = express.Router();

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, createTask);

export default router;