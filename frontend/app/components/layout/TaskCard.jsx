import { Calendar, User, AlertCircle } from "lucide-react";

const TaskCard = ({ task }) => {
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

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-1" />
            <span>{task.assigned_user_name}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{new Date(task.deadline).toLocaleDateString()}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status.replace("_", " ")}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
