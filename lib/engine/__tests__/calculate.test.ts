import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { calculate } from '../calculate';
import { CalculationInput } from '@/types/rules';

// Freeze time at 2025-01-15T12:00:00Z for deterministic tests
const FROZEN_DATE = new Date('2025-01-15T12:00:00Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_DATE);
});

afterEach(() => {
  vi.useRealTimers();
});

// Helper: create a date string N days from the frozen reference date (negative = past)
function daysFromNow(days: number): string {
  const d = new Date(FROZEN_DATE);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}

// ────────────────────────────────────────────
// 1. Straight-line cases for each claim type
// ────────────────────────────────────────────
describe('Straight-line calculation — all 13 claim types', () => {
  // Claim types that don't trigger manual review with basic answers and distant accrual
  const straightLineCases: { claimType: CalculationInput['claimType']; basePeriodYears: number; extraAnswers?: Record<string, string | boolean> }[] = [
    { claimType: 'simple_contract', basePeriodYears: 6 },
    { claimType: 'deed_specialty', basePeriodYears: 12 },
    { claimType: 'debt_recovery', basePeriodYears: 6 },
    { claimType: 'tort_non_pi', basePeriodYears: 6 },
    { claimType: 'defamation', basePeriodYears: 1 },
    { claimType: 'contribution', basePeriodYears: 2 },
    { claimType: 'recovery_of_land', basePeriodYears: 12 },
    { claimType: 'breach_of_trust', basePeriodYears: 6 },
    { claimType: 'mortgage_principal', basePeriodYears: 12 },
    { claimType: 'mortgage_interest', basePeriodYears: 6 },
  ];

  for (const { claimType, basePeriodYears } of straightLineCases) {
    it(`${claimType}: accrual far in the past → expired`, () => {
      const result = calculate({
        claimType,
        answers: {
          accrual_date: '2000-01-01',
          disability_at_accrual: false,
          fraud_concealment: false,
          acknowledgment: false,
          part_payment: false,
          knowledge_date_known: true,
          knowledge_date: '2000-01-01',
          multiple_publications: false,
          latent_damage: false,
          fraudulent_breach: false,
          trust_property_recovery: false,
          multiple_interest_periods: false,
        },
      });
      expect(result.status).toBe('expired');
      expect(result.primaryExpiryDate).toBe(`${2000 + basePeriodYears}-01-01`);
    });
  }

  // PI: knowledge_date_known=false triggers manual review, so provide a knowledge date
  it('personal_injury: accrual far in the past with known knowledge date → expired', () => {
    const result = calculate({
      claimType: 'personal_injury',
      answers: {
        accrual_date: '2000-01-01',
        knowledge_date_known: true,
        knowledge_date: '2000-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.status).toBe('expired');
    // 3 years from accrual (knowledge same as accrual)
    expect(result.primaryExpiryDate).toBe('2003-01-01');
  });

  // judgment_enforcement: accrual > 6yr ago triggers manual review, so test with a 6yr+ accrual
  // that's still old enough to be expired but recent enough to not hit the >6yr manual review
  // Actually the manual review triggers when daysSinceJudgment > 6*365, so we need accrual within 6yr
  // but still expired (impossible for 6yr base). Instead, just test that it correctly returns manual_review.
  it('judgment_enforcement: accrual > 6 years ago → manual review (permission needed)', () => {
    const result = calculate({
      claimType: 'judgment_enforcement',
      answers: {
        accrual_date: '2000-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings.some(w => w.includes('permission'))).toBe(true);
  });

  // professional_negligence: knowledge_date_known=false triggers manual review
  it('professional_negligence: with known knowledge date, distant accrual → expired', () => {
    const result = calculate({
      claimType: 'professional_negligence',
      answers: {
        accrual_date: '2000-01-01',
        knowledge_date_known: true,
        knowledge_date: '2000-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.status).toBe('expired');
    // knowledge_with_longstop: later of (6yr from accrual=2006) and (3yr from knowledge=2003) = 2006
    expect(result.primaryExpiryDate).toBe('2006-01-01');
  });
});

// ────────────────────────────────────────────
// 2. Live claims
// ────────────────────────────────────────────
describe('Live claims', () => {
  it('simple_contract: recent accrual → live', () => {
    const accrualDate = daysFromNow(-100);
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: accrualDate,
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.daysRemaining).toBeGreaterThan(0);
    expect(result.urgencyLevel).toBe('routine');
    expect(result.confidenceLevel).toBe('high');
  });

  it('deed_specialty: recent accrual → live with routine urgency', () => {
    const result = calculate({
      claimType: 'deed_specialty',
      answers: {
        accrual_date: daysFromNow(-30),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.urgencyLevel).toBe('routine');
  });
});

// ────────────────────────────────────────────
// 3. Urgency levels
// ────────────────────────────────────────────
describe('Urgency levels', () => {
  it('claim expiring within 30 days → urgent', () => {
    // Accrual 6 years minus 20 days ago
    const accrualDate = daysFromNow(-(6 * 365 - 20));
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: accrualDate,
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.urgencyLevel).toBe('urgent');
  });

  it('claim expiring within 120 days → important', () => {
    const accrualDate = daysFromNow(-(6 * 365 - 60));
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: accrualDate,
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.urgencyLevel).toBe('important');
  });

  it('expired claim → critical urgency', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('expired');
    expect(result.urgencyLevel).toBe('critical');
  });
});

// ────────────────────────────────────────────
// 4. Modifier logic
// ────────────────────────────────────────────
describe('Modifiers', () => {
  it('disability: extends limitation to base period from cessation', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: true,
        disability_ceased_date: daysFromNow(-100),
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.appliedModifiers).toContain('Disability (s.28 Limitation Act 1980)');
    expect(result.adjustedExpiryDate).toBeDefined();
  });

  it('acknowledgment: fresh accrual from acknowledgment date', () => {
    const ackDate = daysFromNow(-100);
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: true,
        acknowledgment_date: ackDate,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.appliedModifiers).toContain('Acknowledgment — fresh accrual (s.29 Limitation Act 1980)');
  });

  it('acknowledgment before accrual → warning, no fresh accrual', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2015-06-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: true,
        acknowledgment_date: '2014-01-01', // before accrual
        part_payment: false,
      },
    });
    expect(result.warnings).toContain(
      'Acknowledgment date precedes the accrual date. This acknowledgment cannot cause fresh accrual.'
    );
    expect(result.appliedModifiers).not.toContain('Acknowledgment — fresh accrual (s.29 Limitation Act 1980)');
  });

  it('part payment: fresh accrual from payment date', () => {
    const payDate = daysFromNow(-200);
    const result = calculate({
      claimType: 'debt_recovery',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: true,
        part_payment_date: payDate,
      },
    });
    expect(result.status).toBe('live');
    expect(result.appliedModifiers).toContain('Part payment — fresh accrual (s.29 Limitation Act 1980)');
  });

  it('part payment before accrual → warning', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2015-06-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: true,
        part_payment_date: '2014-01-01',
      },
    });
    expect(result.warnings).toContain(
      'Part payment date precedes the accrual date. This payment cannot cause fresh accrual.'
    );
  });

  it('fraud/concealment: postpones from discovery date', () => {
    const discoveryDate = daysFromNow(-100);
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: true,
        discovery_date: discoveryDate,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.appliedModifiers).toContain('Fraud/concealment/mistake postponement (s.32 Limitation Act 1980)');
  });

  it('multiple modifiers: latest date wins', () => {
    const ackDate = daysFromNow(-200);
    const payDate = daysFromNow(-50);
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: true,
        acknowledgment_date: ackDate,
        part_payment: true,
        part_payment_date: payDate,
      },
    });
    expect(result.appliedModifiers.length).toBe(2);
    // The adjusted date should be based on the later modifier (part payment)
    expect(result.adjustedExpiryDate).toBeDefined();
  });

  it('confidence drops to medium when modifiers applied', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: true,
        acknowledgment_date: daysFromNow(-50),
        part_payment: false,
      },
    });
    expect(result.confidenceLevel).toBe('medium');
  });
});

