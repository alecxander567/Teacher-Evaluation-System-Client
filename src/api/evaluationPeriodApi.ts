// src/api/evaluationPeriodApi.ts
import { api } from "./client";
import type {
  EvaluationPeriod,
  EvaluationPeriodDetail,
  EvaluationPeriodRequest,
  EvaluationPeriodStatusUpdate,
  EvaluationPeriodFilters,
} from "../types/evaluationPeriod.types";

export const evaluationPeriodApi = {
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

  getById: async (id: number): Promise<EvaluationPeriod> => {
    const response = await api.get<EvaluationPeriod>(
      `/evaluation-periods/${id}`,
    );
    return response.data;
  },

  getDetails: async (id: number): Promise<EvaluationPeriodDetail> => {
    const response = await api.get<EvaluationPeriodDetail>(
      `/evaluation-periods/${id}/details`,
    );
    return response.data;
  },

  getByStatus: async (status: string): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      `/evaluation-periods/status/${status}`,
    );
    return response.data;
  },

  getByAcademicYearAndSemester: async (
    academicYear: string,
    semester: string,
  ): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      `/evaluation-periods/academic-year/${academicYear}/semester/${semester}`,
    );
    return response.data;
  },

  getActive: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/active",
    );
    return response.data;
  },

  getUpcoming: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/upcoming",
    );
    return response.data;
  },

  getPast: async (): Promise<EvaluationPeriod[]> => {
    const response = await api.get<EvaluationPeriod[]>(
      "/evaluation-periods/past",
    );
    return response.data;
  },

  create: async (data: EvaluationPeriodRequest): Promise<EvaluationPeriod> => {
    const response = await api.post<EvaluationPeriod>(
      "/evaluation-periods",
      data,
    );
    return response.data;
  },

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

  delete: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-periods/${id}`);
  },

  exists: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/evaluation-periods/${id}/exists`);
    return response.data;
  },

  isActive: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/evaluation-periods/${id}/is-active`,
    );
    return response.data;
  },

  hasActivePeriod: async (
    academicYear: string,
    semester: string,
  ): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/evaluation-periods/has-active-period?academicYear=${academicYear}&semester=${semester}`,
    );
    return response.data;
  },

  getCountByStatus: async (status: string): Promise<number> => {
    const response = await api.get<number>(
      `/evaluation-periods/count/status/${status}`,
    );
    return response.data;
  },

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
