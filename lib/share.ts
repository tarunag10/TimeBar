import LZString from 'lz-string';
import { rules } from '@/lib/rules';
import { TIMEBAR_LIMITS } from '@/lib/limits';

// ── Types ──────────────────────────────────

export type ShareState = {
  claimType: string;
  answers: Record<string, string | boolean | undefined>;
};

// ── Encode / Decode ────────────────────────

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function allowedAnswerKeys(claimType: string): Set<string> | null {
  const rule = rules[claimType as keyof typeof rules];
  if (!rule) return null;
  return new Set(rule.questions.map((question) => question.id));
}

function sanitizeAnswers(
  claimType: string,
  answers: unknown,
): Record<string, string | boolean | undefined> | null {
  if (!isPlainObject(answers)) return null;
  const allowedKeys = allowedAnswerKeys(claimType);
  if (!allowedKeys) return null;

  const entries = Object.entries(answers);
  if (entries.length > TIMEBAR_LIMITS.answerMaxCount) return null;

  const sanitized: Record<string, string | boolean | undefined> = {};
  for (const [key, value] of entries) {
    if (
      key.length > TIMEBAR_LIMITS.answerKeyMaxLength ||
      !allowedKeys.has(key)
    ) {
      return null;
    }

    if (value === undefined || typeof value === 'boolean') {
      sanitized[key] = value;
      continue;
    }

    if (
      typeof value === 'string' &&
      value.length <= TIMEBAR_LIMITS.answerStringMaxLength
    ) {
      sanitized[key] = value;
      continue;
    }

    return null;
  }

  return sanitized;
}

function sanitizeShareState(value: unknown): ShareState | null {
  if (!isPlainObject(value) || typeof value.claimType !== 'string') {
    return null;
  }

  const answers = sanitizeAnswers(value.claimType, value.answers);
  if (!answers) return null;

  return { claimType: value.claimType, answers };
}

/**
 * Encode claim type + answers into a URL-safe compressed string.
 * Uses lz-string compressToEncodedURIComponent for short URLs.
 */
export function encodeShareState(state: ShareState): string {
  const sanitized = sanitizeShareState(state);
  if (!sanitized) return '';

  const json = JSON.stringify(sanitized);
  if (json.length > TIMEBAR_LIMITS.shareJsonMaxLength) return '';

  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decode a compressed share string back into ShareState.
 * Returns null if the string is invalid or corrupted.
 */
export function decodeShareState(encoded: string): ShareState | null {
  if (encoded.length > TIMEBAR_LIMITS.shareParamMaxLength) return null;

  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    if (json.length > TIMEBAR_LIMITS.shareJsonMaxLength) return null;

    const parsed = JSON.parse(json);
    return sanitizeShareState(parsed);
  } catch {
    return null;
  }
}

/**
 * Build a full shareable URL from the current page origin + claim state.
 */
export function buildShareURL(state: ShareState): string {
  const encoded = encodeShareState(state);
  if (!encoded) return '';
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/?s=${encoded}`;
}
