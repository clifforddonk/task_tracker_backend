"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  logout,
  isAuthenticated,
} from "../../utils/authService";
import { LogOut, User } from "lucide-react";
import Loading from "../components/layout/Loading";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Fetch user profile
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/auth/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                TaskTracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-5 w-5" />
                <span className="font-medium">{user?.username}</span>
                <span className="text-sm text-gray-500">({user?.role})</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome, {user?.username}! 👋
          </h1>
          <p className="text-xl text-gray-600">
            You're logged in as{" "}
            <span className="font-semibold text-indigo-600">{user?.role}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