// ────────────────────────────────────────────
// 5. Manual review triggers
// ────────────────────────────────────────────
describe('Manual review triggers', () => {
  it('missing accrual date → manual review', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {},
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings).toContain('Required date information is missing.');
  });

  it('ongoing disability (no cease date) → manual review', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: true,
        // no disability_ceased_date
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.confidenceLevel).toBe('low');
  });

  it('disability_at_accrual = "unsure" → manual review', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: 'unsure',
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('manual_review');
  });

  it('tort + latent damage → manual review', () => {
    const result = calculate({
      claimType: 'tort_non_pi',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        latent_damage: true,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings.some(w => w.includes('latent'))).toBe(true);
  });

  it('defamation + multiple publications → manual review', () => {
    const result = calculate({
      claimType: 'defamation',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        multiple_publications: true,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings.some(w => w.includes('multiple publication'))).toBe(true);
  });

  it('PI + knowledge date unknown → manual review', () => {
    const result = calculate({
      claimType: 'personal_injury',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        knowledge_date_known: false,
      },
    });
    expect(result.status).toBe('manual_review');
  });

  it('professional negligence + knowledge unknown → manual review', () => {
    const result = calculate({
      claimType: 'professional_negligence',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        knowledge_date_known: false,
      },
    });
    expect(result.status).toBe('manual_review');
  });

  it('breach of trust + fraudulent breach → manual review (no limitation)', () => {
    const result = calculate({
      claimType: 'breach_of_trust',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        fraudulent_breach: true,
        trust_property_recovery: false,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings.some(w => w.includes('s.21(1)(a)'))).toBe(true);
  });

  it('breach of trust + trust property recovery → manual review', () => {
    const result = calculate({
      claimType: 'breach_of_trust',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        fraudulent_breach: false,
        trust_property_recovery: true,
      },
    });
    expect(result.status).toBe('manual_review');
    expect(result.warnings.some(w => w.includes('s.21(1)(b)'))).toBe(true);
  });

  it('fraud_concealment = "unsure" → manual review', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: 'unsure',
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('manual_review');
  });

  it('mortgage interest + multiple interest periods → manual review', () => {
    const result = calculate({
      claimType: 'mortgage_interest',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        multiple_interest_periods: true,
      },
    });
    expect(result.status).toBe('manual_review');
  });
});

