// src/components/evaluationPeriods/PeriodList.tsx
import React from "react";
import {
  FiPlus,
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiClock,
  FiCalendar,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import type { EvaluationPeriod } from "../../types/evaluationPeriod.types";

interface PeriodListProps {
  periods: EvaluationPeriod[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (period: EvaluationPeriod) => void;
  onDelete: (id: number) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  onFilterByStatus?: (status: string) => void;
  selectedStatus?: string;
  onStatusUpdate?: (period: EvaluationPeriod) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "closed":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "archived":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <FiCheckCircle className="h-4 w-4" />;
    case "draft":
      return <FiClock className="h-4 w-4" />;
    case "closed":
      return <FiXCircle className="h-4 w-4" />;
    case "archived":
      return <FiAlertCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export const PeriodList: React.FC<PeriodListProps> = ({
  periods,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  searchTerm,
  onFilterByStatus,
  selectedStatus = "all",
  onStatusUpdate,
}) => {
  const statuses = ["all", "draft", "active", "closed", "archived"];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const isPeriodActive = (period: EvaluationPeriod) => {
    const now = new Date();
    const start = new Date(period.startDate);
    const end = new Date(period.endDate);
    return period.status === "active" && now >= start && now <= end;
  };

  const isPeriodUpcoming = (period: EvaluationPeriod) => {
    const now = new Date();
    const start = new Date(period.startDate);
    return now < start && period.status !== "archived";
  };

  const isPeriodPast = (period: EvaluationPeriod) => {
    const now = new Date();
    const end = new Date(period.endDate);
    return now > end || period.status === "archived";
  };

  return (
    <div className="bg-white rounded-xl border border-[#E4E1D9] overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-[#E4E1D9]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2
            className="text-xl font-semibold text-[#101826]"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            Evaluation Periods
          </h2>
          <button
            onClick={onAdd}
            className="flex items-center px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium">
            <FiPlus className="h-4 w-4 mr-2" />
            New Period
          </button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5B6472]" />
            <input
              type="text"
              placeholder="Search periods..."
              value={searchTerm}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-[#E4E1D9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:border-transparent bg-[#FAFAF6] text-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => onFilterByStatus?.(status)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedStatus === status ?
                    "bg-[#101826] text-white"
                  : "bg-[#FAFAF6] text-[#5B6472] hover:bg-[#E4E1D9]"
                }`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Periods Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#FAFAF6] border-b border-[#E4E1D9]">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Title
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider hidden sm:table-cell">
                Academic Year
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider hidden md:table-cell">
                Semester
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider hidden lg:table-cell">
                Start Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider hidden lg:table-cell">
                End Date
              </th>
              <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-[#5B6472] uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E4E1D9]">
            {loading ?
              <tr>
                <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#E8A23D] border-t-transparent"></div>
                  <p className="mt-2 text-sm text-[#5B6472]">
                    Loading periods...
                  </p>
                </td>
              </tr>
            : periods.length === 0 ?
              <tr>
                <td colSpan={7} className="px-4 sm:px-6 py-12 text-center">
                  <div className="text-[#5B6472]">
                    <FiCalendar className="h-12 w-12 mx-auto text-[#E4E1D9]" />
                    <p className="mt-2 text-sm">No evaluation periods found</p>
                    <button
                      onClick={onAdd}
                      className="mt-4 text-[#E8A23D] hover:text-[#B8791F] text-sm font-medium">
                      Create your first period
                    </button>
                  </div>
                </td>
              </tr>
            : periods.map((period) => {
                const isActive = isPeriodActive(period);
                const isUpcoming = isPeriodUpcoming(period);
                const isPast = isPeriodPast(period);

                return (
                  <tr
                    key={period.id}
                    className="hover:bg-[#FAFAF6] transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#101826]">
                          {period.title}
                        </span>
                        {isActive && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        )}
                        {isUpcoming && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Upcoming
                          </span>
                        )}
                        {isPast && period.status !== "archived" && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Past
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-[#5B6472]">
                        {period.academicYear}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-[#5B6472]">
                        {period.semester}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#5B6472]">
                        {formatDate(period.startDate)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 hidden lg:table-cell">
                      <span className="text-sm text-[#5B6472]">
                        {formatDate(period.endDate)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                          period.status,
                        )}`}>
                        {getStatusIcon(period.status)}
                        <span className="ml-1.5 capitalize">
                          {period.status}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Status Update Button */}
                        {onStatusUpdate && (
                          <button
                            onClick={() => onStatusUpdate(period)}
                            className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Update status">
                            <FiRefreshCw className="h-4 w-4 text-[#5B6472] hover:text-blue-600" />
                          </button>
                        )}
                        <button
                          onClick={() => onEdit(period)}
                          className="p-1.5 hover:bg-[#FAFAF6] rounded-lg transition-colors"
                          title="Edit period">
                          <FiEdit2 className="h-4 w-4 text-[#5B6472] hover:text-[#101826]" />
                        </button>
                        <button
                          onClick={() => onDelete(period.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete period">
                          <FiTrash2 className="h-4 w-4 text-[#5B6472] hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>

      {/* Footer with count */}
      <div className="px-4 sm:px-6 py-3 border-t border-[#E4E1D9] bg-[#FAFAF6]">
        <p className="text-sm text-[#5B6472]">
          Showing {periods.length} period{periods.length !== 1 ? "s" : ""}
        </p>
      </div>
    </div>
  );
};
