/**
 * AniVerse — Shared Input Validation Utilities
 *
 * DRY: Extracted from auth/artwork route handlers so field validation rules
 * live in one place. Every route should use these instead of duplicating
 * inline checks.
 *
 * Each validator returns an error message string, or `undefined` when valid,
 * so callers can collect them into an errors object:
 *
 *   const errors: Record<string, string> = {};
 *   errors.email = validateEmail(body.email);
 *   errors.password = validatePassword(body.password);
 *   if (Object.values(errors).some(Boolean)) return validationErrorResponse(errors);
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a required string field (must exist, be a string, and be non-empty
 * after trimming). Returns an error message or `undefined` when valid.
 */
export function validateRequiredString(
  value: unknown,
  fieldLabel: string,
): string | undefined {
  if (!value || typeof value !== "string" || !value.trim()) {
    return `${fieldLabel} is required`;
  }
  return undefined;
}

/**
 * Validate an email address (required + basic format). Returns an error
 * message or `undefined` when valid.
 */
export function validateEmail(value: unknown): string | undefined {
  const required = validateRequiredString(value, "Email");
  if (required) return required;

  const normalized = (value as string).trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalized)) {
    return "Please enter a valid email address";
  }
  return undefined;
}

/**
 * Validate a password (required + minimum length). Returns an error message
 * or `undefined` when valid.
 */
export function validatePassword(
  value: unknown,
  minLength = 6,
): string | undefined {
  if (!value || typeof value !== "string" || !value) {
    return "Password is required";
  }
  if (value.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }
  return undefined;
}

/**
 * Convenience: run a list of [field, validator] checks and return a
 * non-empty errors record, or `null` when everything passes.
 *
 *   const errors = collectValidationErrors([
 *     ["email", validateEmail(body.email)],
 *     ["password", validatePassword(body.password)],
 *   ]);
 *   if (errors) return validationErrorResponse(errors);
 */
export function collectValidationErrors(
  checks: Array<[string, string | undefined]>,
): Record<string, string> | null {
  const errors: Record<string, string> = {};
  for (const [field, error] of checks) {
    if (error) errors[field] = error;
  }
  return Object.keys(errors).length > 0 ? errors : null;
}
