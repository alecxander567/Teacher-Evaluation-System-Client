// src/api/teacherAssignmentApi.ts
import axios from "axios";
import type {
  TeacherAssignment,
  TeacherAssignmentRequest,
} from "../types/teacherAssignment.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const teacherAssignmentApi = {
  // Add this method - it was missing
  getAllAssignments: async (): Promise<TeacherAssignment[]> => {
    const response = await api.get("/teacher-assignments");
    return response.data;
  },

  createAssignment: async (
    data: TeacherAssignmentRequest,
  ): Promise<TeacherAssignment> => {
    const response = await api.post("/teacher-assignments", data);
    return response.data;
  },

  getAssignmentsByTeacherId: async (
    teacherId: number,
  ): Promise<TeacherAssignment[]> => {
    const response = await api.get(`/teacher-assignments/teacher/${teacherId}`);
    return response.data;
  },

  getAssignmentsBySubjectId: async (
    subjectId: number,
  ): Promise<TeacherAssignment[]> => {
    const response = await api.get(`/teacher-assignments/subject/${subjectId}`);
    return response.data;
  },

  getAssignmentsByAcademicYearAndSemester: async (
    academicYear: string,
    semester: string,
  ): Promise<TeacherAssignment[]> => {
    const response = await api.get(
      `/teacher-assignments/filter?academicYear=${academicYear}&semester=${semester}`,
    );
    return response.data;
  },

  getAssignmentById: async (id: number): Promise<TeacherAssignment> => {
    const response = await api.get(`/teacher-assignments/${id}`);
    return response.data;
  },

  updateAssignment: async (
    id: number,
    data: TeacherAssignmentRequest,
  ): Promise<TeacherAssignment> => {
    const response = await api.put(`/teacher-assignments/${id}`, data);
    return response.data;
  },

  deleteAssignment: async (id: number): Promise<void> => {
    await api.delete(`/teacher-assignments/${id}`);
  },

  checkAssignmentExists: async (id: number): Promise<boolean> => {
    const response = await api.get(`/teacher-assignments/${id}/exists`);
    return response.data;
  },
};
