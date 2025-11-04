/**
 * Converts various date input formats to a standardized ISO string.
 * 
 * - Attempts to parse common date formats.
 * - If parsing fails or results in an invalid date, returns a future date (100 years from today)
 *   to make errors easy to detect in downstream data.
 *
 * @param input - A date string in an unknown or mixed format.
 * @returns A valid ISO 8601 date string (e.g., "2025-04-10T00:00:00.000Z").
 */
export function toDateIsoString(input: string): string {
  try {
    // Normalize formats like "10 APR 2025", "10-APR-2025", or "10/APR/2025"
    const normalized = input.replace(/(\d+)\/([A-Z]{3})\/(\d{4})/, '$1 $2 $3');
    const date = new Date(normalized + ' UTC');

    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
  } catch {
    // fall through to fallback
  }

  // Fallback: return a date 100 years in the future to mark as "suspicious"
  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() + 100);
  return fallback.toISOString();
}
