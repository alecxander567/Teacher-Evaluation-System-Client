// src/types/department.types.ts

export interface Department {
  id: number;
  name: string;
  description: string;
  teacherCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentDetail extends Department {
  teachers: Teacher[];
}

export interface DepartmentRequest {
  name: string;
  description: string;
}

export interface DepartmentResponse {
  id: number;
  name: string;
  description: string;
  teacherCount: number;
  createdAt: string;
  updatedAt: string;
}

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
