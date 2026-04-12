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
};

export type ClaimCategory = {
  label: string;
  items: { key: Rule['claimType']; title: string; shortDesc: string }[];
};

export const claimCategories: ClaimCategory[] = [
  {
    label: 'Contract & Debt',
    items: [
      { key: 'simple_contract', title: 'Simple Contract', shortDesc: '6 yrs · breach' },
      { key: 'deed_specialty', title: 'Deed / Specialty', shortDesc: '12 yrs · breach' },
      { key: 'debt_recovery', title: 'Debt Recovery', shortDesc: '6 yrs · debt due' },
    ],
  },
  {
    label: 'Tort & Negligence',
    items: [
      { key: 'tort_non_pi', title: 'Tort (Non-PI)', shortDesc: '6 yrs · accrual' },
      { key: 'personal_injury', title: 'Personal Injury', shortDesc: '3 yrs · knowledge' },
      { key: 'professional_negligence', title: 'Professional Negligence', shortDesc: '6 yrs + longstop' },
      { key: 'defamation', title: 'Defamation', shortDesc: '1 yr · publication' },
    ],
  },
  {
    label: 'Specialist Claims',
    items: [
      { key: 'contribution', title: 'Contribution', shortDesc: '2 yrs · judgment' },
      { key: 'recovery_of_land', title: 'Recovery of Land', shortDesc: '12 yrs · possession' },
      { key: 'breach_of_trust', title: 'Breach of Trust', shortDesc: '6 yrs · breach' },
    ],
  },
];

export const claimTypes = claimCategories.flatMap((cat) => cat.items);

export function getRule(claimType: Rule['claimType']): Rule {
  return rules[claimType];
}
