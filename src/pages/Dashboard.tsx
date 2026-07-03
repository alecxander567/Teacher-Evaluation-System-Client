// src/pages/Dashboard.tsx (updated)
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  FiUser,
  FiLogOut,
  FiUsers,
  FiSettings,
  FiBell,
  FiCalendar,
  FiFileText,
  FiArrowRight,
  FiUserPlus,
} from "react-icons/fi";
import { EvalMark } from "../components/icons/EvalMark";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize user from localStorage directly
  const [user] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
  };

  const stats = [
    { label: "Total Users", value: "1,234", icon: FiUsers },
    { label: "Active Sessions", value: "56", icon: FiUsers },
    { label: "Tasks Pending", value: "23", icon: FiFileText },
    { label: "Upcoming Events", value: "8", icon: FiCalendar },
  ];

  const recentActivities = [
    { id: 1, action: "User John Doe signed up", time: "2 minutes ago" },
    { id: 2, action: "New evaluation submitted", time: "15 minutes ago" },
    { id: 3, action: "System update completed", time: "1 hour ago" },
    {
      id: 4,
      action: "Password changed for admin@example.com",
      time: "3 hours ago",
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
          <p className="mt-4 text-[#5B6472]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* Navbar — brand shortens, name hides, logout drops its label,
          all before anything wraps or overflows. */}
      <nav className="bg-[#101826]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 min-w-0">
              <EvalMark className="h-7 w-7 flex-shrink-0" />
              <span
                className="text-base sm:text-lg font-semibold text-[#FAFAF6] tracking-tight truncate"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                <span className="hidden sm:inline">SPCT Evaluation System</span>
                <span className="sm:hidden">SPCT</span>
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                <FiBell className="h-5 w-5 text-[#AEB6C2]" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#E8A23D] rounded-full"></span>
              </button>
              <div className="flex items-center gap-1 sm:gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-[#E8A23D] flex items-center justify-center flex-shrink-0">
                    <FiUser className="h-4 w-4 text-[#101826]" />
                  </div>
                  <span className="hidden md:inline text-sm font-medium text-[#FAFAF6] whitespace-nowrap">
                    {user.firstName} {user.lastName}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-2 sm:px-3 py-2 text-sm text-[#AEB6C2] hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  <FiLogOut className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-[#101826] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
          <EvalMark className="pointer-events-none absolute -right-10 -bottom-14 w-44 h-44 sm:w-56 sm:h-56 opacity-[0.08]" />
          <div className="relative">
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#FAFAF6] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Welcome back, {user.firstName}
            </h1>
            <p className="text-[#AEB6C2] mt-1 text-sm sm:text-base">
              Here's what's happening with your evaluation system today.
            </p>
            <div className="mt-3">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-white/10 text-[#E8A23D]"
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid — 1 col on phones, 2 on small tablets, 4 from md up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-[#E4E1D9] p-5 sm:p-6 hover:border-[#E8A23D]/50 hover:shadow-sm transition-all">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#5B6472] truncate">
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-semibold text-[#101826] mt-1"
                    style={{
                      fontFamily: "'Space Grotesk', system-ui, sans-serif",
                    }}>
                    {stat.value}
                  </p>
                </div>
                <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-[#101826] flex items-center justify-center flex-shrink-0 ml-3">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[#E8A23D]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Two Column Layout — stacks to a single column below lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E1D9] p-5 sm:p-6">
            <h2
              className="text-lg font-semibold text-[#101826] mb-4"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-3 border-b border-[#E4E1D9] last:border-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-[#FBEEDC] flex items-center justify-center flex-shrink-0">
                      <FiFileText className="h-4 w-4 text-[#B8791F]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[#101826] truncate">
                        {activity.action}
                      </p>
                      <p className="text-xs text-[#5B6472]">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 flex items-center gap-1.5 text-sm font-medium text-[#B8791F] hover:text-[#101826] transition-colors">
              View all activity
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-[#E4E1D9] p-5 sm:p-6">
            <h2
              className="text-lg font-semibold text-[#101826] mb-4"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Quick Actions
            </h2>
            <div className="space-y-3">
              {/* Manage Teachers */}
              <button
                onClick={() => navigate("/teachers")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiUserPlus className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Teachers
              </button>

              {/* Manage Departments - Now right after Manage Teachers */}
              <button
                onClick={() => navigate("/departments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiUsers className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Departments
              </button>

              {/* View Evaluations */}
              <button className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiFileText className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                View Evaluations
              </button>

              {/* Schedule Review */}
              <button className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiCalendar className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Schedule Review
              </button>

              {/* System Settings */}
              <button className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiSettings className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                System Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
