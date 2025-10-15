"use client";

import { User, Clock } from "lucide-react";

const ActivityCard = ({ activity, currentUser }) => {
  const getActionIcon = (action) => {
    switch (action) {
      case "CREATED":
        return "🆕";
      case "UPDATED":
        return "✏️";
      case "STATUS_CHANGED":
        return "🔄";
      case "DELETED":
        return "🗑️";
      default:
        return "📝";
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "CREATED":
        return "bg-green-100 text-green-800";
      case "UPDATED":
        return "bg-blue-100 text-blue-800";
      case "STATUS_CHANGED":
        return "bg-yellow-100 text-yellow-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityDescription = (activity) => {
    const isCurrentUser = activity.user.id === currentUser?.id;
    const userName = isCurrentUser ? "You" : activity.user.username;

    switch (activity.action.toLowerCase()) {
      case "status_changed":
        return isCurrentUser
          ? `You marked "${activity.task_title}" as ${activity.changes.to}`
          : `${userName} marked "${activity.task_title}" as ${activity.changes.to}`;

      case "created":
        if (activity.task?.assigned_user?.id === currentUser?.id) {
          return `You have been assigned a task "${activity.task_title}" by ${activity.user.username}`;
        }
        return isCurrentUser
          ? `You created task "${activity.task_title}"`
          : `You have been assigned a task "${activity.task_title}" by ${activity.user.username}`;

      case "updated":
        return isCurrentUser
          ? `You updated task "${activity.task_title}"`
          : `${userName} updated task "${activity.task_title}"`;

      case "deleted":
        return isCurrentUser
          ? `You deleted task "${activity.task_title}"`
          : `${userName} deleted task "${activity.task_title}"`;

      default:
        return activity.description;
    }
  };

  return (
    <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition border border-gray-200">
      <div className="flex-shrink-0 text-2xl">
        {getActionIcon(activity.action)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${getActionColor(
              activity.action
            )}`}
          >
            {activity.action.replace("_", " ")}
          </span>
        </div>
        <p className="text-gray-900 mb-1">{getActivityDescription(activity)}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center space-x-1">
            <User className="h-3 w-3" />
            <span>{activity.user.username}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimestamp(activity.timestamp)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
