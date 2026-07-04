// src/components/evaluationPeriods/PeriodStats.tsx
import React from "react";
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArchive,
} from "react-icons/fi";

interface PeriodStatsProps {
  total: number;
  draft: number;
  active: number;
  closed: number;
  archived: number;
  onStatClick?: (status: string) => void;
}

export const PeriodStats: React.FC<PeriodStatsProps> = ({
  total,
  draft,
  active,
  closed,
  archived,
  onStatClick,
}) => {
  const stats = [
    {
      label: "Total Periods",
      value: total,
      icon: FiCalendar,
      color: "bg-[#101826]",
      status: "all",
    },
    {
      label: "Active",
      value: active,
      icon: FiCheckCircle,
      color: "bg-green-600",
      status: "active",
    },
    {
      label: "Draft",
      value: draft,
      icon: FiClock,
      color: "bg-gray-600",
      status: "draft",
    },
    {
      label: "Closed",
      value: closed,
      icon: FiXCircle,
      color: "bg-blue-600",
      status: "closed",
    },
    {
      label: "Archived",
      value: archived,
      icon: FiArchive,
      color: "bg-purple-600",
      status: "archived",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          onClick={() => onStatClick?.(stat.status)}
          className={`bg-white rounded-xl border border-[#E4E1D9] p-5 sm:p-6 hover:border-[#E8A23D]/50 hover:shadow-sm transition-all ${
            onStatClick ? "cursor-pointer" : ""
          }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#5B6472]">{stat.label}</p>
              <p
                className="text-2xl font-semibold text-[#101826] mt-1"
                style={{
                  fontFamily: "'Space Grotesk', system-ui, sans-serif",
                }}>
                {stat.value}
              </p>
            </div>
            <div
              className={`h-11 w-11 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0 ml-3`}>
              <stat.icon className="h-5 w-5 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
