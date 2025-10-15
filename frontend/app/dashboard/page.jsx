"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../utils/authService";
import { getAllTasks } from "@/utils/taskService";
import TaskCard from "../components/layout/TaskCard";
import DashboardCard from "../components/layout/DashboardCard";
import { useUser } from "@/context/UserContext";
import { Activity as ActivityIcon } from "lucide-react";

import {
  LogOut,
  User,
  ListTodo,
  Clock,
  CheckCircle,
  ClipboardList,
  Search,
  Filter,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Loading from "../components/layout/Loading";

const Page = () => {
  const { user, loading } = useUser();
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    total: 0,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  // Calculate task counts
  const calculateTaskCounts = (tasksList) => {
    return {
      pending: tasksList.filter((task) => task.status === "pending").length,
      in_progress: tasksList.filter((task) => task.status === "in_progress")
        .length,
      completed: tasksList.filter((task) => task.status === "completed").length,
      total: tasksList.length,
    };
  };

  // Check authentication first
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token && !loading) {
      router.push("/auth/login");
    }
  }, [loading, router]);

  // Fetch tasks after user is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const tasksData = await getAllTasks();

        // Filter tasks based on user role
        let userTasks = tasksData;
        if (user?.role === "staff") {
          userTasks = tasksData.filter(
            (task) => task.assigned_user === user.id
          );
        }

        setTasks(userTasks);
        setFilteredTasks(userTasks);
        setTaskCounts(calculateTaskCounts(userTasks));
      } catch (error) {
        console.error("Error fetching tasks:", error);
        // Only redirect on auth errors
        if (error.response?.status === 401) {
          router.push("/auth/login");
        }
      }
    };

    fetchData();
  }, [user]); // Only depend on user

  // Handle search and filter
  useEffect(() => {
    let result = tasks;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Search by assigned user name or title
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.assigned_user_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          task.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, tasks]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
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
                <span className="text-sm text-gray-500 capitalize">
                  ({user?.role})
                </span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}! 👋
            </h2>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your tasks today.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Activity Log - Available to All Users */}
            <Link href="/dashboard/activity">
              <button className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition shadow-md">
                <ActivityIcon className="h-5 w-5" />
                <span>Activity Log</span>
              </button>
            </Link>

            {/* Create Task Button - Admin Only */}
            {user?.role === "admin" && (
              <Link href="/dashboard/tasks">
                <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
                  <Plus className="h-5 w-5" />
                  <span>Create Task</span>
                </button>
              </Link>
            )}
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Tasks"
            count={taskCounts.total}
            icon={ClipboardList}
            color="text-indigo-600"
            bgColor="bg-indigo-100"
          />
          <DashboardCard
            title="Pending"
            count={taskCounts.pending}
            icon={ListTodo}
            color="text-yellow-600"
            bgColor="bg-yellow-100"
          />
          <DashboardCard
            title="In Progress"
            count={taskCounts.in_progress}
            icon={Clock}
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <DashboardCard
            title="Completed"
            count={taskCounts.completed}
            icon={CheckCircle}
            color="text-green-600"
            bgColor="bg-green-100"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by assigned user or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10  text-gray-500 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 text-gray-500 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">
              {statusFilter === "all"
                ? "All Tasks"
                : `${statusFilter.replace("_", " ")} Tasks`}
            </h3>
            <span className="text-gray-500">
              {filteredTasks.length}{" "}
              {filteredTasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardList className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {user?.role === "staff"
                  ? "You Haven't Been Assigned Any Task Yet"
                  : "You Haven't Created Any Task"}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Tasks will appear here once created"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  currentUser={user}
                  onUpdate={async () => {
                    // Refresh tasks after update
                    const tasksData = await getAllTasks();
                    let userTasks = tasksData;
                    if (user.role === "staff") {
                      userTasks = tasksData.filter(
                        (task) => task.assigned_user === user.id
                      );
                    }

                    setTasks(userTasks);
                    setFilteredTasks(userTasks);
                    setTaskCounts(calculateTaskCounts(userTasks));
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
