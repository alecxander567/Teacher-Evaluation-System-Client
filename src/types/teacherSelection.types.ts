// src/types/teacherSelection.types.ts

export interface TeacherSelection {
  teacherId: number;
  firstName: string;
  lastName: string;
  fullName: string;
  employmentType: string;
  departmentId: number | null;
  departmentName: string | null;
  teacherAssignmentId: number; // resolved server-side, used silently on submit
  hasMultipleAssignments: boolean;
}

export interface TeacherEvaluationStatus {
  teacherId: number;
  teacherAssignmentId: number;
  teacherName: string;
  evaluated: boolean;
  submissionId: number | null;
}

export interface BatchStatusRequest {
  evaluationPeriodId: number;
  studentEmail: string;
  teacherAssignmentIds: number[];
}
