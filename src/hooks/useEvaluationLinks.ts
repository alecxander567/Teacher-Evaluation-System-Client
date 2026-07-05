// src/hooks/useEvaluationLinks.ts
import { useState, useCallback } from "react";
import type {
  EvaluationLink,
  EvaluationLinkRequest,
} from "../types/evaluationLink.types";
import { evaluationLinkApi } from "../api/evaluationLinkApi";

const getErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const error = err as { response?: { data?: { message?: string } } };
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
  }
  if (err instanceof Error) return err.message;
  return fallback;
};

export const useEvaluationLinks = () => {
  const [links, setLinks] = useState<EvaluationLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadAllLinks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationLinkApi.getAllLinks();
      setLinks(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load links"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadLinksByFormId = useCallback(async (formId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationLinkApi.getLinksByFormId(formId);
      setLinks(data);
      return data;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to load links"));
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createLink = useCallback(
    async (data: EvaluationLinkRequest): Promise<EvaluationLink | null> => {
      setLoading(true);
      setError(null);
      try {
        const newLink = await evaluationLinkApi.createLink(data);
        setLinks((prev) => [newLink, ...prev]);
        return newLink;
      } catch (err: unknown) {
        setError(getErrorMessage(err, "Failed to create link"));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deactivateLink = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationLinkApi.deactivateLink(id);
      setLinks((prev) =>
        prev.map((link) =>
          link.id === id ? { ...link, status: "inactive" } : link,
        ),
      );
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to deactivate link"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteLink = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await evaluationLinkApi.deleteLink(id);
      setLinks((prev) => prev.filter((link) => link.id !== id));
      return true;
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to delete link"));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    links,
    loading,
    error,
    clearError,
    loadAllLinks,
    loadLinksByFormId,
    createLink,
    deactivateLink,
    deleteLink,
  };
};
