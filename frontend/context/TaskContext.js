"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getAllTasks } from "@/utils/taskService";

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all tasks once
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getAllTasks();
        setTasks(data);
      } catch (error) {
    
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = (task) => setTasks((prev) => [task, ...prev]);

  // Update an existing task
  const updateTask = (updatedTask) =>
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );

  // Delete a task
  const deleteTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  return (
    <TaskContext.Provider
      value={{ tasks, setTasks, addTask, updateTask, deleteTask, loading }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
