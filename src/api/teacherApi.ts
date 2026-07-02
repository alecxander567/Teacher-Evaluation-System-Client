// src/api/teacherApi.ts
import axios from "axios";
import type {
  TeacherRequest,
  TeacherResponse,
} from "../types/teacher";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

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