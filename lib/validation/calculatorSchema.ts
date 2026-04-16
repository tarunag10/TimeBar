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
  ]),
  answers: z.record(z.string(), z.union([z.string(), z.boolean(), z.undefined()])),
});

export const dateFieldSchema = dateString;

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
