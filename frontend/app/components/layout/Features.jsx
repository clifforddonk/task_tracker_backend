import React from "react";
import { BarChart3, Clock, Users } from "lucide-react";
const Features = () => {
  const features = [
    {
      id: 1,
      icon: BarChart3,
      title: "Track Progress",
      description:
        "Monitor task status in real-time with visual dashboards and progress indicators.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: 2,
      icon: Users,
      title: "Team Collaboration",
      description:
        "Assign tasks to team members and collaborate effectively on projects.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
    {
      id: 3,
      icon: Clock,
      title: "Deadline Management",
      description:
        "Set priorities and deadlines to keep your team on track and productive.",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature) => {
          const Icon = feature.icon; // Get the icon component

          return (
            <div
              key={feature.id}
              className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition"
            >
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Features;
