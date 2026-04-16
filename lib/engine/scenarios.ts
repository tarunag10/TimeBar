import { addYears, differenceInCalendarDays, format, parseISO } from 'date-fns';
import { Rule, ScenarioTimeline } from '@/types/rules';
import { addPeriod } from './utils';

type Answers = Record<string, string | boolean | undefined>;

function iso(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function buildScenarioTimelines(
  rule: Rule,
  answers: Answers,
  baseExpiry: Date,
  finalExpiry: Date,
  adjustedExpiry: Date | null,
  longstopExpiry: Date | null,
): ScenarioTimeline[] {
  const accrualStr = answers.accrual_date as string | undefined;
  if (!accrualStr) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const accrualDate = parseISO(accrualStr);

  // Earliest risk: strict accrual-driven date, no modifiers.
  let earliestRiskDate = addPeriod(accrualDate, rule.basePeriod);
  if (rule.startRule === 'knowledge_with_longstop' && longstopExpiry && earliestRiskDate > longstopExpiry) {
    earliestRiskDate = longstopExpiry;
  }

  // Latest arguable: best-case from stated facts, including modifier dates.
  let latestArguableDate = finalExpiry;
  let latestBasis = 'Calculated using entered facts and applicable modifiers.';

  const knowledgeStr = answers.knowledge_date as string | undefined;
  if (
    (rule.startRule === 'later_of_accrual_or_knowledge' || rule.startRule === 'knowledge_with_longstop') &&
    answers.knowledge_date_known === true &&
    knowledgeStr
  ) {
    const knowledgeDate = parseISO(knowledgeStr);
    if (rule.startRule === 'later_of_accrual_or_knowledge') {
      const candidate = addPeriod(knowledgeDate, rule.basePeriod);
      if (candidate > latestArguableDate) {
        latestArguableDate = candidate;
        latestBasis = 'Assumes the later date of knowledge is upheld as the operative start date.';
      }
    }
    if (rule.startRule === 'knowledge_with_longstop') {
      const knowledgeCandidate = addYears(knowledgeDate, 3);
      const accrualCandidate = addYears(accrualDate, 6);
      let candidate = knowledgeCandidate > accrualCandidate ? knowledgeCandidate : accrualCandidate;
      if (longstopExpiry && candidate > longstopExpiry) {
        candidate = longstopExpiry;
      }
      if (candidate > latestArguableDate) {
        latestArguableDate = candidate;
        latestBasis = 'Assumes knowledge-date analysis gives a later date within any longstop cap.';
      }
    }
  }

  if (adjustedExpiry && adjustedExpiry >= latestArguableDate) {
    latestArguableDate = adjustedExpiry;
    latestBasis = 'Assumes all entered postponement/fresh-accrual modifiers are sustained.';
  }

  const scenarios: ScenarioTimeline[] = [
    {
      id: 'earliest_risk',
      label: 'Earliest Risk Date',
      expiryDate: iso(earliestRiskDate),
      daysRemaining: differenceInCalendarDays(earliestRiskDate, today),
      riskBand: 'high',
      basis: 'Strict accrual-based reading with no modifier benefit.',
    },
    {
      id: 'calculated',
      label: 'Calculated Date',
      expiryDate: iso(finalExpiry),
      daysRemaining: differenceInCalendarDays(finalExpiry, today),
      riskBand: 'medium',
      basis: 'Primary engine output using the facts currently entered.',
    },
    {
      id: 'latest_arguable',
      label: 'Latest Arguable Date',
      expiryDate: iso(latestArguableDate),
      daysRemaining: differenceInCalendarDays(latestArguableDate, today),
      riskBand: 'low',
      basis: latestBasis,
    },
  ];

  // De-duplicate identical scenarios while preserving order.
  const seen = new Set<string>();
  return scenarios.filter((s) => {
    const key = `${s.expiryDate}-${s.basis}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
