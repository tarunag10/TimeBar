import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Rule, CalculationResult } from '@/types/rules';
import { buildProceduralMilestones } from './procedural';

function manualNextActions(rule: Rule): string[] {
  const actions = [
    'Prepare a dated chronology of key events and all potential accrual/knowledge dates.',
    'Obtain limitation advice from an England & Wales-qualified lawyer before issuing or enforcing proceedings.',
    'Preserve evidence supporting dates, acknowledgments, and payment history.',
  ];

  if (rule.claimType === 'professional_negligence') {
    actions.push('Obtain specialist advice on s.14A knowledge date and s.14B longstop interaction.');
  }
  if (rule.claimType === 'breach_of_trust') {
    actions.push('Confirm whether s.21 no-limitation exceptions apply on pleaded facts.');
  }
  if (rule.claimType === 'judgment_enforcement') {
    actions.push('Review CPR requirements for enforcement where more than 6 years may have elapsed.');
  }

  return actions;
}

function manualChecklist(rule: Rule): string[] {
  const checklist = [
    'Verify the legally correct accrual/start date against pleadable facts.',
    'Verify whether any postponement, acknowledgment, or payment rules apply.',
    'Check court discretion or procedural gateways before relying on any date output.',
  ];

  if (rule.claimType === 'defamation') {
    checklist.push('Check whether publication facts trigger single-publication or multiple-publication analysis.');
  }
  if (rule.claimType === 'mortgage_interest') {
    checklist.push('Break arrears into separate periods where interest accrued in tranches.');
  }
  if (rule.claimType === 'recovery_of_land') {
    checklist.push('Confirm whether registered-land rules under the Land Registration Act 2002 are engaged.');
  }

  return checklist;
}

