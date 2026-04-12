import { format } from 'date-fns';
import { Rule } from '@/types/rules';
import { ModifierResult } from './modifiers';

function formatDate(date: Date): string {
  return format(date, 'd MMMM yyyy');
}

export function buildExplanation(
  rule: Rule,
  answers: Record<string, string | boolean | undefined>,
  startDate: Date,
  baseExpiry: Date,
  modifierResult: ModifierResult,
): string[] {
  const steps: string[] = [];

  // Step 1: Claim type
  steps.push(`Selected claim type: ${rule.title}`);

  // Step 2: Base period
  steps.push(
    `Base limitation period: ${rule.basePeriod.value} ${rule.basePeriod.unit} (${rule.statuteRef.act}, ${rule.statuteRef.section})`
  );

  // Step 3: Start date
  if (rule.startRule === 'later_of_accrual_or_knowledge') {
    const knowledgeKnown = answers.knowledge_date_known;
    if (knowledgeKnown === true && answers.knowledge_date) {
      const accrualStr = formatDate(startDate);
      steps.push(
        `Start date: ${accrualStr} (later of date of injury and date of knowledge)`
      );
    } else {
      steps.push(`Start date: ${formatDate(startDate)} (date of injury)`);
    }
  } else if (rule.startRule === 'publication') {
    steps.push(`Start date: ${formatDate(startDate)} (date of publication)`);
  } else {
    steps.push(`Start date: ${formatDate(startDate)} (date of accrual)`);
  }

  // Step 4: Modifiers
  if (modifierResult.appliedModifiers.length > 0) {
    for (const mod of modifierResult.appliedModifiers) {
      steps.push(`Modifier applied: ${mod}`);
    }
  } else {
    steps.push('No modifiers applied');
  }

  // Step 5: Final date
  const finalExpiry = modifierResult.adjustedExpiry || baseExpiry;
  steps.push(`Base expiry date: ${formatDate(baseExpiry)}`);
  if (modifierResult.adjustedExpiry) {
    steps.push(`Adjusted expiry date: ${formatDate(modifierResult.adjustedExpiry)}`);
  }
  steps.push(`Likely limitation expiry: ${formatDate(finalExpiry)}`);

  // Step 6: Warnings
  if (modifierResult.warnings.length > 0) {
    for (const warning of modifierResult.warnings) {
      steps.push(`Warning: ${warning}`);
    }
  }

  return steps;
}
