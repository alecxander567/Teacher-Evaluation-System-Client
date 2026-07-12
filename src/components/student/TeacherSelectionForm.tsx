// src/components/student/TeacherSelectionForm.tsx
import React, { useState } from "react";
import {
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiBookOpen,
  FiInfo,
  FiUsers,
} from "react-icons/fi";
import { LoadingSpinner } from "../LoadingSpinner";
import type { DepartmentTeacherGroup } from "../../types/studentEvaluation.types";

interface TeacherSelectionFormProps {
  teacherGroups: DepartmentTeacherGroup[];
  loading: boolean;
  error: string | null;
  onSubmit: (selectedIds: number[]) => void;
  studentEmail: string;
  onEmailChange: (email: string) => void;
}

export const TeacherSelectionForm: React.FC<TeacherSelectionFormProps> = ({
  teacherGroups,
  loading,
  error,
  onSubmit,
  studentEmail,
  onEmailChange,
}) => {
  const [selectedTeachers, setSelectedTeachers] = useState<Set<number>>(
    new Set(),
  );
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Render-time adjustment: recompute auto-selected teachers whenever
  // teacherGroups changes, instead of syncing via useEffect.
  const [prevTeacherGroups, setPrevTeacherGroups] = useState(teacherGroups);
  if (teacherGroups !== prevTeacherGroups) {
    setPrevTeacherGroups(teacherGroups);

    const autoSelected = new Set<number>();
    teacherGroups.forEach((group) => {
      group.teachers.forEach((teacher) => {
        if (teacher.selected) {
          autoSelected.add(teacher.teacherAssignmentId);
        }
      });
    });
    setSelectedTeachers(autoSelected);
  }

  const handleToggleTeacher = (teacherAssignmentId: number) => {
    setSelectedTeachers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(teacherAssignmentId)) {
        newSet.delete(teacherAssignmentId);
      } else {
        newSet.add(teacherAssignmentId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (teachers: DepartmentTeacherGroup["teachers"]) => {
    const allIds = teachers.map((t) => t.teacherAssignmentId);
    const allSelected = allIds.every((id) => selectedTeachers.has(id));

    setSelectedTeachers((prev) => {
      const newSet = new Set(prev);
      if (allSelected) {
        allIds.forEach((id) => newSet.delete(id));
      } else {
        allIds.forEach((id) => newSet.add(id));
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    if (!studentEmail || !studentEmail.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(null);

    if (selectedTeachers.size === 0) {
      setEmailError("Please select at least one teacher to evaluate");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(Array.from(selectedTeachers));
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalTeachers = teacherGroups.reduce(
    (sum, group) => sum + group.teachers.length,
    0,
  );

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner label="Loading teachers..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#EBF0FE] rounded-xl border border-[#3D6BFF]/20 p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-[#3D6BFF]/10 flex items-center justify-center flex-shrink-0">
            <FiInfo className="h-5 w-5 text-[#3D6BFF]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#101625]">
              Select Teachers to Evaluate
            </p>
            <p className="text-sm text-[#5A6478] mt-1">
              You can select multiple teachers to evaluate. Each teacher will be
              evaluated one at a time.
              {totalTeachers > 0 &&
                ` ${totalTeachers} teacher${totalTeachers > 1 ? "s" : ""} available.`}
            </p>
          </div>
        </div>
      </div>

      {/* Student Email */}
      <div>
        <label className="block text-sm font-medium text-[#101625] mb-1.5">
          Your Email <span className="text-[#E53935]">*</span>
        </label>
        <input
          type="email"
          value={studentEmail}
          onChange={(e) => {
            onEmailChange(e.target.value);
            setEmailError(null);
          }}
          required
          placeholder="you@student.edu"
          className="w-full px-4 py-2.5 border border-[#E4E8F0] rounded-lg focus:ring-2 focus:ring-[#3D6BFF]/20 focus:border-[#3D6BFF] outline-none transition-colors bg-[#FBFCFE] text-[#101625] placeholder-[#8E97AE]"
        />
        {(emailError || error) && (
          <p className="mt-1 text-sm text-[#E53935] flex items-center gap-1">
            <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
            {emailError || error}
          </p>
        )}
        <p className="mt-1 text-xs text-[#5A6478]">
          This email will be used to identify your evaluations
        </p>
      </div>

      {/* Teachers List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[#5A6478]">
            <span className="font-medium text-[#101625]">
              {selectedTeachers.size}
            </span>{" "}
            teacher{selectedTeachers.size > 1 ? "s" : ""} selected
          </p>
          {teacherGroups.length > 0 && (
            <span className="text-xs text-[#5A6478]">
              {totalTeachers} total available
            </span>
          )}
        </div>

        {teacherGroups.length === 0 ?
          <div className="text-center py-12 bg-[#FBFCFE] rounded-xl border border-[#E4E8F0]">
            <FiUsers className="h-12 w-12 text-[#8E97AE] mx-auto mb-3" />
            <p className="text-sm font-medium text-[#101625]">
              No teachers available
            </p>
            <p className="text-sm text-[#5A6478] mt-1">
              No teachers are currently available for evaluation.
            </p>
          </div>
        : <div className="space-y-4">
            {teacherGroups.map((group) => (
              <div
                key={group.departmentId}
                className="border border-[#E4E8F0] rounded-xl overflow-hidden bg-[#FBFCFE]">
                <div className="bg-[#F4F6FA] px-5 py-3 border-b border-[#E4E8F0] flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[#101625]">
                    {group.departmentName}
                    <span className="ml-2 text-xs text-[#5A6478] font-normal">
                      ({group.teachers.length} teacher
                      {group.teachers.length > 1 ? "s" : ""})
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(group.teachers)}
                    className="text-xs font-medium text-[#3D6BFF] hover:text-[#101625] transition-colors">
                    {(
                      group.teachers.every((t) =>
                        selectedTeachers.has(t.teacherAssignmentId),
                      )
                    ) ?
                      "Deselect All"
                    : "Select All"}
                  </button>
                </div>
                <div className="divide-y divide-[#E4E8F0]">
                  {group.teachers.map((teacher) => {
                    const isSelected = selectedTeachers.has(
                      teacher.teacherAssignmentId,
                    );
                    return (
                      <div
                        key={teacher.teacherAssignmentId}
                        className={`px-5 py-3.5 flex items-start gap-4 cursor-pointer transition-colors ${
                          isSelected ?
                            "bg-[#EBF0FE] hover:bg-[#E4E8F0]"
                          : "hover:bg-[#F4F6FA]"
                        }`}
                        onClick={() =>
                          handleToggleTeacher(teacher.teacherAssignmentId)
                        }>
                        <div className="flex-shrink-0 pt-0.5">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ?
                                "bg-[#3D6BFF] border-[#3D6BFF]"
                              : "border-[#5A6478]"
                            }`}>
                            {isSelected && (
                              <FiCheck className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-[#101625]">
                              {teacher.fullName}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#EBF0FE] text-[#3D6BFF]">
                              {teacher.employmentType}
                            </span>
                            {teacher.position && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#F4F6FA] text-[#5A6478]">
                                {teacher.position}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-[#5A6478] flex-wrap">
                            <span className="flex items-center gap-1">
                              <FiBookOpen className="h-3 w-3 flex-shrink-0" />
                              {teacher.subjectName || "No subject assigned"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiUser className="h-3 w-3 flex-shrink-0" />
                              {teacher.email}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        }
      </div>

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E4E8F0]">
        <p className="text-sm text-[#5A6478] order-2 sm:order-1">
          <span className="font-medium text-[#101625]">
            {selectedTeachers.size}
          </span>{" "}
          teacher{selectedTeachers.size > 1 ? "s" : ""} selected for evaluation
        </p>
        <button
          type="submit"
          disabled={isSubmitting || selectedTeachers.size === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#3D6BFF] text-white rounded-lg hover:bg-[#2A5AF0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium order-1 sm:order-2 w-full sm:w-auto justify-center">
          {isSubmitting ?
            <>
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Starting...
            </>
          : <>
              Start Evaluation
              <FiCheck className="h-4 w-4" />
            </>
          }
        </button>
      </div>
    </form>
  );
};
