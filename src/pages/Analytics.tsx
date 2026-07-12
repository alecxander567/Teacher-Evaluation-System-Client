// src/pages/Analytics.tsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiTrendingUp,
  FiStar,
  FiUsers,
  FiBarChart2,
  FiAward,
  FiAlertCircle,
  FiHome,
  FiFileText,
  FiUser,
  FiCpu,
} from "react-icons/fi";
import { useAnalytics } from "../hooks/useAnalytics";
import { useEvaluationAnalytics } from "../hooks/useEvaluationAnalytics";
import { useDepartmentAnalytics } from "../hooks/useDepartmentAnalytics";
import { TeacherPerformanceTrendChart } from "../components/analytics/TeacherPerformanceTrendChart";
import { HorizontalBarChart } from "../components/analytics/HorizontalBarChart";
import { DonutChart } from "../components/analytics/DonutChart";
import { BarChart } from "../components/analytics/BarChart";
import { TeachersRequiringImprovementTable } from "../components/analytics/TeachersRequiringImprovementTable";
import { DepartmentPerformanceTrendChart } from "../components/analytics/DepartmentPerformanceTrendChart";
import { DepartmentEvaluationScoreChart } from "../components/analytics/DepartmentEvaluationScoreChart";
import { DepartmentEvaluatedTeachersChart } from "../components/analytics/DepartmentEvaluatedTeachersChart";
import { Navbar } from "../components/Navbar";
import { LoadingSpinner } from "../components/LoadingSpinner";

// New components
import { ComparisonBetweenPeriods } from "../components/analytics/ComparisonBetweenPeriods";
import { TotalResponsesPerPeriod } from "../components/analytics/TotalResponsesPerPeriod";
import { CompletionRatePerPeriod } from "../components/analytics/CompletionRatePerPeriod";
import { OverallRatingKPI } from "../components/analytics/OverallRatingKPI";
import { TeacherPerformanceTrend } from "../components/analytics/TeacherPerformanceTrend";
import { TeacherCriteriaBreakdown } from "../components/analytics/TeacherCriteriaBreakdown";
import { TeacherRatingDistribution } from "../components/analytics/TeacherRatingDistribution";

// AI Summary
import { AISummaryCard } from "../components/analytics/AISummaryCard";
import type { AnalyticsSummaryData } from "../services/aiSummaryService";

// Import the hooks for teacher analytics
import { useOverallRating } from "../hooks/useTeacherAnalytics";

