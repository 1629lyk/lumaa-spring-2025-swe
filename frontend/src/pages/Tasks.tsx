import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
// import { LogOut, Plus, Check, X, Pencil, Trash2 } from "lucide-react";
import { LogOut, Plus, Check, X, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getTasks, createTask, updateTask, deleteTask } from "../lib/api";
import { Task } from "../types/models";

export default function Tasks() {
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchTasks = useCallback(async () => {
    if (!token) return;
    try {
      const data: Task[] = await getTasks(token);
      setTasks(data); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [token]);

const handleLogout = () => {
    logout();
    navigate("/login");
};

const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
  
    try {
      const task: Task = await createTask(token!, newTask);
      setTasks((prevTasks) => [task, ...prevTasks]); 
      setNewTask({ title: "", description: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    }
};

const handleToggleComplete = async (task: Task) => {
    try {
      const updatedTask = await updateTask(token!, task.id, {
        ...task,
        isComplete: !task.isComplete, // ✅ Updated to match backend
      });
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
};

const handleUpdateTask = async (task: Task) => {
    try {
      const updatedTask = await updateTask(token!, task.id, task);
      setTasks(tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
};

const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(token!, id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task");
    }
};

useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchTasks();
}, [token, navigate, fetchTasks]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-between items-center">
                  <h2 className="text-3xl font-bold text-gray-900">Tasks</h2>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask({ ...newTask, title: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Task description (optional)"
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask({ ...newTask, description: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows={3}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </button>
                </form>

                {loading ? (
                  <div className="text-center py-4">Loading tasks...</div>
                ) : (
                  <div className="mt-8 space-y-4">
                    {tasks.map((task) =>
                      editingTask?.id === task.id ? (
                        <div key={task.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <input
                            type="text"
                            value={editingTask.title}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, title: e.target.value })
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                          />
                          <textarea
                            value={editingTask.description || ""}
                            onChange={(e) =>
                              setEditingTask({ ...editingTask, description: e.target.value })
                            }
                            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                            rows={3}
                          />
                          <div className="mt-2 flex justify-end space-x-2">
                            <button
                              onClick={() => handleUpdateTask(editingTask)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Save
                            </button>
                            <button
                              onClick={() => setEditingTask(null)}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div key={task.id} className="bg-white border rounded-lg p-4 shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <button
                                onClick={() => handleToggleComplete(task)}
                                className={`mt-1 flex-shrink-0 w-5 h-5 rounded border ${
                                  task.isComplete ? "bg-green-500 border-green-500" : "border-gray-300"
                                }`}
                              >
                                {task.isComplete && <Check className="h-4 w-4 text-white" />}
                              </button>
                              <h3 className={`text-lg font-medium ${task.isComplete ? "text-gray-500 line-through" : "text-gray-900"}`}>
                                {task.title}
                              </h3>
                              <div className="flex space-x-2">
                                <button
                                onClick={() => handleDeleteTask(task.id)} 
                                className="text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
