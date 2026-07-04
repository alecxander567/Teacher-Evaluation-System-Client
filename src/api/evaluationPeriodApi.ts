// src/api/evaluationPeriodApi.ts
import axios from "axios";
import type {
  EvaluationPeriod,
  EvaluationPeriodDetail,
  EvaluationPeriodRequest,
  EvaluationPeriodStatusUpdate,
  EvaluationPeriodFilters,
} from "../types/evaluationPeriod.types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export const evaluationPeriodApi = {
  // Get all evaluation periods with optional filters
  getAll: async (
    filters?: EvaluationPeriodFilters,
  ): Promise<EvaluationPeriod[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters?.semester) params.append("semester", filters.semester);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<EvaluationPeriod[]>(
      `/evaluation-periods${query}`,
    );
    return response.data;
  },

  // Get evaluation period by ID
  getById: async (id: number): Promise<EvaluationPeriod> => {
    const response = await api.get<EvaluationPeriod>(
      `/evaluation-periods/${id}`,
    );
    return response.data;
  },

  // Get evaluation period details by ID
  getDetails: async (id: number): Promise<EvaluationPeriodDetail> => {
    const response = await api.get<EvaluationPeriodDetail>(
      `/evaluation-periods/${id}/details`,
    );
    return response.data;
  },

  // Get evaluation periods by status
  getByStatus: async (status: string): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      `/evaluation-periods/status/${status}`,
    );
    return response.data;
  },

  // Get evaluation periods by academic year and semester
  getByAcademicYearAndSemester: async (
    academicYear: string,
    semester: string,
  ): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      `/evaluation-periods/academic-year/${academicYear}/semester/${semester}`,
    );
    return response.data;
  },

  // Get active evaluation periods
  getActive: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/active",
    );
    return response.data;
  },

  // Get upcoming evaluation periods
  getUpcoming: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/upcoming",
    );
    return response.data;
  },

  // Get past evaluation periods
  getPast: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/past",
    );
    return response.data;
  },

  // Create new evaluation period
  create: async (data: EvaluationPeriodRequest): Promise<EvaluationPeriod> => {
    const response = await api.post<EvaluationPeriod>(
      "/evaluation-periods",
      data,
    );
    return response.data;
  },

  // Update evaluation period
  update: async (
    id: number,
    data: EvaluationPeriodRequest,
  ): Promise<EvaluationPeriod> => {
    const response = await api.put<EvaluationPeriod>(
      `/evaluation-periods/${id}`,
      data,
    );
    return response.data;
  },

  // Update evaluation period status
  updateStatus: async (
    id: number,
    statusUpdate: EvaluationPeriodStatusUpdate,
  ): Promise<EvaluationPeriod> => {
    const response = await api.patch<EvaluationPeriod>(
      `/evaluation-periods/${id}/status`,
      statusUpdate,
    );
    return response.data;
  },

  // Delete evaluation period
  delete: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-periods/${id}`);
  },

  // Check if period exists
  exists: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/evaluation-periods/${id}/exists`);
    return response.data;
  },

  // Check if period is active
  isActive: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/evaluation-periods/${id}/is-active`,
    );
    return response.data;
  },

  // Check if there's an active period for a semester
  hasActivePeriod: async (
    academicYear: string,
    semester: string,
  ): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/evaluation-periods/has-active-period?academicYear=${academicYear}&semester=${semester}`,
    );
    return response.data;
  },

  // Get count by status
  getCountByStatus: async (status: string): Promise<number> => {
    const response = await api.get<number>(
      `/evaluation-periods/count/status/${status}`,
    );
    return response.data;
  },

  // Get period statistics
  getStats: async (): Promise<{
    total: number;
    draft: number;
    active: number;
    closed: number;
    archived: number;
  }> => {
    const [total, draft, active, closed, archived] = await Promise.all([
      api
        .get<EvaluationPeriod[]>("/evaluation-periods")
        .then((res) => res.data.length),
      api
        .get<number>("/evaluation-periods/count/status/draft")
        .then((res) => res.data),
      api
        .get<number>("/evaluation-periods/count/status/active")
        .then((res) => res.data),
      api
        .get<number>("/evaluation-periods/count/status/closed")
        .then((res) => res.data),
      api
        .get<number>("/evaluation-periods/count/status/archived")
        .then((res) => res.data),
    ]);

    return { total, draft, active, closed, archived };
  },
};
