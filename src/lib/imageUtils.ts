/**
 * Utility function to construct image URLs consistently across the application
 * Handles various URL formats and edge cases
 */
export const imgUrl = (path: string | undefined | null): string => {
  if (!path) return '';
  
  // If it's already a full URL (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Get API base URL from environment
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const base = API_BASE_URL.replace(/\/api\/?$/, '') || 'http://localhost:3001';
  
  // If path starts with '/', append to base directly
  // Otherwise, add '/' between base and path
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
};
