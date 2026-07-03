// src/types/assignment.types.ts

export interface Assignment {
  id: number;
  teacherId: number;
  teacherName?: string;
  subjectId: number;
  subjectCode?: string;
  subjectName?: string;
  academicYear: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentDetail extends Assignment {
  teacherEmail?: string;
  subjectDescription?: string;
}

export interface AssignmentRequest {
  teacherId: number;
  subjectId: number;
  academicYear: string;
  semester: string;
}

export interface AssignmentResponse {
  id: number;
  teacherId: number;
  teacherName?: string;
  subjectId: number;
  subjectCode?: string;
  subjectName?: string;
  academicYear: string;
  semester: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentFilters {
  teacherId?: number;
  subjectId?: number;
  academicYear?: string;
  semester?: string;
}
