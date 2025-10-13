"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getUserProfile,
  logout,
  isAuthenticated,
} from "../../utils/authService";
import { getTasks, getTaskCounts } from "../../utils/mockData";
import TaskCard from "../components/layout/TaskCard";
import DashboardCard from "../components/layout/DashboardCard";
import {
  LogOut,
  User,
  ListTodo,
  Clock,
  CheckCircle,
  ClipboardList,
  Search,
  Filter,
} from "lucide-react";
import Loading from "../components/layout/Loading";

const Page = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    pending: 0,
    in_progress: 0,
    completed: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }

    // Fetch user profile and tasks
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);

        // Get tasks (using mock data for now)
        const tasksData = await getTasks();

        // Filter tasks based on user role
        let userTasks = tasksData;
        if (userData.role === "staff") {
          // Staff only sees their assigned tasks
          userTasks = tasksData.filter(
            (task) => task.assigned_user === userData.id
          );
        }

        setTasks(userTasks);
        setFilteredTasks(userTasks);
        setTaskCounts(getTaskCounts(userTasks));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        router.push("/auth/login");
      }
    };

    fetchData();
  }, [router]);

  // Handle search and filter
  useEffect(() => {
    let result = tasks;

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((task) => task.status === statusFilter);
    }

    // Search by title or description
    if (searchQuery) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredTasks(result);
  }, [searchQuery, statusFilter, tasks]);

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div>
        <Loading/>
      </div>
    );
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}! 👋
          </h2>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your tasks today.
          </p>
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
                placeholder="Search tasks by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
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
              <p className="text-gray-500 text-lg">No tasks found</p>
              <p className="text-gray-400 text-sm mt-1">
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Tasks will appear here once created"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