const Analytics: React.FC = () => {
  const navigate = useNavigate();

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

  // Fetch overall rating for the teacher name
  const { data: overallRatingData, loading: overallRatingLoading } =
    useOverallRating(selectedTeacherId || 12);

  const {
    teacherPerformanceRanking,
    evaluationCriteriaBreakdown,
    ratingDistribution,
    topPerformingTeachers,
    teachersRequiringImprovement,
    loading,
    error,
  } = useAnalytics();

  const {
    departmentTrendData,
    departmentScores,
    departmentTeacherCounts,
    loading: deptLoading,
    error: deptError,
  } = useDepartmentAnalytics();

  const {
    periodsComparison,
    totalResponsesPerPeriod,
    completionRatePerPeriod,
    loading: evalLoading,
    error: evalError,
  } = useEvaluationAnalytics();

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

  // Get teacher name from the API data
  const teacherName = overallRatingData?.[0]?.teacher_name || "Current Teacher";

  // Prepare data for AI summary
  const prepareAISummaryData = useCallback((): AnalyticsSummaryData => {
    return {
      teacherPerformance: {
        totalTeachers: teacherPerformanceRanking.length,
        topPerformer: topPerformingTeachers[0]?.teacher_name || "N/A",
        averageRating:
          teacherPerformanceRanking.length > 0 ?
            teacherPerformanceRanking.reduce(
              (acc, t) => acc + t.avg_rating,
              0,
            ) / teacherPerformanceRanking.length
          : 0,
        needsImprovement: teachersRequiringImprovement.length,
        topPerformingTeachers: topPerformingTeachers.map((t) => ({
          name: t.teacher_name,
          rating: t.avg_rating,
        })),
        teachersRequiringImprovement: teachersRequiringImprovement.map((t) => ({
          name: t.teacher_name,
          rating: t.avg_rating,
        })),
      },
      departmentPerformance: {
        totalDepartments: departmentScores.length,
        bestDepartment:
          departmentScores.length > 0 ?
            departmentScores.reduce((a, b) =>
              a.avg_rating > b.avg_rating ? a : b,
            )?.department_name || "N/A"
          : "N/A",
        averageScore:
          departmentScores.length > 0 ?
            departmentScores.reduce((acc, d) => acc + d.avg_rating, 0) /
            departmentScores.length
          : 0,
        departments: departmentScores.map((d) => ({
          name: d.department_name,
          rating: d.avg_rating,
          teacherCount:
            departmentTeacherCounts.find(
              (t) => t.department_name === d.department_name,
            )?.evaluated_teacher_count || 0,
        })),
      },
      evaluationMetrics: {
        totalResponses: totalResponsesPerPeriod.reduce(
          (acc, s) => acc + (s.total_submissions || 0),
          0,
        ),
        averageScore:
          periodsComparison.length > 0 ?
            periodsComparison.reduce((acc, s) => acc + (s.avg_rating || 0), 0) /
            periodsComparison.length
          : 0,
        completionRate:
          completionRatePerPeriod.length > 0 ?
            completionRatePerPeriod.reduce(
              (acc, s) => acc + (s.completion_rate || 0),
              0,
            ) / completionRatePerPeriod.length
          : 0,
        periods: periodsComparison.map((s) => ({
          period: `${s.academic_year} ${s.semester}`,
          responses:
            totalResponsesPerPeriod.find((r) => r.period_id === s.period_id)
              ?.total_submissions || 0,
          score: s.avg_rating || 0,
        })),
      },
      teacherDetails:
        selectedTeacherId ?
          {
            name: teacherName,
            overallRating: overallRatingData?.[0]?.overall_rating || 0,
            totalEvaluations: overallRatingData?.[0]?.total_evaluations || 0,
            criteriaBreakdown: evaluationCriteriaBreakdown.map((c) => ({
              criteria: c.category,
              rating: c.avg_rating,
            })),
            ratingDistribution: ratingDistribution.map((r) => ({
              rating: `${r.rating} Star${r.rating > 1 ? "s" : ""}`,
              count: r.count,
            })),
            performanceTrend: periodsComparison.map((s) => ({
              period: `${s.academic_year} ${s.semester}`,
              rating: s.avg_rating || 0,
            })),
          }
        : undefined,
    };
  }, [
    teacherPerformanceRanking,
    topPerformingTeachers,
    teachersRequiringImprovement,
    departmentScores,
    departmentTeacherCounts,
    periodsComparison,
    totalResponsesPerPeriod,
    completionRatePerPeriod,
    selectedTeacherId,
    teacherName,
    overallRatingData,
    evaluationCriteriaBreakdown,
    ratingDistribution,
  ]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F4F6FA] flex items-center justify-center">
        <LoadingSpinner fullScreen label="Loading..." />
      </div>
    );
  }

  const isLoading =
    loading || deptLoading || evalLoading || overallRatingLoading;
  const hasError = error || deptError || evalError;

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-[#5A6478] hover:text-[#101625] transition-colors mb-6">
          <FiArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1
              className="text-2xl font-semibold text-[#101625]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Analytics Dashboard
            </h1>
            <p className="text-sm text-[#5A6478] mt-1">
              Comprehensive overview of teacher, department, and evaluation
              performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#EBF0FE] text-[#3D6BFF]">
              <FiTrendingUp className="h-3 w-3 mr-1" />
              Live Data
            </span>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 bg-white rounded-xl border border-[#E4E8F0]">
            <LoadingSpinner label="Loading analytics data..." />
          </div>
        )}

        {hasError && !isLoading && (
          <div className="mb-6 bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{hasError}</p>
          </div>
        )}

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

              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                <TeachersRequiringImprovementTable
                  data={teachersRequiringImprovement}
                  loading={loading}
                />
              </div>
            </div>

            {/* Department Analytics Section */}
            <div className="border-t border-[#E4E8F0] pt-8 mb-8">
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

              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-6">
                <DepartmentPerformanceTrendChart
                  data={departmentTrendData}
                  loading={deptLoading}
                />
              </div>
            </div>

            {/* Evaluation Analytics Section */}
            <div className="border-t border-[#E4E8F0] pt-8 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FiFileText className="h-5 w-5 text-[#3D6BFF]" />
                <h2
                  className="text-lg font-semibold text-[#101625]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  Evaluation Analytics
                </h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <ComparisonBetweenPeriods />
                </div>
                <div className="lg:col-span-1">
                  <TotalResponsesPerPeriod />
                </div>
                <div className="lg:col-span-1">
                  <CompletionRatePerPeriod />
                </div>
              </div>
            </div>

            {/* Individual Teacher Section - Updated with Real API Data */}
            <div className="border-t border-[#E4E8F0] pt-8">
              <div className="flex items-center gap-2 mb-4">
                <FiUser className="h-5 w-5 text-[#3D6BFF]" />
                <h2
                  className="text-lg font-semibold text-[#101625]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  Individual Teacher Analytics
                </h2>
              </div>

              {/* Teacher selector for individual analytics */}
              <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-4 mb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label
                    htmlFor="individual-teacher-select"
                    className="text-sm font-medium text-[#5A6478] flex items-center gap-2">
                    <FiUser className="h-4 w-4 text-[#3D6BFF]" />
                    Select teacher for detailed analytics:
                  </label>
                  <select
                    id="individual-teacher-select"
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                  <OverallRatingKPI
                    teacherId={selectedTeacherId || 12}
                    teacherName={teacherName}
                  />
                </div>
                <div className="lg:col-span-2">
                  <TeacherPerformanceTrend
                    teacherId={selectedTeacherId || 12}
                    teacherName={teacherName}
                    title="Performance Trend"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-1">
                  <TeacherCriteriaBreakdown
                    teacherId={selectedTeacherId || 12}
                    title="Criteria Breakdown"
                  />
                </div>
                <div className="lg:col-span-1">
                  <TeacherRatingDistribution
                    teacherId={selectedTeacherId || 12}
                    title="Rating Distribution"
                  />
                </div>
              </div>
            </div>

            {/* AI Summary Section - MOVED TO BOTTOM */}
            <div className="border-t border-[#E4E8F0] pt-8 mt-8">
              <div className="flex items-center gap-2 mb-4">
                <FiCpu className="h-5 w-5 text-[#3D6BFF]" />
                <h2
                  className="text-lg font-semibold text-[#101625]"
                  style={{
                    fontFamily: "'Space Grotesk', system-ui, sans-serif",
                  }}>
                  AI-Powered Summary
                </h2>
                <span className="text-xs text-[#5A6478] bg-[#F4F6FA] px-2 py-1 rounded-full">
                  Beta
                </span>
              </div>
              <AISummaryCard
                data={prepareAISummaryData()}
                title="Executive Summary"
                type="overall"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Analytics;
