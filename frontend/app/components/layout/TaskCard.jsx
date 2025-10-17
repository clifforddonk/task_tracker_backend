"use client";
import { useState } from "react";
import { User } from "lucide-react";
import TaskModal from "./TaskModal";

const TaskCard = ({ task, onUpdate, currentUser }) => {
  const [showModal, setShowModal] = useState(false);

  const ismy =
    currentUser?.role === "admin" && currentUser?.id === task.assigned_user;

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const priorityBorders = {
    low: "border-l-green-500",
    medium: "border-l-yellow-500",
    high: "border-l-red-500",
  };

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer border-l-4 ${
          priorityBorders[task.priority]
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <User className="h-4 w-4 mr-1" />

              <span>
                {currentUser?.role === "admin"
                  ? currentUser?.id === task.assigned_user
                    ? "Me"
                    : task.assigned_user_name
                  : currentUser?.role === "staff"
                  ? task.created_by_username
                  : null}
              </span>
            </div>
          </div>
          <p>
            {ismy && (
              <span className="text-gray-500 mr-2 px-2 py-1 bg-yellow-200 rounded-full text-xs font-medium ">
                my task
              </span>
            )}
          </p>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              statusColors[task.status]
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>
      </div>

      {showModal && (
        <TaskModal
          task={task}
          currentUser={currentUser}
          onClose={() => setShowModal(false)}
          onUpdate={onUpdate}
        />
      )}
    </>
  );
};

export default TaskCard;
