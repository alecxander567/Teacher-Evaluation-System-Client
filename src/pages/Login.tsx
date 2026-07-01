// src/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthInput } from "../components/AuthInput";
import { AuthButton } from "../components/AuthButton";
import {
  FiMail,
  FiLock,
  FiAlertCircle,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

// Signature mark: a partial evaluation dial resolving into a checkmark.
// Only handwritten SVG in this file — everything else uses react-icons.
const EvalMark: React.FC<{ className?: string }> = ({ className }) => (
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const successMessage =
    (location.state as { message?: string })?.message || null;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
    } catch {
      // Error is handled by useAuth hook
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FAFAF6]">
      {/* Left — identity panel */}
      <div className="relative overflow-hidden bg-[#101826] text-[#FAFAF6] flex flex-col justify-between md:w-[44%] px-10 py-12 md:px-16 md:py-16">
        {/* Ambient signature texture */}
        <EvalMark className="pointer-events-none absolute -right-24 -bottom-24 w-[420px] h-[420px] opacity-[0.06]" />

        <div>
          <div className="flex items-center gap-3 mb-16">
            <EvalMark className="w-9 h-9" />
            <span
              className="text-[11px] font-medium tracking-[0.2em] text-[#E8A23D] uppercase"
              style={{
                fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
              }}>
              Secure Access
            </span>
          </div>

          <h1
            className="text-4xl md:text-5xl font-semibold leading-[1.1] tracking-tight"
            style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
            SPCT Evaluation
            <br />
            System
          </h1>
          <p className="mt-5 text-[#AEB6C2] text-base leading-relaxed max-w-sm">
            Structured review and scoring for every submission, in one place.
          </p>
        </div>

        <p
          className="relative text-[11px] text-[#5B6472] tracking-[0.15em] uppercase"
          style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Authorized personnel only
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold text-[#101826] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Sign in
            </h2>
            <p className="text-[#5B6472] mt-1.5 text-sm">
              Enter your credentials to continue.
            </p>
          </div>

          {successMessage && (
            <div className="mb-5 p-4 bg-[#F3F8F1] border border-[#CFE3C8] rounded-lg flex items-start gap-3">
              <FiCheckCircle className="h-5 w-5 text-[#4C9A4C] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#3C7A3C]">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-[#FCF1EE] border border-[#F0CFC5] rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-[#C4553D] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#9A3D2B]">
                  {error.error}
                </p>
                <p className="text-sm text-[#B65240]">{error.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={FiMail}
              disabled={isLoading}
            />

            <AuthInput
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={FiLock}
              disabled={isLoading}
            />

            <div className="flex items-center justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-[#5B6472] hover:text-[#101826] transition-colors">
                Forgot password?
              </Link>
            </div>

            <AuthButton
              type="submit"
              icon={FiArrowRight}
              isLoading={isLoading}
              disabled={!email || !password}
              fullWidth>
              Sign In
            </AuthButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#5B6472]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#101826] hover:text-[#E8A23D] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
