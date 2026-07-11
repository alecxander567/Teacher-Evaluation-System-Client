// src/services/departmentAnalyticsService.ts
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://loud-terms-pick.loca.lt/api";

interface DepartmentTrendData {
  academic_year: string;
  avg_rating: number;
  department_name: string;
  period: string;
  semester: string;
}

interface DepartmentScoreData {
  department_id: number;
  department_name: string;
  avg_rating: number;
}

interface DepartmentTeacherCountData {
  department_id: number;
  department_name: string;
  evaluated_teacher_count: number;
}

export class DepartmentAnalyticsService {
  private static getHeaders(): HeadersInit {
    const token = localStorage.getItem("accessToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  static async getDepartmentTrend(): Promise<DepartmentTrendData[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/department-trend`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch department trend data: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching department trend:", error);
      // Return mock data for now
      return [
        {
          academic_year: "2026-2027",
          avg_rating: 3.67,
          department_name: "Computing Department",
          period: "test evaluation",
          semester: "First Semester",
        },
        {
          academic_year: "2026-2027",
          avg_rating: 3.0,
          department_name: "Education Department",
          period: "ewrwer",
          semester: "First Semester",
        },
        {
          academic_year: "2026-2027",
          avg_rating: 3.73,
          department_name: "Education Department",
          period: "test evaluation",
          semester: "First Semester",
        },
      ];
    }
  }

  static async getDepartmentScores(): Promise<DepartmentScoreData[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/department-scores`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch department scores: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching department scores:", error);
      // Return mock data for now
      return [
        {
          avg_rating: 3.67,
          department_id: 2,
          department_name: "Education Department",
        },
        {
          avg_rating: 3.67,
          department_id: 1,
          department_name: "Computing Department",
        },
      ];
    }
  }

  static async getDepartmentTeacherCounts(): Promise<
    DepartmentTeacherCountData[]
  > {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analytics/department-teacher-counts`,
        {
          method: "GET",
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch department teacher counts: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching department teacher counts:", error);
      // Return mock data for now
      return [
        {
          department_id: 2,
          department_name: "Education Department",
          evaluated_teacher_count: 2,
        },
        {
          department_id: 1,
          department_name: "Computing Department",
          evaluated_teacher_count: 1,
        },
      ];
    }
  }
}

// Export an instance for convenience
export const departmentAnalyticsService = DepartmentAnalyticsService;
