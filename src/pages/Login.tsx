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
  FiEye,
  FiEyeOff,
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
      stroke="#3D6BFF"
      strokeWidth="2.5"
      strokeOpacity="0.35"
    />
    <path
      d="M24 5a19 19 0 0 1 16.45 28.4"
      stroke="#3D6BFF"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M15.5 24.5l5.5 5.5L32.5 18"
      stroke="#3D6BFF"
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
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F4F6FA]">
      {/* Left — identity panel */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#0A0E1A] to-[#121A2E] text-[#F4F6FA] flex flex-col justify-between md:w-[44%] px-10 py-12 md:px-16 md:py-16">
        {/* Sapphire glow — a quiet light in the nightfall field */}
        <div
          className="pointer-events-none absolute -top-32 -right-24 w-[420px] h-[420px] rounded-full opacity-25 blur-3xl"
          style={{ background: "#3D6BFF" }}
        />
        <EvalMark className="pointer-events-none absolute -right-20 -bottom-20 w-[380px] h-[380px] opacity-[0.06]" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-9 h-9 rounded-full bg-[#121A2E] ring-1 ring-[#3D6BFF]/30 flex items-center justify-center">
              <EvalMark className="w-6 h-6" />
            </div>
            <span
              className="text-[11px] font-medium tracking-[0.2em] text-[#6E8CFF] uppercase"
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
          <p className="mt-5 text-[#8E97AE] text-base leading-relaxed max-w-sm">
            Structured review and scoring for every submission, in one place.
          </p>
        </div>

        <p
          className="relative text-[11px] text-[#4C5468] tracking-[0.15em] uppercase"
          style={{ fontFamily: "'IBM Plex Mono', ui-monospace, monospace" }}>
          Authorized personnel only
        </p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 md:px-16">
        <div className="w-full max-w-sm bg-[#FBFCFE] rounded-3xl px-8 py-9 md:px-10 md:py-10">
          <div className="mb-8">
            <h2
              className="text-2xl font-semibold text-[#101625] tracking-tight"
              style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
              Sign in
            </h2>
            <p className="text-[#5A6478] mt-1.5 text-sm">
              Enter your credentials to continue.
            </p>
          </div>

          {successMessage && (
            <div className="mb-5 p-4 bg-[#EBF0FE] border border-[#C7D6FB] rounded-lg flex items-start gap-3">
              <FiCheckCircle className="h-5 w-5 text-[#3D6BFF] mt-0.5 flex-shrink-0" />
              <p className="text-sm text-[#2A4BC4]">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-5 p-4 bg-[#FBEEF0] border border-[#F0CBD1] rounded-lg flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 text-[#C4536A] mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-[#9A3A50]">
                  {error.error}
                </p>
                <p className="text-sm text-[#B65A70]">{error.message}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AuthInput
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={FiMail}
              disabled={isLoading}
            />

            {/* Password field with show/hide toggle.
                Bordered box, matching AuthInput's look, with an
                eye toggle on the right since AuthInput has no
                right-icon slot. */}
            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9AA3B8]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full pl-12 pr-12 py-3.5 text-base rounded-xl border border-[#E4E8F0] bg-[#FBFCFE] text-[#101625] placeholder:text-[#9AA3B8] focus:outline-none focus:ring-2 focus:ring-[#3D6BFF]/30 focus:border-[#3D6BFF] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={isLoading}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9AA3B8] hover:text-[#3D6BFF] transition-colors disabled:opacity-50">
                {showPassword ?
                  <FiEyeOff className="h-5 w-5" />
                : <FiEye className="h-5 w-5" />}
              </button>
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
            <p className="text-sm text-[#5A6478]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[#101625] hover:text-[#3D6BFF] transition-colors">
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
