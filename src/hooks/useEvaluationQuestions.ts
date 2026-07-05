// src/hooks/useEvaluationQuestions.ts
import { useState, useCallback } from "react";
import type {
  EvaluationQuestion,
  EvaluationQuestionRequest,
} from "../types/evaluationCategory.types";
import { evaluationQuestionApi } from "../api/evaluationQuestionApi";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as { response?: { data?: { message?: string } } };
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useEvaluationQuestions = () => {
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load questions by category ID
  const loadQuestionsByCategoryId = useCallback(async (categoryId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await evaluationQuestionApi.getQuestionsByCategoryId(categoryId);
      setQuestions(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load questions"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Load questions by form ID
  const loadQuestionsByFormId = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationQuestionApi.getQuestionsByFormId(formId);
      setQuestions(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load questions"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new question
  const createQuestion = useCallback(
    async (
      data: EvaluationQuestionRequest,
    ): Promise<EvaluationQuestion | null> => {
      setLoading(true);
      setError(null);
      try {
        const newQuestion = await evaluationQuestionApi.createQuestion(data);
        setQuestions((prev) => [...prev, newQuestion]);
        return newQuestion;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to create question"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update a question
  const updateQuestion = useCallback(
    async (
      id: number,
      data: EvaluationQuestionRequest,
    ): Promise<EvaluationQuestion | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedQuestion = await evaluationQuestionApi.updateQuestion(
          id,
          data,
        );
        setQuestions((prev) =>
          prev.map((q) => (q.id === id ? updatedQuestion : q)),
        );
        return updatedQuestion;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to update question"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a question
  const deleteQuestion = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationQuestionApi.deleteQuestion(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete question"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete all questions for a category
  const deleteQuestionsByCategoryId = useCallback(
    async (categoryId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await evaluationQuestionApi.deleteQuestionsByCategoryId(categoryId);
        setQuestions([]);
        return true;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to delete questions"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    questions,
    loading,
    error,
    clearError,
    loadQuestionsByCategoryId,
    loadQuestionsByFormId,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    deleteQuestionsByCategoryId,
  };
};
