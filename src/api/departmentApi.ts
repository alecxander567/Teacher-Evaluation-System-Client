// src/api/departmentApi.ts

import axios from "axios";
// Use type-only import for DepartmentRequest
import type { DepartmentRequest } from "../types/department.types";

// Use Vite's import.meta.env instead of process.env
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const departmentApi = {
  // Get all departments
  getAll: async () => {
    const response = await apiClient.get("/departments");
    return response.data;
  },

  // Get department by ID
  getById: async (id: number) => {
    const response = await apiClient.get(`/departments/${id}`);
    return response.data;
  },

  // Get department details with teachers
  getDetail: async (id: number) => {
    const response = await apiClient.get(`/departments/${id}/details`);
    return response.data;
  },

  // Create department
  create: async (data: DepartmentRequest) => {
    const response = await apiClient.post("/departments", data);
    return response.data;
  },

  // Update department
  update: async (id: number, data: DepartmentRequest) => {
    const response = await apiClient.put(`/departments/${id}`, data);
    return response.data;
  },

  // Delete department
  delete: async (id: number) => {
    const response = await apiClient.delete(`/departments/${id}`);
    return response.data;
  },

  // Search departments
  search: async (term: string) => {
    const response = await apiClient.get(`/departments/search?term=${term}`);
    return response.data;
  },

  // Get departments with teachers
  getWithTeachers: async () => {
    const response = await apiClient.get("/departments/with-teachers");
    return response.data;
  },

  // Get departments without teachers
  getWithoutTeachers: async () => {
    const response = await apiClient.get("/departments/without-teachers");
    return response.data;
  },

  // Get teacher count by department
  getTeacherCount: async (id: number) => {
    const response = await apiClient.get(`/departments/${id}/teacher-count`);
    return response.data;
  },

  // Check if department exists
  exists: async (id: number) => {
    const response = await apiClient.get(`/departments/${id}/exists`);
    return response.data;
  },

  // Check if department name exists
  existsByName: async (name: string) => {
    const response = await apiClient.get(
      `/departments/exists?name=${encodeURIComponent(name)}`,
    );
    return response.data;
  },
};
