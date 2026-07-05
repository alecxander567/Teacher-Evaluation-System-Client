// src/types/evaluationCategory.types.ts
export interface EvaluationCategory {
  id: number;
  formId: number;
  name: string;
  description: string;
  displayOrder: number;
  questionCount: number;
  createdAt: string;
  updatedAt: string;
  questions?: EvaluationQuestion[];
}

export interface EvaluationCategoryRequest {
  formId: number;
  name: string;
  description?: string;
  displayOrder?: number;
  questions?: EvaluationQuestionRequest[];
}

export interface EvaluationQuestion {
  id: number;
  categoryId: number;
  question: string;
  displayOrder: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationQuestionRequest {
  categoryId: number;
  question: string;
  displayOrder?: number;
  isRequired?: boolean;
}

export interface EvaluationFormDetail {
  id: number;
  evaluationPeriodId: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  evaluationPeriodTitle: string;
  evaluationPeriodStatus: string;
  isPeriodActive: boolean;
  totalQuestions: number;
  totalResponses: number;
  categories: EvaluationCategory[];
}
