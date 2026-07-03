// src/hooks/useDepartment.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { departmentApi } from "../api/departmentApi";
import type {
  Department,
  DepartmentDetail,
  DepartmentRequest,
} from "../types/department.types";

// Define a proper error type
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const useDepartments = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await departmentApi.getAll();
      setDepartments(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to fetch departments",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Track first render to avoid cascading renders
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchDepartments();
    }
  }, [fetchDepartments]);

  return { departments, loading, error, refetch: fetchDepartments };
};

export const useDepartment = (id: number) => {
  const [department, setDepartment] = useState<DepartmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartment = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await departmentApi.getDetail(id);
        setDepartment(data);
      } catch (err) {
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message || "Failed to fetch department",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDepartment();
    }
  }, [id]);

  return { department, loading, error };
};

export const useCreateDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDepartment = async (data: DepartmentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentApi.create(data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to create department";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { createDepartment, loading, error };
};

export const useUpdateDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDepartment = async (id: number, data: DepartmentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentApi.update(id, data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to update department";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { updateDepartment, loading, error };
};

export const useDeleteDepartment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDepartment = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await departmentApi.delete(id);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to delete department";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { deleteDepartment, loading, error };
};

export const useSearchDepartments = () => {
  const [results, setResults] = useState<Department[]>([]);
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
      const data = await departmentApi.search(term);
      setResults(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.message || "Failed to search departments",
      );
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
