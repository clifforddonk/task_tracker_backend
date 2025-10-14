"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllActivities, getTaskActivities } from "@/utils/activityService";
import { useUser } from "@/context/UserContext";
import ActivityCard from "./ActivityCard";
import ActivityFilters from "./ActivityFilters";
import {
  ArrowLeft,
  Activity,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  Loader,
} from "lucide-react";
import Link from "next/link";

const ActivityLogPage = () => {
  const { user, loading: userLoading } = useUser();
  const [activities, setActivities] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  const router = useRouter();

  // Fetch activities based on user role
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const data = await getAllActivities({
          search: searchQuery,
          action: actionFilter !== "all" ? actionFilter : null,
        });

        setActivities(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError("Failed to load activity log");
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [user, searchQuery, actionFilter]);

  // Apply sorting
  useEffect(() => {
    let sorted = [...activities];

    if (sortOrder === "newest") {
      sorted.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
    } else {
      sorted.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    }

    setFilteredActivities(sorted);
  }, [activities, sortOrder]);

  const getActionColor = (action) => {
    const colors = {
      created: "bg-blue-100 text-blue-800 border-blue-300",
      updated: "bg-yellow-100 text-yellow-800 border-yellow-300",
      status_changed: "bg-purple-100 text-purple-800 border-purple-300",
      deleted: "bg-red-100 text-red-800 border-red-300",
      assigned: "bg-green-100 text-green-800 border-green-300",
      unassigned: "bg-orange-100 text-orange-800 border-orange-300",
      comment_added: "bg-indigo-100 text-indigo-800 border-indigo-300",
    };

    return colors[action] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return `Today at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return `Yesterday at ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return date.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <nav className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
              </Link>
              <div className="flex items-center space-x-3">
                <Activity className="h-6 w-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Activity Log
                </h1>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {user?.role === "admin" ? "All Activities" : "Your Activities"}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search activities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Action Filter */}
              <div className="flex gap-2">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={actionFilter}
                    onChange={(e) => setActionFilter(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="all">All Actions</option>
                    <option value="created">Created</option>
                    <option value="updated">Updated</option>
                    <option value="status_changed">Status Changed</option>
                    <option value="assigned">Assigned</option>
                    <option value="unassigned">Unassigned</option>
                    <option value="deleted">Deleted</option>
                    <option value="comment_added">Comment Added</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white cursor-pointer"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
              <p className="text-sm text-red-700 mt-1">Please try again later</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Activities List */}
        {!loading && (
          <>
            {filteredActivities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Activity className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No activities found
                </h3>
                <p className="text-gray-600">
                  {searchQuery || actionFilter !== "all"
                    ? "Try adjusting your filters"
                    : "Activity log will appear here"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition p-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Action Badge */}
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full border ${getActionColor(
                              activity.action
                            )}`}
                          >
                            {activity.action.replace("_", " ").toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {activity.user?.username || "System"}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-900 font-medium mb-2">
                          {activity.description}
                        </p>

                        {/* Task Link */}
                        {activity.task_id && (
                          <div className="mb-3">
                            <Link href={`/dashboard/tasks/${activity.task_id}`}>
                              <span className="text-sm text-indigo-600 hover:text-indigo-700 cursor-pointer font-medium">
                                Task: {activity.task_title}
                              </span>
                            </Link>
                          </div>
                        )}

                        {/* Changes Details */}
                        {activity.changes && Object.keys(activity.changes).length > 0 && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              Changes:
                            </p>
                            <div className="space-y-1">
                              {Object.entries(activity.changes).map(([key, value]) => {
                                if (key === "task_id" || key.includes("_users")) {
                                  return null;
                                }

                                if (typeof value === "object" && value !== null && "old" in value) {
                                  return (
                                    <div key={key} className="text-xs text-gray-600">
                                      <span className="font-medium capitalize">
                                        {key.replace("_", " ")}:
                                      </span>{" "}
                                      <span className="line-through text-red-600">
                                        {value.old || "—"}
                                      </span>{" "}
                                      → <span className="text-green-600">{value.new || "—"}</span>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-right">
                        <time className="text-sm text-gray-500 whitespace-nowrap">
                          {formatDate(activity.timestamp)}
                        </time>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityLogPage;