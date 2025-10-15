import { Clock } from "lucide-react";

const EmptyActivities = ({ userRole }) => {
  return (
    <div className="text-center py-12">
      <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">No activities yet</p>
      <p className="text-gray-400 text-sm mt-1">
        {userRole === "staff"
          ? "Activities for your assigned tasks will appear here"
          : "Activity logs will appear here"}
      </p>
    </div>
  );
};

export default EmptyActivities;
