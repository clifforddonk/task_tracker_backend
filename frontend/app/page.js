"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../utils/authService";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Loading from "./components/layout/Loading";
import Features from "./components/layout/Features";
import Footer from "./components/layout/Footer";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (isAuthenticated()) {
      router.push("/dashboard");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">
                TaskTracker
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <button className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium transition">
                  Login
                </button>
              </Link>
              <Link href="/auth/register">
                <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition shadow-md">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Manage Your Tasks
            <span className="block text-indigo-600">
              Efficiently & Effectively
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            A simple, powerful task management system designed for teams. Track
            progress, assign tasks, and collaborate seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <button className="px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-lg transition shadow-lg flex items-center justify-center">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 font-semibold text-lg transition shadow-lg">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <Features />
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-16 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose TaskTracker?
            </h2>
            <p className="text-xl text-gray-600">
              Built for teams who value simplicity and productivity
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Role-Based Access
                </h4>
                <p className="text-gray-600">
                  Admins have full control while staff members focus on their
                  assigned tasks
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Real-Time Updates
                </h4>
                <p className="text-gray-600">
                  See task status changes instantly as your team makes progress
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Priority Management
                </h4>
                <p className="text-gray-600">
                  Organize tasks by priority to focus on what matters most
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CheckCircle className="h-6 w-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">
                  Activity Tracking
                </h4>
                <p className="text-gray-600">
                  Keep a complete log of all task changes and team activities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-indigo-600 rounded-2xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join teams worldwide who trust TaskTracker for their project
            management
          </p>
          <Link href="/auth/register">
            <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-semibold text-lg transition shadow-lg">
              Create Free Account
            </button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div>
        <Footer />
      </div>
    </div>
  );
};

export default Page;
