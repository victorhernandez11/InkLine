/**
 * Sanitize user input to prevent XSS and injection attacks.
 * Strips HTML-dangerous characters, dangerous protocols, event handlers,
 * and control characters. Enforces a max length of 2000 characters.
 */
export function sanitize(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[<>"'`]/g, '')                            // HTML tag/attribute chars
    .replace(/javascript:/gi, '')                        // JS protocol
    .replace(/data:/gi, '')                              // Data URI protocol
    .replace(/vbscript:/gi, '')                          // VBScript protocol
    .replace(/on\w+\s*=/gi, '')                          // Inline event handlers
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')  // ASCII control chars
    .substring(0, 2000)
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
 * Validate a project name: non-empty, reasonable length, no control
 * characters, and no Unicode bidirectional override codepoints that could
 * be used to spoof display order (Trojan-source style attacks).
 */
export function isValidProjectName(name: string): boolean {
  const trimmed = name.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return false;
  // Block ASCII control characters
  if (/[\x00-\x1F\x7F]/.test(trimmed)) return false;
  // Block Unicode bidirectional override characters
  if (/[\u200F\u200E\u202A-\u202E\u2066-\u2069\uFEFF]/.test(trimmed)) return false;
  return true;
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
