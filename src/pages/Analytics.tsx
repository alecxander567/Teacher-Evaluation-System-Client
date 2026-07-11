// src/pages/Analytics.tsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiLogOut,
  FiBell,
  FiUser,
  FiChevronDown,
  FiSettings,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiBarChart2,
  FiAward,
  FiAlertCircle,
  FiHome,
} from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { useAnalytics } from "../hooks/useAnalytics";
import { TeacherPerformanceTrendChart } from "../components/analytics/TeacherPerformanceTrendChart";
import { HorizontalBarChart } from "../components/analytics/HorizontalBarChart";
import { DonutChart } from "../components/analytics/DonutChart";
import { BarChart } from "../components/analytics/BarChart";
import { TeachersRequiringImprovementTable } from "../components/analytics/TeachersRequiringImprovementTable";
import { DepartmentPerformanceTrendChart } from "../components/analytics/DepartmentPerformanceTrendChart";
import { DepartmentEvaluationScoreChart } from "../components/analytics/DepartmentEvaluationScoreChart";
import { DepartmentEvaluatedTeachersChart } from "../components/analytics/DepartmentEvaluatedTeachersChart";
import { EvalMark } from "../components/icons/EvalMark";
import { LoadingSpinner } from "../components/LoadingSpinner";

// Import department analytics hooks/services
import { useDepartmentAnalytics } from "../hooks/useDepartmentAnalytics";

