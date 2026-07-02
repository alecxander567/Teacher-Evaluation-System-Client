// src/components/icons/EvalMark.tsx
import React from "react";

interface EvalMarkProps {
  className?: string;
}

export const EvalMark: React.FC<EvalMarkProps> = ({ className }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg">
    <circle
      cx="24"
      cy="24"
      r="19"
      stroke="#E8A23D"
      strokeWidth="2.5"
      strokeOpacity="0.35"
    />
    <path
      d="M24 5a19 19 0 0 1 16.45 28.4"
      stroke="#E8A23D"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15.5 24.5l5.5 5.5L32.5 18"
      stroke="#E8A23D"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
