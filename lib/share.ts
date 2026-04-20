import LZString from 'lz-string';

// ── Types ──────────────────────────────────

export type ShareState = {
  claimType: string;
  answers: Record<string, string | boolean | undefined>;
};

// ── Encode / Decode ────────────────────────

/**
 * Encode claim type + answers into a URL-safe compressed string.
 * Uses lz-string compressToEncodedURIComponent for short URLs.
 */
export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  return LZString.compressToEncodedURIComponent(json);
}

/**
 * Decode a compressed share string back into ShareState.
 * Returns null if the string is invalid or corrupted.
 */
export function decodeShareState(encoded: string): ShareState | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(encoded);
    if (!json) return null;
    const parsed = JSON.parse(json);
    if (typeof parsed !== 'object' || typeof parsed.claimType !== 'string' || typeof parsed.answers !== 'object') {
      return null;
    }
    return parsed as ShareState;
  } catch {
    return null;
  }
}

/**
 * Build a full shareable URL from the current page origin + claim state.
 */
export function buildShareURL(state: ShareState): string {
  const encoded = encodeShareState(state);
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/?s=${encoded}`;
}
