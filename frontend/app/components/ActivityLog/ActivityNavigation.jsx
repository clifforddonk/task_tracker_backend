import { ArrowLeft, User } from "lucide-react";
import Link from "next/link";

const ActivityNavigation = ({ user }) => {
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span className="">Back</span>
              </button>
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-indigo-600">Activity Log</h1>
        </div>
      </div>
    </nav>
  );
};

export default ActivityNavigation;
