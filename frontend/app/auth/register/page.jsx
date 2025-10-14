"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../../../utils/authService";
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setIsLoading(true);

    try {
      const result = await registerUser(userData);
      setMessage(result);
      setIsLoading(false);

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Hero/Landing Area */}
        <div className="w-full lg:w-1/2 bg-indigo-600 px-5 py-12 flex flex-col justify-center items-center text-white">
          <div className="max-w-md text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Welcome to TaskTracker
            </h1>
            <p className="text-xl mb-8">
              Join our team and manage tasks efficiently.
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <p className="text-lg">Track your tasks in real-time</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <p className="text-lg">Collaborate with your team</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-3" />
                <p className="text-lg">Stay organized and productive</p>
              </div>
            </div>

            <div className="mt-8 hidden lg:block">
              <p className="text-sm opacity-80">Trusted by teams worldwide</p>
            </div>
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Create Account
              </h2>
              <p className="text-gray-600 mt-2">Start managing tasks today</p>
            </div>

            {/* Status Messages */}
            {message && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg flex items-center mb-6">
                <CheckCircle className="h-5 w-5 mr-2" />
                <p>{message}</p>
              </div>
            )}
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center mb-6">
                <X className="h-5 w-5 mr-2" />
                <p>{error}</p>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Username"
                  value={userData.username}
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  required
                  className="block w-full text-gray-500  text-black pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  required
                  className="block text-black text-gray-500  w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  required
                  className="block w-full text-gray-500   text-black pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Role Selection (Optional - can be hidden for staff-only registration) */}
              {/* <div className="relative">
                <select
                  value={userData.role}
                  onChange={(e) =>
                    setUserData({ ...userData, role: e.target.value })
                  }
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div> */}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors shadow-md disabled:opacity-70"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link href="/auth/login">
                    <span className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Sign In
                    </span>
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
