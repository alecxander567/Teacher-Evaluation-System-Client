// src/pages/Analytics.tsx

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLogOut, FiBell, FiUser } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useAnalytics } from "../hooks/useAnalytics";
import { TeacherPerformanceTrendChart } from "../components/analytics/TeacherPerformanceTrendChart";
import { HorizontalBarChart } from "../components/analytics/HorizontalBarChart";
import { DonutChart } from "../components/analytics/DonutChart";
import { BarChart } from "../components/analytics/BarChart";
import { TeachersRequiringImprovementTable } from "../components/analytics/TeachersRequiringImprovementTable";
import { EvalMark } from "../components/icons/EvalMark";

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Initialize user from localStorage directly (matches Teachers.tsx pattern)
  const [user] = useState<{
    firstName: string;
    lastName: string;
  } | null>(() => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  });

  const [selectedTeacherId, setSelectedTeacherId] = useState<
    number | undefined
  >(undefined);

  const {
    teacherPerformanceRanking,
    evaluationCriteriaBreakdown,
    ratingDistribution,
    topPerformingTeachers,
    teachersRequiringImprovement,
    loading,
    error,
  } = useAnalytics();

  // Use a ref to track if we've already set the default teacher
  const hasSetDefaultTeacher = useRef(false);

  // Default to the first teacher in the ranking once it loads
  useEffect(() => {
    if (
      !hasSetDefaultTeacher.current &&
      selectedTeacherId === undefined &&
      teacherPerformanceRanking.length > 0
    ) {
      hasSetDefaultTeacher.current = true;
      setSelectedTeacherId(teacherPerformanceRanking[0].teacher_id);
    }
  }, [teacherPerformanceRanking, selectedTeacherId]);

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAF6]">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
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
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5B6472] hover:text-[#101826] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Page Title */}
        <h1
          className="text-2xl font-semibold text-[#101826] mb-6"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          Analytics Dashboard
        </h1>

        {/* Loading Spinner - same as Teachers page */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-[#E8A23D] border-t-transparent"></div>
          </div>
        )}

        {/* Error Message */}
        {error && !loading && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Content - Only show when not loading */}
        {!loading && (
          <>
            {/* First Row: Teacher Performance Trend */}
            <div className="mb-6">
              <div className="bg-white rounded-xl border border-[#E4E1D9] p-4 mb-4 flex items-center gap-3">
                <label
                  htmlFor="teacher-select"
                  className="text-sm font-medium text-[#5B6472]">
                  Viewing trend for:
                </label>
                <select
                  id="teacher-select"
                  value={selectedTeacherId ?? ""}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  className="border border-[#E4E1D9] rounded-lg px-3 py-2 text-sm text-[#101826] bg-white focus:outline-none focus:ring-2 focus:ring-[#E8A23D]">
                  {teacherPerformanceRanking.length === 0 && (
                    <option value="">No teachers available</option>
                  )}
                  {teacherPerformanceRanking.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id}>
                      {t.teacher_name} ({t.subject_name})
                    </option>
                  ))}
                </select>
              </div>

              {selectedTeacherId !== undefined ?
                <TeacherPerformanceTrendChart teacherId={selectedTeacherId} />
              : <div className="h-80 flex items-center justify-center bg-white rounded-xl border border-[#E4E1D9]">
                  <div className="text-[#5B6472]">No teacher selected.</div>
                </div>
              }
            </div>

            {/* Second Row: Rankings and Criteria Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <HorizontalBarChart
                data={teacherPerformanceRanking.map((item) => ({
                  ...item,
                  displayName: `${item.teacher_name} (${item.subject_name})`,
                }))}
                dataKey="avg_rating"
                nameKey="displayName"
                title="Teacher Performance Ranking"
                loading={loading}
                color="#E8A23D"
                xAxisLabel="Average Rating"
              />
              <HorizontalBarChart
                data={evaluationCriteriaBreakdown}
                dataKey="avg_rating"
                nameKey="category"
                title="Evaluation Criteria Breakdown"
                loading={loading}
                color="#4A90E2"
                xAxisLabel="Average Rating"
              />
            </div>

            {/* Third Row: Rating Distribution and Top Performing Teachers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <DonutChart
                data={ratingDistribution.map((item) => ({
                  ...item,
                  rating: `${item.rating} Star${item.rating > 1 ? "s" : ""}`,
                }))}
                dataKey="count"
                nameKey="rating"
                title="Rating Distribution"
                loading={loading}
              />
              <BarChart
                data={topPerformingTeachers.map((item) => ({
                  ...item,
                  displayName: `${item.teacher_name} (${item.subject_name})`,
                }))}
                dataKey="avg_rating"
                nameKey="displayName"
                title="Top Performing Teachers"
                loading={loading}
                color="#2ECC71"
                yAxisLabel="Average Rating"
              />
            </div>

            {/* Fourth Row: Teachers Requiring Improvement Table */}
            <div>
              <TeachersRequiringImprovementTable
                data={teachersRequiringImprovement}
                loading={loading}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
