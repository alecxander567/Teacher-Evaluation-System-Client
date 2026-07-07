// src/api/studentEvaluationApi.ts
import axios from "axios";
import type {
  DepartmentTeacherGroup,
  StudentEvaluationSession,
  TeacherEvaluationProgress,
  StartEvaluationSessionRequest,
} from "../types/studentEvaluation.types";
import type { EvaluationFormDetail } from "../types/evaluationCategory.types";
import type { EvaluationSubmissionRequest } from "../types/evaluationSubmission.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const studentEvaluationApi = {
  // Get available teachers for a period
  getAvailableTeachers: async (
    periodId: number,
    formId: number,
    studentEmail: string,
  ): Promise<DepartmentTeacherGroup[]> => {
    const response = await api.get(
      `/student/evaluation/teachers?periodId=${periodId}&formId=${formId}&studentEmail=${encodeURIComponent(studentEmail)}`,
    );
    return response.data;
  },

  // Start evaluation session
  startSession: async (
    request: StartEvaluationSessionRequest,
  ): Promise<StudentEvaluationSession> => {
    const response = await api.post(
      "/student/evaluation/session/start",
      request,
    );
    return response.data;
  },

  // Get session by ID
  getSession: async (sessionId: string): Promise<StudentEvaluationSession> => {
    const response = await api.get(`/student/evaluation/session/${sessionId}`);
    return response.data;
  },

  // Get next teacher to evaluate
  getNextTeacher: async (
    sessionId: string,
  ): Promise<TeacherEvaluationProgress> => {
    const response = await api.get(
      `/student/evaluation/session/${sessionId}/next`,
    );
    return response.data;
  },

  // Get session progress
  getSessionProgress: async (
    sessionId: string,
  ): Promise<TeacherEvaluationProgress[]> => {
    const response = await api.get(
      `/student/evaluation/session/${sessionId}/progress`,
    );
    return response.data;
  },

  // Check if session is complete
  isSessionComplete: async (sessionId: string): Promise<boolean> => {
    const response = await api.get(
      `/student/evaluation/session/${sessionId}/is-complete`,
    );
    return response.data;
  },

  // Get evaluation form for a specific teacher
  getTeacherEvaluationForm: async (
    sessionId: string,
    teacherAssignmentId: number,
  ): Promise<EvaluationFormDetail> => {
    const response = await api.get(
      `/student/evaluation/session/${sessionId}/teacher/${teacherAssignmentId}/form`,
    );
    return response.data;
  },

  // Submit evaluation for a teacher
  submitTeacherEvaluation: async (
    sessionId: string,
    submission: EvaluationSubmissionRequest,
  ): Promise<TeacherEvaluationProgress> => {
    const response = await api.post(
      `/student/evaluation/session/${sessionId}/submit`,
      submission,
    );
    return response.data;
  },

  // Complete the evaluation session
  completeSession: async (sessionId: string): Promise<void> => {
    await api.post(`/student/evaluation/session/${sessionId}/complete`);
  },

  // Cancel the evaluation session
  cancelSession: async (sessionId: string): Promise<void> => {
    await api.delete(`/student/evaluation/session/${sessionId}`);
  },
};
