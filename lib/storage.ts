import { CalculationResult } from '@/types/rules';
import { generateId } from '@/lib/utils';

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
  type: 'claim_selected' | 'result_computed' | 'copy_clicked' | 'share_clicked' | 'ics_downloaded' | 'print_clicked';
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
    id: generateId(),
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

export function clearAllData(): void {
  if (isBrowser()) {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem('timebar_disclaimer_dismissed');
  }
}

// ── Draft Auto-Save ────────────────────────

const DRAFT_KEY = 'timebar_draft';
const DRAFT_MAX_AGE_MS = 24 * 60 * 60 * 1000; // 24 hours

export type DraftData = {
  claimType: string;
  answers: Record<string, string | boolean | undefined>;
  timestamp: number;
};

export function saveDraft(claimType: string, answers: Record<string, string | boolean | undefined>): void {
  safeSetJSON(DRAFT_KEY, { claimType, answers, timestamp: Date.now() });
}

export function getDraft(): DraftData | null {
  const draft = safeGetJSON<DraftData>(DRAFT_KEY);
  if (!draft) return null;
  // Expire drafts older than 24 hours
  if (Date.now() - draft.timestamp > DRAFT_MAX_AGE_MS) {
    clearDraft();
    return null;
  }
  return draft;
}

export function clearDraft(): void {
  if (isBrowser()) {
    localStorage.removeItem(DRAFT_KEY);
  }
}

// ── Onboarding ─────────────────────────────

const ONBOARDED_KEY = 'timebar_onboarded';

export function isOnboarded(): boolean {
  if (!isBrowser()) return false;
  try {
    return localStorage.getItem(ONBOARDED_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setOnboarded(): void {
  safeSetJSON(ONBOARDED_KEY, true);
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
