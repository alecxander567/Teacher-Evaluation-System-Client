// src/api/evaluationQuestionApi.ts
import axios from "axios";
import type {
  EvaluationQuestion,
  EvaluationQuestionRequest,
} from "../types/evaluationCategory.types";

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

export const evaluationQuestionApi = {
  // Create a new question
  createQuestion: async (
    data: EvaluationQuestionRequest,
  ): Promise<EvaluationQuestion> => {
    const response = await api.post("/evaluation-questions", data);
    return response.data;
  },

  // Get questions by category ID
  getQuestionsByCategoryId: async (
    categoryId: number,
  ): Promise<EvaluationQuestion[]> => {
    const response = await api.get(
      `/evaluation-questions/category/${categoryId}`,
    );
    return response.data;
  },

  // Get questions by form ID
  getQuestionsByFormId: async (
    formId: number,
  ): Promise<EvaluationQuestion[]> => {
    const response = await api.get(`/evaluation-questions/form/${formId}`);
    return response.data;
  },

  // Get question by ID
  getQuestionById: async (id: number): Promise<EvaluationQuestion> => {
    const response = await api.get(`/evaluation-questions/${id}`);
    return response.data;
  },

  // Update question
  updateQuestion: async (
    id: number,
    data: EvaluationQuestionRequest,
  ): Promise<EvaluationQuestion> => {
    const response = await api.put(`/evaluation-questions/${id}`, data);
    return response.data;
  },

  // Delete question
  deleteQuestion: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-questions/${id}`);
  },

  // Delete all questions for a category
  deleteQuestionsByCategoryId: async (categoryId: number): Promise<void> => {
    await api.delete(`/evaluation-questions/category/${categoryId}`);
  },

  // Count questions by category ID
  countQuestionsByCategoryId: async (categoryId: number): Promise<number> => {
    const response = await api.get(
      `/evaluation-questions/category/${categoryId}/count`,
    );
    return response.data;
  },
};
