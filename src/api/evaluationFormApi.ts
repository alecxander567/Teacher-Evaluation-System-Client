// src/api/evaluationFormApi.ts
import axios from "axios";
import type {
  EvaluationForm,
  EvaluationFormDetail,
  EvaluationFormRequest,
} from "../types/evaluationForm";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const evaluationFormApi = {
  // Create a new evaluation form
  createForm: async (data: EvaluationFormRequest): Promise<EvaluationForm> => {
    const response = await api.post("/evaluation-forms", data);
    return response.data;
  },

  // Get all evaluation forms
  getAllForms: async (): Promise<EvaluationForm[]> => {
    const response = await api.get("/evaluation-forms");
    return response.data;
  },

  // Get form by ID
  getFormById: async (id: number): Promise<EvaluationForm> => {
    const response = await api.get(`/evaluation-forms/${id}`);
    return response.data;
  },

  // Get form details with computed fields
  getFormDetails: async (id: number): Promise<EvaluationFormDetail> => {
    const response = await api.get(`/evaluation-forms/${id}/details`);
    return response.data;
  },

  // Get forms by evaluation period ID
  getFormsByPeriodId: async (periodId: number): Promise<EvaluationForm[]> => {
    const response = await api.get(`/evaluation-forms/period/${periodId}`);
    return response.data;
  },

  // Get forms by period status
  getFormsByPeriodStatus: async (status: string): Promise<EvaluationForm[]> => {
    const response = await api.get(`/evaluation-forms/period-status/${status}`);
    return response.data;
  },

  // Search forms by title
  searchFormsByTitle: async (title: string): Promise<EvaluationForm[]> => {
    const response = await api.get(`/evaluation-forms/search?title=${title}`);
    return response.data;
  },

  // Get forms with period details
  getFormsWithPeriodDetails: async (): Promise<EvaluationForm[]> => {
    const response = await api.get("/evaluation-forms/with-period-details");
    return response.data;
  },

  // Update evaluation form
  updateForm: async (
    id: number,
    data: EvaluationFormRequest,
  ): Promise<EvaluationForm> => {
    const response = await api.put(`/evaluation-forms/${id}`, data);
    return response.data;
  },

  // Delete evaluation form
  deleteForm: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-forms/${id}`);
  },

  // Delete all forms for a period
  deleteFormsByPeriod: async (periodId: number): Promise<void> => {
    await api.delete(`/evaluation-forms/period/${periodId}`);
  },

  // Check if form exists
  checkFormExists: async (id: number): Promise<boolean> => {
    const response = await api.get(`/evaluation-forms/${id}/exists`);
    return response.data;
  },

  // Check if forms exist for a period
  checkFormsExistForPeriod: async (periodId: number): Promise<boolean> => {
    const response = await api.get(
      `/evaluation-forms/period/${periodId}/exists`,
    );
    return response.data;
  },

  // Count forms by period ID
  countFormsByPeriodId: async (periodId: number): Promise<number> => {
    const response = await api.get(
      `/evaluation-forms/period/${periodId}/count`,
    );
    return response.data;
  },
};
