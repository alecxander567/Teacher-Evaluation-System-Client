// src/components/student/TeacherSelectionForm.tsx
import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiAlertCircle,
  FiUser,
  FiBookOpen,
  FiInfo,
} from "react-icons/fi";
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

  // Reset selections when teacher groups change
  useEffect(() => {
    // Auto-select teachers that are marked as selected in the data
    const autoSelected = new Set<number>();
    teacherGroups.forEach((group) => {
      group.teachers.forEach((teacher) => {
        if (teacher.selected) {
          autoSelected.add(teacher.teacherAssignmentId);
        }
      });
    });
    setSelectedTeachers(autoSelected);
  }, [teacherGroups]);

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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header Info */}
      <div className="bg-[#FBEEDC] rounded-lg p-4 border border-[#E8A23D]/30">
        <div className="flex items-start gap-3">
          <FiInfo className="h-5 w-5 text-[#B8791F] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[#101826] font-medium">
              Select Teachers to Evaluate
            </p>
            <p className="text-sm text-[#5B6472] mt-1">
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
        <label className="block text-sm font-medium text-[#101826] mb-1.5">
          Your Email *
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
          className="w-full px-4 py-2.5 border border-[#E4E1D9] rounded-lg focus:ring-2 focus:ring-[#E8A23D] focus:border-[#E8A23D] outline-none transition-colors bg-white text-[#101826]"
        />
        {(emailError || error) && (
          <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
            <FiAlertCircle className="h-4 w-4" />
            {emailError || error}
          </p>
        )}
        <p className="mt-1 text-xs text-[#5B6472]">
          This email will be used to identify your evaluations
        </p>
      </div>

      {/* Teachers List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm text-[#5B6472]">
            Select teachers to evaluate ({selectedTeachers.size} selected)
          </p>
        </div>

        {teacherGroups.length === 0 ?
          <div className="text-center py-12 bg-[#FAFAF6] rounded-lg border border-[#E4E1D9]">
            <p className="text-sm text-[#5B6472]">
              No teachers available for evaluation.
            </p>
          </div>
        : <div className="space-y-6">
            {teacherGroups.map((group) => (
              <div
                key={group.departmentId}
                className="border border-[#E4E1D9] rounded-lg overflow-hidden">
                <div className="bg-[#FAFAF6] px-4 py-3 border-b border-[#E4E1D9] flex items-center justify-between">
                  <h3 className="text-sm font-medium text-[#101826]">
                    {group.departmentName}
                    <span className="ml-2 text-xs text-[#5B6472] font-normal">
                      ({group.teachers.length} teacher
                      {group.teachers.length > 1 ? "s" : ""})
                    </span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(group.teachers)}
                    className="text-xs text-[#B8791F] hover:text-[#101826] transition-colors font-medium">
                    {(
                      group.teachers.every((t) =>
                        selectedTeachers.has(t.teacherAssignmentId),
                      )
                    ) ?
                      "Deselect All"
                    : "Select All"}
                  </button>
                </div>
                <div className="divide-y divide-[#E4E1D9]">
                  {group.teachers.map((teacher) => {
                    const isSelected = selectedTeachers.has(
                      teacher.teacherAssignmentId,
                    );
                    return (
                      <div
                        key={teacher.teacherAssignmentId}
                        className={`px-4 py-3 flex items-start gap-4 cursor-pointer transition-colors ${
                          isSelected ? "bg-[#FBEEDC]" : "hover:bg-[#FAFAF6]"
                        }`}
                        onClick={() =>
                          handleToggleTeacher(teacher.teacherAssignmentId)
                        }>
                        <div className="flex-shrink-0 pt-0.5">
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected ?
                                "bg-[#101826] border-[#101826]"
                              : "border-[#5B6472]"
                            }`}>
                            {isSelected && (
                              <FiCheck className="h-3.5 w-3.5 text-white" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-[#101826]">
                              {teacher.fullName}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-[#E4E1D9] text-[#5B6472]">
                              {teacher.employmentType}
                            </span>
                            {teacher.position && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E8F0FE] text-[#1A4F8A]">
                                {teacher.position}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-[#5B6472] flex-wrap">
                            <span className="flex items-center gap-1">
                              <FiBookOpen className="h-3 w-3" />
                              {teacher.subjectName || "No subject assigned"}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiUser className="h-3 w-3" />
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
      <div className="flex items-center justify-end gap-4 pt-4 border-t border-[#E4E1D9]">
        <p className="text-sm text-[#5B6472]">
          {selectedTeachers.size} teacher{selectedTeachers.size > 1 ? "s" : ""}{" "}
          selected
        </p>
        <button
          type="submit"
          disabled={isSubmitting || selectedTeachers.size === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
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
