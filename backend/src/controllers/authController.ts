import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password and create the new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, password: hashedPassword });

    // Generate a JWT token for the new user
    const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Return the response with the token and user data
    res.status(201).json({
      message: "User registered successfully",
      data: {
        token,
        user: { id: newUser.id, username: newUser.username },
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(400).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      data: {
        token,
        user: { id: user.id, username: user.username },
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
