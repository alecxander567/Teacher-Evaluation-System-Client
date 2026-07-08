// src/hooks/useAnalytics.ts

import { useState, useEffect } from "react";
import { analyticsService } from "../services/analyticsService";
import type {
  TeacherPerformanceTrend,
  TeacherPerformanceRanking,
  EvaluationCriteriaBreakdown,
  RatingDistribution,
  TopPerformingTeacher,
  TeacherRequiringImprovement,
} from "../types/analytics";

interface UseAnalyticsReturn {
  teacherPerformanceTrend: TeacherPerformanceTrend[];
  teacherPerformanceRanking: TeacherPerformanceRanking[];
  evaluationCriteriaBreakdown: EvaluationCriteriaBreakdown[];
  ratingDistribution: RatingDistribution[];
  topPerformingTeachers: TopPerformingTeacher[];
  teachersRequiringImprovement: TeacherRequiringImprovement[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useAnalytics = (teacherId?: number): UseAnalyticsReturn => {
  const [teacherPerformanceTrend, setTeacherPerformanceTrend] = useState<
    TeacherPerformanceTrend[]
  >([]);
  const [teacherPerformanceRanking, setTeacherPerformanceRanking] = useState<
    TeacherPerformanceRanking[]
  >([]);
  const [evaluationCriteriaBreakdown, setEvaluationCriteriaBreakdown] =
    useState<EvaluationCriteriaBreakdown[]>([]);
  const [ratingDistribution, setRatingDistribution] = useState<
    RatingDistribution[]
  >([]);
  const [topPerformingTeachers, setTopPerformingTeachers] = useState<
    TopPerformingTeacher[]
  >([]);
  const [teachersRequiringImprovement, setTeachersRequiringImprovement] =
    useState<TeacherRequiringImprovement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const trendPromise =
        teacherId ?
          analyticsService.getTeacherPerformanceTrend(teacherId)
        : Promise.resolve([]);

      const [
        trend,
        ranking,
        criteria,
        distribution,
        topTeachers,
        improvementTeachers,
      ] = await Promise.all([
        trendPromise,
        analyticsService.getTeacherPerformanceRanking(),
        analyticsService.getEvaluationCriteriaBreakdown(),
        analyticsService.getRatingDistribution(),
        analyticsService.getTopPerformingTeachers(),
        analyticsService.getTeachersRequiringImprovement(),
      ]);

      setTeacherPerformanceTrend(trend);
      setTeacherPerformanceRanking(ranking);
      setEvaluationCriteriaBreakdown(criteria);
      setRatingDistribution(distribution);
      setTopPerformingTeachers(topTeachers);
      setTeachersRequiringImprovement(improvementTeachers);
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
      setError("Failed to load analytics data. Please try again.");

      setTeacherPerformanceTrend([]);
      setTeacherPerformanceRanking([]);
      setEvaluationCriteriaBreakdown([]);
      setRatingDistribution([]);
      setTopPerformingTeachers([]);
      setTeachersRequiringImprovement([]);
    } finally {
      setLoading(false);
    }
  };

  // Fixed: Properly handle the async function in useEffect
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isMounted) return;
      await fetchData();
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [teacherId]);

  return {
    teacherPerformanceTrend,
    teacherPerformanceRanking,
    evaluationCriteriaBreakdown,
    ratingDistribution,
    topPerformingTeachers,
    teachersRequiringImprovement,
    loading,
    error,
    refetch: fetchData,
  };
};
