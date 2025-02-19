import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel";

export interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.header("Authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access Denied" });
    return;
  }

  try {
    // Verify token and get payload (assumed to have the user's id)
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

    // Query the database for the user using Sequelize
    const user = await User.findByPk(payload.id);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    // Attach the user instance to the request object for downstream use
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid Token" });
  }
};
