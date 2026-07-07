// src/api/teacherApi.ts
import { api } from "./client";
import type { TeacherRequest, TeacherResponse } from "../types/teacher";

export const teacherApi = {
  // Get all teachers
  getAll: async (): Promise<TeacherResponse[]> => {
    const response = await api.get<TeacherResponse[]>("/teachers");
    return response.data;
  },

  // Get teacher by ID
  getById: async (id: number): Promise<TeacherResponse> => {
    const response = await api.get<TeacherResponse>(`/teachers/${id}`);
    return response.data;
  },

  // Get teachers by department
  getByDepartment: async (departmentId: number): Promise<TeacherResponse[]> => {
    const response = await api.get<TeacherResponse[]>(
      `/teachers/department/${departmentId}`,
    );
    return response.data;
  },

  // Create teacher
  create: async (data: TeacherRequest): Promise<TeacherResponse> => {
    const response = await api.post<TeacherResponse>("/teachers", data);
    return response.data;
  },

  // Update teacher
  update: async (
    id: number,
    data: TeacherRequest,
  ): Promise<TeacherResponse> => {
    const response = await api.put<TeacherResponse>(`/teachers/${id}`, data);
    return response.data;
  },

  // Delete teacher
  delete: async (id: number): Promise<void> => {
    await api.delete(`/teachers/${id}`);
  },

  // Search teachers
  search: async (term: string): Promise<TeacherResponse[]> => {
    const response = await api.get<TeacherResponse[]>(
      `/teachers/search?term=${term}`,
    );
    return response.data;
  },

  // Get teacher count by department
  getCountByDepartment: async (departmentId: number): Promise<number> => {
    const response = await api.get<number>(
      `/teachers/count/department/${departmentId}`,
    );
    return response.data;
  },

  // Check if teacher exists
  exists: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/teachers/${id}/exists`);
    return response.data;
  },
};
