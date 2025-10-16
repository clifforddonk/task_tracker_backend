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
    const action = activity.action?.toLowerCase();
    const isCurrentUser = activity.user.id === currentUser?.id;
    const userName = isCurrentUser ? "You" : activity.user.username;

    switch (action) {
      case "created":
        return isCurrentUser
          ? `You created task "${taskTitle}"`
          : `${userName} created task "${taskTitle}"`;

      case "updated":
        return isCurrentUser
          ? `You updated task "${taskTitle}"`
          : `${userName} updated task "${taskTitle}"`;

      case "status_changed": {
        const status = activity.changes?.to?.replace("_", " ") || "updated";
        return isCurrentUser
          ? `You marked "${taskTitle}" as ${status}`
          : `${userName} marked "${taskTitle}" as ${status}`;
      }

      case "deleted": {
        // Extract username and replace with "You" if current user
        const deletedBy = activity.description.split(" deleted")[0].trim();
        const isCurrentUser = deletedBy === currentUser?.username;

        const updatedDescription = activity.description.replace(
          deletedBy,
          isCurrentUser ? "You" : deletedBy
        );

        return updatedDescription;
      }

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
