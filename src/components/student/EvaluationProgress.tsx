// src/components/student/EvaluationProgress.tsx
import React from "react";
import { FiCheckCircle, FiCircle, FiUser, FiBookOpen } from "react-icons/fi";
import type { TeacherEvaluationProgress } from "../../types/studentEvaluation.types";

interface EvaluationProgressProps {
  progress: TeacherEvaluationProgress[];
  currentIndex: number;
  onTeacherClick?: (index: number) => void;
}

export const EvaluationProgress: React.FC<EvaluationProgressProps> = ({
  progress,
  currentIndex,
  onTeacherClick,
}) => {
  if (progress.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-[#E4E1D9] p-4">
      <h4 className="text-sm font-medium text-[#101826] mb-3">
        Evaluation Progress
        <span className="ml-2 text-xs text-[#5B6472] font-normal">
          ({currentIndex + 1} of {progress.length})
        </span>
      </h4>
      <div className="space-y-2">
        {progress.map((item, index) => {
          const isCurrent = index === currentIndex;
          const isCompleted = item.evaluated;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div
              key={item.teacherAssignmentId || index}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrent ? "bg-[#FBEEDC] border border-[#E8A23D]/30"
                : isCompleted ? "bg-[#F3F8F1]"
                : "hover:bg-[#FAFAF6]"
              } ${onTeacherClick && isCompleted ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (onTeacherClick && isCompleted) {
                  onTeacherClick(index);
                }
              }}>
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {isCompleted ?
                  <FiCheckCircle className="h-5 w-5 text-[#4C9A4C]" />
                : isCurrent ?
                  <div className="h-5 w-5 rounded-full border-2 border-[#E8A23D] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#E8A23D] animate-pulse" />
                  </div>
                : <FiCircle className="h-5 w-5 text-[#5B6472]" />}
              </div>

              {/* Teacher Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-[#101826]"
                      : isCompleted ? "text-[#5B6472]"
                      : "text-[#5B6472]"
                    }`}>
                    {item.teacherName || "Unknown Teacher"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isCompleted ? "bg-[#4C9A4C]/10 text-[#4C9A4C]"
                      : isCurrent ? "bg-[#E8A23D]/10 text-[#B8791F]"
                      : "bg-[#E4E1D9] text-[#5B6472]"
                    }`}>
                    {isCompleted ?
                      "Completed"
                    : isCurrent ?
                      "Current"
                    : "Pending"}
                  </span>
                </div>
                {item.subjectName && (
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-[#5B6472]">
                    <FiBookOpen className="h-3 w-3" />
                    {item.subjectName}
                  </div>
                )}
              </div>

              {/* Index */}
              <div className="flex-shrink-0 text-xs text-[#5B6472]">
                {index + 1}/{item.totalCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
