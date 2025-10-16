import { Plus } from "lucide-react";
import Link from "next/link";

const WelcomeSection = ({ username, isAdmin }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
          Welcome back, {username}! 👋
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Here's what's happening with your tasks today.
        </p>
      </div>

      <div className="flex gap-2 sm:gap-3 flex-shrink-0">
        {isAdmin && (
          <Link href="/dashboard/tasks" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white text-sm sm:text-base rounded-lg hover:bg-indigo-700 transition shadow-md active:shadow-sm active:scale-95">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="whitespace-nowrap">Create Task</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default WelcomeSection;
