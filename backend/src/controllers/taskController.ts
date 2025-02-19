import { Request, Response } from "express";
import Task from "../models/taskModel";
import { AuthRequest } from "../middlerware/authMiddleware"

// GET /tasks - Get all tasks for the authenticated user
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Fetch tasks belonging to the logged-in user
    const tasks = await Task.findAll({
      where: { userId: req.user?.id },
    });
    res.status(200).json({ result: tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// POST /tasks - Create a new task for the authenticated user
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    if (!title) {
      res.status(400).json({ error: "Title is required" });
      return;
    }

    const newTask = await Task.create({
      title,
      description,
      userId: req.user?.id, // assign task to the current user
    });
    res.status(201).json({ result: newTask });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT /tasks/:taskId - Update an existing task
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.taskId, 10);
    const { title, description, isComplete } = req.body;

    // Find task that belongs to the authenticated user
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user?.id },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    // Update fields if provided
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (isComplete !== undefined) task.isComplete = isComplete;

    await task.save();
    res.status(200).json({ result: task });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE /tasks/:taskId - Delete a task
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.taskId, 10);

    // Find task that belongs to the current user
    const task = await Task.findOne({
      where: { id: taskId, userId: req.user?.id },
    });

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    await task.destroy();
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Server error" });
  }
};
