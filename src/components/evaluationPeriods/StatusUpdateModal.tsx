// src/components/evaluationPeriods/StatusUpdateModal.tsx
import React, { useState } from "react";
import { FiX, FiAlertCircle } from "react-icons/fi";
import type { EvaluationPeriod } from "../../types/evaluationPeriod.types";

type PeriodStatus = EvaluationPeriod["status"];

interface StatusUpdateModalProps {
  isOpen: boolean;
  period: EvaluationPeriod | null;
  onClose: () => void;
  onConfirm: (status: PeriodStatus) => Promise<void>;
  loading: boolean;
}

const statusOptions: {
  value: PeriodStatus;
  label: string;
  description: string;
}[] = [
  { value: "draft", label: "Draft", description: "Period is in draft mode" },
  {
    value: "active",
    label: "Active",
    description: "Period is active for evaluations",
  },
  { value: "closed", label: "Closed", description: "Period is closed" },
  { value: "archived", label: "Archived", description: "Period is archived" },
];

export const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  isOpen,
  period,
  onClose,
  onConfirm,
  loading,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<PeriodStatus | "">("");

  // Tracks which `period` the current selectedStatus was derived from, so we
  // can detect prop changes and re-derive state *during render* instead of
  // syncing it via a useEffect (which causes an extra render pass).
  const [prevPeriod, setPrevPeriod] = useState<EvaluationPeriod | null>(null);

  if (period !== prevPeriod) {
    setPrevPeriod(period);
    setSelectedStatus(period ? period.status : "");
  }

  if (!isOpen || !period) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStatus && selectedStatus !== period.status) {
      await onConfirm(selectedStatus);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#E4E1D9]">
            <h3
              className="text-lg font-semibold text-[#101826]"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Update Status
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#FAFAF6] rounded-lg transition-colors">
              <FiX className="h-5 w-5 text-[#5B6472]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#5B6472] mb-2">
                  Update status for:{" "}
                  <strong className="text-[#101826]">{period.title}</strong>
                </p>
                <p className="text-xs text-[#5B6472] mb-4">
                  Current status:{" "}
                  <span className="capitalize font-medium">
                    {period.status}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                {statusOptions.map((option) => (
                  <label
                    key={option.value}
                    className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedStatus === option.value ?
                        "border-[#E8A23D] bg-[#FBEEDC]"
                      : "border-[#E4E1D9] hover:bg-[#FAFAF6]"
                    }`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="status"
                        value={option.value}
                        checked={selectedStatus === option.value}
                        onChange={() => setSelectedStatus(option.value)}
                        className="mt-0.5 h-4 w-4 text-[#E8A23D] border-[#E4E1D9] focus:ring-[#E8A23D]"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#101826] capitalize">
                          {option.label}
                        </p>
                        <p className="text-xs text-[#5B6472]">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {selectedStatus === "active" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <FiAlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-yellow-800">
                      Setting this period to active will make it available for
                      evaluations. Only one active period is allowed per
                      academic year and semester.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-[#E4E1D9]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#5B6472] hover:text-[#101826] transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedStatus === period.status}
                className="px-4 py-2 bg-[#101826] text-white rounded-lg hover:bg-[#1a2438] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                {loading ?
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Updating...
                  </>
                : "Update Status"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
