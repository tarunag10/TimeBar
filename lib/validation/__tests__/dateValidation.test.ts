import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { validateDateNotFuture, validateDateOrder } from '../calculatorSchema';

// Freeze time for deterministic tests
const FROZEN_DATE = new Date('2025-01-15T12:00:00Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FROZEN_DATE);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('validateDateNotFuture', () => {
  it('returns null for a past date', () => {
    expect(validateDateNotFuture('2020-01-01')).toBeNull();
  });

  it('returns null for today', () => {
    const today = '2025-01-15'; // matches FROZEN_DATE
    expect(validateDateNotFuture(today)).toBeNull();
  });

  it('returns error for a future date', () => {
    const result = validateDateNotFuture('2026-01-15');
    expect(result).toBeTruthy();
    expect(result).toContain('future');
  });
});

describe('validateDateOrder', () => {
  it('returns null when later >= earlier', () => {
    expect(validateDateOrder('2020-01-01', '2021-06-15', 'Test')).toBeNull();
  });

  it('returns null when dates are the same', () => {
    expect(validateDateOrder('2020-01-01', '2020-01-01', 'Test')).toBeNull();
  });

  it('returns error when later < earlier', () => {
    const result = validateDateOrder('2021-06-15', '2020-01-01', 'Test context');
    expect(result).toBeTruthy();
    expect(result).toContain('Test context');
  });
});
