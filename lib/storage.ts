import { CalculationResult } from '@/types/rules';
import { generateId } from '@/lib/utils';
import { TIMEBAR_LIMITS } from '@/lib/limits';

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

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isAnswerMap(value: unknown): value is Record<string, string | boolean | undefined> {
  if (!isPlainObject(value)) return false;
  const entries = Object.entries(value);
  if (entries.length > TIMEBAR_LIMITS.answerMaxCount) return false;

  return entries.every(([key, answer]) => {
    if (key.length > TIMEBAR_LIMITS.answerKeyMaxLength) return false;
    if (answer === undefined || typeof answer === 'boolean') return true;
    return typeof answer === 'string' && answer.length <= TIMEBAR_LIMITS.answerStringMaxLength;
  });
}

function isHistoryEntry(value: unknown): value is HistoryEntry {
  return (
    isPlainObject(value) &&
    typeof value.id === 'string' &&
    typeof value.claimType === 'string' &&
    typeof value.accrualDate === 'string' &&
    ['live', 'expires_today', 'expired', 'manual_review'].includes(String(value.status)) &&
    (typeof value.expiryDate === 'string' || value.expiryDate === null) &&
    typeof value.timestamp === 'number' &&
    isAnswerMap(value.answers)
  );
}

function isAnalyticsEvent(value: unknown): value is AnalyticsEvent {
  return (
    isPlainObject(value) &&
    ['claim_selected', 'result_computed', 'copy_clicked', 'share_clicked', 'ics_downloaded', 'print_clicked'].includes(String(value.type)) &&
    (value.claimType === undefined || typeof value.claimType === 'string') &&
    (value.status === undefined || typeof value.status === 'string') &&
    typeof value.timestamp === 'number'
  );
}

function isDraftData(value: unknown): value is DraftData {
  return (
    isPlainObject(value) &&
    typeof value.claimType === 'string' &&
    typeof value.timestamp === 'number' &&
    isAnswerMap(value.answers)
  );
}

// ── History ────────────────────────────────

export function getHistory(): HistoryEntry[] {
  const entries = safeGetJSON<unknown>(HISTORY_KEY);
  if (!Array.isArray(entries)) return [];
  return entries.filter(isHistoryEntry).slice(0, TIMEBAR_LIMITS.historyMaxEntries);
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
  safeSetJSON(HISTORY_KEY, entries.slice(0, TIMEBAR_LIMITS.historyMaxEntries));
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
export type DraftData = {
  claimType: string;
  answers: Record<string, string | boolean | undefined>;
  timestamp: number;
};

export function saveDraft(claimType: string, answers: Record<string, string | boolean | undefined>): void {
  if (!isAnswerMap(answers)) return;
  safeSetJSON(DRAFT_KEY, { claimType, answers, timestamp: Date.now() });
}

export function getDraft(): DraftData | null {
  const draft = safeGetJSON<unknown>(DRAFT_KEY);
  if (!isDraftData(draft)) return null;
  // Expire drafts older than 24 hours
  if (Date.now() - draft.timestamp > TIMEBAR_LIMITS.draftMaxAgeMs) {
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
  const events = safeGetJSON<unknown>(ANALYTICS_KEY);
  if (!Array.isArray(events)) return [];
  return events.filter(isAnalyticsEvent).slice(-TIMEBAR_LIMITS.analyticsMaxEvents);
}

export function trackEvent(event: Omit<AnalyticsEvent, 'timestamp'>): void {
  const events = getAnalyticsEvents();
  events.push({ ...event, timestamp: Date.now() });
  // Keep newest entries, cap at max
  safeSetJSON(ANALYTICS_KEY, events.slice(-TIMEBAR_LIMITS.analyticsMaxEvents));
}
