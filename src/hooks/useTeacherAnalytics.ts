// src/hooks/useTeacherAnalytics.ts
import { useState, useEffect } from "react";
import { teacherAnalyticsService } from "../services/teacherAnalyticsService";
import type {
  OverallRating,
  PerformanceTrend,
  CriteriaBreakdown,
  RatingDistribution,
  StudentComment,
  TeacherAnalyticsBundle,
} from "../services/teacherAnalyticsService";

export const useOverallRating = (teacherId: number = 12) => {
  const [data, setData] = useState<OverallRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await teacherAnalyticsService.getOverallRating(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};

export const usePerformanceTrend = (teacherId: number = 12) => {
  const [data, setData] = useState<PerformanceTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await teacherAnalyticsService.getPerformanceTrend(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};

export const useCriteriaBreakdown = (teacherId: number = 12) => {
  const [data, setData] = useState<CriteriaBreakdown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await teacherAnalyticsService.getCriteriaBreakdown(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};

export const useRatingDistribution = (teacherId: number = 12) => {
  const [data, setData] = useState<RatingDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await teacherAnalyticsService.getRatingDistribution(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};

export const useStudentComments = (teacherId: number = 12) => {
  const [data, setData] = useState<StudentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result =
          await teacherAnalyticsService.getStudentComments(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};

// Combined hook for all analytics
export const useAllTeacherAnalytics = (teacherId: number = 12) => {
  const [data, setData] = useState<TeacherAnalyticsBundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await teacherAnalyticsService.getAllAnalytics(teacherId);
        setData(result);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId]);

  return { data, loading, error };
};
