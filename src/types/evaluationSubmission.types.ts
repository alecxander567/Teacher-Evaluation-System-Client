// src/types/evaluationSubmission.types.ts
export interface EvaluationResponse {
  id: number;
  submissionId: number;
  questionId: number;
  questionText?: string;
  rating: number;
  createdAt: string;
}

export interface EvaluationResponseRequest {
  questionId: number;
  rating: number;
}

export interface EvaluationSubmission {
  id: number;
  evaluationPeriodId: number;
  teacherAssignmentId: number;
  studentEmail: string;
  overallComment?: string;
  submittedAt: string;
  evaluationPeriodTitle?: string;
  teacherName?: string;
  subjectName?: string;
  totalQuestions?: number;
  answeredQuestions?: number;
  averageRating?: number;
  responses?: EvaluationResponse[];
}

export interface EvaluationSubmissionRequest {
  evaluationPeriodId: number;
  teacherAssignmentId: number;
  studentEmail: string;
  overallComment?: string;
  responses: EvaluationResponseRequest[];
}
