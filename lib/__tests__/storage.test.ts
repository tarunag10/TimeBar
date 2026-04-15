// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getHistory,
  addHistoryEntry,
  removeHistoryEntry,
  clearHistory,
  getAnalyticsEvents,
  trackEvent,
} from '../storage';

beforeEach(() => {
  localStorage.clear();
});

describe('History CRUD', () => {
  it('starts empty', () => {
    expect(getHistory()).toEqual([]);
  });

  it('adds an entry', () => {
    addHistoryEntry({
      claimType: 'simple_contract',
      accrualDate: '2020-01-01',
      status: 'expired',
      expiryDate: '2026-01-01',
      answers: { accrual_date: '2020-01-01' },
    });
    const h = getHistory();
    expect(h).toHaveLength(1);
    expect(h[0].claimType).toBe('simple_contract');
    expect(h[0].id).toBeTruthy();
    expect(h[0].timestamp).toBeGreaterThan(0);
  });

  it('caps at 10 entries', () => {
    for (let i = 0; i < 15; i++) {
      addHistoryEntry({
        claimType: 'simple_contract',
        accrualDate: `2020-01-${String(i + 1).padStart(2, '0')}`,
        status: 'live',
        expiryDate: '2026-01-01',
        answers: {},
      });
    }
    expect(getHistory()).toHaveLength(10);
  });

  it('deduplicates top entry with same claimType + accrualDate', () => {
    addHistoryEntry({
      claimType: 'simple_contract',
      accrualDate: '2020-01-01',
      status: 'live',
      expiryDate: '2026-01-01',
      answers: {},
    });
    addHistoryEntry({
      claimType: 'simple_contract',
      accrualDate: '2020-01-01',
      status: 'expired',
      expiryDate: '2026-01-01',
      answers: {},
    });
    const h = getHistory();
    expect(h).toHaveLength(1);
    expect(h[0].status).toBe('expired'); // latest
  });

  it('removes an entry by id', () => {
    addHistoryEntry({
      claimType: 'simple_contract',
      accrualDate: '2020-01-01',
      status: 'live',
      expiryDate: '2026-01-01',
      answers: {},
    });
    const id = getHistory()[0].id;
    removeHistoryEntry(id);
    expect(getHistory()).toHaveLength(0);
  });

  it('clears all history', () => {
    addHistoryEntry({
      claimType: 'simple_contract',
      accrualDate: '2020-01-01',
      status: 'live',
      expiryDate: '2026-01-01',
      answers: {},
    });
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});

describe('Analytics', () => {
  it('starts empty', () => {
    expect(getAnalyticsEvents()).toEqual([]);
  });

  it('tracks an event', () => {
    trackEvent({ type: 'claim_selected', claimType: 'simple_contract' });
    const events = getAnalyticsEvents();
    expect(events).toHaveLength(1);
    expect(events[0].type).toBe('claim_selected');
    expect(events[0].timestamp).toBeGreaterThan(0);
  });

  it('caps at 100 events (keeps newest)', () => {
    for (let i = 0; i < 110; i++) {
      trackEvent({ type: 'claim_selected', claimType: `type_${i}` });
    }
    const events = getAnalyticsEvents();
    expect(events).toHaveLength(100);
    // Should have kept the last 100 (indices 10-109)
    expect(events[0].claimType).toBe('type_10');
  });
});
