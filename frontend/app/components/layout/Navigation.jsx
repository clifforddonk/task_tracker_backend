import { User, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const Navigation = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setMobileMenuOpen(false);
    onLogout();
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-lg sm:text-2xl font-bold text-indigo-600 whitespace-nowrap">
              TaskTracker
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                {user?.username}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 capitalize">
                ({user?.role})
              </span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition active:bg-red-100"
            >
              <LogOut className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="text-sm sm:text-base">Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-gray-200 py-4 space-y-3">
            <div className="flex items-center gap-2 text-gray-700 px-2 py-2">
              <User className="h-5 w-5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 capitalize">
                  ({user?.role})
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
