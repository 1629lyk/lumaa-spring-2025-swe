// taskModel.ts
import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../config/db";

// Define the attributes for a Task
interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// When creating a new Task, some fields are optional
interface TaskCreationAttributes extends Optional<TaskAttributes, "id" | "isComplete" | "createdAt" | "updatedAt"> {}

// Extend the Model class with our attributes
class Task extends Model<TaskAttributes, TaskCreationAttributes> implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public isComplete!: boolean;
  public userId!: number;
  
  // timestamps managed by Sequelize
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Task model
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "iscomplete"
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userid"
    },
  },
  {
    sequelize,
    tableName: "tasks",
    timestamps: true, // automatically adds createdAt and updatedAt
    modelName: "Task",
    underscored: true
  }
);

export default Task;
