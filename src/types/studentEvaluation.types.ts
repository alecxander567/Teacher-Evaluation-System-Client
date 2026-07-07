// src/types/studentEvaluation.types.ts

export interface TeacherSelection {
  teacherId: number;
  fullName: string;
  email: string;
  position: string;
  employmentType: string;
  departmentName: string;
  departmentId: number;
  subjectName: string;
  subjectId: number;
  teacherAssignmentId: number;
  selected: boolean;
}

export interface DepartmentTeacherGroup {
  departmentId: number;
  departmentName: string;
  teachers: TeacherSelection[];
}

export interface StudentEvaluationSession {
  sessionId: string;
  studentEmail: string;
  studentName?: string;
  evaluationPeriodId: number;
  evaluationPeriodTitle?: string;
  evaluationFormId: number;
  evaluationFormTitle?: string;
  selectedTeacherAssignmentIds: number[];
  currentIndex: number;
  currentTeacherAssignmentId?: number;
  totalTeachers: number;
  completedCount: number;
  status: "SELECTING" | "IN_PROGRESS" | "COMPLETED";
}

export interface TeacherEvaluationProgress {
  teacherAssignmentId?: number;
  teacherName?: string;
  subjectName?: string;
  evaluated: boolean;
  currentIndex: number;
  totalCount: number;
}

export interface StartEvaluationSessionRequest {
  evaluationPeriodId: number;
  evaluationFormId: number;
  studentEmail: string;
  studentName?: string;
  teacherAssignmentIds: number[];
}
