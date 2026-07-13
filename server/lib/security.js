/**
 * Shared security helpers for the API server.
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function resolveJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (secret && secret.length >= 32) {
    return secret;
  }
  if (IS_PRODUCTION) {
    throw new Error(
      'JWT_SECRET must be set to a random string of at least 32 characters in production.'
    );
  }
  console.warn(
    '⚠ Using development JWT_SECRET. Set JWT_SECRET in .env before deploying.'
  );
  return secret || 'dev-only-jwt-secret-change-before-production';
}

export function isProduction() {
  return IS_PRODUCTION;
}

/** Avoid leaking internal error details to API clients. */
export function publicErrorMessage(error, fallback = 'Request failed') {
  if (!IS_PRODUCTION && error?.message) {
    return error.message;
  }
  return fallback;
}

/** Only Google Apps Script web app URLs may be used for sheet webhooks (SSRF mitigation). */
export function isValidGoogleAppsScriptUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed.startsWith('https://')) return false;
  try {
    const parsed = new URL(trimmed);
    if (parsed.hostname !== 'script.google.com') return false;
    if (!parsed.pathname.includes('/macros/s/')) return false;
    if (!parsed.pathname.endsWith('/exec') && !parsed.pathname.endsWith('/dev')) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

const MIN_PASSWORD_LENGTH = 12;

export function validatePasswordStrength(password, { fieldName = 'Password' } = {}) {
  const value = String(password ?? '');
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `${fieldName} must be at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value)) {
    return `${fieldName} must include upper and lower case letters and a number`;
  }
  const weak = ['admin123', 'password', 'password123', 'vietstaff', 'changeme'];
  if (weak.some((w) => value.toLowerCase().includes(w))) {
    return `${fieldName} is too common; choose a stronger password`;
  }
  return null;
}
