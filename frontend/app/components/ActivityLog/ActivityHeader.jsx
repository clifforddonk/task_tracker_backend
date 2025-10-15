import { Activity as ActivityIcon } from "lucide-react";

const ActivityHeader = ({ userRole, activitiesCount }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">
        {userRole === "admin" ? "All Activity Logs" : "Your Task Activities"}
      </h2>
      <div className="flex items-center space-x-2 text-gray-500">
        <ActivityIcon className="h-5 w-5" />
        <span>
          {activitiesCount} {activitiesCount === 1 ? "activity" : "activities"}
        </span>
      </div>
    </div>
  );
};

export default ActivityHeader;
