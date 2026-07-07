// src/api/departmentApi.ts
import { api } from "./client";
import type { DepartmentRequest } from "../types/department.types";

export const departmentApi = {
  // Get all departments
  getAll: async () => {
    const response = await api.get("/departments");
    return response.data;
  },

  // Get department by ID
  getById: async (id: number) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  // Get department details with teachers
  getDetail: async (id: number) => {
    const response = await api.get(`/departments/${id}/details`);
    return response.data;
  },

  // Create department
  create: async (data: DepartmentRequest) => {
    const response = await api.post("/departments", data);
    return response.data;
  },

  // Update department
  update: async (id: number, data: DepartmentRequest) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data;
  },

  // Delete department
  delete: async (id: number) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },

  // Search departments
  search: async (term: string) => {
    const response = await api.get(`/departments/search?term=${term}`);
    return response.data;
  },

  // Get departments with teachers
  getWithTeachers: async () => {
    const response = await api.get("/departments/with-teachers");
    return response.data;
  },

  // Get departments without teachers
  getWithoutTeachers: async () => {
    const response = await api.get("/departments/without-teachers");
    return response.data;
  },

  // Get teacher count by department
  getTeacherCount: async (id: number) => {
    const response = await api.get(`/departments/${id}/teacher-count`);
    return response.data;
  },

  // Check if department exists
  exists: async (id: number) => {
    const response = await api.get(`/departments/${id}/exists`);
    return response.data;
  },

  // Check if department name exists
  existsByName: async (name: string) => {
    const response = await api.get(
      `/departments/exists?name=${encodeURIComponent(name)}`,
    );
    return response.data;
  },
};
