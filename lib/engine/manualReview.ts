import { Rule, CalculationResult } from '@/types/rules';

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
