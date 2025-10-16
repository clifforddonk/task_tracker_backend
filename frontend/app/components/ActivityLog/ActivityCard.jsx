// components/ActivityLog/ActivityCard.jsx

"use client";

import { Clock } from "lucide-react";

const ActivityCard = ({ activity, currentUser }) => {
  // Helper to get the reliable task title
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
    const isCurrentUser = activity.user.id === currentUser?.id;
    const userName = isCurrentUser ? "You" : activity.user.username;

    // Use the pre-formatted description from the backend as the primary source of truth
    // This ensures consistency with what the backend logs.
    const description = activity.description;
    
    // Replace the backend username with "You" if it's the current user for a more personal feel.
    if (isCurrentUser) {
        return description.replace(activity.user.username, "You");
    }

    return description;
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