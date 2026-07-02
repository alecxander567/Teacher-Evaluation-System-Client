// src/components/AlertModal.tsx
import React, { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

export interface AlertModalProps {
  type: "success" | "error";
  title: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  autoClose?: number;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  type,
  title,
  message,
  isOpen,
  onClose,
  autoClose = 4000,
}) => {
  useEffect(() => {
    if (!isOpen || !autoClose) return;
    const timer = setTimeout(onClose, autoClose);
    return () => clearTimeout(timer);
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-[#FAFAF6] text-[#5B6472] hover:text-[#101826] transition-colors">
          <FiX className="h-4 w-4" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className={`h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
              isSuccess
                ? "bg-[#F3F8F1] text-[#4C9A4C]"
                : "bg-[#FCF1EE] text-[#C4553D]"
            }`}>
            {isSuccess ?
              <FiCheckCircle className="h-7 w-7" />
            : <FiAlertCircle className="h-7 w-7" />}
          </div>

          <h3
            className="text-lg font-semibold text-[#101826] mb-1"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            {title}
          </h3>

          <p className="text-sm text-[#5B6472] leading-relaxed">{message}</p>

          <button
            onClick={onClose}
            className={`mt-6 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              isSuccess
                ? "bg-[#101826] text-white hover:bg-[#1a2438]"
                : "bg-[#C4553D] text-white hover:bg-[#9A3D2B]"
            }`}>
            {isSuccess ? "Continue" : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
};