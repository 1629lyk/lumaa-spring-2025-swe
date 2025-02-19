import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import taskRoutes from "./routes/taskRoutes";
import sequelize from "./config/db";

dotenv.config()

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Task Management API is running!",
  });
});

const PORT = process.env.PORT || 5001;

sequelize
  .sync( { force: true })
  .then(() => {
    console.log("Database synchronized");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to sync database:", err);
  });