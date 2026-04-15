import { describe, it, expect } from 'vitest';
import { validateDateNotFuture, validateDateOrder } from '../calculatorSchema';

describe('validateDateNotFuture', () => {
  it('returns null for a past date', () => {
    expect(validateDateNotFuture('2020-01-01')).toBeNull();
  });

  it('returns null for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(validateDateNotFuture(today)).toBeNull();
  });

  it('returns error for a future date', () => {
    const future = new Date();
    future.setFullYear(future.getFullYear() + 1);
    const futureStr = future.toISOString().split('T')[0];
    const result = validateDateNotFuture(futureStr);
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
