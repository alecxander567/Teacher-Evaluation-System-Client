// src/types/teacher.ts
export interface Teacher {
  id: number;
  departmentId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherRequest {
  departmentId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
}

export interface TeacherResponse {
  id: number;
  departmentId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  position: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TeacherSearchParams {
  searchTerm?: string;
  departmentId?: number;
}
