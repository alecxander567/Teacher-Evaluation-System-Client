// src/components/AuthButton.tsx
import React from "react";
import type { IconType } from "react-icons";

interface AuthButtonProps {
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  icon?: IconType;
  variant?: "primary" | "secondary";
  fullWidth?: boolean;
}

export const AuthButton: React.FC<AuthButtonProps> = ({
  type = "button",
  onClick,
  isLoading = false,
  disabled = false,
  children,
  icon: Icon,
  variant = "primary",
  fullWidth = false,
}) => {
  const baseStyles = `
    flex items-center justify-center gap-2 px-6 py-3 rounded-lg
    font-medium transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? "w-full" : ""}
  `;

  const variants = {
    primary: `
      bg-[#E8A23D] text-[#101826] hover:bg-[#D6912F]
      focus:outline-none focus:ring-2 focus:ring-[#E8A23D] focus:ring-offset-2
    `,
    secondary: `
      bg-[#EEEBE3] text-[#101826] hover:bg-[#E4E1D9]
      focus:outline-none focus:ring-2 focus:ring-[#5B6472] focus:ring-offset-2
    `,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]}`}>
      {isLoading ?
        <>
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Processing...
        </>
      : <>
          {children}
          {Icon && <Icon className="h-5 w-5" />}
        </>
      }
    </button>
  );
};
