// src/pages/Dashboard.tsx (with API integration)
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
  FiBookOpen,
  FiLink,
  FiClock,
  FiUserCheck,
  FiStar,
  FiClipboard,
  FiCheckCircle,
} from "react-icons/fi";
import { EvalMark } from "../components/icons/EvalMark";
import KPICard from "../components/dashboard/KPICard";

// Define the API response type
interface DashboardSummary {
  evaluation_completion_rate: string;
  overall_evaluation_score: number;
  total_evaluations_submitted: number;
  total_teachers_evaluated: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<DashboardSummary | null>(null);

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

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://every-drinks-notice.loca.lt/api/dashboard-summary",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: DashboardSummary = await response.json();
        setKpiData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
        // Fallback mock data for development
        setKpiData({
          evaluation_completion_rate: "87.0%",
          overall_evaluation_score: 3.67,
          total_evaluations_submitted: 10,
          total_teachers_evaluated: 3,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleLogout = () => {
    logout();
  };

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

  // Parse completion rate (remove % sign and convert to number)
  const completionRate =
    kpiData?.evaluation_completion_rate ?
      parseFloat(kpiData.evaluation_completion_rate.replace("%", ""))
    : 0;

  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
          <p className="mt-4 text-[#5B6472]">
            {loading ? "Loading..." : "Loading user data..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF6]">
      {/* Navbar */}
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

        {/* Error message if API fails */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error} - Using fallback data</p>
          </div>
        )}

        {/* Evaluation KPI Cards */}
        <div className="mb-6 sm:mb-8">
          <h2
            className="text-lg font-semibold text-[#101826] mb-4"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Evaluation Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Overall Score */}
            <KPICard
              title="Overall Evaluation Score"
              value={`${kpiData?.overall_evaluation_score?.toFixed(2) ?? "0.00"} / 5.0`}
              icon={<FiStar className="h-5 w-5 text-[#E8A23D]" />}
              subtitle="Average of all evaluations"
              trend={
                kpiData?.overall_evaluation_score ?
                  { value: 5, isPositive: true }
                : undefined
              }
            />

            {/* Total Teachers Evaluated */}
            <KPICard
              title="Total Teachers Evaluated"
              value={kpiData?.total_teachers_evaluated ?? 0}
              icon={<FiUsers className="h-5 w-5 text-[#E8A23D]" />}
              subtitle="Teachers with completed evaluations"
            />

            {/* Total Evaluations Submitted */}
            <KPICard
              title="Total Evaluations Submitted"
              value={kpiData?.total_evaluations_submitted ?? 0}
              icon={<FiClipboard className="h-5 w-5 text-[#E8A23D]" />}
              subtitle="Across all evaluation periods"
            />

            {/* Evaluation Completion Rate with Progress Bar */}
            <KPICard
              title="Evaluation Completion Rate"
              value={kpiData?.evaluation_completion_rate ?? "0%"}
              icon={<FiCheckCircle className="h-5 w-5 text-[#E8A23D]" />}
              subtitle="Target: 90%"
              progress={Math.min(completionRate, 100)}
              showProgress={true}
            />
          </div>
        </div>

        {/* Two Column Layout */}
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
              <button
                onClick={() => navigate("/evaluation-forms")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiFileText className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Evaluation Forms
              </button>

              <button
                onClick={() => navigate("/teachers")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiUserPlus className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Teachers
              </button>

              <button
                onClick={() => navigate("/teacher-assignments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiUserCheck className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Teacher Assignments
              </button>

              <button
                onClick={() => navigate("/departments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiUsers className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Departments
              </button>

              <button
                onClick={() => navigate("/subjects")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiBookOpen className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Subjects
              </button>

              <button
                onClick={() => navigate("/assignments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiLink className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Assignments
              </button>

              <button
                onClick={() => navigate("/evaluation-periods")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiClock className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Manage Evaluation Periods
              </button>

              <button className="w-full flex items-center px-4 py-3 text-sm text-[#101826] bg-[#FAFAF6] hover:bg-[#101826] hover:text-white rounded-lg transition-colors group">
                <FiCalendar className="h-5 w-5 mr-3 text-[#B8791F] group-hover:text-[#E8A23D] flex-shrink-0" />
                Schedule Review
              </button>

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
