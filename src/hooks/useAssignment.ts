// src/hooks/useAssignment.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { assignmentApi } from "../api/assignmentApi";
import type {
  Assignment,
  AssignmentDetail,
  AssignmentRequest,
  AssignmentFilters,
} from "../types/assignment.types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useAssignments = (filters?: AssignmentFilters) => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assignmentApi.getAll(filters);
      setAssignments(data || []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to fetch assignments",
      );
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchAssignments();
    }
  }, [fetchAssignments]);

  return { assignments, loading, error, refetch: fetchAssignments };
};

export const useAssignment = (id: number) => {
  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const data = await assignmentApi.getDetail(id);
        setAssignment(data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message || "Failed to fetch assignment",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id]);

  return { assignment, loading, error };
};

export const useCreateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssignment = async (data: AssignmentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignmentApi.create(data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to create assignment";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { createAssignment, loading, error };
};

export const useUpdateAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAssignment = async (id: number, data: AssignmentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await assignmentApi.update(id, data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to update assignment";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { updateAssignment, loading, error };
};

export const useDeleteAssignment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAssignment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await assignmentApi.delete(id);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to delete assignment";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { deleteAssignment, loading, error };
};

export const useAssignmentCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAssignment = async (
    teacherId: number,
    subjectId: number,
    academicYear: string,
    semester: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await assignmentApi.checkAssignment(
        teacherId,
        subjectId,
        academicYear,
        semester,
      );
      return result;
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to check assignment",
      );
      throw new Error(apiError.message || "Failed to check assignment", {
        cause: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return { checkAssignment, loading, error };
};

export const useAssignmentCounts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCountByTeacher = async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      const count = await assignmentApi.getCountByTeacher(teacherId);
      return count;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to get count");
      throw new Error(apiError.message || "Failed to get count", {
        cause: err,
      });
    } finally {
      setLoading(false);
    }
  };

  const getCountBySubject = async (subjectId: number) => {
    setLoading(true);
    setError(null);
    try {
      const count = await assignmentApi.getCountBySubject(subjectId);
      return count;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to get count");
      throw new Error(apiError.message || "Failed to get count", {
        cause: err,
      });
    } finally {
      setLoading(false);
    }
  };

  return { getCountByTeacher, getCountBySubject, loading, error };
};

export const useSearchAssignments = () => {
  const [results, setResults] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const allAssignments = await assignmentApi.getAll();
      const lowerTerm = term.toLowerCase();
      const filtered = allAssignments.filter(
        (a) =>
          a.teacherName?.toLowerCase().includes(lowerTerm) ||
          a.subjectName?.toLowerCase().includes(lowerTerm) ||
          a.subjectCode?.toLowerCase().includes(lowerTerm),
      );
      setResults(filtered);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to search assignments",
      );
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
