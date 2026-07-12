// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiTrendingUp,
  FiFileText,
  FiUserPlus,
  FiBookOpen,
  FiLink,
  FiClock,
  FiUserCheck,
  FiStar,
  FiClipboard,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
} from "react-icons/fi";
import { Navbar } from "../components/Navbar";
import { EvalMark } from "../components/icons/EvalMark";
import KPICard from "../components/dashboard/KPICard";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { teacherApi } from "../api/teacherApi";
import { departmentApi } from "../api/departmentApi";
import { evaluationFormApi } from "../api/evaluationFormApi";
import type { TeacherResponse } from "../types/teacher";
import type { Department } from "../types/department.types";
import type { EvaluationForm } from "../types/evaluationForm";

// Define the API response type
interface DashboardSummary {
  evaluation_completion_rate: string;
  overall_evaluation_score: number;
  total_evaluations_submitted: number;
  total_teachers_evaluated: number;
}

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_ANALYTICS_API_BASE_URL is not set. Add it to your .env file (see .env.example).",
  );
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<DashboardSummary | null>(null);
  const [teachers, setTeachers] = useState<TeacherResponse[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [evaluationForms, setEvaluationForms] = useState<EvaluationForm[]>([]);
  const [activeTab, setActiveTab] = useState<
    "forms" | "teachers" | "departments"
  >("forms");
  const [dataErrors, setDataErrors] = useState<{
    kpi?: string;
    teachers?: string;
    departments?: string;
    forms?: string;
  }>({});

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
        setError(null);
        setDataErrors({});

        const errors: typeof dataErrors = {};
        let gotAnyData = false;

        // Fetch KPI data
        try {
          const response = await fetch(`${API_BASE_URL}/dashboard-summary`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch KPI data: ${response.status}`);
          }

          const data: DashboardSummary = await response.json();
          setKpiData(data);
          gotAnyData = true;
        } catch (err) {
          console.error("Failed to fetch KPI data:", err);
          errors.kpi = "Failed to load evaluation overview data";
        }

        // Fetch teachers
        try {
          const teachersData = await teacherApi.getAll();
          setTeachers(teachersData || []);
          if (teachersData?.length) gotAnyData = true;
        } catch (err) {
          console.error("Failed to fetch teachers:", err);
          errors.teachers = "Failed to load teachers data";
        }

        // Fetch departments
        try {
          const departmentsData = await departmentApi.getAll();
          setDepartments(departmentsData || []);
          if (departmentsData?.length) gotAnyData = true;
        } catch (err) {
          console.error("Failed to fetch departments:", err);
          errors.departments = "Failed to load departments data";
        }

        // Fetch evaluation forms
        try {
          const formsData = await evaluationFormApi.getAllForms();
          setEvaluationForms(formsData || []);
          if (formsData?.length) gotAnyData = true;
        } catch (err) {
          console.error("Failed to fetch evaluation forms:", err);
          errors.forms = "Failed to load evaluation forms data";
        }

        setDataErrors(errors);

        // Check if all data failed
        const hasErrors = Object.keys(errors).length > 0;
        if (!gotAnyData && hasErrors) {
          setError("Unable to load dashboard data. Please try again later.");
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Parse completion rate (remove % sign and convert to number)
  const rawCompletionRate =
    kpiData?.evaluation_completion_rate ?
      parseFloat(kpiData.evaluation_completion_rate.replace("%", ""))
    : 0;

  const completionRate = Math.min(Math.max(rawCompletionRate, 0), 100);

  // Look up a department's display name from its id
  const getDepartmentName = (departmentId?: number | string | null) => {
    if (departmentId == null) return null;
    const dept = departments.find((d) => d.id === departmentId);
    return dept?.name ?? null;
  };

  if (!user || loading) {
    return (
      <LoadingSpinner
        fullScreen
        label={loading ? "Loading..." : "Loading user data..."}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA]">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome banner */}
        <div className="relative overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] rounded-xl p-5 sm:p-6 mb-6 sm:mb-8">
          <div
            className="pointer-events-none absolute -top-20 -right-16 w-64 h-64 rounded-full opacity-25 blur-3xl"
            style={{ background: "#3D6BFF" }}
          />
          <EvalMark className="pointer-events-none absolute -right-10 -bottom-14 w-44 h-44 sm:w-56 sm:h-56 opacity-[0.06]" />
          <div className="relative">
            <h1
              className="text-xl sm:text-2xl font-semibold text-[#F4F6FA] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Welcome back, {user.firstName}
            </h1>
            <p className="text-[#8E97AE] mt-1 text-sm sm:text-base">
              Here's what's happening with your evaluation system today.
            </p>
            <div className="mt-3">
              <span
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase bg-white/10 text-[#6E8CFF]"
                style={{
                  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
                }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Global Error message */}
        {error && (
          <div className="mb-4 bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
            <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Evaluation KPI Cards */}
        <div className="mb-6 sm:mb-8">
          <h2
            className="text-lg font-semibold text-[#101625] mb-4"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Evaluation Overview
          </h2>
          {dataErrors.kpi ?
            <div className="bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{dataErrors.kpi}</p>
            </div>
          : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Overall Score */}
              <KPICard
                title="Overall Evaluation Score"
                value={
                  kpiData ?
                    `${kpiData.overall_evaluation_score?.toFixed(2) ?? "0.00"} / 5.0`
                  : "No data"
                }
                icon={<FiStar className="h-5 w-5 text-[#3D6BFF]" />}
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
                value={kpiData?.total_teachers_evaluated ?? "No data"}
                icon={<FiUsers className="h-5 w-5 text-[#3D6BFF]" />}
                subtitle="Teachers with completed evaluations"
              />

              {/* Total Evaluations Submitted */}
              <KPICard
                title="Total Evaluations Submitted"
                value={kpiData?.total_evaluations_submitted ?? "No data"}
                icon={<FiClipboard className="h-5 w-5 text-[#3D6BFF]" />}
                subtitle="Across all evaluation periods"
              />

              {/* Evaluation Completion Rate with Progress Bar */}
              <KPICard
                title="Evaluation Completion Rate"
                value={kpiData ? `${completionRate.toFixed(1)}%` : "No data"}
                icon={<FiCheckCircle className="h-5 w-5 text-[#3D6BFF]" />}
                subtitle="Target: 90%"
                progress={kpiData ? completionRate : 0}
                showProgress={!!kpiData}
              />
            </div>
          }
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent Activity - Now with tabs for forms, teachers, departments */}
          <div className="lg:col-span-2 bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-5 sm:p-6 flex flex-col h-[450px]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h2
                className="text-lg font-semibold text-[#101625]"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                Recent Items
              </h2>
              <div className="flex gap-1 bg-[#F4F6FA] rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("forms")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === "forms" ?
                      "bg-white text-[#3D6BFF] shadow-sm"
                    : "text-[#5A6478] hover:text-[#101625]"
                  }`}>
                  <FiFileText className="h-3.5 w-3.5" />
                  Forms
                </button>
                <button
                  onClick={() => setActiveTab("teachers")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === "teachers" ?
                      "bg-white text-[#3D6BFF] shadow-sm"
                    : "text-[#5A6478] hover:text-[#101625]"
                  }`}>
                  <FiUsers className="h-3.5 w-3.5" />
                  Teachers
                </button>
                <button
                  onClick={() => setActiveTab("departments")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    activeTab === "departments" ?
                      "bg-white text-[#3D6BFF] shadow-sm"
                    : "text-[#5A6478] hover:text-[#101625]"
                  }`}>
                  <FiBookOpen className="h-3.5 w-3.5" />
                  Departments
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {activeTab === "forms" && (
                <div className="space-y-3">
                  {dataErrors.forms ?
                    <div className="bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{dataErrors.forms}</p>
                    </div>
                  : evaluationForms.length === 0 ?
                    <div className="text-center py-8">
                      <FiFileText className="h-10 w-10 text-[#8E97AE] mx-auto mb-2" />
                      <p className="text-sm text-[#5A6478]">
                        No evaluation forms found
                      </p>
                    </div>
                  : evaluationForms.map((form) => (
                      <div
                        key={form.id}
                        className="flex items-center justify-between py-3 px-3 hover:bg-[#F4F6FA] rounded-lg transition-colors border-b border-[#E4E8F0] last:border-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-8 w-8 rounded-full bg-[#EBF0FE] flex items-center justify-center flex-shrink-0">
                            <FiFileText className="h-4 w-4 text-[#3D6BFF]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#101625] truncate">
                              {form.title || `Form ${form.id}`}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {form.description && (
                                <p className="text-xs text-[#5A6478] truncate max-w-[200px]">
                                  {form.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() =>
                            navigate(`/evaluation-forms/${form.id}`)
                          }
                          className="text-xs font-medium text-[#3D6BFF] hover:text-[#101625] transition-colors flex-shrink-0 ml-2">
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
              )}

              {activeTab === "teachers" && (
                <div className="space-y-3">
                  {dataErrors.teachers ?
                    <div className="bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{dataErrors.teachers}</p>
                    </div>
                  : teachers.length === 0 ?
                    <div className="text-center py-8">
                      <FiUsers className="h-10 w-10 text-[#8E97AE] mx-auto mb-2" />
                      <p className="text-sm text-[#5A6478]">
                        No teachers found
                      </p>
                    </div>
                  : teachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="flex items-center justify-between py-3 px-3 hover:bg-[#F4F6FA] rounded-lg transition-colors border-b border-[#E4E8F0] last:border-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-8 w-8 rounded-full bg-[#EBF0FE] flex items-center justify-center flex-shrink-0">
                            <FiUser className="h-4 w-4 text-[#3D6BFF]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#101625] truncate">
                              {teacher.fullName}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              <p className="text-xs text-[#5A6478] truncate max-w-[180px]">
                                {teacher.email}
                              </p>
                              {getDepartmentName(teacher.departmentId) && (
                                <span className="text-xs px-2 py-0.5 bg-[#F4F6FA] rounded-full text-[#5A6478]">
                                  {getDepartmentName(teacher.departmentId)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/teachers/${teacher.id}`)}
                          className="text-xs font-medium text-[#3D6BFF] hover:text-[#101625] transition-colors flex-shrink-0 ml-2">
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
              )}

              {activeTab === "departments" && (
                <div className="space-y-3">
                  {dataErrors.departments ?
                    <div className="bg-[#FBEEF0] border border-[#F0CBD1] text-[#9A3A50] px-4 py-3 rounded-lg flex items-start gap-3">
                      <FiAlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-sm">{dataErrors.departments}</p>
                    </div>
                  : departments.length === 0 ?
                    <div className="text-center py-8">
                      <FiBookOpen className="h-10 w-10 text-[#8E97AE] mx-auto mb-2" />
                      <p className="text-sm text-[#5A6478]">
                        No departments found
                      </p>
                    </div>
                  : departments.map((dept) => (
                      <div
                        key={dept.id}
                        className="flex items-center justify-between py-3 px-3 hover:bg-[#F4F6FA] rounded-lg transition-colors border-b border-[#E4E8F0] last:border-0">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="h-8 w-8 rounded-full bg-[#EBF0FE] flex items-center justify-center flex-shrink-0">
                            <FiBookOpen className="h-4 w-4 text-[#3D6BFF]" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[#101625] truncate">
                              {dept.name}
                            </p>
                            <div className="flex items-center gap-3 mt-0.5">
                              {dept.description && (
                                <p className="text-xs text-[#5A6478] truncate max-w-[150px]">
                                  {dept.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/departments/${dept.id}`)}
                          className="text-xs font-medium text-[#3D6BFF] hover:text-[#101625] transition-colors flex-shrink-0 ml-2">
                          View
                        </button>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-5 sm:p-6 h-[450px] flex flex-col">
            <h2
              className="text-lg font-semibold text-[#101625] mb-4 flex-shrink-0"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Quick Actions
            </h2>
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
              <button
                onClick={() => navigate("/evaluation-forms")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiFileText className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Evaluation Forms</span>
              </button>
              <button
                onClick={() => navigate("/teachers")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiUserPlus className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Teachers</span>
              </button>
              <button
                onClick={() => navigate("/teacher-assignments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiUserCheck className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Teacher Assignments</span>
              </button>
              <button
                onClick={() => navigate("/departments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiUsers className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Departments</span>
              </button>
              <button
                onClick={() => navigate("/subjects")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiBookOpen className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Subjects</span>
              </button>
              <button
                onClick={() => navigate("/assignments")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiLink className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Assignments</span>
              </button>
              <button
                onClick={() => navigate("/evaluation-periods")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiClock className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">Manage Evaluation Periods</span>
              </button>
              <button
                onClick={() => navigate("/analytics")}
                className="w-full flex items-center px-4 py-3 text-sm text-[#101625] bg-[#F4F6FA] hover:bg-[#121A2E] hover:text-white rounded-lg transition-colors group">
                <FiTrendingUp className="h-5 w-5 mr-3 text-[#3D6BFF] group-hover:text-[#6E8CFF] flex-shrink-0" />
                <span className="truncate">View Analytics Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F4F6FA;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D1D5DB;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9CA3AF;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #D1D5DB #F4F6FA;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
