// src/api/evaluationCategoryApi.ts
import { api } from "./client";
import type {
  EvaluationCategory,
  EvaluationCategoryRequest,
} from "../types/evaluationCategory.types";

export const evaluationCategoryApi = {
  // Create a new category
  createCategory: async (
    data: EvaluationCategoryRequest,
  ): Promise<EvaluationCategory> => {
    const response = await api.post("/evaluation-categories", data);
    return response.data;
  },

  // Get categories by form ID
  getCategoriesByFormId: async (
    formId: number,
  ): Promise<EvaluationCategory[]> => {
    const response = await api.get(`/evaluation-categories/form/${formId}`);
    return response.data;
  },

  // Get categories with questions by form ID
  getCategoriesWithQuestions: async (
    formId: number,
  ): Promise<EvaluationCategory[]> => {
    const response = await api.get(
      `/evaluation-categories/form/${formId}/with-questions`,
    );
    return response.data;
  },

  // Get category by ID
  getCategoryById: async (id: number): Promise<EvaluationCategory> => {
    const response = await api.get(`/evaluation-categories/${id}`);
    return response.data;
  },

  // Update category
  updateCategory: async (
    id: number,
    data: EvaluationCategoryRequest,
  ): Promise<EvaluationCategory> => {
    const response = await api.put(`/evaluation-categories/${id}`, data);
    return response.data;
  },

  // Delete category
  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-categories/${id}`);
  },

  // Delete all categories for a form
  deleteCategoriesByFormId: async (formId: number): Promise<void> => {
    await api.delete(`/evaluation-categories/form/${formId}`);
  },

  // Check if categories exist for a form
  checkCategoriesExist: async (formId: number): Promise<boolean> => {
    const response = await api.get(
      `/evaluation-categories/form/${formId}/exists`,
    );
    return response.data;
  },

  // Count categories by form ID
  countCategoriesByFormId: async (formId: number): Promise<number> => {
    const response = await api.get(
      `/evaluation-categories/form/${formId}/count`,
    );
    return response.data;
  },
};
