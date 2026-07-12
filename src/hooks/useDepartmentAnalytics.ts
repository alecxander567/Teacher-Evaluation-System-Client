// src/hooks/useDepartmentAnalytics.ts
import { useState, useEffect } from "react";
import { DepartmentAnalyticsService } from "../services/departmentAnalyticsService";

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

export function useDepartmentAnalytics() {
  const [departmentTrendData, setDepartmentTrendData] = useState<
    DepartmentTrendData[]
  >([]);
  const [departmentScores, setDepartmentScores] = useState<
    DepartmentScoreData[]
  >([]);
  const [departmentTeacherCounts, setDepartmentTeacherCounts] = useState<
    DepartmentTeacherCountData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartmentAnalytics = async () => {
      try {
        setLoading(true);
        setError(null);

        const [trendData, scoresData, countsData] = await Promise.all([
          DepartmentAnalyticsService.getDepartmentTrend(),
          DepartmentAnalyticsService.getDepartmentScores(),
          DepartmentAnalyticsService.getDepartmentTeacherCounts(),
        ]);

        setDepartmentTrendData(trendData);
        setDepartmentScores(scoresData);
        setDepartmentTeacherCounts(countsData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ?
            err.message
          : "Failed to fetch department analytics";
        setError(errorMessage);
        console.error("Error fetching department analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentAnalytics();
  }, []);

  return {
    departmentTrendData,
    departmentScores,
    departmentTeacherCounts,
    loading,
    error,
  };
}
