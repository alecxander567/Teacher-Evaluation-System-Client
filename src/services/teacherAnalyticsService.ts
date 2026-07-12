// src/services/teacherAnalyticsService.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_ANALYTICS_API_BASE_URL is not set. Add it to your .env file (see .env.example).",
  );
}

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export interface OverallRating {
  overall_rating: number;
  teacher_id: number;
  teacher_name: string;
  total_evaluations: number;
}

export interface PerformanceTrend {
  academic_year: string;
  avg_rating: number;
  period: string;
  semester: string;
}

export interface CriteriaBreakdown {
  avg_rating: number;
  category: string;
}

export interface RatingDistribution {
  count: number;
  rating: number;
}

export interface StudentComment {
  overall_comment: string;
  submitted_at: string;
}

export interface TeacherAnalyticsBundle {
  overallRating: OverallRating[];
  performanceTrend: PerformanceTrend[];
  criteriaBreakdown: CriteriaBreakdown[];
  ratingDistribution: RatingDistribution[];
  studentComments: StudentComment[];
}

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unexpected error occurred";
};

class TeacherAnalyticsService {
  private teacherId: number = 12; // You can make this dynamic

  async getOverallRating(
    teacherId: number = this.teacherId,
  ): Promise<OverallRating[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teachers/${teacherId}/overall-rating`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching overall rating:", getErrorMessage(error));
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }

  async getPerformanceTrend(
    teacherId: number = this.teacherId,
  ): Promise<PerformanceTrend[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teacher-performance-trend/${teacherId}`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching performance trend:",
        getErrorMessage(error),
      );
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }

  async getCriteriaBreakdown(
    teacherId: number = this.teacherId,
  ): Promise<CriteriaBreakdown[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teachers/${teacherId}/criteria-breakdown`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching criteria breakdown:",
        getErrorMessage(error),
      );
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }

  async getRatingDistribution(
    teacherId: number = this.teacherId,
  ): Promise<RatingDistribution[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teachers/${teacherId}/rating-distribution`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching rating distribution:",
        getErrorMessage(error),
      );
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }

  async getStudentComments(
    teacherId: number = this.teacherId,
  ): Promise<StudentComment[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/teachers/${teacherId}/student-comments`,
        { headers: authHeaders() },
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching student comments:", getErrorMessage(error));
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }

  // Method to fetch all analytics data at once
  async getAllAnalytics(
    teacherId: number = this.teacherId,
  ): Promise<TeacherAnalyticsBundle> {
    try {
      const [
        overallRating,
        performanceTrend,
        criteriaBreakdown,
        ratingDistribution,
        studentComments,
      ] = await Promise.all([
        this.getOverallRating(teacherId),
        this.getPerformanceTrend(teacherId),
        this.getCriteriaBreakdown(teacherId),
        this.getRatingDistribution(teacherId),
        this.getStudentComments(teacherId),
      ]);

      return {
        overallRating,
        performanceTrend,
        criteriaBreakdown,
        ratingDistribution,
        studentComments,
      };
    } catch (error) {
      console.error("Error fetching all analytics:", getErrorMessage(error));
      throw new Error(getErrorMessage(error), { cause: error });
    }
  }
}

export const teacherAnalyticsService = new TeacherAnalyticsService();
