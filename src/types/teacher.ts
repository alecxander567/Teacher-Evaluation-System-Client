// src/types/teacher.ts

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACTUAL";

export interface Teacher {
  id: number;
  departmentId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  position: string;
  employmentType: EmploymentType | null;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherRequest {
  departmentId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  position: string;
  employmentType: EmploymentType | null;
}

export interface TeacherResponse {
  id: number;
  departmentId: number | null;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  position: string;
  employmentType: EmploymentType | null;
  createdAt: string;
  updatedAt: string;
}
