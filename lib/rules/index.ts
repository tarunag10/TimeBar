import { Rule } from '@/types/rules';
import simpleContract from './ew.simple-contract.v1.json';
import tortNonPi from './ew.tort-non-pi.v1.json';
import personalInjury from './ew.personal-injury.v1.json';
import defamation from './ew.defamation.v1.json';

export const rules: Record<Rule['claimType'], Rule> = {
  simple_contract: simpleContract as Rule,
  tort_non_pi: tortNonPi as Rule,
  personal_injury: personalInjury as Rule,
  defamation: defamation as Rule,
};

export const claimTypes = [
  { key: 'simple_contract' as const, title: 'Simple Contract', shortDesc: '6 yrs · breach' },
  { key: 'tort_non_pi' as const, title: 'Tort (Non-PI)', shortDesc: '6 yrs · accrual' },
  { key: 'personal_injury' as const, title: 'Personal Injury', shortDesc: '3 yrs' },
  { key: 'defamation' as const, title: 'Defamation', shortDesc: '1 yr · publication' },
] as const;

export function getRule(claimType: Rule['claimType']): Rule {
  return rules[claimType];
}
