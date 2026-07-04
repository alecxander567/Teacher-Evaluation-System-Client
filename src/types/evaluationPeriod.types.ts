// src/types/evaluationPeriod.types.ts
export interface EvaluationPeriod {
  id: number;
  title: string;
  academicYear: string;
  semester: string;
  startDate: string; 
  endDate: string;
  status: "draft" | "active" | "closed" | "archived";
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationPeriodDetail extends EvaluationPeriod {
  daysRemaining: number;
  isActive: boolean;
  isUpcoming: boolean;
  isPast: boolean;
}

export interface EvaluationPeriodRequest {
  title: string;
  academicYear: string;
  semester: string;
  startDate: string;
  endDate: string;
  status?: "draft" | "active" | "closed" | "archived";
}

export interface EvaluationPeriodStatusUpdate {
  status: "draft" | "active" | "closed" | "archived";
}

export interface EvaluationPeriodStats {
  total: number;
  draft: number;
  active: number;
  closed: number;
  archived: number;
}

export interface EvaluationPeriodFilters {
  status?: string;
  academicYear?: string;
  semester?: string;
}
