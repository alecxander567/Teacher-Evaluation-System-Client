// src/hooks/useSubjects.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { subjectApi } from "../api/subjectApi";
import { departmentApi } from "../api/departmentApi";
import type {
  Subject,
  SubjectDetail,
  SubjectRequest,
} from "../types/subject.types";
import type { Department } from "../types/department.types";

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
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

const enrichSubjectsWithDepartmentNames = async (
  subjects: Subject[],
): Promise<Subject[]> => {
  // Get unique department IDs
  const deptIds = [
    ...new Set(subjects.map((s) => s.departmentId).filter((id) => id !== null)),
  ];

  // Fetch department names for IDs not in cache
  const missingIds = deptIds.filter((id) => !departmentCache.has(id));

  if (missingIds.length > 0) {
    await fetchDepartmentNames();
  }

  // Enrich subjects with department names
  return subjects.map((subject) => ({
    ...subject,
    departmentName:
      subject.departmentId ?
        departmentCache.get(subject.departmentId) ||
        `Dept ID: ${subject.departmentId}`
      : "No Department",
  }));
};

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [departmentNames, setDepartmentNames] = useState<Map<number, string>>(
    new Map(),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(() => {
    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError(null);
      })
      .then(() => Promise.all([subjectApi.getAll(), fetchDepartmentNames()]))
      .then(([data, deptMap]) => {
        setDepartmentNames(deptMap);
        return enrichSubjectsWithDepartmentNames(data);
      })
      .then((enriched) => {
        setSubjects(enriched);
      })
      .catch((err) => {
        const apiError = err as ApiError;
        setError(
          apiError.response?.data?.message || "Failed to fetch subjects",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Track first render to avoid cascading renders
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      fetchSubjects();
    }
  }, [fetchSubjects]);

  return { subjects, loading, error, departmentNames, refetch: fetchSubjects };
};

export const useSubject = (id: number) => {
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubject = useCallback(() => {
    if (!id) return Promise.resolve();
    return Promise.resolve()
      .then(() => {
        setLoading(true);
        setError(null);
      })
      .then(() =>
        Promise.all([subjectApi.getDetail(id), fetchDepartmentNames()]),
      )
      .then(([data, deptMap]) => {
        // Ensure all required fields are present for SubjectDetail
        const subjectDetail: SubjectDetail = {
          ...data,
          teacherCount: 0, // Add default value for teacherCount
          departmentName:
            data.departmentId ?
              deptMap.get(data.departmentId) || undefined
            : undefined,
        };
        setSubject(subjectDetail);
      })
      .catch((err) => {
        const apiError = err as ApiError;
        setError(apiError.response?.data?.message || "Failed to fetch subject");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchSubject();
  }, [fetchSubject]);

  return { subject, loading, error, refetch: fetchSubject };
};

export const useCreateSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSubject = async (data: SubjectRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subjectApi.create(data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to create subject";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { createSubject, loading, error };
};

export const useUpdateSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSubject = async (id: number, data: SubjectRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await subjectApi.update(id, data);
      return response;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to update subject";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { updateSubject, loading, error };
};

export const useDeleteSubject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSubject = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await subjectApi.delete(id);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      const message =
        apiError.response?.data?.message || "Failed to delete subject";
      setError(message);
      throw new Error(message, { cause: err });
    } finally {
      setLoading(false);
    }
  };

  return { deleteSubject, loading, error };
};

export const useSearchSubjects = () => {
  const [results, setResults] = useState<Subject[]>([]);
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
      const data = await subjectApi.search(term);
      const enriched = await enrichSubjectsWithDepartmentNames(data);
      setResults(enriched);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.response?.data?.message || "Failed to search subjects");
    } finally {
      setLoading(false);
    }
  };

  return { results, loading, error, search };
};
