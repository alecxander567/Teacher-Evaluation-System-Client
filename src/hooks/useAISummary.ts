// src/hooks/useAISummary.ts
import { useState, useCallback } from "react";
import { aiSummaryService } from "../services/aiSummaryService";
import type { AnalyticsSummaryData } from "../services/aiSummaryService";

export const useAISummary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>("");

  const generateSummary = useCallback(
    async (
      data: AnalyticsSummaryData,
      type: "overall" | "teacher" | "department" = "overall",
    ) => {
      try {
        setLoading(true);
        setError(null);

        let result = "";
        switch (type) {
          case "teacher":
            result = await aiSummaryService.generateTeacherSummary(data);
            break;
          case "department":
            result = await aiSummaryService.generateDepartmentSummary(data);
            break;
          default:
            result = await aiSummaryService.generateAnalyticsSummary(data);
        }

        setSummary(result);
        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to generate summary";
        setError(errorMessage);
        throw new Error(errorMessage, { cause: err });
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const clearSummary = useCallback(() => {
    setSummary("");
    setError(null);
  }, []);

  return {
    summary,
    loading,
    error,
    generateSummary,
    clearSummary,
  };
};
