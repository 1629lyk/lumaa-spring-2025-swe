import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const existingUser = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existingUser.rows.length > 0) {
      res.status(400).json({ error: "User already exists" });
      return; 
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
      "INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *",
      [username, hashedPassword]
    );

    res.status(201).json({
      message: "User registered successfully",
      data: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    if (user.rows.length === 0) {
      res.status(400).json({ error: "Invalid credentials" });
      return; 
    }

    const isValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isValid) {
      res.status(400).json({ error: "Invalid credentials" });
      return; 
    }

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: { id: user.rows[0].id, username: user.rows[0].username },
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
