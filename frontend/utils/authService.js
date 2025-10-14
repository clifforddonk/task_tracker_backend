import axiosInstance from "@/axios/axiosInstance";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/auth/signup/", userData);
    return response.data.message;
  } catch (error) {
    if (error.response?.data) {
      const errorData = error.response.data;

      if (errorData.non_field_errors) {
        throw errorData.non_field_errors[0];
      }
      if (errorData.email) {
        throw errorData.email[0];
      }
      if (errorData.username) {
        throw errorData.username[0];
      }
      if (errorData.password) {
        throw errorData.password[0];
      }
    }
    throw "Registration failed! Please try again.";
  }
};

// Login a user
export const loginUser = async (email, password) => {
  try {
    const response = await axiosInstance.post("/auth/login/", {
      email,
      password,
    });

    if (!response.data || !response.data.access) {
      throw new Error("Invalid response from server!");
    }

    // Store tokens in localStorage
    localStorage.setItem("access_token", response.data.access);
    localStorage.setItem("refresh_token", response.data.refresh);

    return "Login successful!";
  } catch (error) {
    const errorMessage =
      error.response?.data?.detail || "Invalid email or password!";
    throw errorMessage;
  }
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("access_token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await axiosInstance.get("/auth/profile/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        const token = localStorage.getItem("access_token");
        const response = await axiosInstance.get("/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (refreshError) {
        logout();
        throw new Error("Session expired. Please login again.");
      }
    }
    throw error.response?.data || "Failed to fetch user profile.";
  }
};

// Refresh access token
export const refreshToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) {
      throw new Error("No refresh token found");
    }

    const response = await axiosInstance.post("/auth/token/refresh/", {
      refresh: refresh,
    });

    localStorage.setItem("access_token", response.data.access);
    return response.data.access;
  } catch (error) {
    logout();
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  window.location.href = "/auth/login";
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem("access_token");
};

// Get all users (Admin only - for task assignment)
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem("access_token");
    const response = await axiosInstance.get("/auth/users/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Failed to fetch users.";
  }
};
