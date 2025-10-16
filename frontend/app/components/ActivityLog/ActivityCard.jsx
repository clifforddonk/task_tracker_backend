"use client";

import { Clock } from "lucide-react";

const ActivityCard = ({ activity, currentUser }) => {
  const taskTitle = activity.task_info?.title || "a task";

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

  const getSimpleDescription = (activity) => {
    const description = activity.description || "";
    const actor = activity.user?.username || "";
    const isCurrentUser = currentUser?.id === activity.user?.id;

    // Extract everything after the username (e.g., "deleted task 'task 4'")
    const afterUsername = description.replace(actor, "").trim();

    // Replace the username with "You" if current user performed the action
    const displayActor = isCurrentUser ? "You" : actor;

    // Final readable description
    return `${displayActor} ${afterUsername}`;
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <span className="text-xl">{getActionIcon(activity.action)}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          {getSimpleDescription(activity)}
        </p>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>
            {new Date(activity.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActivityCard;
