// src/hooks/useEvaluationSubmissions.ts
import { useState, useCallback } from "react";
import type {
  EvaluationSubmission,
  EvaluationSubmissionRequest,
} from "../types/evaluationSubmission.types";
import { evaluationSubmissionApi } from "../api/evaluationSubmissionApi";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as { response?: { data?: { message?: string } } };
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useEvaluationSubmissions = () => {
  const [submissions, setSubmissions] = useState<EvaluationSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadSubmissionsByPeriodId = useCallback(async (periodId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await evaluationSubmissionApi.getSubmissionsByPeriodId(periodId);
      setSubmissions(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load submissions"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSubmissionsByAssignmentId = useCallback(
    async (assignmentId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data =
          await evaluationSubmissionApi.getSubmissionsByAssignmentId(
            assignmentId,
          );
        setSubmissions(data);
        return data;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to load submissions"));
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getSubmissionWithResponses = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationSubmissionApi.getSubmissionWithResponses(id);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load submission details"));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createSubmission = useCallback(
    async (
      data: EvaluationSubmissionRequest,
    ): Promise<EvaluationSubmission | null> => {
      setLoading(true);
      setError(null);
      try {
        const newSubmission =
          await evaluationSubmissionApi.createSubmission(data);
        setSubmissions((prev) => [newSubmission, ...prev]);
        return newSubmission;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to submit evaluation"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const checkStudentSubmitted = useCallback(
    async (periodId: number, assignmentId: number, studentEmail: string) => {
      try {
        return await evaluationSubmissionApi.checkStudentSubmitted(
          periodId,
          assignmentId,
          studentEmail,
        );
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to check submission status"));
        return false;
      }
    },
    [],
  );

  const deleteSubmission = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationSubmissionApi.deleteSubmission(id);
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete submission"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    submissions,
    loading,
    error,
    clearError,
    loadSubmissionsByPeriodId,
    loadSubmissionsByAssignmentId,
    getSubmissionWithResponses,
    createSubmission,
    checkStudentSubmitted,
    deleteSubmission,
  };
};
