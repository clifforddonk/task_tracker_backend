import { Plus } from "lucide-react";
import Link from "next/link";

const WelcomeSection = ({ username, isAdmin }) => {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back, {username}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <div className="flex gap-3">
        {isAdmin && (
          <Link href="/dashboard/tasks">
            <button className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md">
              <Plus className="h-5 w-5" />
              <span>Create Task</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;
