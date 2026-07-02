// src/hooks/useTeacher.ts
import { useState, useCallback } from "react";
import { teacherApi } from "../api/teacherApi";
import type { Teacher, TeacherRequest } from "../types/teacher";

interface UseTeacherReturn {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  fetchTeachers: () => Promise<void>;
  fetchTeachersByDepartment: (departmentId: number) => Promise<void>;
  searchTeachers: (term: string) => Promise<void>;
  getTeacher: (id: number) => Promise<Teacher | undefined>;
  createTeacher: (data: TeacherRequest) => Promise<Teacher | undefined>;
  updateTeacher: (
    id: number,
    data: TeacherRequest,
  ) => Promise<Teacher | undefined>;
  deleteTeacher: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useTeacher = (): UseTeacherReturn => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (err: unknown) => {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    setError(message);
    console.error("Teacher operation failed:", err);
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all teachers
  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherApi.getAll();
      setTeachers(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch teachers by department
  const fetchTeachersByDepartment = useCallback(
    async (departmentId: number) => {
      setLoading(true);
      setError(null);
      try {
        const data = await teacherApi.getByDepartment(departmentId);
        setTeachers(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Search teachers
  const searchTeachers = useCallback(async (term: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await teacherApi.search(term);
      setTeachers(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get single teacher
  const getTeacher = useCallback(
    async (id: number): Promise<Teacher | undefined> => {
      setLoading(true);
      setError(null);
      try {
        return await teacherApi.getById(id);
      } catch (err) {
        handleError(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Create teacher
  const createTeacher = useCallback(
    async (data: TeacherRequest): Promise<Teacher | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const newTeacher = await teacherApi.create(data);
        setTeachers((prev) => [...prev, newTeacher]);
        return newTeacher;
      } catch (err) {
        handleError(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update teacher
  const updateTeacher = useCallback(
    async (id: number, data: TeacherRequest): Promise<Teacher | undefined> => {
      setLoading(true);
      setError(null);
      try {
        const updatedTeacher = await teacherApi.update(id, data);
        setTeachers((prev) =>
          prev.map((t) => (t.id === id ? updatedTeacher : t)),
        );
        return updatedTeacher;
      } catch (err) {
        handleError(err);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete teacher
  const deleteTeacher = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await teacherApi.delete(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    teachers,
    loading,
    error,
    fetchTeachers,
    fetchTeachersByDepartment,
    searchTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    clearError,
  };
};
