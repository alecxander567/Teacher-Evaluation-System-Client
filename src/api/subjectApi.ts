// src/api/subjectApi.ts
import axios from "axios";
import type { SubjectRequest, SubjectResponse } from "../types/subject.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

export const subjectApi = {
  // Get all subjects
  getAll: async (): Promise<SubjectResponse[]> => {
    const response = await api.get<SubjectResponse[]>("/subjects");
    return response.data;
  },

  // Get subject by ID
  getById: async (id: number): Promise<SubjectResponse> => {
    const response = await api.get<SubjectResponse>(`/subjects/${id}`);
    return response.data;
  },

  // Get subject details with department info
  getDetail: async (id: number): Promise<SubjectResponse> => {
    const response = await api.get<SubjectResponse>(`/subjects/${id}/details`);
    return response.data;
  },

  // Get subjects by department
  getByDepartment: async (departmentId: number): Promise<SubjectResponse[]> => {
    const response = await api.get<SubjectResponse[]>(
      `/subjects/department/${departmentId}`,
    );
    return response.data;
  },

  // Create subject
  create: async (data: SubjectRequest): Promise<SubjectResponse> => {
    const response = await api.post<SubjectResponse>("/subjects", data);
    return response.data;
  },

  // Update subject
  update: async (
    id: number,
    data: SubjectRequest,
  ): Promise<SubjectResponse> => {
    const response = await api.put<SubjectResponse>(`/subjects/${id}`, data);
    return response.data;
  },

  // Delete subject
  delete: async (id: number): Promise<void> => {
    await api.delete(`/subjects/${id}`);
  },

  // Search subjects by code or name
  search: async (term: string): Promise<SubjectResponse[]> => {
    const response = await api.get<SubjectResponse[]>(
      `/subjects/search?term=${term}`,
    );
    return response.data;
  },

  // Get subject count by department
  getCountByDepartment: async (departmentId: number): Promise<number> => {
    const response = await api.get<number>(
      `/subjects/count/department/${departmentId}`,
    );
    return response.data;
  },

  // Check if subject exists
  exists: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/subjects/${id}/exists`);
    return response.data;
  },

  // Check if subject code exists
  existsByCode: async (code: string): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/subjects/exists?code=${encodeURIComponent(code)}`,
    );
    return response.data;
  },
};
