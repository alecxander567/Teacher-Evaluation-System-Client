// src/components/AuthInput.tsx
import React from "react";
import type { IconType } from "react-icons";

interface AuthInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: IconType;
  error?: string;
  disabled?: boolean;
}

export const AuthInput: React.FC<AuthInputProps> = ({
  id,
  type,
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-1">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Icon className="h-5 w-5 text-[#9A9F8C]" />
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full pl-10 pr-3 py-3 border rounded-lg bg-white
            transition-colors duration-200
            placeholder:text-[#9A9F8C] text-[#101826]
            focus:outline-none focus:ring-2 focus:ring-[#E8A23D]/40 focus:border-[#E8A23D]
            ${error ? "border-[#C4553D]" : "border-[#E4E1D9]"}
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
          placeholder={placeholder}
        />
      </div>
      {error && <p className="text-sm text-[#C4553D]">{error}</p>}
    </div>
  );
};
