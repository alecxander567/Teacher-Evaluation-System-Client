// src/components/DeleteConfirmationModal.tsx
import React from "react";
import { FiAlertTriangle, FiX } from "react-icons/fi";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  itemName?: string;
  loading?: boolean;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Confirmation",
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  itemName,
  loading = false,
}) => {
  if (!isOpen) return null;

  const defaultMessage =
    itemName ?
      `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
    : "Are you sure you want to delete this item? This action cannot be undone.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-[#FAFAF6] text-[#5B6472] hover:text-[#101826] transition-colors"
          disabled={loading}>
          <FiX className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mx-auto mb-4">
          <FiAlertTriangle className="h-8 w-8 text-red-500" />
        </div>

        {/* Title */}
        <h2
          className="text-xl font-semibold text-[#101826] text-center mb-2"
          style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-[#5B6472] text-center mb-6">
          {message || defaultMessage}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#E4E1D9] text-[#5B6472] rounded-lg hover:bg-[#FAFAF6] transition-colors"
            disabled={loading}>
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            disabled={loading}>
            {loading ?
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
