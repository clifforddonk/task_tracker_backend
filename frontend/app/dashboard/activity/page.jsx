"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { getRecentActivityLogs } from "@/utils/activityService";
import Loading from "@/app/components/layout/Loading";
import ActivityCard from "@/app/components/ActivityLog/ActivityCard";
import ActivityNavigation from "@/app/components/ActivityLog/ActivityNavigation";
import ActivityHeader from "@/app/components/ActivityLog/ActivityHeader";
import EmptyActivities from "@/app/components/ActivityLog/EmptyActivities";

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

  if (loading || isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityNavigation user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <ActivityHeader
            userRole={user?.role}
            activitiesCount={activities.length}
          />

          {activities.length === 0 ? (
            <EmptyActivities userRole={user?.role} />
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
