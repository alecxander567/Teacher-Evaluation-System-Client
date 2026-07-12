// src/services/aiSummaryService.ts
import { GoogleGenAI } from "@google/genai";

// Initialize the Google AI with your API key
// For Vite, use import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY || "";

// Only initialize if we have an API key
let ai: GoogleGenAI | null = null;
try {
  if (API_KEY && API_KEY !== "your-google-ai-api-key-here") {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (error) {
  console.error("Failed to initialize Google GenAI client:", error);
}

// Current, supported model names (newest first). If Google retires one of
// these, swap in whatever ai.google.dev/gemini-api/docs/models currently
// lists — do NOT reuse gemini-pro / gemini-1.0-* / gemini-1.5-*, they're gone.
const MODEL_CANDIDATES = ["gemini-2.5-flash", "gemini-2.5-pro"];

// Export the interface
export interface AnalyticsSummaryData {
  teacherPerformance: {
    totalTeachers: number;
    topPerformer: string;
    averageRating: number;
    needsImprovement: number;
    topPerformingTeachers: Array<{ name: string; rating: number }>;
    teachersRequiringImprovement: Array<{ name: string; rating: number }>;
  };
  departmentPerformance: {
    totalDepartments: number;
    bestDepartment: string;
    averageScore: number;
    departments: Array<{ name: string; rating: number; teacherCount: number }>;
  };
  evaluationMetrics: {
    totalResponses: number;
    averageScore: number;
    completionRate: number;
    periods: Array<{ period: string; responses: number; score: number }>;
  };
  teacherDetails?: {
    name: string;
    overallRating: number;
    totalEvaluations: number;
    criteriaBreakdown: Array<{ criteria: string; rating: number }>;
    ratingDistribution: Array<{ rating: string; count: number }>;
    performanceTrend: Array<{ period: string; rating: number }>;
  };
}

export class AISummaryService {
  private isInitialized: boolean = false;
  private errorMessage: string | null = null;
  // Remembers the first model that actually worked, so later calls skip
  // straight to it instead of re-probing every candidate each time.
  private workingModel: string | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    if (!API_KEY || API_KEY === "your-google-ai-api-key-here") {
      this.errorMessage =
        "Google AI API key is not configured. Please add VITE_GOOGLE_AI_API_KEY to your .env file.";
      console.warn(this.errorMessage);
      this.isInitialized = false;
      return;
    }

    if (!ai) {
      this.errorMessage =
        "Failed to initialize Google GenAI client. Please check your API key.";
      console.error(this.errorMessage);
      this.isInitialized = false;
      return;
    }

    this.isInitialized = true;
    this.errorMessage = null;
  }

  private checkInitialization() {
    if (!this.isInitialized || !ai) {
      throw new Error(
        this.errorMessage ||
          "AI service is not initialized. Please check your API key.",
      );
    }
  }

  // Actually calls the API — this is where a bad/retired model name shows
  // up (unlike the old getGenerativeModel(), which never failed here).
  private async generateWithFallback(prompt: string): Promise<string> {
    this.checkInitialization();

    const candidates =
      this.workingModel ?
        [
          this.workingModel,
          ...MODEL_CANDIDATES.filter((m) => m !== this.workingModel),
        ]
      : MODEL_CANDIDATES;

    let lastError: unknown = null;

    for (const modelName of candidates) {
      try {
        const response = await ai!.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        this.workingModel = modelName;
        return response.text ?? "";
      } catch (err) {
        console.warn(`Model "${modelName}" failed:`, err);
        lastError = err;
      }
    }

    const message =
      lastError instanceof Error ? lastError.message : String(lastError);
    if (message.includes("404")) {
      throw new Error(
        "Model not found. All configured model names were rejected — check " +
          "https://ai.google.dev/gemini-api/docs/models for current model IDs " +
          "and update MODEL_CANDIDATES.",
      );
    }
    if (
      message.includes("401") ||
      message.includes("403") ||
      message.includes("UNAUTHENTICATED")
    ) {
      throw new Error(
        "Authentication failed. Check that VITE_GOOGLE_AI_API_KEY is a valid, " +
          "unrestricted Gemini API key from https://aistudio.google.com/apikey.",
      );
    }
    throw new Error("Failed to generate AI summary: " + message);
  }

  async generateAnalyticsSummary(data: AnalyticsSummaryData): Promise<string> {
    const prompt = this.buildAnalyticsPrompt(data);
    return this.generateWithFallback(prompt);
  }

  async generateTeacherSummary(data: AnalyticsSummaryData): Promise<string> {
    const prompt = this.buildTeacherPrompt(data);
    return this.generateWithFallback(prompt);
  }

  async generateDepartmentSummary(data: AnalyticsSummaryData): Promise<string> {
    const prompt = this.buildDepartmentPrompt(data);
    return this.generateWithFallback(prompt);
  }

  // SHORTER PROMPTS - More concise summaries
  private buildAnalyticsPrompt(data: AnalyticsSummaryData): string {
    return `
      You are an educational analytics expert. Provide a concise summary of this data.

      DATA:
      - ${data.teacherPerformance.totalTeachers} teachers, avg rating ${(data.teacherPerformance.averageRating || 0).toFixed(2)}/5.0
      - Top: ${data.teacherPerformance.topPerformer || "N/A"}, Needs improvement: ${data.teacherPerformance.needsImprovement || 0}
      - ${data.departmentPerformance.totalDepartments} departments, avg ${(data.departmentPerformance.averageScore || 0).toFixed(2)}/5.0
      - Best dept: ${data.departmentPerformance.bestDepartment || "N/A"}
      - ${data.evaluationMetrics.totalResponses} responses, ${(data.evaluationMetrics.completionRate || 0).toFixed(1)}% completion

      Write a short summary (3-5 sentences) with key insights and 2-3 recommendations.
      Format: Use clear section headers like "Summary:", "Key Insights:", "Recommendations:".
    `;
  }

  private buildTeacherPrompt(data: AnalyticsSummaryData): string {
    if (!data.teacherDetails) {
      return "No teacher data available for analysis.";
    }

    const teacher = data.teacherDetails;

    return `
      You are an educational analytics expert. Provide a concise summary for this teacher.

      TEACHER: ${teacher.name || "Unknown"}
      RATING: ${(teacher.overallRating || 0).toFixed(2)}/5.0 from ${teacher.totalEvaluations} evaluations
      STRENGTHS: ${
        teacher.criteriaBreakdown
          ?.filter((c) => c.rating >= 4)
          .map((c) => c.criteria)
          .join(", ") || "None"
      }
      AREAS TO IMPROVE: ${
        teacher.criteriaBreakdown
          ?.filter((c) => c.rating < 3.5)
          .map((c) => c.criteria)
          .join(", ") || "None"
      }

      Write a brief summary (3-5 sentences) and 2-3 specific recommendations.
      Format: Use clear section headers like "Summary:", "Strengths:", "Areas to Improve:", "Recommendations:".
    `;
  }

  private buildDepartmentPrompt(data: AnalyticsSummaryData): string {
    return `
      You are an educational analytics expert. Provide a concise department summary.

      DEPARTMENTS:
      ${
        data.departmentPerformance.departments
          ?.map(
            (d) =>
              `- ${d.name}: ${(d.rating || 0).toFixed(2)}/5.0 (${d.teacherCount} teachers)`,
          )
          .join("\n") || "No data"
      }

      Best: ${data.departmentPerformance.bestDepartment || "N/A"}
      Average: ${(data.departmentPerformance.averageScore || 0).toFixed(2)}/5.0

      Write a short summary (2-3 sentences) and 2-3 recommendations.
      Format: Use clear section headers like "Summary:", "Top Departments:", "Recommendations:".
    `;
  }
}

// Create and export the service instance
export const aiSummaryService = new AISummaryService();

// Also export a default for easier importing if needed
export default aiSummaryService;
