import { CalculationResult } from '@/types/rules';

// ── Types ──────────────────────────────────

export type HistoryEntry = {
  id: string;
  claimType: string;
  accrualDate: string;
  status: CalculationResult['status'];
  expiryDate: string | null;
  timestamp: number;
  answers: Record<string, string | boolean | undefined>;
};

export type AnalyticsEvent = {
  type: 'claim_selected' | 'result_computed' | 'copy_clicked' | 'ics_downloaded' | 'print_clicked';
  claimType?: string;
  status?: string;
  timestamp: number;
};

// ── Constants ──────────────────────────────

const HISTORY_KEY = 'timebar_history';
const ANALYTICS_KEY = 'timebar_analytics';
const HISTORY_MAX = 10;
const ANALYTICS_MAX = 100;

// ── Helpers ────────────────────────────────

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function safeGetJSON<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function safeSetJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or unavailable — silently ignore
  }
}

// ── History ────────────────────────────────

export function getHistory(): HistoryEntry[] {
  return safeGetJSON<HistoryEntry[]>(HISTORY_KEY) ?? [];
}

export function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>): void {
  const entries = getHistory();

  // Deduplicate: if top entry has same claimType + accrualDate, replace it
  if (
    entries.length > 0 &&
    entries[0].claimType === entry.claimType &&
    entries[0].accrualDate === entry.accrualDate
  ) {
    entries.shift();
  }

  const newEntry: HistoryEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };

  entries.unshift(newEntry);
  safeSetJSON(HISTORY_KEY, entries.slice(0, HISTORY_MAX));
}

export function removeHistoryEntry(id: string): void {
  const entries = getHistory().filter((e) => e.id !== id);
  safeSetJSON(HISTORY_KEY, entries);
}

export function clearHistory(): void {
  if (isBrowser()) {
    localStorage.removeItem(HISTORY_KEY);
  }
}

// ── Analytics ──────────────────────────────

export function getAnalyticsEvents(): AnalyticsEvent[] {
  return safeGetJSON<AnalyticsEvent[]>(ANALYTICS_KEY) ?? [];
}

export function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
  const events = getAnalyticsEvents();
  events.push({ ...event, timestamp: Date.now() });
  // Keep newest entries, cap at max
  safeSetJSON(ANALYTICS_KEY, events.slice(-ANALYTICS_MAX));
}
