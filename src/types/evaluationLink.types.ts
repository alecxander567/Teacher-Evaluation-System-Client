export interface EvaluationLink {
  id: number;
  token: string;
  fullLink: string;
  evaluationFormId: number;
  evaluationFormTitle: string;
  evaluationPeriodTitle: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  submissionCount: number;
}

export interface EvaluationLinkRequest {
  evaluationFormId: number;
}