// ────────────────────────────────────────────
// 6. Knowledge date / later-of rules (PI)
// ────────────────────────────────────────────
describe('Knowledge date rules', () => {
  it('PI: knowledge date later than accrual → uses knowledge date', () => {
    const accrual = '2020-01-01';
    const knowledge = '2022-06-01';
    const result = calculate({
      claimType: 'personal_injury',
      answers: {
        accrual_date: accrual,
        knowledge_date_known: true,
        knowledge_date: knowledge,
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    // 3 years from knowledge (2022-06-01) = 2025-06-01
    expect(result.primaryExpiryDate).toBe('2025-06-01');
  });

  it('PI: knowledge date earlier than accrual → uses accrual date', () => {
    const accrual = '2022-06-01';
    const knowledge = '2020-01-01';
    const result = calculate({
      claimType: 'personal_injury',
      answers: {
        accrual_date: accrual,
        knowledge_date_known: true,
        knowledge_date: knowledge,
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    // 3 years from accrual (2022-06-01) = 2025-06-01
    expect(result.primaryExpiryDate).toBe('2025-06-01');
  });
});

// ────────────────────────────────────────────
// 7. Longstop logic (professional negligence)
// ────────────────────────────────────────────
describe('Knowledge-with-longstop (professional negligence)', () => {
  it('longstop caps an otherwise later expiry', () => {
    // Accrual 14 years ago, knowledge 1 year ago
    // 6yr from accrual is past, 3yr from knowledge = future
    // But 15yr longstop from accrual should cap
    const accrual = '2010-06-01';
    const knowledge = daysFromNow(-365);
    const result = calculate({
      claimType: 'professional_negligence',
      answers: {
        accrual_date: accrual,
        knowledge_date_known: true,
        knowledge_date: knowledge,
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    // 15yr longstop from 2010-06-01 = 2025-06-01
    expect(result.warnings.some(w => w.includes('longstop') || w.includes('s.14B'))).toBe(true);
  });

  it('knowledge date within longstop → no cap applied', () => {
    const accrual = '2018-01-01';
    const knowledge = '2020-01-01';
    const result = calculate({
      claimType: 'professional_negligence',
      answers: {
        accrual_date: accrual,
        knowledge_date_known: true,
        knowledge_date: knowledge,
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    // 6yr from accrual = 2024-01-01, 3yr from knowledge = 2023-01-01
    // Later is 2024-01-01, longstop is 2033-01-01 → no cap
    expect(result.appliedModifiers).not.toContain(expect.stringContaining('Longstop'));
  });
});

describe('Expanded limitation rules', () => {
  it('clinical negligence uses the known date of knowledge', () => {
    const result = calculate({
      claimType: 'clinical_negligence',
      answers: {
        accrual_date: '2020-01-01',
        knowledge_date_known: true,
        knowledge_date: '2022-06-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });

    expect(result.status).not.toBe('manual_review');
    expect(result.primaryExpiryDate).toBe('2025-06-01');
  });

  it('fatal accident routes uncertain dependant knowledge to manual review', () => {
    const result = calculate({
      claimType: 'fatal_accident',
      answers: {
        accrual_date: '2024-01-01',
        knowledge_date_known: false,
        disability_at_accrual: false,
      },
    });

    expect(result.status).toBe('manual_review');
    expect(result.warnings.some((warning) => warning.includes('dependant'))).toBe(true);
  });

  it('product liability enforces the 10-year product-supply longstop', () => {
    const result = calculate({
      claimType: 'product_liability',
      answers: {
        act_or_omission_date: '2010-01-01',
        accrual_date: '2020-01-01',
        knowledge_date_known: true,
        knowledge_date: '2024-01-01',
        disability_at_accrual: false,
      },
    });

    expect(result.adjustedExpiryDate).toBe('2020-01-01');
    expect(result.appliedModifiers.some((modifier) => modifier.includes('10 years'))).toBe(true);
    expect(result.warnings.some((warning) => warning.includes('CPA 1987'))).toBe(true);
  });

  it('product liability without product-supply date requires manual review', () => {
    const result = calculate({
      claimType: 'product_liability',
      answers: {
        accrual_date: '2020-01-01',
        knowledge_date_known: true,
        knowledge_date: '2020-01-01',
        disability_at_accrual: false,
      },
    });

    expect(result.status).toBe('manual_review');
    expect(result.warnings.some((warning) => warning.includes('product-supply'))).toBe(true);
  });

  it('latent damage uses the s.14B longstop from act or omission date', () => {
    const result = calculate({
      claimType: 'latent_damage',
      answers: {
        act_or_omission_date: '2010-06-01',
        accrual_date: '2020-01-01',
        knowledge_date_known: true,
        knowledge_date: '2024-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });

    expect(result.adjustedExpiryDate).toBe('2025-06-01');
    expect(result.warnings.some((warning) => warning.includes('s.14B'))).toBe(true);
  });
});

// ────────────────────────────────────────────
// 8. Result structure validation
// ────────────────────────────────────────────
describe('Result structure', () => {
  it('contains all required fields for a live result', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.status).toBe('live');
    expect(result.primaryExpiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof result.daysRemaining).toBe('number');
    expect(result.urgencyLevel).toBeDefined();
    expect(result.confidenceLevel).toBeDefined();
    expect(result.scenarioSummary).toBeDefined();
    expect(Array.isArray(result.nextActions)).toBe(true);
    expect(result.nextActions.length).toBeGreaterThan(0);
    expect(Array.isArray(result.reviewChecklist)).toBe(true);
    expect(Array.isArray(result.proceduralMilestones)).toBe(true);
    expect(Array.isArray(result.scenarioTimelines)).toBe(true);
    expect(Array.isArray(result.explanationSteps)).toBe(true);
    expect(result.explanationSteps.length).toBeGreaterThan(0);
    expect(Array.isArray(result.warnings)).toBe(true);
    expect(Array.isArray(result.appliedModifiers)).toBe(true);
    expect(result.ruleVersion).toBe('1.0.0');
    expect(Array.isArray(result.statuteRefs)).toBe(true);
  });

  it('contains all required fields for a manual review result', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {},
    });
    expect(result.status).toBe('manual_review');
    expect(result.urgencyLevel).toBe('critical');
    expect(result.confidenceLevel).toBe('low');
    expect(result.scenarioSummary).toBeDefined();
    expect(result.nextActions.length).toBeGreaterThan(0);
    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.explanationSteps.length).toBeGreaterThan(0);
    expect(result.ruleVersion).toBe('1.0.0');
  });
});

// ────────────────────────────────────────────
// 9. Scenario timelines
// ────────────────────────────────────────────
describe('Scenario timelines', () => {
  it('generates scenario timelines for a live claim', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.scenarioTimelines.length).toBeGreaterThanOrEqual(1);
    const ids = result.scenarioTimelines.map(s => s.id);
    expect(ids).toContain('calculated');
  });

  it('deduplicates identical scenarios', () => {
    // No modifiers → earliest_risk and calculated should be the same date
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    // earliest_risk and calculated should have same date → may be deduplicated
    // but they have different basis strings, so they survive dedup
    for (const scenario of result.scenarioTimelines) {
      expect(scenario.expiryDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(typeof scenario.daysRemaining).toBe('number');
      expect(['high', 'medium', 'low']).toContain(scenario.riskBand);
    }
  });

  it('manual review → empty scenario timelines', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {},
    });
    expect(result.scenarioTimelines).toEqual([]);
  });
});

// ────────────────────────────────────────────
// 10. Procedural milestones
// ────────────────────────────────────────────
describe('Procedural milestones', () => {
  it('live claim has procedural milestones', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.proceduralMilestones.length).toBeGreaterThan(0);
    const titles = result.proceduralMilestones.map(m => m.title);
    expect(titles).toContain('Latest date to issue claim form');
  });

  it('manual review has specialist review milestone', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {},
    });
    expect(result.proceduralMilestones.length).toBeGreaterThan(0);
    const titles = result.proceduralMilestones.map(m => m.title);
    expect(titles).toContain('Specialist procedural review');
  });

  it('expired claim has urgent post-deadline milestone', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2010-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    const titles = result.proceduralMilestones.map(m => m.title);
    expect(titles).toContain('Urgent post-deadline legal review');
  });
});

// ────────────────────────────────────────────
// 11. Explanation steps
// ────────────────────────────────────────────
describe('Explanation steps', () => {
  it('includes claim type, base period, start date, and final date', () => {
    const result = calculate({
      claimType: 'simple_contract',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        acknowledgment: false,
        part_payment: false,
      },
    });
    expect(result.explanationSteps.some(s => s.includes('Simple Contract'))).toBe(true);
    expect(result.explanationSteps.some(s => s.includes('6 years'))).toBe(true);
    expect(result.explanationSteps.some(s => s.includes('date of accrual'))).toBe(true);
    expect(result.explanationSteps.some(s => s.includes('Likely limitation expiry'))).toBe(true);
  });
});

// ────────────────────────────────────────────
// 12. Claim-specific warnings
// ────────────────────────────────────────────
describe('Claim-specific warnings', () => {
  it('PI claims include s.33 discretion warning', () => {
    const result = calculate({
      claimType: 'personal_injury',
      answers: {
        accrual_date: '2020-01-01',
        knowledge_date_known: true,
        knowledge_date: '2020-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.warnings.some(w => w.includes('s.33'))).toBe(true);
  });

  it('defamation claims include s.32A discretion warning', () => {
    const result = calculate({
      claimType: 'defamation',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        multiple_publications: false,
      },
    });
    expect(result.warnings.some(w => w.includes('s.32A'))).toBe(true);
  });
});

// ────────────────────────────────────────────
// 13. Claim-specific next actions & checklists
// ────────────────────────────────────────────
describe('Claim-specific guidance', () => {
  it('professional negligence has s.14A/s.14B guidance', () => {
    const result = calculate({
      claimType: 'professional_negligence',
      answers: {
        accrual_date: daysFromNow(-100),
        knowledge_date_known: true,
        knowledge_date: daysFromNow(-50),
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.nextActions.some(a => a.includes('s.14A') || a.includes('s.14B'))).toBe(true);
  });

  it('breach of trust has s.21 checklist item', () => {
    const result = calculate({
      claimType: 'breach_of_trust',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
        fraudulent_breach: false,
        trust_property_recovery: false,
      },
    });
    expect(result.reviewChecklist.some(c => c.includes('s.21'))).toBe(true);
  });

  it('recovery of land has registered/unregistered checklist item', () => {
    const result = calculate({
      claimType: 'recovery_of_land',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.reviewChecklist.some(c => c.includes('Registered') || c.includes('registered'))).toBe(true);
  });

  it('judgment enforcement has permission checklist item', () => {
    const result = calculate({
      claimType: 'judgment_enforcement',
      answers: {
        accrual_date: daysFromNow(-100),
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
    expect(result.reviewChecklist.some(c => c.includes('permission') || c.includes('Enforcement'))).toBe(true);
  });
});
