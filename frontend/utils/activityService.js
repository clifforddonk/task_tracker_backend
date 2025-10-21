import axiosInstance from "@/axios/axiosInstance";

export const getAllActivities = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.taskId) params.append('task_id', filters.taskId);
    if (filters.action) params.append('action', filters.action);
    if (filters.search) params.append('search', filters.search);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await axiosInstance.get(
      `/api/activity/?${params.toString()}`
    );
    
    return response.data.results || response.data;
  } catch (error) {
 
    throw error;
  }
};

export const getTaskActivities = async (taskId) => {
  try {
    const response = await axiosInstance.get(
      `/api/activity/by_task/?task_id=${taskId}`
    );
    
    return response.data;
  } catch (error) {
  
    throw error;
  }
};

export const getRecentActivities = async () => {
  try {
    const response = await axiosInstance.get(
      `/api/activity/recent/`
    );
    
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const getActivityLogs = async () => {
  try {
    const response = await axiosInstance.get("/api/activity/");
    return response.data;
  } catch (error) {
 
    throw error;
  }
};

export const getRecentActivityLogs = async () => {
  try {
    const response = await axiosInstance.get("/api/activity/recent/");
    return response.data;
  } catch (error) {
   
    throw error;
  }
};

export const getActivityLogsByTask = async (taskId) => {
  try {
    const response = await axiosInstance.get(`/api/activity/by_task/?task_id=${taskId}`);
    return response.data;
  } catch (error) {
    
    throw error;
  }
};
