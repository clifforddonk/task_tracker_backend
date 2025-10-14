import axiosInstance from "@/axios/axiosInstance";

// Get all tasks
export const getAllTasks = async () => {
  try {
    const response = await axiosInstance.get("/tasks/");
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch tasks";
  }
};

// Get single task by ID
export const getTaskById = async (taskId) => {
  try {
    const response = await axiosInstance.get(`/tasks/${taskId}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch task";
  }
};

// Create new task (Admin only)
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post("/tasks/create/", taskData);
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;

    if (errorData) {
      if (errorData.title) throw errorData.title[0];
      if (errorData.description) throw errorData.description[0];
      if (errorData.assigned_user) throw errorData.assigned_user[0];
      if (errorData.status) throw errorData.status[0];
      if (errorData.priority) throw errorData.priority[0];
      if (errorData.deadline) throw errorData.deadline[0];
      if (errorData.detail) throw errorData.detail;
    }

    throw "Failed to create task";
  }
};

// Edit/Update full task (Admin only)
export const editTask = async (taskId, taskData) => {
  try {
    const response = await axiosInstance.patch(
      `/tasks/${taskId}/edit/`,
      taskData
    );
    return response.data;
  } catch (error) {
    const errorData = error.response?.data;

    if (errorData) {
      if (errorData.detail) throw errorData.detail;
    }

    throw "Failed to update task";
  }
};

// Delete task (Admin only)
export const deleteTask = async (taskId) => {
  try {
    const response = await axiosInstance.delete(`/tasks/${taskId}/delete/`);
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to delete task";
  }
};

// Update only task status (Admin & Staff)
export const updateTaskStatus = async (taskId, status) => {
  try {
    const response = await axiosInstance.patch(`/tasks/${taskId}/status/`, {
      status,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.detail || "Failed to update task status";
  }
};
