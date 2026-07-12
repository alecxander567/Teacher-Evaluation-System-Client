// src/components/Navbar.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiUser,
  FiLogOut,
  FiSettings,
  FiChevronDown,
  FiHelpCircle,
} from "react-icons/fi";
import { EvalMark } from "./icons/EvalMark";

interface NavbarProps {
  showHelp?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ showHelp = true }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate("/admin-settings");
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!user) {
    return (
      <nav className="bg-gradient-to-b from-[#0A0E1A] to-[#121A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 min-w-0">
              <EvalMark className="h-7 w-7 flex-shrink-0" />
              <span
                className="text-base sm:text-lg font-semibold text-[#F4F6FA] tracking-tight truncate"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                <span className="hidden sm:inline">SPCT Evaluation System</span>
                <span className="sm:hidden">SPCT</span>
              </span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 min-w-0">
            <EvalMark className="h-7 w-7 flex-shrink-0" />
            <span
              className="text-base sm:text-lg font-semibold text-[#F4F6FA] tracking-tight truncate"
              style={{
                fontFamily: "'Space Grotesk', system-ui, sans-serif",
              }}>
              <span className="hidden sm:inline">SPCT Evaluation System</span>
              <span className="sm:hidden">SPCT</span>
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
            {/* Help Link */}
            {showHelp && (
              <button
                onClick={() => navigate("/help")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-[#8E97AE] hover:text-white hover:bg-white/5 transition-colors">
                <FiHelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Help</span>
              </button>
            )}

            {/* Profile Dropdown */}
            <div className="relative profile-dropdown">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                <div className="h-8 w-8 rounded-full bg-[#3D6BFF] flex items-center justify-center flex-shrink-0">
                  <FiUser className="h-4 w-4 text-[#0A0E1A]" />
                </div>
                <span className="hidden md:inline text-sm font-medium text-[#F4F6FA] whitespace-nowrap">
                  {user.firstName} {user.lastName}
                </span>
                <FiChevronDown
                  className={`h-4 w-4 text-[#8E97AE] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#E4E8F0] py-1 z-50">
                  <div className="px-4 py-3 border-b border-[#E4E8F0]">
                    <p className="text-sm font-medium text-[#101625]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#5A6478] truncate">
                      {user.email}
                    </p>
                    <span className="inline-block mt-1 px-2 py-0.5 bg-[#EBF0FE] text-[#3D6BFF] text-xs rounded-full">
                      {user.role}
                    </span>
                  </div>

                  <button
                    onClick={handleSettings}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#101625] hover:bg-[#F4F6FA] transition-colors">
                    <FiSettings className="h-4 w-4 text-[#5A6478]" />
                    Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-[#FBEEF0] transition-colors border-t border-[#E4E8F0]">
                    <FiLogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
