// src/types/subject.types.ts

export interface Subject {
  id: number;
  departmentId: number | null;
  departmentName?: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectDetail extends Subject {
  teacherCount: number;
}

export interface SubjectRequest {
  departmentId: number | null;
  subjectCode: string;
  subjectName: string;
  description: string;
}

export interface SubjectResponse {
  id: number;
  departmentId: number | null;
  departmentName?: string;
  subjectCode: string;
  subjectName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectSearchParams {
  searchTerm?: string;
  departmentId?: number;
}
