"use client";
import { useState } from "react";
import { Calendar, User, AlertCircle } from "lucide-react";
import { updateTaskStatus } from "../../../utils/taskService";
import { getUserProfile } from "@/utils/authService";

const TaskCard = ({ task, onUpdate, currentUser }) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  // Priority colors
  const priorityColors = {
    low: "text-green-600",
    medium: "text-yellow-600",
    high: "text-red-600",
  };

  const priorityDots = {
    low: "bg-green-500",
    medium: "bg-yellow-500",
    high: "bg-red-500",
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setError(null);
    setUpdating(true);

    try {
      await updateTaskStatus(task.id, newStatus);
      // Call parent component to refresh data
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
    window.location.reload();
  };

  // Check if current user can update this task
  const canUpdateStatus = task.assigned_user === currentUser?.id;

  return (
    <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition border-l-4 border-indigo-500">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {task.description}
          </p>
        </div>
        <div className="flex items-center ml-3">
          <span
            className={`w-3 h-3 rounded-full ${priorityDots[task.priority]}`}
          ></span>
          <span
            className={`ml-1 text-xs font-medium ${
              priorityColors[task.priority]
            } uppercase`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 text-red-600 text-xs rounded">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex space-x-4 justify-between">
            <div>
              <span>
                Assigned to:{" "}
                {task.assigned_user === currentUser?.id
                  ? "Me"
                  : task.assigned_user_name}
              </span>
            </div>
            <div className="flex">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Status - Dropdown if user can update, badge otherwise */}
        {canUpdateStatus ? (
          <select
            value={task.status}
            onChange={handleStatusChange}
            disabled={updating}
            className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              statusColors[task.status]
            } ${updating ? "opacity-50" : ""}`}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        ) : (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
