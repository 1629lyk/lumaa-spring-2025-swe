import axios from "axios";
import { Task } from "../types/models"

const API_URL = import.meta.env.VITE_API_BASE_URL;

interface AuthResponse {
    token: string;
    user: {
        id: number;
        username: string
    };
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, { username, password });
  return response.data.data;
}
export async function register(username: string, password: string): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/register`, { username, password });
  return response.data.data;
}

export async function getTasks(token: string): Promise<Task[]> {
    const response = await axios.get<{ result: Task[] }>(`${API_URL}/tasks`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.result.map((task) => ({
      ...task,
      userId: task.userId ?? 0,
      createdAt: task.createdAt ?? "",
      updatedAt: task.updatedAt ?? "",
    }));
}

export async function createTask(token: string, task: { title: string; description?: string }): Promise<Task> {
    const response = await axios.post<{ result: Task }>(`${API_URL}/tasks`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return {
      ...response.data.result,
      userId: response.data.result.userId ?? 0,
      createdAt: response.data.result.createdAt ?? "",
      updatedAt: response.data.result.updatedAt ?? "",
    };
}

export async function updateTask(
    token: string,
    taskId: number,
    task: { title: string; description?: string; isComplete: boolean }
  ): Promise<Task> {
    const response = await axios.put<{ result: Task }>(`${API_URL}/tasks/${taskId}`, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    return {
      ...response.data.result,
      userId: response.data.result.userId ?? 0,
      createdAt: response.data.result.createdAt ?? "",
      updatedAt: response.data.result.updatedAt ?? "",
    };
}

export async function deleteTask(token: string, taskId: number): Promise<void> {
    await axios.delete(`${API_URL}/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
}