export interface EvaluationSubmission {
  id: number;
  evaluationPeriodId: number;
  teacherAssignmentId: number;
  evaluationLinkId?: number;
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
  evaluationLinkId?: number;
  studentEmail: string;
  overallComment?: string;
  responses: EvaluationResponseRequest[];
}
