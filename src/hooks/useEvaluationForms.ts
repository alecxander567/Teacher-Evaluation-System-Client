// src/hooks/useEvaluationForms.ts
import { useState, useCallback } from "react";
import type {
  EvaluationForm,
  EvaluationFormDetail,
  EvaluationFormRequest,
} from "../types/evaluationForm";
import { evaluationFormApi } from "../api/evaluationFormApi";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

const isApiErrorResponse = (err: unknown): err is ApiErrorResponse => {
  return typeof err === "object" && err !== null && "response" in err;
};

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (isApiErrorResponse(err)) {
    const message = err.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useEvaluationForms = () => {
  const [forms, setForms] = useState<EvaluationForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Load all forms
  const loadForms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationFormApi.getAllForms();
      setForms(data);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load forms"));
    } finally {
      setLoading(false);
    }
  }, []);

  // Load forms by period ID
  const loadFormsByPeriodId = useCallback(async (periodId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationFormApi.getFormsByPeriodId(periodId);
      setForms(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load forms"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new form
  const createForm = useCallback(
    async (data: EvaluationFormRequest): Promise<EvaluationForm | null> => {
      setLoading(true);
      setError(null);
      try {
        const newForm = await evaluationFormApi.createForm(data);
        setForms((prev) => [newForm, ...prev]);
        return newForm;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to create form"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update a form
  const updateForm = useCallback(
    async (
      id: number,
      data: EvaluationFormRequest,
    ): Promise<EvaluationForm | null> => {
      setLoading(true);
      setError(null);
      try {
        const updatedForm = await evaluationFormApi.updateForm(id, data);
        setForms((prev) =>
          prev.map((form) => (form.id === id ? updatedForm : form)),
        );
        return updatedForm;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to update form"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete a form
  const deleteForm = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationFormApi.deleteForm(id);
      setForms((prev) => prev.filter((form) => form.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete form"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete all forms for a period
  const deleteFormsByPeriod = useCallback(
    async (periodId: number): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        await evaluationFormApi.deleteFormsByPeriod(periodId);
        setForms((prev) =>
          prev.filter((form) => form.evaluationPeriodId !== periodId),
        );
        return true;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to delete forms"));
        return false;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Search forms by title
  const searchForms = useCallback(async (title: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationFormApi.searchFormsByTitle(title);
      setForms(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to search forms"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get form details
  const getFormDetails = useCallback(
    async (id: number): Promise<EvaluationFormDetail | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await evaluationFormApi.getFormDetails(id);
        return data;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load form details"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    forms,
    loading,
    error,
    clearError,
    loadForms,
    loadFormsByPeriodId,
    createForm,
    updateForm,
    deleteForm,
    deleteFormsByPeriod,
    searchForms,
    getFormDetails,
  };
};
