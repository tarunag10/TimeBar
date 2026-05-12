import { describe, expect, it } from 'vitest';
import LZString from 'lz-string';
import { decodeShareState, encodeShareState } from '../share';

describe('share-state limits', () => {
  it('round-trips a valid rule-scoped share state', () => {
    const encoded = encodeShareState({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2020-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });

    expect(encoded).toBeTruthy();
    expect(decodeShareState(encoded)).toEqual({
      claimType: 'simple_contract',
      answers: {
        accrual_date: '2020-01-01',
        disability_at_accrual: false,
        fraud_concealment: false,
      },
    });
  });

  it('rejects an oversized encoded query parameter before decompressing', () => {
    expect(decodeShareState('x'.repeat(4097))).toBeNull();
  });

  it('rejects oversized decompressed JSON', () => {
    const encoded = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        claimType: 'simple_contract',
        answers: {
          accrual_date: '2020-01-01',
          disability_at_accrual: false,
          fraud_concealment: false,
          acknowledgment_date: 'a'.repeat(13000),
        },
      }),
    );

    expect(decodeShareState(encoded)).toBeNull();
  });

  it('rejects unknown claim types and answer keys', () => {
    const badClaim = LZString.compressToEncodedURIComponent(
      JSON.stringify({ claimType: 'unknown_claim', answers: { accrual_date: '2020-01-01' } }),
    );
    const badKey = LZString.compressToEncodedURIComponent(
      JSON.stringify({
        claimType: 'simple_contract',
        answers: { accrual_date: '2020-01-01', injected: 'value' },
      }),
    );

    expect(decodeShareState(badClaim)).toBeNull();
    expect(decodeShareState(badKey)).toBeNull();
  });
});
