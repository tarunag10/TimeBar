import { addYears, addMonths, addDays, differenceInCalendarDays, parseISO, format } from 'date-fns';
import { Rule, CalculationInput, CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { checkManualReview } from './manualReview';
import { applyModifiers } from './modifiers';
import { buildExplanation } from './explain';

function addPeriod(date: Date, period: { unit: string; value: number }): Date {
  switch (period.unit) {
    case 'years': return addYears(date, period.value);
    case 'months': return addMonths(date, period.value);
    case 'days': return addDays(date, period.value);
    default: return addYears(date, period.value);
  }
}

function determineStartDate(rule: Rule, answers: Record<string, string | boolean | undefined>): Date | null {
  const accrualStr = answers.accrual_date as string | undefined;
  if (!accrualStr) return null;

  const accrualDate = parseISO(accrualStr);

  if (rule.startRule === 'later_of_accrual_or_knowledge') {
    const knowledgeKnown = answers.knowledge_date_known;
    if (knowledgeKnown === true) {
      const knowledgeStr = answers.knowledge_date as string | undefined;
      if (knowledgeStr) {
        const knowledgeDate = parseISO(knowledgeStr);
        return knowledgeDate > accrualDate ? knowledgeDate : accrualDate;
      }
    }
  }

  return accrualDate;
}

export function calculate(input: CalculationInput): CalculationResult {
  const rule = getRule(input.claimType);
  const { answers } = input;

  // Check manual review triggers first
  const manualReviewResult = checkManualReview(rule, answers);
  if (manualReviewResult) {
    return manualReviewResult;
  }

  const startDate = determineStartDate(rule, answers);
  if (!startDate) {
    return {
      status: 'manual_review',
      warnings: ['Required date information is missing.'],
      explanationSteps: ['Cannot calculate: accrual date not provided.'],
      statuteRefs: [rule.statuteRef],
      appliedModifiers: [],
      ruleVersion: rule.version,
    };
  }

  // Calculate base expiry
  const baseExpiry = addPeriod(startDate, rule.basePeriod);

  // Apply modifiers
  const modifierResult = applyModifiers(rule, answers, startDate, baseExpiry);

  const finalExpiry = modifierResult.adjustedExpiry || baseExpiry;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysRemaining = differenceInCalendarDays(finalExpiry, today);

  let status: CalculationResult['status'];
  if (daysRemaining > 0) {
    status = 'live';
  } else if (daysRemaining === 0) {
    status = 'expires_today';
  } else {
    status = 'expired';
  }

  const primaryExpiryStr = format(baseExpiry, 'yyyy-MM-dd');
  const adjustedExpiryStr = modifierResult.adjustedExpiry
    ? format(modifierResult.adjustedExpiry, 'yyyy-MM-dd')
    : undefined;

  const explanationSteps = buildExplanation(
    rule,
    answers,
    startDate,
    baseExpiry,
    modifierResult,
  );

  const warnings: string[] = [...modifierResult.warnings];

  // Add PI/defamation discretion warnings
  if (rule.claimType === 'personal_injury') {
    warnings.push(
      'The court has discretion under s.33 Limitation Act 1980 to disapply the time limit in personal injury cases. This tool cannot predict the exercise of judicial discretion.'
    );
  }
  if (rule.claimType === 'defamation') {
    warnings.push(
      'The court has discretion under s.32A Limitation Act 1980 to disapply the 1-year time limit. This tool cannot predict the exercise of judicial discretion.'
    );
  }

  return {
    status,
    primaryExpiryDate: primaryExpiryStr,
    adjustedExpiryDate: adjustedExpiryStr,
    daysRemaining,
    statuteRefs: [rule.statuteRef],
    explanationSteps,
    warnings,
    appliedModifiers: modifierResult.appliedModifiers,
    ruleVersion: rule.version,
  };
}
