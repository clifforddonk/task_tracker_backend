"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getRecentActivityLogs } from "@/utils/activityService";
import {
  ArrowLeft,
  Clock,
  User,
  FileText,
  Activity as ActivityIcon,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/app/components/layout/Loading"
import ActivityCard from "@/app/components/ActivityLog/ActivityCard";

const ActivityPage = () => {
  const { user, loading } = useUser();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivityLogs();
        setActivities(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching activities:", error);
        setIsLoading(false);
      }
    };

    if (user) {
      fetchActivities();
    }
  }, [user]);

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

  const getActionColor = (action) => {
    switch (action) {
      case "CREATED":
        return "bg-green-100 text-green-800";
      case "UPDATED":
        return "bg-blue-100 text-blue-800";
      case "STATUS_CHANGED":
        return "bg-yellow-100 text-yellow-800";
      case "DELETED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityDescription = (activity) => {
    const isCurrentUser = activity.user.id === user?.id;
    const userName = isCurrentUser ? "You" : activity.user.username;

    switch (activity.action) {
      case "status_changed":
        return isCurrentUser
          ? `You marked "${activity.task_title}" as ${activity.changes.to}`
          : `${userName} marked "${activity.task_title}" as ${activity.changes.to}`;

      case "created":
        if (activity.task?.assigned_user?.id === user?.id) {
          return `You have been assigned a task "${activity.task_title}" by ${activity.user.username}`;
        }
        return isCurrentUser
          ? `You created task "${activity.task_title}"`
          : `${userName} created task "${activity.task_title}"`;

      case "updated":
        return isCurrentUser
          ? `You updated task "${activity.task_title}"`
          : `${userName} updated task "${activity.task_title}"`;

      case "deleted":
        return isCurrentUser
          ? `You deleted task "${activity.task_title}"`
          : `${userName} deleted task "${activity.task_title}"`;

      default:
        return activity.description;
    }
  };

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </button>
              </Link>
            </div>
            <h1 className="text-2xl font-bold text-indigo-600">Activity Log</h1>
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5" />
              <span className="font-medium">{user?.username}</span>
              <span className="text-sm text-gray-500 capitalize">
                ({user?.role})
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {user?.role === "admin"
                ? "All Activity Logs"
                : "Your Task Activities"}
            </h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <ActivityIcon className="h-5 w-5" />
              <span>
                {activities.length}{" "}
                {activities.length === 1 ? "activity" : "activities"}
              </span>
            </div>
          </div>

          {activities.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No activities yet</p>
              <p className="text-gray-400 text-sm mt-1">
                {user?.role === "staff"
                  ? "Activities for your assigned tasks will appear here"
                  : "Activity logs will appear here"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  currentUser={user}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityPage;
