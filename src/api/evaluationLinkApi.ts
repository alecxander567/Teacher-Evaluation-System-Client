// src/api/evaluationLinkApi.ts
import { api } from "./client";
import type {
  EvaluationLink,
  EvaluationLinkRequest,
} from "../types/evaluationLink.types";

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
