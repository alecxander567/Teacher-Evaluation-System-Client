// src/hooks/useTeacher.ts
import { useState, useCallback } from "react";
import { teacherApi } from "../api/teacherApi";
import { departmentApi } from "../api/departmentApi";
import type { Teacher } from "../types/teacher";
import type { TeacherRequest } from "../types/department.types";
import type { Department } from "../types/department.types";

interface UseTeacherReturn {
  teachers: Teacher[];
  loading: boolean;
  error: string | null;
  departmentNames: Map<number, string>; // Added this
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

// Cache for department names
let departmentCache: Map<number, string> = new Map();

// Function to fetch and cache department names
const fetchDepartmentNames = async (): Promise<Map<number, string>> => {
  try {
    const departments: Department[] = await departmentApi.getAll();
    const map = new Map<number, string>();
    departments.forEach((dept) => {
      map.set(dept.id, dept.name);
    });
    departmentCache = map;
    return map;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return new Map<number, string>();
  }
};

const enrichTeachersWithDepartmentNames = async (
  teachers: Teacher[],
): Promise<Teacher[]> => {
  // Get unique department IDs
  const deptIds = [
    ...new Set(teachers.map((t) => t.departmentId).filter((id) => id !== null)),
  ];

  // Fetch department names for IDs not in cache
  const missingIds = deptIds.filter((id) => !departmentCache.has(id));

  if (missingIds.length > 0) {
    await fetchDepartmentNames();
  }

  // Enrich teachers with department names
  return teachers.map((teacher) => ({
    ...teacher,
    departmentName:
      teacher.departmentId ?
        departmentCache.get(teacher.departmentId) ||
        `Dept ID: ${teacher.departmentId}`
      : "No Department",
  }));
};

export const useTeacher = (): UseTeacherReturn => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [departmentNames, setDepartmentNames] = useState<Map<number, string>>(
    new Map(),
  );
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
      const [data, deptMap] = await Promise.all([
        teacherApi.getAll(),
        fetchDepartmentNames(),
      ]);
      setDepartmentNames(deptMap);
      const enriched = await enrichTeachersWithDepartmentNames(data);
      setTeachers(enriched);
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
        const [data, deptMap] = await Promise.all([
          teacherApi.getByDepartment(departmentId),
          fetchDepartmentNames(),
        ]);
        setDepartmentNames(deptMap);
        const enriched = await enrichTeachersWithDepartmentNames(data);
        setTeachers(enriched);
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
      const [data, deptMap] = await Promise.all([
        teacherApi.search(term),
        fetchDepartmentNames(),
      ]);
      setDepartmentNames(deptMap);
      const enriched = await enrichTeachersWithDepartmentNames(data);
      setTeachers(enriched);
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
        const data = await teacherApi.getById(id);
        const deptMap = await fetchDepartmentNames();
        setDepartmentNames(deptMap);
        const [enriched] = await enrichTeachersWithDepartmentNames([data]);
        return enriched;
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
        const [newTeacher, deptMap] = await Promise.all([
          teacherApi.create(data),
          fetchDepartmentNames(),
        ]);
        setDepartmentNames(deptMap);
        const [enriched] = await enrichTeachersWithDepartmentNames([
          newTeacher,
        ]);
        setTeachers((prev) => [...prev, enriched]);
        return enriched;
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
        const [updatedTeacher, deptMap] = await Promise.all([
          teacherApi.update(id, data),
          fetchDepartmentNames(),
        ]);
        setDepartmentNames(deptMap);
        const [enriched] = await enrichTeachersWithDepartmentNames([
          updatedTeacher,
        ]);
        setTeachers((prev) => prev.map((t) => (t.id === id ? enriched : t)));
        return enriched;
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
    departmentNames, // Return departmentNames
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
