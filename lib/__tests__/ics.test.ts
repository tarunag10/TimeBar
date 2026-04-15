import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateIcsContent } from '../ics';
import { CalculationResult } from '@/types/rules';

function makeResult(overrides: Partial<CalculationResult> = {}): CalculationResult {
  return {
    status: 'live',
    primaryExpiryDate: '2030-06-15',
    daysRemaining: 1500,
    urgencyLevel: 'routine',
    confidenceLevel: 'high',
    scenarioSummary: 'Test',
    nextActions: [],
    reviewChecklist: [],
    proceduralMilestones: [],
    scenarioTimelines: [],
    statuteRefs: [{ act: 'Limitation Act 1980', section: 's.5', label: 'Test' }],
    explanationSteps: [],
    warnings: [],
    appliedModifiers: [],
    ruleVersion: '1.0.0',
    ...overrides,
  };
}

beforeEach(() => {
  vi.stubGlobal('crypto', { randomUUID: () => '00000000-0000-0000-0000-000000000000' });
});

describe('generateIcsContent', () => {
  it('returns null when no expiry date', () => {
    const result = makeResult({ primaryExpiryDate: undefined, adjustedExpiryDate: undefined });
    expect(generateIcsContent({ result, claimType: 'simple_contract' })).toBeNull();
  });

  it('generates valid VCALENDAR wrapper', () => {
    const ics = generateIcsContent({ result: makeResult(), claimType: 'simple_contract' })!;
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
  });

  it('sets correct DTSTART for known expiry', () => {
    const ics = generateIcsContent({ result: makeResult(), claimType: 'simple_contract' })!;
    expect(ics).toContain('DTSTART;VALUE=DATE:20300615');
    expect(ics).toContain('DTEND;VALUE=DATE:20300616');
  });

  it('includes 3 VALARM blocks', () => {
    const ics = generateIcsContent({ result: makeResult(), claimType: 'simple_contract' })!;
    const alarms = ics.match(/BEGIN:VALARM/g);
    expect(alarms).toHaveLength(3);
    expect(ics).toContain('TRIGGER:-P90D');
    expect(ics).toContain('TRIGGER:-P30D');
    expect(ics).toContain('TRIGGER:-P7D');
  });

  it('SUMMARY contains rule title', () => {
    const ics = generateIcsContent({ result: makeResult(), claimType: 'simple_contract' })!;
    expect(ics).toContain('SUMMARY:TimeBar: Simple Contract limitation deadline');
  });

  it('DESCRIPTION contains disclaimer', () => {
    const ics = generateIcsContent({ result: makeResult(), claimType: 'simple_contract' })!;
    expect(ics).toContain('not legal advice');
  });

  it('prefers adjustedExpiryDate over primaryExpiryDate', () => {
    const result = makeResult({ primaryExpiryDate: '2030-01-01', adjustedExpiryDate: '2031-03-20' });
    const ics = generateIcsContent({ result, claimType: 'simple_contract' })!;
    expect(ics).toContain('DTSTART;VALUE=DATE:20310320');
  });
});
