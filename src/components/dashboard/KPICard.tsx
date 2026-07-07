// src/components/dashboard/KPICard.tsx
import React from "react";
import { FiStar, FiUsers, FiClipboard, FiCheckCircle } from "react-icons/fi";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  progress?: number; // 0-100
  showProgress?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  subtitle,
  trend,
  progress,
  showProgress = false,
}) => {
  // Determine progress bar color based on value
  const getProgressColor = (value: number) => {
    if (value >= 90) return "bg-green-500";
    if (value >= 70) return "bg-[#E8A23D]";
    if (value >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] p-5 sm:p-6 hover:border-[#E8A23D]/50 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#5B6472] truncate">{title}</p>
          <p
            className="text-2xl font-semibold text-[#101826] mt-1"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-[#5B6472] mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}>
                {trend.isPositive ? "+" : "-"}
                {trend.value}%
              </span>
              <span className="text-xs text-[#5B6472]">from last period</span>
            </div>
          )}

          {/* Progress Bar */}
          {showProgress && progress !== undefined && (
            <div className="mt-3">
              <div className="w-full h-2 bg-[#E4E1D9] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressColor(
                    progress,
                  )}`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-[#5B6472]">0%</span>
                <span className="text-xs font-medium text-[#101826]">
                  {Math.min(progress, 100)}%
                </span>
                <span className="text-xs text-[#5B6472]">100%</span>
              </div>
            </div>
          )}
        </div>
        <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-lg bg-[#101826] flex items-center justify-center flex-shrink-0 ml-3">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
