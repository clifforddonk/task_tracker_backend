"use client";
import { useState } from "react";
import { loginUser } from "../../../utils/authService";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, CheckCircle, X } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage("");
    setIsLoading(true);

    try {
      await loginUser(email, password);
      setMessage("Login successful! Redirecting...");

      // Wait a bit longer and use router.push directly
      setTimeout(() => {
        router.push("/dashboard");
        // Force reload to ensure UserContext picks up the new token
        window.location.href = "/dashboard";
      }, 500);
    } catch (err) {
      setError(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-blue-100">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Section - Hero/Landing Area */}
        <div className="w-full lg:w-1/2 bg-indigo-600 py-10 flex flex-col justify-center items-center text-white">
          <div className="max-w-md text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Welcome Back
            </h1>
            <p className="text-xl mb-8">We're excited to see you again!</p>

            <div className="space-y-6 mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-4" />
                <p className="text-lg">Access your personalized dashboard</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-4" />
                <p className="text-lg">Manage your tasks efficiently</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 mr-4" />
                <p className="text-lg">Collaborate with your team</p>
              </div>
            </div>

            <div className="mt-8 hidden lg:block">
              <p className="text-sm opacity-80">Trusted by teams worldwide</p>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full lg:w-1/2 flex justify-center items-center p-4 lg:p-8">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">
                Log In To Your Account
              </h2>
              <p className="text-gray-600 mt-2">Welcome back to TaskTracker</p>
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

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block text-gray-500 w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full text-gray-500  pl-10 pr-12 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
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

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-500  text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-600"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer transition-colors shadow-md disabled:opacity-70"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>

              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/auth/register">
                    <span className="text-indigo-600 hover:text-indigo-800 font-medium">
                      Register here
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
