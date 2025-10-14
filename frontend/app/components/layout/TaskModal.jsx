"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateTaskStatus, deleteTask } from "@/utils/taskService";
import {
  X,
  Calendar,
  User,
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react";

const TaskModal = ({ task, currentUser, onClose, onUpdate }) => {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
  };

  const priorityColors = {
    low: "text-green-600 bg-green-50",
    medium: "text-yellow-600 bg-yellow-50",
    high: "text-red-600 bg-red-50",
  };

  const canUpdateStatus = task.assigned_user === currentUser?.id;

  const isAdmin = currentUser?.role === "admin";

  const handleStatusChange = async (newStatus) => {
    setError(null);
    setUpdating(true);

    try {
      await updateTaskStatus(task.id, newStatus);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setDeleting(true);

    try {
      await deleteTask(task.id);
      onUpdate();
      onClose();
    } catch (err) {
      setError(err);
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    router.push(`/dashboard/tasks/${task.id}/edit`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          )}

          {/* Title */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Title</h3>
            <p className="text-lg font-semibold text-gray-900">{task.title}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Description
            </h3>
            <p className="text-gray-700">{task.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assigned User */}
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Assigned To</p>
                <p className="text-sm font-medium text-gray-900">
                  {task.assigned_user_name || "Unassigned"}
                </p>
              </div>
            </div>

            {/* Deadline */}
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Deadline</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Priority */}
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(task.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Status Update Section */}
          {canUpdateStatus && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Update Status
              </h3>
              <div className="flex flex-wrap gap-3">
                {["pending", "in_progress", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    disabled={updating || task.status === status}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                      task.status === status
                        ? statusColors[status]
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {status.replace("_", " ").toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Admin Actions */}
          {isAdmin && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Admin Actions
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  <Edit className="h-4 w-4" />
                  <span>Edit Task</span>
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Task</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <div className="bg-white rounded-lg p-6 m-4 max-w-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Delete Task?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be
                undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
