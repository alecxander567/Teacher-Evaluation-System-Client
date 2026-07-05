// src/hooks/useTeacherAssignments.ts
import { useState, useCallback } from "react";
import type {
  TeacherAssignment,
  TeacherAssignmentRequest,
} from "../types/teacherAssignment.types";
import { teacherAssignmentApi } from "../api/teacherAssignmentApi";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as { response?: { data?: { message?: string } } };
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useTeacherAssignments = () => {
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadAllAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherAssignmentApi.getAllAssignments();
      setAssignments(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load assignments"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadAssignmentsByTeacherId = useCallback(async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data =
        await teacherAssignmentApi.getAssignmentsByTeacherId(teacherId);
      setAssignments(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load assignments"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createAssignment = useCallback(
    async (
      data: TeacherAssignmentRequest,
    ): Promise<TeacherAssignment | null> => {
      setLoading(true);
      setError(null);
      try {
        const newAssignment = await teacherAssignmentApi.createAssignment(data);
        setAssignments((prev) => [...prev, newAssignment]);
        return newAssignment;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to create assignment"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateAssignment = useCallback(
    async (
      id: number,
      data: TeacherAssignmentRequest,
    ): Promise<TeacherAssignment | null> => {
      setLoading(true);
      setError(null);
      try {
        const updated = await teacherAssignmentApi.updateAssignment(id, data);
        setAssignments((prev) => prev.map((a) => (a.id === id ? updated : a)));
        return updated;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to update assignment"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteAssignment = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await teacherAssignmentApi.deleteAssignment(id);
      setAssignments((prev) => prev.filter((a) => a.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete assignment"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    assignments,
    loading,
    error,
    clearError,
    loadAllAssignments,
    loadAssignmentsByTeacherId,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
};
