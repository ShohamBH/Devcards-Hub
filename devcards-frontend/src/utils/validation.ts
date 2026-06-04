export interface ValidationErrors {
  [key: string]: string;
}

export const validateEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateCardForm = (formData: any): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full Name is required';
  }

  if (!formData.title?.trim()) {
    errors.title = 'Professional Title is required';
  }

  const email = formData.socialLinks?.email || '';
  if (!email.trim()) {
    errors.email = 'Email Address is required';
  } else if (!validateEmail(email)) {
    errors.email = 'Valid Email Address is required';
  }

  return errors;
};
