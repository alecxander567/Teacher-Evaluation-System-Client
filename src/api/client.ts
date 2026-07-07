// src/api/client.ts
import axios from "axios";
import type { ErrorResponse } from "../types/auth";

const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the token to every outgoing request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize errors + handle expired/invalid sessions globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data as ErrorResponse);
    }
    return Promise.reject({
      error: "Network Error",
      message: "Unable to connect to server",
      status: 500,
      timestamp: new Date().toISOString(),
    } as ErrorResponse);
  },
);