export function checkManualReview(
  rule: Rule,
  answers: Record<string, string | boolean | undefined>,
): CalculationResult | null {
  const warnings: string[] = [];
  const explanationSteps: string[] = [];

  // "Unsure" on disability
  if (answers.disability_at_accrual === 'unsure') {
    warnings.push(
      'You indicated uncertainty about whether the claimant was under a disability. Disability can significantly affect the limitation period. Manual legal review is required.'
    );
    explanationSteps.push('Disability status is uncertain — manual review required.');
  }

  // Tort: latent damage indicated
  if (rule.claimType === 'tort_non_pi' && answers.latent_damage === true) {
    warnings.push(
      'You indicated the damage may be latent. The special knowledge-based limitation regime under s.14A Limitation Act 1980 (Latent Damage Act 1986) may apply. This tool does not calculate that regime in v1.'
    );
    explanationSteps.push('Possible latent damage — standard 6-year rule may not apply.');
  }

  // Defamation: multiple publications
  if (rule.claimType === 'defamation' && answers.multiple_publications === true) {
    warnings.push(
      'You indicated multiple publication events or online republications. The single publication rule under s.8 Defamation Act 2013 may not apply, and each publication may give rise to a separate cause of action. Manual review is required.'
    );
    explanationSteps.push('Multiple publications indicated — single publication rule may not apply.');
  }

  // PI: knowledge date unknown
  if (
    rule.claimType === 'personal_injury' &&
    answers.knowledge_date_known === false
  ) {
    warnings.push(
      'You indicated the claimant\'s date of knowledge is not known. Under s.11/s.14 Limitation Act 1980, the limitation period may run from the date of knowledge rather than the date of injury. If the date of knowledge cannot be identified with reasonable confidence, manual legal review is required.'
    );
    explanationSteps.push('Date of knowledge is unknown — cannot determine if later-of rule applies.');
  }

  // Professional negligence: knowledge date unknown/disputed
  if (
    rule.claimType === 'professional_negligence' &&
    answers.knowledge_date_known === false
  ) {
    warnings.push(
      'You indicated the claimant\'s date of knowledge is not known. Professional negligence claims may rely on the s.14A knowledge-based period (3 years from knowledge), with a separate longstop under s.14B. Manual legal review is required where knowledge is uncertain.'
    );
    explanationSteps.push('Professional negligence knowledge date uncertain — s.14A analysis required.');
  }

  // Mortgage interest usually needs period-by-period treatment if arrears are rolling
  if (
    rule.claimType === 'mortgage_interest' &&
    answers.multiple_interest_periods === true
  ) {
    warnings.push(
      'You indicated multiple/rolling interest arrears periods. Mortgage interest claims commonly require period-by-period analysis of each arrears tranche. Manual legal review is required.'
    );
    explanationSteps.push('Multiple mortgage interest arrears periods indicated — single-date calculation may be misleading.');
  }

  // Judgment enforcement: after 6 years, permission issues may arise
  if (rule.claimType === 'judgment_enforcement') {
    const accrualStr = answers.accrual_date as string | undefined;
    if (accrualStr) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysSinceJudgment = differenceInCalendarDays(today, parseISO(accrualStr));
      if (daysSinceJudgment > (6 * 365)) {
        warnings.push(
          'More than 6 years has elapsed since the judgment date. Enforcement may require court permission under procedural rules and should be manually reviewed.'
        );
        explanationSteps.push('Judgment appears older than 6 years — permission-based enforcement issues may apply.');
      }
    }
  }

  // Breach of trust: no-limitation scenarios under s.21(1)
  if (rule.claimType === 'breach_of_trust' && answers.fraudulent_breach === true) {
    warnings.push(
      'You indicated a fraudulent breach of trust. Under s.21(1)(a) Limitation Act 1980, no limitation period applies in this scenario. Manual legal review is required to confirm classification and remedy scope.'
    );
    explanationSteps.push('Fraudulent breach of trust indicated — no statutory limitation period (s.21(1)(a)).');
  }

  if (rule.claimType === 'breach_of_trust' && answers.trust_property_recovery === true) {
    warnings.push(
      'You indicated a claim to recover trust property (or proceeds) from a trustee. Under s.21(1)(b) Limitation Act 1980, no limitation period applies where trust property is in the trustee’s possession or converted to their use. Manual legal review is required.'
    );
    explanationSteps.push('Trust property recovery from trustee indicated — no statutory limitation period (s.21(1)(b)).');
  }

  // Fraud/concealment indicated but no discovery date and "unsure" response
  if (
    answers.fraud_concealment === 'unsure'
  ) {
    warnings.push(
      'You indicated uncertainty about whether fraud, concealment, or mistake is relevant. This could significantly affect the limitation period. Manual legal review is required.'
    );
    explanationSteps.push('Fraud/concealment/mistake status uncertain — manual review required.');
  }

  // Ongoing disability with no cease date
  if (
    answers.disability_at_accrual === true &&
    !answers.disability_ceased_date
  ) {
    warnings.push(
      'Disability is ongoing and no cease date is available. The limitation period does not begin to run until disability ceases. A definitive expiry date cannot be calculated.'
    );
    explanationSteps.push('Ongoing disability — limitation period suspended.');
  }

  if (warnings.length > 0) {
    return {
      status: 'manual_review',
      urgencyLevel: 'critical',
      confidenceLevel: 'low',
      scenarioSummary: 'This scenario requires specialist legal review before a reliable limitation deadline can be stated.',
      nextActions: manualNextActions(rule),
      reviewChecklist: manualChecklist(rule),
      proceduralMilestones: buildProceduralMilestones('manual_review', null, new Date()),
      scenarioTimelines: [],
      warnings,
      explanationSteps: [
        `Selected claim type: ${rule.title}`,
        `Base period: ${rule.basePeriod.value} ${rule.basePeriod.unit} (${rule.statuteRef.act}, ${rule.statuteRef.section})`,
        ...explanationSteps,
        'Manual review required — this tool cannot provide a confident calculation for this scenario.',
      ],
      statuteRefs: [rule.statuteRef],
      appliedModifiers: [],
      ruleVersion: rule.version,
    };
  }

  return null;
}
