// src/api/assignmentApi.ts
import { api } from "./client";
import type {
  AssignmentRequest,
  AssignmentResponse,
  AssignmentFilters,
} from "../types/assignment.types";

export const assignmentApi = {
  // Create assignment
  create: async (data: AssignmentRequest): Promise<AssignmentResponse> => {
    const response = await api.post<AssignmentResponse>("/assignments", data);
    return response.data;
  },

  // Get all assignments with filters
  getAll: async (
    filters?: AssignmentFilters,
  ): Promise<AssignmentResponse[]> => {
    const params = new URLSearchParams();
    if (filters?.teacherId)
      params.append("teacherId", filters.teacherId.toString());
    if (filters?.subjectId)
      params.append("subjectId", filters.subjectId.toString());
    if (filters?.academicYear)
      params.append("academicYear", filters.academicYear);
    if (filters?.semester) params.append("semester", filters.semester);

    const query = params.toString() ? `?${params.toString()}` : "";
    const response = await api.get<AssignmentResponse[]>(
      `/assignments${query}`,
    );
    return response.data;
  },

  // Get assignment by ID
  getById: async (id: number): Promise<AssignmentResponse> => {
    const response = await api.get<AssignmentResponse>(`/assignments/${id}`);
    return response.data;
  },

  // Get assignment details
  getDetail: async (id: number): Promise<AssignmentResponse> => {
    const response = await api.get<AssignmentResponse>(
      `/assignments/${id}/details`,
    );
    return response.data;
  },

  // Update assignment
  update: async (
    id: number,
    data: AssignmentRequest,
  ): Promise<AssignmentResponse> => {
    const response = await api.put<AssignmentResponse>(
      `/assignments/${id}`,
      data,
    );
    return response.data;
  },

  // Delete assignment
  delete: async (id: number): Promise<void> => {
    await api.delete(`/assignments/${id}`);
  },

  // Check if teacher is assigned to subject
  checkAssignment: async (
    teacherId: number,
    subjectId: number,
    academicYear: string,
    semester: string,
  ): Promise<boolean> => {
    const response = await api.get<boolean>(
      `/assignments/check?teacherId=${teacherId}&subjectId=${subjectId}&academicYear=${academicYear}&semester=${semester}`,
    );
    return response.data;
  },

  // Get assignment count by teacher
  getCountByTeacher: async (teacherId: number): Promise<number> => {
    const response = await api.get<number>(
      `/assignments/count/teacher/${teacherId}`,
    );
    return response.data;
  },

  // Get assignment count by subject
  getCountBySubject: async (subjectId: number): Promise<number> => {
    const response = await api.get<number>(
      `/assignments/count/subject/${subjectId}`,
    );
    return response.data;
  },

  // Check if assignment exists
  exists: async (id: number): Promise<boolean> => {
    const response = await api.get<boolean>(`/assignments/${id}/exists`);
    return response.data;
  },
};
