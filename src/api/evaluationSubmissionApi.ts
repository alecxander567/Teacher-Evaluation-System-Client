// src/api/evaluationSubmissionApi.ts
import axios from "axios";
import type {
  EvaluationSubmission,
  EvaluationSubmissionRequest,
} from "../types/evaluationSubmission.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const evaluationSubmissionApi = {
  createSubmission: async (
    data: EvaluationSubmissionRequest,
  ): Promise<EvaluationSubmission> => {
    const response = await api.post("/evaluation-submissions", data);
    return response.data;
  },

  getSubmissionById: async (id: number): Promise<EvaluationSubmission> => {
    const response = await api.get(`/evaluation-submissions/${id}`);
    return response.data;
  },

  getSubmissionWithResponses: async (
    id: number,
  ): Promise<EvaluationSubmission> => {
    const response = await api.get(
      `/evaluation-submissions/${id}/with-responses`,
    );
    return response.data;
  },

  getSubmissionsByPeriodId: async (
    periodId: number,
  ): Promise<EvaluationSubmission[]> => {
    const response = await api.get(
      `/evaluation-submissions/period/${periodId}`,
    );
    return response.data;
  },

  getSubmissionsByAssignmentId: async (
    assignmentId: number,
  ): Promise<EvaluationSubmission[]> => {
    const response = await api.get(
      `/evaluation-submissions/assignment/${assignmentId}`,
    );
    return response.data;
  },

  getSubmissionsByStudentEmail: async (
    email: string,
  ): Promise<EvaluationSubmission[]> => {
    const response = await api.get(`/evaluation-submissions/student/${email}`);
    return response.data;
  },

  checkStudentSubmitted: async (
    periodId: number,
    assignmentId: number,
    studentEmail: string,
  ): Promise<boolean> => {
    const response = await api.get(
      `/evaluation-submissions/check-submission?periodId=${periodId}&assignmentId=${assignmentId}&studentEmail=${encodeURIComponent(studentEmail)}`,
    );
    return response.data;
  },

  countSubmissionsByPeriodId: async (periodId: number): Promise<number> => {
    const response = await api.get(
      `/evaluation-submissions/period/${periodId}/count`,
    );
    return response.data;
  },

  countSubmissionsByAssignmentId: async (
    assignmentId: number,
  ): Promise<number> => {
    const response = await api.get(
      `/evaluation-submissions/assignment/${assignmentId}/count`,
    );
    return response.data;
  },

  deleteSubmission: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-submissions/${id}`);
  },
};
