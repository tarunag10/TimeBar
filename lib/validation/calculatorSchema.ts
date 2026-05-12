import { z } from 'zod';
import { format } from 'date-fns';

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').refine(
  (val) => {
    const date = new Date(val);
    return !isNaN(date.getTime());
  },
  { message: 'Invalid date' }
);

export const calculatorInputSchema = z.object({
  claimType: z.enum([
    'simple_contract',
    'tort_non_pi',
    'personal_injury',
    'defamation',
    'deed_specialty',
    'professional_negligence',
    'debt_recovery',
    'contribution',
    'recovery_of_land',
    'breach_of_trust',
    'judgment_enforcement',
    'mortgage_principal',
    'mortgage_interest',
    'clinical_negligence',
    'fatal_accident',
    'product_liability',
    'conversion',
    'unjust_enrichment',
    'latent_damage',
    'hra_claim',
  ]),
  answers: z.record(z.string(), z.union([z.string(), z.boolean(), z.undefined()])),
});

export const dateFieldSchema = dateString;

/** Minimum year for date inputs — dates before 1900 are almost certainly errors */
export const DATE_MIN_YEAR = 1900;
/** Maximum year for date inputs — dates after 2100 are almost certainly errors */
export const DATE_MAX_YEAR = 2100;

/**
 * Validate that a date string falls within a reasonable year range.
 * Returns an error message or null if valid.
 */
export function validateDateRange(dateStr: string): string | null {
  const year = parseInt(dateStr.slice(0, 4), 10);
  if (isNaN(year)) return 'Invalid date format.';
  if (year < DATE_MIN_YEAR) return `Year must be ${DATE_MIN_YEAR} or later. Dates before ${DATE_MIN_YEAR} are not accepted.`;
  if (year > DATE_MAX_YEAR) return `Year must be ${DATE_MAX_YEAR} or earlier. Dates after ${DATE_MAX_YEAR} are not accepted.`;
  return null;
}

export function validateDateNotFuture(dateStr: string): string | null {
  // Compare lexicographically to avoid UTC vs local timezone issues
  // with new Date('YYYY-MM-DD') parsing as midnight UTC.
  const today = format(new Date(), 'yyyy-MM-dd');
  if (dateStr > today) {
    return 'Date cannot be in the future for an accrual event that has already occurred.';
  }
  return null;
}

export function validateDateOrder(earlierStr: string, laterStr: string, context: string): string | null {
  // Compare lexicographically to avoid timezone parsing issues
  if (laterStr < earlierStr) {
    return `${context}: the second date cannot be before the first date.`;
  }
  return null;
}

/**
 * Comprehensive inline date validation for a single field.
 * Checks: format, range (1900–2100), future date, and optional date ordering.
 * Returns the first error found, or null if valid.
 */
export function validateDateInline(
  dateStr: string,
  options?: { mustBeAfter?: string; afterLabel?: string }
): string | null {
  // Format check
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return 'Enter the date in DD/MM/YYYY format.';
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return 'Invalid date. Please enter a valid date.';
  }

  // Range check
  const rangeError = validateDateRange(dateStr);
  if (rangeError) return rangeError;

  // Future date check (warning, not hard block for accrual_date)
  const futureError = validateDateNotFuture(dateStr);
  if (futureError) return futureError;

  // Date ordering check
  if (options?.mustBeAfter) {
    const label = options.afterLabel ?? 'the earlier date';
    const orderError = validateDateOrder(options.mustBeAfter, dateStr, `This date must not be before ${label}`);
    if (orderError) return orderError;
  }

  return null;
}
