// src/services/evaluationAnalyticsService.ts
import type {
  EvaluationPeriodComparison,
  TotalResponsesPerPeriodItem,
  CompletionRatePerPeriodItem,
  EvaluationActivityOverTimeItem,
} from "../hooks/useEvaluationAnalytics";

const API_BASE_URL = import.meta.env.VITE_ANALYTICS_API_BASE_URL;

if (!API_BASE_URL) {
  throw new Error(
    "VITE_ANALYTICS_API_BASE_URL is not set. Add it to your .env file (see .env.example).",
  );
}

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const EvaluationAnalyticsService = {
  getEvaluationPeriodsComparison: async (): Promise<
    EvaluationPeriodComparison[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/evaluation-periods-comparison`,
      { headers: authHeaders() },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch evaluation periods comparison: ${response.status}`,
      );
    }
    return response.json();
  },

  getTotalResponsesPerPeriod: async (): Promise<
    TotalResponsesPerPeriodItem[]
  > => {
    const response = await fetch(`${API_BASE_URL}/total-responses-per-period`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch total responses per period: ${response.status}`,
      );
    }
    return response.json();
  },

  getCompletionRatePerPeriod: async (): Promise<
    CompletionRatePerPeriodItem[]
  > => {
    const response = await fetch(`${API_BASE_URL}/completion-rate-per-period`, {
      headers: authHeaders(),
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch completion rate per period: ${response.status}`,
      );
    }
    return response.json();
  },

  getEvaluationActivityOverTime: async (): Promise<
    EvaluationActivityOverTimeItem[]
  > => {
    const response = await fetch(
      `${API_BASE_URL}/evaluation-activity-over-time`,
      { headers: authHeaders() },
    );
    if (!response.ok) {
      throw new Error(
        `Failed to fetch evaluation activity over time: ${response.status}`,
      );
    }
    return response.json();
  },
};
