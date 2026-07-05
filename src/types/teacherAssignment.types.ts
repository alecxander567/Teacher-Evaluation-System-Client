export interface TeacherAssignment {
  id: number;
  teacherId: number;
  teacherName: string;
  subjectId: number;
  subjectName: string;
  academicYear: string;
  semester: string;
}

export interface TeacherAssignmentRequest {
  teacherId: number;
  subjectId: number;
  academicYear: string;
  semester: string;
}
