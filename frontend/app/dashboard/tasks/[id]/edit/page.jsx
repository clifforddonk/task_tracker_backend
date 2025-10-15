"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUserProfile, getAllUsers } from "../../../../../utils/authService";
import { getTaskById, editTask } from "../../../../../utils/taskService";
import Loading from "@/app/components/layout/Loading";
import Navigation from "@/app/components/layout/Navigation";
import TaskFormLayout from "@/app/components/layout/TaskFormLayout";
import TaskForm from "@/app/components/layout/TaskForm";

const EditTaskPage = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const params = useParams();
  const taskId = params.id;

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assigned_user: "",
    status: "pending",
    priority: "medium",
    deadline: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);

        // Check if user is admin
        if (userData.role !== "admin") {
          router.push("/dashboard");
          return;
        }

        // Fetch task details
        const task = await getTaskById(taskId);
        setTaskData({
          title: task.title,
          description: task.description,
          assigned_user: task.assigned_user,
          status: task.status,
          priority: task.priority,
          deadline: task.deadline,
        });

        // Fetch all users for reassignment
        const usersData = await getAllUsers();
        setUsers(usersData);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        router.push("/dashboard");
      }
    };

    fetchData();
  }, [router, taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      await editTask(taskId, taskData);
      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err);
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setTaskData({
      ...taskData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} title="Edit Task" backLink="/dashboard" />

      <TaskFormLayout success={success} error={error} title="Edit Task">
        <TaskForm
          taskData={taskData}
          users={users}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          submitting={submitting}
        />
      </TaskFormLayout>
    </div>
  );
};

export default EditTaskPage;
