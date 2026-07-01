// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateName = (name: string): boolean => {
  return name.trim().length > 0 && name.length <= 100;
};

export const getValidationErrors = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!validateName(firstName)) {
    errors.firstName =
      "First name is required and must be less than 100 characters";
  }

  if (!validateName(lastName)) {
    errors.lastName =
      "Last name is required and must be less than 100 characters";
  }

  if (!validateEmail(email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!validatePassword(password)) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
};