const Analytics: React.FC = () => {
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

  // Department analytics
  const {
    departmentTrendData,
    departmentScores,
    departmentTeacherCounts,
    loading: deptLoading,
    error: deptError,
  } = useDepartmentAnalytics();

  const hasSetDefaultTeacher = useRef(false);

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
    setIsDropdownOpen(false);
  };

  const handleSettings = () => {
    navigate("/admin-settings");
    setIsDropdownOpen(false);
  };

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
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <LoadingSpinner fullScreen label="Loading..." />
      </div>
    );
  }

  const isLoading = loading || deptLoading;

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      {/* Navbar */}
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
            <div className="flex items-center gap-1 sm:gap-4 flex-shrink-0">
              <button className="p-2 rounded-full hover:bg-white/5 transition-colors relative">
                <FiBell className="h-5 w-5 text-[#8E97AE]" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-[#3D6BFF] rounded-full"></span>
              </button>

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back to Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-semibold text-[#101625]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Analytics Dashboard
            </h1>
            <p className="text-sm text-[#5A6478] mt-1">
              Comprehensive overview of teacher and department performance
              metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EBF0FE] text-[#3D6BFF]">
              <FiTrendingUp className="h-3 w-3 mr-1" />
              Live Data
            </span>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-[#E4E8F0]">
            <LoadingSpinner label="Loading analytics data..." />
          </div>
        )}

        {/* Error Message */}
        {(error || deptError) && !isLoading && (
          <div className="mb-6 bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error || deptError}</p>
          </div>
        )}

        {/* Content */}
        {!isLoading && (
          <>
            {/* Teacher Analytics Section */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FiUsers className="h-5 w-5 text-[#3D6BFF]" />
                <h2
                  className="text-lg font-semibold text-[#101625]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  Teacher Analytics
                </h2>
              </div>

              {/* First Row: Teacher Performance Trend */}
              <div className="mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <label
                      htmlFor="teacher-select"
                      className="text-sm font-medium text-[#5A6478] flex items-center gap-2">
                      <FiUsers className="h-4 w-4 text-[#3D6BFF]" />
                      Viewing trend for:
                    </label>
                    <select
                      id="teacher-select"
                      value={selectedTeacherId ?? ""}
                      onChange={(e) =>
                        setSelectedTeacherId(Number(e.target.value))
                      }
                      className="border border-[#E4E8F0] rounded-lg px-3 py-2 text-sm text-[#101625] bg-white focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] w-full sm:w-auto">
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
                </div>

                {selectedTeacherId !== undefined ?
                  <TeacherPerformanceTrendChart teacherId={selectedTeacherId} />
                : <div className="h-80 flex items-center justify-center bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
                    <div className="text-[#5A6478] flex flex-col items-center gap-2">
                      <FiBarChart2 className="h-8 w-8 text-[#8E97AE]" />
                      <p className="text-sm">No teacher selected.</p>
                    </div>
                  </div>
                }
              </div>

              {/* Stats Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#EBF0FE]">
                      <FiUsers className="h-5 w-5 text-[#3D6BFF]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">Total Teachers</p>
                      <p className="text-xl font-semibold text-[#101625]">
                        {teacherPerformanceRanking.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#E8F5E9]">
                      <FiAward className="h-5 w-5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">Top Performer</p>
                      <p className="text-lg font-semibold text-[#101625] truncate">
                        {topPerformingTeachers.length > 0 ?
                          topPerformingTeachers[0]?.teacher_name || "N/A"
                        : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FFF3E0]">
                      <FiStar className="h-5 w-5 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">Avg Rating</p>
                      <p className="text-xl font-semibold text-[#101625]">
                        {teacherPerformanceRanking.length > 0 ?
                          (
                            teacherPerformanceRanking.reduce(
                              (acc, t) => acc + t.avg_rating,
                              0,
                            ) / teacherPerformanceRanking.length
                          ).toFixed(2)
                        : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FBEEF0]">
                      <FiAlertCircle className="h-5 w-5 text-[#E53935]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">
                        Needs Improvement
                      </p>
                      <p className="text-xl font-semibold text-[#101625]">
                        {teachersRequiringImprovement.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Second Row: Rankings and Criteria Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                  <HorizontalBarChart
                    data={teacherPerformanceRanking.map((item) => ({
                      ...item,
                      displayName: `${item.teacher_name} (${item.subject_name})`,
                    }))}
                    dataKey="avg_rating"
                    nameKey="displayName"
                    title="Teacher Performance Ranking"
                    loading={loading}
                    color="#3D6BFF"
                    xAxisLabel="Average Rating"
                  />
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                  <HorizontalBarChart
                    data={evaluationCriteriaBreakdown}
                    dataKey="avg_rating"
                    nameKey="category"
                    title="Evaluation Criteria Breakdown"
                    loading={loading}
                    color="#6E8CFF"
                    xAxisLabel="Average Rating"
                  />
                </div>
              </div>

              {/* Third Row: Rating Distribution and Top Performing Teachers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
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
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                  <BarChart
                    data={topPerformingTeachers.map((item) => ({
                      ...item,
                      displayName: `${item.teacher_name} (${item.subject_name})`,
                    }))}
                    dataKey="avg_rating"
                    nameKey="displayName"
                    title="Top Performing Teachers"
                    loading={loading}
                    color="#4CAF50"
                    yAxisLabel="Average Rating"
                  />
                </div>
              </div>

              {/* Fourth Row: Teachers Requiring Improvement Table */}
              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                <TeachersRequiringImprovementTable
                  data={teachersRequiringImprovement}
                  loading={loading}
                />
              </div>
            </div>

            {/* Department Analytics Section */}
            <div className="border-t border-[#E4E8F0] pt-8">
              <div className="flex items-center gap-2 mb-4">
                <FiHome className="h-5 w-5 text-[#3D6BFF]" />
                <h2
                  className="text-lg font-semibold text-[#101625]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  Department Analytics
                </h2>
              </div>

              {/* Department Stats Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#EBF0FE]">
                      <FiHome className="h-5 w-5 text-[#3D6BFF]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">
                        Total Departments
                      </p>
                      <p className="text-xl font-semibold text-[#101625]">
                        {departmentScores.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#E8F5E9]">
                      <FiStar className="h-5 w-5 text-[#4CAF50]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">
                        Best Performing Dept
                      </p>
                      <p className="text-lg font-semibold text-[#101625] truncate">
                        {departmentScores.length > 0 ?
                          departmentScores.reduce((a, b) =>
                            a.avg_rating > b.avg_rating ? a : b,
                          )?.department_name || "N/A"
                        : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#FFF3E0]">
                      <FiUsers className="h-5 w-5 text-[#FF9800]" />
                    </div>
                    <div>
                      <p className="text-sm text-[#5A6478]">
                        Total Teachers Evaluated
                      </p>
                      <p className="text-xl font-semibold text-[#101625]">
                        {departmentTeacherCounts.reduce(
                          (acc, d) => acc + d.evaluated_teacher_count,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                  <DepartmentEvaluationScoreChart
                    data={departmentScores}
                    loading={deptLoading}
                  />
                </div>
                <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                  <DepartmentEvaluatedTeachersChart
                    data={departmentTeacherCounts}
                    loading={deptLoading}
                  />
                </div>
              </div>

              {/* Department Performance Trend - Full Width */}
              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                <DepartmentPerformanceTrendChart
                  data={departmentTrendData}
                  loading={deptLoading}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
