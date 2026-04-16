import { parseISO } from 'date-fns';
import { Rule } from '@/types/rules';
import { addPeriod } from './utils';

export type ModifierResult = {
  adjustedExpiry: Date | null;
  appliedModifiers: string[];
  warnings: string[];
};

function isLater(a: Date, b: Date | null): boolean {
  if (!b) return true;
  return a.getTime() > b.getTime();
}

export function applyModifiers(
  rule: Rule,
  answers: Record<string, string | boolean | undefined>,
  startDate: Date,
  baseExpiry: Date,
): ModifierResult {
  let latestExpiry: Date | null = null;
  const appliedModifiers: string[] = [];
  const warnings: string[] = [];

  // Disability postponement
  if (
    rule.supportedModifiers.includes('disability') &&
    answers.disability_at_accrual === true
  ) {
    const ceasedStr = answers.disability_ceased_date as string | undefined;
    if (ceasedStr) {
      const ceasedDate = parseISO(ceasedStr);
      const disabilityExpiry = addPeriod(ceasedDate, rule.basePeriod);
      if (isLater(disabilityExpiry, latestExpiry)) {
        latestExpiry = disabilityExpiry;
      }
      appliedModifiers.push('Disability (s.28 Limitation Act 1980)');
    } else {
      warnings.push(
        'Disability is ongoing. The limitation period does not run while the claimant is under a disability. A definitive expiry date cannot be calculated until disability ceases.'
      );
    }
  }

  // Fraud / concealment / mistake postponement
  if (
    rule.supportedModifiers.includes('fraud_concealment_mistake') &&
    answers.fraud_concealment === true
  ) {
    const discoveryStr = answers.discovery_date as string | undefined;
    if (discoveryStr) {
      const discoveryDate = parseISO(discoveryStr);
      const fraudExpiry = addPeriod(discoveryDate, rule.basePeriod);
      if (isLater(fraudExpiry, latestExpiry)) {
        latestExpiry = fraudExpiry;
      }
      appliedModifiers.push('Fraud/concealment/mistake postponement (s.32 Limitation Act 1980)');
    } else {
      warnings.push(
        'Fraud, concealment, or mistake indicated but discovery date not provided. Cannot calculate postponed limitation period.'
      );
    }
  }

  // Acknowledgment — fresh accrual
  if (
    rule.supportedModifiers.includes('acknowledgment') &&
    answers.acknowledgment === true
  ) {
    const ackStr = answers.acknowledgment_date as string | undefined;
    if (ackStr) {
      const ackDate = parseISO(ackStr);
      if (ackDate >= startDate) {
        const ackExpiry = addPeriod(ackDate, rule.basePeriod);
        if (isLater(ackExpiry, latestExpiry)) {
          latestExpiry = ackExpiry;
        }
        appliedModifiers.push('Acknowledgment — fresh accrual (s.29 Limitation Act 1980)');
      } else {
        warnings.push(
          'Acknowledgment date precedes the accrual date. This acknowledgment cannot cause fresh accrual.'
        );
      }
    }
  }

  // Part payment — fresh accrual
  if (
    rule.supportedModifiers.includes('part_payment') &&
    answers.part_payment === true
  ) {
    const payStr = answers.part_payment_date as string | undefined;
    if (payStr) {
      const payDate = parseISO(payStr);
      if (payDate >= startDate) {
        const payExpiry = addPeriod(payDate, rule.basePeriod);
        if (isLater(payExpiry, latestExpiry)) {
          latestExpiry = payExpiry;
        }
        appliedModifiers.push('Part payment — fresh accrual (s.29 Limitation Act 1980)');
      } else {
        warnings.push(
          'Part payment date precedes the accrual date. This payment cannot cause fresh accrual.'
        );
      }
    }
  }

  // Only return adjusted expiry if it differs from base
  const adjusted = latestExpiry && latestExpiry.getTime() !== baseExpiry.getTime()
    ? latestExpiry
    : null;

  return {
    adjustedExpiry: adjusted,
    appliedModifiers,
    warnings,
  };
}
