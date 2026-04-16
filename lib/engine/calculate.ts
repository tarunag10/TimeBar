import { differenceInCalendarDays, parseISO, format } from 'date-fns';
import { Rule, CalculationInput, CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';
import { calculatorInputSchema } from '@/lib/validation/calculatorSchema';
import { addPeriod } from './utils';
import { checkManualReview } from './manualReview';
import { applyModifiers } from './modifiers';
import { buildExplanation } from './explain';
import { buildProceduralMilestones } from './procedural';
import { buildScenarioTimelines } from './scenarios';

function determineStartDate(rule: Rule, answers: Record<string, string | boolean | undefined>): Date | null {
  const accrualStr = answers.accrual_date as string | undefined;
  if (!accrualStr) return null;

  const accrualDate = parseISO(accrualStr);

  if (rule.startRule === 'later_of_accrual_or_knowledge' || rule.startRule === 'knowledge_with_longstop') {
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

function determineKnowledgeRuleExpiry(rule: Rule, answers: Record<string, string | boolean | undefined>): Date | null {
  const accrualStr = answers.accrual_date as string | undefined;
  if (!accrualStr) return null;

  const accrualDate = parseISO(accrualStr);

  if (rule.startRule !== 'knowledge_with_longstop') {
    return null;
  }

  const accrualExpiry = addPeriod(accrualDate, rule.basePeriod);
  const knowledgeKnown = answers.knowledge_date_known;

  if (knowledgeKnown === true) {
    const knowledgeStr = answers.knowledge_date as string | undefined;
    if (knowledgeStr) {
      const knowledgeDate = parseISO(knowledgeStr);
      const knowledgeExpiry = addPeriod(knowledgeDate, { unit: 'years', value: 3 });
      return knowledgeExpiry > accrualExpiry ? knowledgeExpiry : accrualExpiry;
    }
  }

  return accrualExpiry;
}

function getUrgencyLevel(status: CalculationResult['status'], daysRemaining?: number): CalculationResult['urgencyLevel'] {
  if (status === 'manual_review' || status === 'expired' || status === 'expires_today') {
    return 'critical';
  }
  if (typeof daysRemaining !== 'number') return 'important';
  if (daysRemaining <= 30) return 'urgent';
  if (daysRemaining <= 120) return 'important';
  return 'routine';
}

function getConfidenceLevel(
  status: CalculationResult['status'],
  warnings: string[],
  appliedModifiers: string[],
): CalculationResult['confidenceLevel'] {
  if (status === 'manual_review') return 'low';
  if (warnings.length > 1) return 'low';
  if (warnings.length > 0 || appliedModifiers.length > 0) return 'medium';
  return 'high';
}

function buildScenarioSummary(
  status: CalculationResult['status'],
  daysRemaining: number,
  expiryLabel: string,
): string {
  if (status === 'expired') {
    return `The calculated limitation date (${expiryLabel}) appears to have passed by ${Math.abs(daysRemaining)} day(s).`;
  }
  if (status === 'expires_today') {
    return `The calculated limitation date is today (${expiryLabel}). Immediate legal action may be required.`;
  }
  return `The claim appears in time with an estimated limitation date of ${expiryLabel} (${daysRemaining} day(s) remaining).`;
}

function buildNextActions(
  rule: Rule,
  status: CalculationResult['status'],
  daysRemaining: number,
): string[] {
  const actions: string[] = [
    'Preserve and date-stamp source evidence for all entered dates and modifiers.',
    'Set internal reminders before the calculated deadline (for example: 90, 30, and 7 days).',
  ];

  if (status === 'expired' || status === 'expires_today') {
    actions.unshift('Obtain urgent limitation advice on potential extension/discretion routes before taking next steps.');
    actions.push('Assess whether any claim-specific judicial discretion or postponement routes remain available.');
  } else if (daysRemaining <= 30) {
    actions.unshift('Treat this file as urgent: prepare final pleadings and issue strategy immediately.');
  } else if (daysRemaining <= 120) {
    actions.unshift('Prioritize this file for pre-issue review and evidence finalization.');
  } else {
    actions.unshift('Maintain active monitoring and re-check limitation if facts or dates change.');
  }

  if (rule.claimType === 'professional_negligence') {
    actions.push('Keep a separate record of both accrual analysis and knowledge-date analysis (s.14A/s.14B).');
  }
  if (rule.claimType === 'defamation') {
    actions.push('Confirm whether republication facts could alter the operative publication date.');
  }
  if (rule.claimType === 'mortgage_interest') {
    actions.push('Separate each arrears period if interest accrued over multiple intervals.');
  }

  return actions;
}

function buildReviewChecklist(rule: Rule): string[] {
  const checklist = [
    'Accrual/start date supported by documentary evidence.',
    'Any modifier dates (discovery, acknowledgment, part payment, disability cessation) verified.',
    'Claim pleaded in the correct legal category (for example deed vs simple contract).',
    'Procedural timetable (issue/service/enforcement steps) checked separately from substantive limitation.',
  ];

  if (rule.claimType === 'recovery_of_land') {
    checklist.push('Registered vs unregistered land position confirmed.');
  }
  if (rule.claimType === 'judgment_enforcement') {
    checklist.push('Enforcement route checked against any permission requirements.');
  }
  if (rule.claimType === 'breach_of_trust') {
    checklist.push('Verified whether s.21 no-limitation exceptions apply.');
  }

  return checklist;
}

export function calculate(input: CalculationInput): CalculationResult {
  // Validate input with Zod schema
  const parsed = calculatorInputSchema.safeParse(input);
  if (!parsed.success) {
    // Guard: claimType may be invalid, so getRule could throw
    let rule: Rule;
    try {
      rule = getRule(input.claimType);
    } catch {
      // Fallback rule reference for the error result
      return {
        status: 'manual_review',
        urgencyLevel: 'critical',
        confidenceLevel: 'low',
        scenarioSummary: 'Invalid input: the data provided could not be validated.',
        nextActions: [
          'Check that all required fields are filled in correctly.',
          'Re-run the calculator with valid data.',
        ],
        reviewChecklist: [
          'Input data validated against expected format.',
        ],
        proceduralMilestones: [{ title: 'Specialist procedural review', priority: 'critical', note: 'Confirm the applicable procedural route before relying on any deadline.' }],
        scenarioTimelines: [],
        warnings: ['Invalid input data: ' + parsed.error.issues.map((i) => i.message).join('; ')],
        explanationSteps: ['Cannot calculate: input validation failed.'],
        statuteRefs: [],
        appliedModifiers: [],
        ruleVersion: 'unknown',
      };
    }
    return {
      status: 'manual_review',
      urgencyLevel: 'critical',
      confidenceLevel: 'low',
      scenarioSummary: 'Invalid input: the data provided could not be validated.',
      nextActions: [
        'Check that all required fields are filled in correctly.',
        'Re-run the calculator with valid data.',
      ],
      reviewChecklist: [
        'Input data validated against expected format.',
      ],
      proceduralMilestones: buildProceduralMilestones('manual_review', null, new Date()),
      scenarioTimelines: [],
      warnings: ['Invalid input data: ' + parsed.error.issues.map((i) => i.message).join('; ')],
      explanationSteps: ['Cannot calculate: input validation failed.'],
      statuteRefs: [rule.statuteRef],
      appliedModifiers: [],
      ruleVersion: rule.version,
    };
  }

  const rule = getRule(parsed.data.claimType);
  const { answers } = parsed.data;

  // Check manual review triggers first
  const manualReviewResult = checkManualReview(rule, answers);
  if (manualReviewResult) {
    return manualReviewResult;
  }

  const startDate = determineStartDate(rule, answers);
  if (!startDate) {
    return {
      status: 'manual_review',
      urgencyLevel: 'critical',
      confidenceLevel: 'low',
      scenarioSummary: 'A reliable limitation date cannot be calculated because essential date data is missing.',
      nextActions: [
        'Identify and verify the core accrual/start date from source documents.',
        'Re-run the calculator once required dates are available.',
      ],
      reviewChecklist: [
        'Accrual/start date established.',
        'Core claim classification confirmed.',
      ],
      proceduralMilestones: buildProceduralMilestones('manual_review', null, new Date()),
      scenarioTimelines: [],
      warnings: ['Required date information is missing.'],
      explanationSteps: ['Cannot calculate: accrual date not provided.'],
      statuteRefs: [rule.statuteRef],
      appliedModifiers: [],
      ruleVersion: rule.version,
    };
  }

  // Calculate base expiry
  const baseExpiry =
    determineKnowledgeRuleExpiry(rule, answers) ?? addPeriod(startDate, rule.basePeriod);

  // Apply modifiers
  const modifierResult = applyModifiers(rule, answers, startDate, baseExpiry);

  let adjustedExpiry = modifierResult.adjustedExpiry || null;
  let finalExpiry = adjustedExpiry || baseExpiry;
  let longstopExpiry: Date | null = null;
  let longstopApplied = false;

  if (rule.startRule === 'knowledge_with_longstop' && rule.longstopPeriod) {
    // s.14B longstop runs from the date of the negligent act or omission,
    // NOT from the date of damage/accrual. Use act_or_omission_date if available,
    // falling back to accrual_date for backwards compatibility.
    const longstopBaseStr = (answers.act_or_omission_date as string | undefined) || (answers.accrual_date as string | undefined);
    if (longstopBaseStr) {
      longstopExpiry = addPeriod(parseISO(longstopBaseStr), rule.longstopPeriod);
      if (finalExpiry > longstopExpiry) {
        finalExpiry = longstopExpiry;
        adjustedExpiry = longstopExpiry;
        longstopApplied = true;
        modifierResult.appliedModifiers.push(
          `Longstop cap (${rule.longstopPeriod.value} ${rule.longstopPeriod.unit} from date of act/omission)`
        );
        modifierResult.warnings.push(
          'The calculated date has been capped by the 15-year longstop (s.14B Limitation Act 1980), which runs from the date of the negligent act or omission.'
        );
      }
    }
  }

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
  const adjustedExpiryStr = adjustedExpiry
    ? format(adjustedExpiry, 'yyyy-MM-dd')
    : undefined;

  const explanationSteps = buildExplanation(
    rule,
    answers,
    startDate,
    baseExpiry,
    modifierResult,
    longstopExpiry,
    longstopApplied,
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
  if (status === 'live' && daysRemaining <= 90) {
    warnings.push(
      'This claim is within 90 days of the calculated limitation date. Urgent legal action may be needed.'
    );
  }

  const displayExpiry = format(finalExpiry, 'd MMMM yyyy');
  const urgencyLevel = getUrgencyLevel(status, daysRemaining);
  const confidenceLevel = getConfidenceLevel(status, warnings, modifierResult.appliedModifiers);
  const scenarioSummary = buildScenarioSummary(status, daysRemaining, displayExpiry);
  const nextActions = buildNextActions(rule, status, daysRemaining);
  const reviewChecklist = buildReviewChecklist(rule);
  const proceduralMilestones = buildProceduralMilestones(status, finalExpiry, today);
  const scenarioTimelines = buildScenarioTimelines(
    rule,
    answers,
    baseExpiry,
    finalExpiry,
    adjustedExpiry,
    longstopExpiry,
  );

  return {
    status,
    primaryExpiryDate: primaryExpiryStr,
    adjustedExpiryDate: adjustedExpiryStr,
    daysRemaining,
    urgencyLevel,
    confidenceLevel,
    scenarioSummary,
    nextActions,
    reviewChecklist,
    proceduralMilestones,
    scenarioTimelines,
    statuteRefs: [rule.statuteRef],
    explanationSteps,
    warnings,
    appliedModifiers: modifierResult.appliedModifiers,
    ruleVersion: rule.version,
  };
}
