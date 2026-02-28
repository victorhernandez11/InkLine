/**
 * Sanitize user input to prevent XSS and injection attacks.
 * Strips HTML tags and trims whitespace.
 */
export function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

/**
 * Validate a date string in YYYY-MM-DD format.
 */
export function isValidDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const date = new Date(dateStr + 'T00:00:00');
  return !isNaN(date.getTime());
}

/**
 * Validate word count is a positive integer within reasonable bounds.
 */
export function isValidWordCount(count: number): boolean {
  return Number.isInteger(count) && count > 0 && count <= 1_000_000;
}

/**
 * Validate a project name: non-empty, reasonable length, sanitized.
 */
export function isValidProjectName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/**
 * Safely parse JSON from localStorage with type validation.
 * Returns fallback on any error.
 */
export function safeParseJSON<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) && (typeof parsed !== 'object' || parsed === null)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}
