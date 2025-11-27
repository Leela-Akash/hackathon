/**
 * Safely formats a rate/percentage value that may be a number, string, object, null, or undefined.
 * Handles various input formats including percentages, decimals, and nested objects.
 * 
 * @param {any} value - The value to format (number, string like "95%", object, null, undefined)
 * @param {number} digits - Number of decimal places (default: 2)
 * @returns {string} Formatted number string or '—' for invalid/missing values
 */
export function formatRate(value, digits = 2) {
  if (value == null) return '—'; // null or undefined

  // If it's an object like { value: 0.95 } or { rate: "95%" }, try common props
  if (typeof value === 'object') {
    if (typeof value.value === 'number') return value.value.toFixed(digits);
    if (typeof value.rate === 'number') return value.rate.toFixed(digits);
    // Try to find any numeric property
    const maybe = Object.values(value).find(v => typeof v === 'number' || typeof v === 'string');
    if (maybe != null) value = maybe;
  }

  if (typeof value === 'string') {
    // Remove commas, whitespace, trailing percent sign
    const cleaned = value.replace(/[, ]+/g, '').replace('%', '').trim();
    const n = Number(cleaned);
    if (Number.isFinite(n)) {
      // If original had '%', convert to decimal if needed (assume it's already a percentage)
      if (value.includes('%')) {
        // If the number is > 1, it's likely already a percentage (e.g., "95" means 95%)
        // If it's < 1, treat as decimal (e.g., "0.95" means 95%)
        return n >= 1 ? n.toFixed(digits) : (n * 100).toFixed(digits);
      }
      return n.toFixed(digits);
    }
    return '—';
  }

  if (typeof value === 'number') {
    return value.toFixed(digits);
  }

  // Fallback: try coercion
  const n = Number(value);
  return Number.isFinite(n) ? n.toFixed(digits) : '—';
}

/**
 * Normalizes transactionSuccessRate from API response to a consistent number or null.
 * Use this in data mappers/services when processing API responses.
 * 
 * @param {any} raw - Raw value from API (number, string, object, null, undefined)
 * @returns {number|null} Normalized number or null if invalid
 */
export function normalizeTransactionSuccessRate(raw) {
  if (raw == null) return null;
  
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : null;
  }
  
  if (typeof raw === 'string') {
    const cleaned = raw.replace(/[, ]+/g, '').replace('%', '').trim();
    const n = Number(cleaned);
    if (Number.isFinite(n)) {
      // If original had '%', convert to decimal if needed
      return raw.includes('%') ? (n >= 1 ? n : n * 100) : n;
    }
    return null;
  }
  
  if (typeof raw === 'object') {
    const maybe = raw.value ?? raw.rate ?? null;
    if (maybe == null) return null;
    const n = typeof maybe === 'number' ? maybe : Number(maybe);
    return Number.isFinite(n) ? n : null;
  }
  
  return null;
}

