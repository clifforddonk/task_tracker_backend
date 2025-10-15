"use client";

import { Clock } from "lucide-react";

const SimpleActivityCard = ({ activity, currentUser }) => {
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

    switch (activity.action.toLowerCase()) {
      case "status_changed":
        return isCurrentUser
          ? `You marked "${
              activity.task_title
            }" as ${activity.changes.to.replace("_", " ")}`
          : `${userName} marked "${
              activity.task_title
            }" as ${activity.changes.to.replace("_", " ")}`;
      case "created":
        return isCurrentUser
          ? `You created task "${activity.task_title}"`
          : `You have been assigned "${activity.task_title}" by ${userName} `;
      case "updated":
        return isCurrentUser
          ? `You updated  task "${activity.task_title}"`
          : `${userName} updated task "${activity.task_title}
          "`;
      case "deleted":
        return isCurrentUser ? "You deleted" : `${userName} deleted`;
      default:
        return activity.description;
    }
  };

  return (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      <span className="text-xl">{getActionIcon(activity.action)}</span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          {getSimpleDescription(activity)}
        </p>
        <div className="flex items-center text-xs text-gray-500">
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

export default SimpleActivityCard;
