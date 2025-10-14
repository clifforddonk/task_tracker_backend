"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "@/axios/axiosInstance";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("access_token");

        if (!token) {
          setLoading(false);
          return;
        }

        // Set the token in axios headers
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const response = await axiosInstance.get("/api/users/profile/");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        // Only clear auth if it's an auth error (401)
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          delete axiosInstance.defaults.headers.common["Authorization"];
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
