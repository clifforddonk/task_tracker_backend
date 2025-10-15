"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../utils/authService";
import { getAllTasks } from "@/utils/taskService";
import TaskCard from "../components/layout/TaskCard";
import DashboardCard from "../components/layout/DashboardCard";
import { useUser } from "@/context/UserContext";
import { Activity as ActivityIcon } from "lucide-react";
import ActivityCard from "../components/ActivityLog/ActivityCard";
import Navigation from "../components/layout/Navigation";
import WelcomeSection from "../components/layout/WelcomeSection";
import SearchFilter from "../components/layout/SearchFilter";

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
import { getAllActivities } from "@/utils/activityService";

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
  const [activities, setActivities] = useState([]);
  const [loadingActivities, setLoadingActivities] = useState(true);
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

  // Fetch tasks and activities after user is loaded
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch tasks
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

        // Fetch activities
        const activitiesData = await getAllActivities();

        // Sort activities by date (most recent first) and get top 3
        const sortedActivities = activitiesData
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 3);

        setActivities(sortedActivities);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Only redirect on auth errors
        if (error.response?.status === 401) {
          router.push("/auth/login");
        }
      } finally {
        setLoadingActivities(false);
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
      <Navigation user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <WelcomeSection
          username={user?.username}
          isAdmin={user?.role === "admin"}
        />

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

        <SearchFilter
          searchQuery={searchQuery}
          statusFilter={statusFilter}
          onSearchChange={(e) => setSearchQuery(e.target.value)}
          onStatusChange={(e) => setStatusFilter(e.target.value)}
        />

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

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Recent Activity
            </h2>
            <button
              onClick={() => router.push("/dashboard/activity")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              <span>View More</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Activity List */}
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No recent activity</p>
              <p className="text-gray-400 text-sm mt-2">
                Start creating and updating tasks to see activity here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  currentUser={user}
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
