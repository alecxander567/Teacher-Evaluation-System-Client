// src/services/analyticsService.ts

import type {
  TeacherPerformanceTrend,
  TeacherPerformanceRanking,
  EvaluationCriteriaBreakdown,
  RatingDistribution,
  TopPerformingTeacher,
  TeacherRequiringImprovement,
} from "../types/analytics";

const API_BASE_URL = "https://loud-terms-pick.loca.lt/api";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const analyticsService = {
  // GET /api/teacher-performance-trend/{teacherId}
  // Now accepts a dynamic teacher ID
  async getTeacherPerformanceTrend(
    teacherId: number,
  ): Promise<TeacherPerformanceTrend[]> {
    const response = await fetch(
      `${API_BASE_URL}/teacher-performance-trend/${teacherId}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Teacher performance trend for ID ${teacherId} not found`);
        return [];
      }
      throw new Error(
        `Failed to fetch teacher performance trend: ${response.status}`,
      );
    }
    return response.json();
  },

  // GET /api/teacher-performance-ranking
  async getTeacherPerformanceRanking(): Promise<TeacherPerformanceRanking[]> {
    const response = await fetch(
      `${API_BASE_URL}/teacher-performance-ranking`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch teacher performance ranking: ${response.status}`,
      );
    }
    return response.json();
  },

  // GET /api/evaluation-criteria-breakdown
  async getEvaluationCriteriaBreakdown(): Promise<
    EvaluationCriteriaBreakdown[]
  > {
    const response = await fetch(
      `${API_BASE_URL}/evaluation-criteria-breakdown`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch evaluation criteria breakdown: ${response.status}`,
      );
    }
    return response.json();
  },

  // GET /api/rating-distribution
  async getRatingDistribution(): Promise<RatingDistribution[]> {
    const response = await fetch(`${API_BASE_URL}/rating-distribution`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch rating distribution: ${response.status}`,
      );
    }
    return response.json();
  },

  // GET /api/top-performing-teachers
  async getTopPerformingTeachers(): Promise<TopPerformingTeacher[]> {
    const response = await fetch(`${API_BASE_URL}/top-performing-teachers`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch top performing teachers: ${response.status}`,
      );
    }
    return response.json();
  },

  // GET /api/teachers-requiring-improvement
  async getTeachersRequiringImprovement(): Promise<
    TeacherRequiringImprovement[]
  > {
    const response = await fetch(
      `${API_BASE_URL}/teachers-requiring-improvement`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch teachers requiring improvement: ${response.status}`,
      );
    }
    return response.json();
  },
};
