// src/components/student/EvaluationProgress.tsx
import React from "react";
import { FiCheckCircle, FiCircle, FiBookOpen } from "react-icons/fi";
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

  const completedCount = progress.filter((item) => item.evaluated).length;

  return (
    <div className="bg-[#FBFCFE] rounded-xl border border-[#E4E8F0] p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-semibold text-[#101625]">
          Evaluation Progress
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5A6478]">
            <span className="font-medium text-[#101625]">{completedCount}</span>{" "}
            of {progress.length} completed
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-[#EBF0FE] text-[#3D6BFF] font-medium">
            {Math.round((completedCount / progress.length) * 100)}%
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {progress.map((item, index) => {
          const isCurrent = index === currentIndex;
          const isCompleted = item.evaluated;

          return (
            <div
              key={item.teacherAssignmentId || index}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                isCurrent ? "bg-[#EBF0FE] border-2 border-[#3D6BFF] shadow-sm"
                : isCompleted ? "bg-[#F6F9F6] hover:bg-[#F4F6FA]"
                : "hover:bg-[#F4F6FA]"
              } ${onTeacherClick && isCompleted ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (onTeacherClick && isCompleted) {
                  onTeacherClick(index);
                }
              }}>
              {/* Status Icon */}
              <div className="flex-shrink-0">
                {isCompleted ?
                  <FiCheckCircle className="h-5 w-5 text-[#4CAF50]" />
                : isCurrent ?
                  <div className="h-5 w-5 rounded-full border-2 border-[#3D6BFF] flex items-center justify-center">
                    <div className="h-2 w-2 rounded-full bg-[#3D6BFF] animate-pulse" />
                  </div>
                : <FiCircle className="h-5 w-5 text-[#8E97AE]" />}
              </div>

              {/* Teacher Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-sm font-medium ${
                      isCurrent ? "text-[#101625]"
                      : isCompleted ? "text-[#101625]"
                      : "text-[#5A6478]"
                    }`}>
                    {item.teacherName || "Unknown Teacher"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isCompleted ? "bg-[#E8F5E9] text-[#4CAF50]"
                      : isCurrent ? "bg-[#EBF0FE] text-[#3D6BFF]"
                      : "bg-[#F4F6FA] text-[#5A6478]"
                    }`}>
                    {isCompleted ?
                      "Completed"
                    : isCurrent ?
                      "Current"
                    : "Pending"}
                  </span>
                </div>
                {item.subjectName && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-[#5A6478]">
                    <FiBookOpen className="h-3 w-3 flex-shrink-0" />
                    {item.subjectName}
                  </div>
                )}
              </div>

              {/* Index */}
              <div className="flex-shrink-0">
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    isCurrent ? "bg-[#3D6BFF] text-white"
                    : isCompleted ? "bg-[#E8F5E9] text-[#4CAF50]"
                    : "bg-[#F4F6FA] text-[#5A6478]"
                  }`}>
                  {index + 1}/{item.totalCount || progress.length}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 pt-4 border-t border-[#E4E8F0]">
        <div className="w-full h-1.5 bg-[#F4F6FA] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#3D6BFF] to-[#6E8CFF] rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(completedCount / progress.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
