// Mock tasks data - we'll replace this with real API later
export const mockTasks = [
  {
    id: 1,
    title: "Fix login bug",
    description: "Users can't login with email",
    assigned_user: 1,
    assigned_user_name: "John Doe",
    status: "in_progress",
    priority: "high",
    deadline: "2025-10-15",
    created_at: "2025-10-10",
  },
  {
    id: 2,
    title: "Update documentation",
    description: "Add API docs for new endpoints",
    assigned_user: 1,
    assigned_user_name: "Jane Smith",
    status: "pending",
    priority: "medium",
    deadline: "2025-10-20",
    created_at: "2025-10-11",
  },
  {
    id: 3,
    title: "Deploy to production",
    description: "Deploy v2.0 to production server",
    assigned_user: 1,
    assigned_user_name: "John Doe",
    status: "completed",
    priority: "high",
    deadline: "2025-10-12",
    created_at: "2025-10-08",
  },
  {
    id: 4,
    title: "Design new landing page",
    description: "Create mockups for homepage redesign",
    assigned_user: 1,
    assigned_user_name: "Alice Johnson",
    status: "pending",
    priority: "low",
    deadline: "2025-10-25",
    created_at: "2025-10-12",
  },
  {
    id: 5,
    title: "Database optimization",
    description: "Optimize slow queries in production",
    assigned_user: 1,
    assigned_user_name: "John Doe",
    status: "in_progress",
    priority: "medium",
    deadline: "2025-10-18",
    created_at: "2025-10-13",
  },
];

// Mock function to get tasks (we'll replace with API call)
export const getTasks = async () => {
  // Simulate API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTasks);
    }, 500);
  });
};

// Get task counts by status
export const getTaskCounts = (tasks) => {
  return {
    pending: tasks.filter((task) => task.status === "pending").length,
    in_progress: tasks.filter((task) => task.status === "in_progress").length,
    completed: tasks.filter((task) => task.status === "completed").length,
    total: tasks.length,
  };
};
