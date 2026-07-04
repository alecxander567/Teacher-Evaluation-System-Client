// src/utils/getErrorMessage.ts

/**
 * Safely extracts a user-facing message from an unknown error, without
 * relying on `any`. Handles the common Axios-style shape
 * (err.response.data.message) as well as plain Error instances and
 * anything else, falling back to a provided default.
 */
export const getErrorMessage = (err: unknown, fallback: string): string => {
  if (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as { response?: unknown }).response === "object" &&
    (err as { response?: unknown }).response !== null
  ) {
    const response = (err as { response?: { data?: unknown } }).response;
    const data = response?.data;
    if (
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof (data as { message?: unknown }).message === "string"
    ) {
      return (data as { message: string }).message;
    }
  }

  if (err instanceof Error && err.message) {
    return err.message;
  }

  return fallback;
};
