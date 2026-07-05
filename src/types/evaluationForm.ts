// src/types/evaluationForm.ts
import type { EvaluationCategory } from "./evaluationCategory.types";

export interface EvaluationForm {
  id: number;
  evaluationPeriodId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationFormDetail extends EvaluationForm {
  evaluationPeriodTitle: string;
  evaluationPeriodStatus: string;
  isPeriodActive: boolean;
  totalQuestions: number;
  totalResponses: number;
  categories: EvaluationCategory[];
}

export interface EvaluationFormRequest {
  evaluationPeriodId: number;
  title: string;
  description: string;
}

export interface EvaluationPeriod {
  id: number;
  title: string;
  academicYear: string;
  semester: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
