// src/api/evaluationSubmissionApi.ts
import { api } from "./client";
import type {
  EvaluationSubmission,
  EvaluationSubmissionRequest,
} from "../types/evaluationSubmission.types";
import type {
  BatchStatusRequest,
  TeacherEvaluationStatus,
} from "../types/teacherSelection.types";

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

  checkBatchStatus: async (
    data: BatchStatusRequest,
  ): Promise<TeacherEvaluationStatus[]> => {
    const response = await api.post(
      "/evaluation-submissions/check-batch-status",
      data,
    );
    return response.data;
  },
};
