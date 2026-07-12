// src/hooks/useEvaluationAnalytics.ts
import { useState, useEffect } from "react";
import { EvaluationAnalyticsService } from "../services/evaluationAnalyticsService";

export interface EvaluationPeriodComparison {
  academic_year: string;
  avg_rating: number;
  period: string;
  period_id: number;
  semester: string;
}

export interface TotalResponsesPerPeriodItem {
  period: string;
  period_id: number;
  total_submissions: number;
}

export interface CompletionRatePerPeriodItem {
  completion_rate: number;
  period: string;
  period_id: number;
  total_links: number;
  total_submitted: number;
}

export interface EvaluationActivityOverTimeItem {
  submission_date: string;
  total_submissions: number;
}

export const useEvaluationAnalytics = () => {
  const [periodsComparison, setPeriodsComparison] = useState<
    EvaluationPeriodComparison[]
  >([]);
  const [totalResponsesPerPeriod, setTotalResponsesPerPeriod] = useState<
    TotalResponsesPerPeriodItem[]
  >([]);
  const [completionRatePerPeriod, setCompletionRatePerPeriod] = useState<
    CompletionRatePerPeriodItem[]
  >([]);
  const [activityOverTime, setActivityOverTime] = useState<
    EvaluationActivityOverTimeItem[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [comparison, totalResponses, completionRate, activity] =
          await Promise.all([
            EvaluationAnalyticsService.getEvaluationPeriodsComparison(),
            EvaluationAnalyticsService.getTotalResponsesPerPeriod(),
            EvaluationAnalyticsService.getCompletionRatePerPeriod(),
            EvaluationAnalyticsService.getEvaluationActivityOverTime(),
          ]);

        setPeriodsComparison(comparison);
        setTotalResponsesPerPeriod(totalResponses);
        setCompletionRatePerPeriod(completionRate);
        setActivityOverTime(activity);
      } catch (err) {
        setError(
          err instanceof Error ?
            err.message
          : "Failed to fetch evaluation analytics",
        );
        console.error("Error fetching evaluation analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    periodsComparison,
    totalResponsesPerPeriod,
    completionRatePerPeriod,
    activityOverTime,
    loading,
    error,
  };
};
