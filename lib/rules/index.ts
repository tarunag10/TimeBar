import { Rule } from '@/types/rules';
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

export const rules: Record<Rule['claimType'], Rule> = {
  simple_contract: simpleContract as Rule,
  tort_non_pi: tortNonPi as Rule,
  personal_injury: personalInjury as Rule,
  defamation: defamation as Rule,
  deed_specialty: deedSpecialty as Rule,
  professional_negligence: professionalNegligence as Rule,
  debt_recovery: debtRecovery as Rule,
  contribution: contribution as Rule,
  recovery_of_land: recoveryOfLand as Rule,
  breach_of_trust: breachOfTrust as Rule,
  judgment_enforcement: judgmentEnforcement as Rule,
  mortgage_principal: mortgagePrincipal as Rule,
  mortgage_interest: mortgageInterest as Rule,
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
