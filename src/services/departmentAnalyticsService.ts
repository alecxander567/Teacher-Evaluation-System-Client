// src/services/departmentAnalyticsService.ts

export interface DepartmentTrendData {
  academic_year: string;
  avg_rating: number;
  department_name: string;
  period: string;
  semester: string;
}

export interface DepartmentScoreData {
  department_id: number;
  department_name: string;
  avg_rating: number;
}

export interface DepartmentTeacherCountData {
  department_id: number;
  department_name: string;
  evaluated_teacher_count: number;
}

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_ANALYTICS_API_BASE_URL is not set. Add it to your .env file (see .env.example).",
  );
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const DepartmentAnalyticsService = {
  getDepartmentTrend: async (): Promise<DepartmentTrendData[]> => {
    const response = await fetch(
      `${API_BASE_URL}/department-performance-trend`,
      { headers: authHeaders() },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch department trend: ${response.status}`);
    }
    return response.json();
  },

  getDepartmentScores: async (): Promise<DepartmentScoreData[]> => {
    const response = await fetch(
      `${API_BASE_URL}/department-average-evaluation`,
      { headers: authHeaders() },
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch department scores: ${response.status}`);
    }
    return response.json();
  },

  getDepartmentTeacherCounts: async (): Promise<
    DepartmentTeacherCountData[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/evaluated-teachers-per-department`,
      { headers: authHeaders() },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch department teacher counts: ${response.status}`,
      );
    }
    return response.json();
  },
};
