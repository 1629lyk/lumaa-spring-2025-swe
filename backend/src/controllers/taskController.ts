import { Request, Response } from "express";
import pool from "../config/db";

// Extend Express Request type to include user
interface AuthRequest extends Request {
  user?: { id: number };
}

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return; 
    }

    const tasks = await pool.query("SELECT * FROM tasks WHERE userId = $1", [req.user.id]);

    res.status(200).json({
      message: "Tasks retrieved successfully",
      data: tasks.rows,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return; 
    }

    const { title, description } = req.body;
    const newTask = await pool.query(
      "INSERT INTO tasks (title, description, isComplete, userId) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, false, req.user.id]
    );

    res.status(201).json({
      message: "Task created successfully",
      data: newTask.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
