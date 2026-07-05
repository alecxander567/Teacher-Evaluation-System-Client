// src/api/evaluationLinkApi.ts
import axios from "axios";
import type {
  EvaluationLink,
  EvaluationLinkRequest,
} from "../types/evaluationLink.types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const evaluationLinkApi = {
  createLink: async (data: EvaluationLinkRequest): Promise<EvaluationLink> => {
    const response = await api.post("/evaluation-links", data);
    return response.data;
  },

  getAllLinks: async (): Promise<EvaluationLink[]> => {
    const response = await api.get("/evaluation-links");
    return response.data;
  },

  getLinkById: async (id: number): Promise<EvaluationLink> => {
    const response = await api.get(`/evaluation-links/${id}`);
    return response.data;
  },

  getLinkByToken: async (token: string): Promise<EvaluationLink> => {
    const response = await api.get(`/evaluation-links/token/${token}`);
    return response.data;
  },

  getLinksByFormId: async (formId: number): Promise<EvaluationLink[]> => {
    const response = await api.get(`/evaluation-links/form/${formId}`);
    return response.data;
  },

  validateToken: async (token: string): Promise<boolean> => {
    const response = await api.get(`/evaluation-links/validate/${token}`);
    return response.data;
  },

  deactivateLink: async (id: number): Promise<void> => {
    await api.patch(`/evaluation-links/${id}/deactivate`);
  },

  deleteLink: async (id: number): Promise<void> => {
    await api.delete(`/evaluation-links/${id}`);
  },
};
