// src/api/teacherSelectionApi.ts
import { api } from "./client";
import type { TeacherSelection } from "../types/teacherSelection.types";

export const teacherSelectionApi = {
  getSelectionList: async (
    academicYear: string,
    semester: string,
    departmentId?: number,
  ): Promise<TeacherSelection[]> => {
    const params = new URLSearchParams({ academicYear, semester });
    if (departmentId) params.append("departmentId", String(departmentId));
    const response = await api.get(
      `/teacher-assignments/selection?${params.toString()}`,
    );
    return response.data;
  },
};
