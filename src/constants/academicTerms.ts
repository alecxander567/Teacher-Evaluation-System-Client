// src/constants/academicTerms.ts
export const SEMESTERS = [
  "First Semester",
  "Second Semester",
  "Summer",
] as const;
export type Semester = (typeof SEMESTERS)[number];
