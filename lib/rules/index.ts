import { Rule } from '@/types/rules';
import { z } from 'zod';
import simpleContract from './ew.simple-contract.v1.json';
import tortNonPi from './ew.tort-non-pi.v1.json';
import personalInjury from './ew.personal-injury.v1.json';
import defamation from './ew.defamation.v1.json';
import deedSpecialty from './ew.deed-specialty.v1.json';
import professionalNegligence from './ew.professional-negligence.v1.json';
import debtRecovery from './ew.debt-recovery.v1.json';
import contribution from './ew.contribution.v1.json';
import recoveryOfLand from './ew.recovery-of-land.v1.json';
import breachOfTrust from './ew.breach-of-trust.v1.json';
import judgmentEnforcement from './ew.judgment-enforcement.v1.json';
import mortgagePrincipal from './ew.mortgage-principal.v1.json';
import mortgageInterest from './ew.mortgage-interest.v1.json';

const selectOptionSchema = z.object({
  value: z.string(),
  label: z.string(),
});

const questionSchema = z.object({
  id: z.string(),
  type: z.enum(['date', 'boolean', 'select']),
  label: z.string(),
  helpText: z.string().optional(),
  required: z.boolean(),
  options: z.array(selectOptionSchema).optional(),
  showWhen: z.object({ field: z.string(), equals: z.union([z.string(), z.boolean()]) }).optional(),
});

const ruleSchema = z.object({
  id: z.string(),
  jurisdiction: z.literal('england_wales'),
  claimType: z.enum([
    'simple_contract', 'tort_non_pi', 'personal_injury', 'defamation',
    'deed_specialty', 'professional_negligence', 'debt_recovery', 'contribution',
    'recovery_of_land', 'breach_of_trust', 'judgment_enforcement',
    'mortgage_principal', 'mortgage_interest',
  ]),
  title: z.string(),
  statuteRef: z.object({ act: z.string(), section: z.string(), label: z.string() }),
  version: z.string(),
  lastReviewed: z.string(),
  basePeriod: z.object({ unit: z.enum(['years', 'months', 'days']), value: z.number() }),
  startRule: z.enum(['accrual', 'publication', 'later_of_accrual_or_knowledge', 'knowledge_with_longstop']),
  longstopPeriod: z.object({ unit: z.enum(['years', 'months', 'days']), value: z.number() }).optional(),
  supportedModifiers: z.array(z.enum(['disability', 'fraud_concealment_mistake', 'acknowledgment', 'part_payment'])),
  questions: z.array(questionSchema),
  manualReviewTriggers: z.array(z.string()),
  notes: z.array(z.string()).optional(),
});

function validateRule(raw: unknown, label: string): Rule {
  const result = ruleSchema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Rule validation failed for ${label}: ${issues}`);
  }
  return result.data as Rule;
}

export const rules: Record<Rule['claimType'], Rule> = {
  simple_contract: validateRule(simpleContract, 'simple_contract'),
  tort_non_pi: validateRule(tortNonPi, 'tort_non_pi'),
  personal_injury: validateRule(personalInjury, 'personal_injury'),
  defamation: validateRule(defamation, 'defamation'),
  deed_specialty: validateRule(deedSpecialty, 'deed_specialty'),
  professional_negligence: validateRule(professionalNegligence, 'professional_negligence'),
  debt_recovery: validateRule(debtRecovery, 'debt_recovery'),
  contribution: validateRule(contribution, 'contribution'),
  recovery_of_land: validateRule(recoveryOfLand, 'recovery_of_land'),
  breach_of_trust: validateRule(breachOfTrust, 'breach_of_trust'),
  judgment_enforcement: validateRule(judgmentEnforcement, 'judgment_enforcement'),
  mortgage_principal: validateRule(mortgagePrincipal, 'mortgage_principal'),
  mortgage_interest: validateRule(mortgageInterest, 'mortgage_interest'),
};

export type ClaimCategory = {
  label: string;
  items: { key: Rule['claimType']; title: string; shortDesc: string }[];
};

export const claimCategories: ClaimCategory[] = [
  {
    label: 'Contract & Debt',
    items: [
      { key: 'simple_contract', title: 'Simple Contract', shortDesc: '6 years from Breach Date' },
      { key: 'deed_specialty', title: 'Deed Claim (Specialty Contract)', shortDesc: '12 years from Breach Date' },
      { key: 'debt_recovery', title: 'Debt Recovery', shortDesc: '6 years from Date Debt Became Due' },
    ],
  },
  {
    label: 'Tort & Negligence',
    items: [
      { key: 'tort_non_pi', title: 'Tort (Non-PI)', shortDesc: '6 years from Accrual Date' },
      { key: 'personal_injury', title: 'Personal Injury', shortDesc: '3 years from Later of Injury/Knowledge' },
      { key: 'professional_negligence', title: 'Professional Negligence', shortDesc: '6 years or 3-year Knowledge Rule (with 15-year longstop)' },
      { key: 'defamation', title: 'Defamation', shortDesc: '1 year from First Publication' },
    ],
  },
  {
    label: 'Specialist Claims',
    items: [
      { key: 'contribution', title: 'Contribution', shortDesc: '2 years from Judgment/Settlement Date' },
      { key: 'recovery_of_land', title: 'Recovery of Land', shortDesc: '12 years from Start of Adverse Possession' },
      { key: 'breach_of_trust', title: 'Breach of Trust', shortDesc: 'Usually 6 years (some claims have no limitation period)' },
    ],
  },
  {
    label: 'Property & Enforcement',
    items: [
      { key: 'judgment_enforcement', title: 'Judgment Enforcement', shortDesc: '6 years from Judgment Date' },
      { key: 'mortgage_principal', title: 'Mortgage Principal', shortDesc: '12 years from Date Principal Became Due' },
      { key: 'mortgage_interest', title: 'Mortgage Interest Arrears', shortDesc: '6 years from Interest Due Date' },
    ],
  },
];

export const claimTypes = claimCategories.flatMap((cat) => cat.items);

export function getRule(claimType: Rule['claimType']): Rule {
  return rules[claimType];
}
