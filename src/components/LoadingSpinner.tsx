// src/components/LoadingSpinner.tsx
import React from "react";

interface LoadingSpinnerProps {
  /** Optional message shown below the spinner */
  label?: string;
  /** Spinner diameter/border in px-based Tailwind classes */
  size?: "sm" | "md" | "lg";
  /** Wraps the spinner in a full-screen centered container */
  fullScreen?: boolean;
  className?: string;
}

const sizeMap: Record<NonNullable<LoadingSpinnerProps["size"]>, string> = {
  sm: "h-6 w-6 border-2",
  md: "h-12 w-12 border-4",
  lg: "h-16 w-16 border-4",
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label,
  size = "md",
  fullScreen = false,
  className = "",
}) => {
  const spinner = (
    <div className={`text-center ${className}`}>
      <div
        role="status"
        aria-label={label || "Loading"}
        className={`inline-block animate-spin rounded-full border-[#3D6BFF] border-t-transparent ${sizeMap[size]}`}
      />
      {label && <p className="mt-4 text-[#5A6478] text-sm">{label}</p>}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
      {spinner}
    </div>
  );
};

export default LoadingSpinner;
