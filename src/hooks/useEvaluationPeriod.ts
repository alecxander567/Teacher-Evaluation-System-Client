// src/hooks/useEvaluationPeriod.ts
import { useState, useCallback } from "react";
import { evaluationPeriodApi } from "../api/evaluationPeriodApi"; 
import { getErrorMessage } from "../utils/getErrorMessage";
import type {
  EvaluationPeriod,
  EvaluationPeriodDetail,
  EvaluationPeriodRequest,
  EvaluationPeriodStatusUpdate,
  EvaluationPeriodFilters,
} from "../types/evaluationPeriod.types";

export const useEvaluationPeriod = () => {
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<EvaluationPeriod | null>(
    null,
  );
  const [periodDetails, setPeriodDetails] =
    useState<EvaluationPeriodDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    active: 0,
    closed: 0,
    archived: 0,
  });

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Fetch all periods with optional filters
  const fetchPeriods = useCallback(
    async (filters?: EvaluationPeriodFilters) => {
      setLoading(true);
      setError(null);
      try {
        const data = await evaluationPeriodApi.getAll(filters);
        setPeriods(data);
        return data;
      } catch (err: unknown) {
        const message = getErrorMessage(
          err,
          "Failed to fetch evaluation periods",
        );
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch period statistics
  const fetchStats = useCallback(async () => {
    try {
      const data = await evaluationPeriodApi.getStats();
      setStats(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch statistics");
      setError(message);
      return null;
    }
  }, []);

  // Fetch period by ID
  const fetchPeriodById = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getById(id);
      setSelectedPeriod(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch evaluation period");
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch period details
  const fetchPeriodDetails = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getDetails(id);
      setPeriodDetails(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch period details");
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch periods by status
  const fetchPeriodsByStatus = useCallback(async (status: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getByStatus(status);
      setPeriods(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch periods by status");
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch periods by academic year and semester
  const fetchPeriodsByAcademicYearAndSemester = useCallback(
    async (academicYear: string, semester: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await evaluationPeriodApi.getByAcademicYearAndSemester(
          academicYear,
          semester,
        );
        setPeriods(data);
        return data;
      } catch (err: unknown) {
        const message = getErrorMessage(
          err,
          "Failed to fetch periods by academic year and semester",
        );
        setError(message);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Fetch active periods
  const fetchActivePeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getActive();
      setPeriods(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch active periods");
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch upcoming periods
  const fetchUpcomingPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getUpcoming();
      setPeriods(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch upcoming periods");
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch past periods
  const fetchPastPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationPeriodApi.getPast();
      setPeriods(data);
      return data;
    } catch (err: unknown) {
      const message = getErrorMessage(err, "Failed to fetch past periods");
      setError(message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create period
  const createPeriod = useCallback(async (data: EvaluationPeriodRequest) => {
    setLoading(true);
    setError(null);
    try {
      const result = await evaluationPeriodApi.create(data);
      return result;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to create evaluation period",
      );
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update period
  const updatePeriod = useCallback(
    async (id: number, data: EvaluationPeriodRequest) => {
      setLoading(true);
      setError(null);
      try {
        const result = await evaluationPeriodApi.update(id, data);
        return result;
      } catch (err: unknown) {
        const message = getErrorMessage(
          err,
          "Failed to update evaluation period",
        );
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Update period status
  const updatePeriodStatus = useCallback(
    async (id: number, statusUpdate: EvaluationPeriodStatusUpdate) => {
      setLoading(true);
      setError(null);
      try {
        const result = await evaluationPeriodApi.updateStatus(id, statusUpdate);
        return result;
      } catch (err: unknown) {
        const message = getErrorMessage(err, "Failed to update period status");
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Delete period
  const deletePeriod = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await evaluationPeriodApi.delete(id);
      return true;
    } catch (err: unknown) {
      const message = getErrorMessage(
        err,
        "Failed to delete evaluation period",
      );
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check if there's an active period for a semester
  const checkActivePeriodForSemester = useCallback(
    async (academicYear: string, semester: string) => {
      try {
        return await evaluationPeriodApi.hasActivePeriod(
          academicYear,
          semester,
        );
      } catch (err: unknown) {
        const message = getErrorMessage(
          err,
          "Failed to check active period for semester",
        );
        setError(message);
        return false;
      }
    },
    [],
  );

  return {
    periods,
    selectedPeriod,
    periodDetails,
    stats,
    loading,
    error,
    clearError,
    fetchPeriods,
    fetchStats,
    fetchPeriodById,
    fetchPeriodDetails,
    fetchPeriodsByStatus,
    fetchPeriodsByAcademicYearAndSemester,
    fetchActivePeriods,
    fetchUpcomingPeriods,
    fetchPastPeriods,
    createPeriod,
    updatePeriod,
    updatePeriodStatus,
    deletePeriod,
    checkActivePeriodForSemester,
  };
};
