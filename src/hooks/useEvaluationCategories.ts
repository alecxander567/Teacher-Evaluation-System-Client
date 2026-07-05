// src/hooks/useEvaluationCategories.ts
import { useState, useCallback } from "react";
import type {
  EvaluationCategory,
  EvaluationCategoryRequest,
} from "../types/evaluationCategory.types";
import { evaluationCategoryApi } from "../api/evaluationCategoryApi";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as { response?: { data?: { message?: string } } };
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useEvaluationCategories = () => {
  const [categories, setCategories] = useState<EvaluationCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load categories by form ID
  const loadCategoriesByFormId = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationCategoryApi.getCategoriesByFormId(formId);
      setCategories(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load categories"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load categories with questions by form ID
  const loadCategoriesWithQuestions = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationCategoryApi.getCategoriesWithQuestions(formId);
      setCategories(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load categories with questions"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new category
  const createCategory = useCallback(
    async (data: EvaluationCategoryRequest): Promise<EvaluationCategory | null> => {
      setLoading(true);
      setError(null);
      try {
        const newCategory = await evaluationCategoryApi.createCategory(data);
        setCategories((prev) => [...prev, newCategory]);
        return newCategory;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to create category"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Update a category
  const updateCategory = useCallback(
    async (id: number, data: EvaluationCategoryRequest): Promise<EvaluationCategory | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedCategory = await evaluationCategoryApi.updateCategory(id, data);
        setCategories((prev) =>
          prev.map((cat) => (cat.id === id ? updatedCategory : cat))
        );
        return updatedCategory;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to update category"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Delete a category
  const deleteCategory = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationCategoryApi.deleteCategory(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete category"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete all categories for a form
  const deleteCategoriesByFormId = useCallback(async (formId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationCategoryApi.deleteCategoriesByFormId(formId);
      setCategories([]);
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete categories"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    clearError,
    loadCategoriesByFormId,
    loadCategoriesWithQuestions,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategoriesByFormId,
  };
};