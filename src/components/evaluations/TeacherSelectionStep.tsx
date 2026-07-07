// src/components/evaluations/TeacherSelectionStep.tsx
import React, { useMemo, useState } from "react";
import { FiCheck } from "react-icons/fi";
import type { TeacherSelection } from "../../types/teacherSelection.types";

interface Props {
  teachers: TeacherSelection[];
  loading: boolean;
  onContinue: (selected: TeacherSelection[]) => void;
}

const employmentBadgeClasses: Record<string, string> = {
  FULL_TIME: "bg-green-50 text-green-600",
  PART_TIME: "bg-amber-50 text-amber-600",
  CONTRACTUAL: "bg-blue-50 text-blue-600",
};

const employmentLabels: Record<string, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACTUAL: "Contractual",
};

export const TeacherSelectionStep: React.FC<Props> = ({
  teachers,
  loading,
  onContinue,
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const grouped = useMemo(() => {
    const map = new Map<string, TeacherSelection[]>();
    teachers.forEach((t) => {
      const key = t.departmentName || "Unassigned Department";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(t);
    });
    return Array.from(map.entries());
  }, [teachers]);

  const toggle = (teacherId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(teacherId)) next.delete(teacherId);
      else next.add(teacherId);
      return next;
    });
  };

  const handleContinue = () => {
    const selected = teachers.filter((t) => selectedIds.has(t.teacherId));
    onContinue(selected);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent" />
      </div>
    );
  }

  if (teachers.length === 0) {
    return (
      <p className="text-sm text-[#5B6472] text-center py-8">
        No teachers are available to evaluate for this period.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map(([departmentName, deptTeachers]) => (
        <div key={departmentName}>
          <h3 className="text-sm font-semibold text-[#101826] mb-2">
            {departmentName}
          </h3>
          <div className="space-y-2">
            {deptTeachers.map((t) => {
              const isChecked = selectedIds.has(t.teacherId);
              return (
                <label
                  key={t.teacherId}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isChecked ?
                      "border-[#E8A23D] bg-[#FBEEDC]/40"
                    : "border-[#E4E1D9] hover:border-[#E8A23D]/50"
                  }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(t.teacherId)}
                      className="h-4 w-4 rounded border-[#E4E1D9] text-[#E8A23D] focus:ring-[#E8A23D]"
                    />
                    <span className="text-sm text-[#101826]">{t.fullName}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      employmentBadgeClasses[t.employmentType] ||
                      "bg-gray-50 text-gray-600"
                    }`}>
                    {employmentLabels[t.employmentType] || t.employmentType}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <div className="pt-4 border-t border-[#E4E1D9] flex items-center justify-between">
        <span className="text-sm text-[#5B6472]">
          {selectedIds.size} teacher{selectedIds.size === 1 ? "" : "s"} selected
        </span>
        <button
          onClick={handleContinue}
          disabled={selectedIds.size === 0}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium">
          <FiCheck className="h-4 w-4" />
          Continue
        </button>
      </div>
    </div>
  );
};
