import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/task", taskRoutes);

app.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "Task Management API is running!" });
  });    

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on the port ${PORT}`));