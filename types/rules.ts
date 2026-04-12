export type ModifierKey =
  | 'disability'
  | 'fraud_concealment_mistake'
  | 'acknowledgment'
  | 'part_payment';

export type Question = {
  id: string;
  type: 'date' | 'boolean' | 'select';
  label: string;
  helpText?: string;
  required: boolean;
  showWhen?: {
    field: string;
    equals: string | boolean;
  };
};

export type Rule = {
  id: string;
  jurisdiction: 'england_wales';
  claimType:
    | 'simple_contract'
    | 'tort_non_pi'
    | 'personal_injury'
    | 'defamation'
    | 'deed_specialty'
    | 'professional_negligence'
    | 'debt_recovery'
    | 'contribution'
    | 'recovery_of_land'
    | 'breach_of_trust';
  title: string;
  statuteRef: {
    act: string;
    section: string;
    label: string;
  };
  version: string;
  lastReviewed: string;
  basePeriod: {
    unit: 'years' | 'months' | 'days';
    value: number;
  };
  startRule: 'accrual' | 'publication' | 'later_of_accrual_or_knowledge' | 'knowledge_with_longstop';
  longstopPeriod?: {
    unit: 'years' | 'months' | 'days';
    value: number;
  };
  supportedModifiers: ModifierKey[];
  questions: Question[];
  manualReviewTriggers: string[];
  notes?: string[];
};

export type CalculationInput = {
  claimType: Rule['claimType'];
  answers: Record<string, string | boolean | undefined>;
};

export type CalculationResult = {
  status: 'live' | 'expires_today' | 'expired' | 'manual_review';
  primaryExpiryDate?: string;
  adjustedExpiryDate?: string;
  daysRemaining?: number;
  statuteRefs: { act: string; section: string; label: string }[];
  explanationSteps: string[];
  warnings: string[];
  appliedModifiers: string[];
  ruleVersion: string;
};
