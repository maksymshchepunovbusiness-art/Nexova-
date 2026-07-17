import { describe, it, expect } from 'vitest';
import {
  estimateLow,
  estimateHigh,
  estimateMonthly,
  cardMonthly,
} from '../pricing';

// ── Three anchor assertions (must never regress) ─────────────────────────────
describe('estimateMonthly — anchor prices', () => {
  it('Start (1 500 zł) → 449 zł/mies.', () => {
    expect(estimateMonthly(1_500)).toBe(449);
  });
  it('Business (3 500 zł) → 649 zł/mies.', () => {
    expect(estimateMonthly(3_500)).toBe(649);
  });
  it('Sklep (7 000 zł) → 999 zł/mies.', () => {
    expect(estimateMonthly(7_000)).toBe(999);
  });
});

// ── cardMonthly mirrors the anchor prices ────────────────────────────────────
describe('cardMonthly — pricing card values', () => {
  it('Start + Basic → 449', () => expect(cardMonthly('start',    'basic')).toBe(449));
  it('Business + Basic → 649', () => expect(cardMonthly('business', 'basic')).toBe(649));
  it('Sklep + Basic → 999', () => expect(cardMonthly('sklep',    'basic')).toBe(999));
});

// ── Full table: low / high / monthly ─────────────────────────────────────────
describe('estimate table', () => {
  it('Landing, 1 page', () => {
    expect(estimateLow  ('start', 1)).toBe(1_500);
    expect(estimateHigh ('start', 1)).toBe(1_900);
    expect(estimateMonthly(1_500)) .toBe(449);
  });

  it('Firmowa, 5 podstron', () => {
    expect(estimateLow  ('business', 5)).toBe(3_500);
    expect(estimateHigh ('business', 5)).toBe(4_400);
    expect(estimateMonthly(3_500))      .toBe(649);
  });

  it('Firmowa, 8 podstron', () => {
    expect(estimateLow  ('business', 8)).toBe(4_700);
    expect(estimateHigh ('business', 8)).toBe(5_600);
    expect(estimateMonthly(4_700))      .toBe(769);
  });

  it('Sklep, 5 podstron', () => {
    expect(estimateLow  ('sklep', 5)).toBe(7_000);
    expect(estimateHigh ('sklep', 5)).toBe(8_800);
    expect(estimateMonthly(7_000))   .toBe(999);
  });

  it('Sklep, 10 podstron', () => {
    expect(estimateLow  ('sklep', 10)).toBe(9_500);
    expect(estimateHigh ('sklep', 10)).toBe(11_300);
    expect(estimateMonthly(9_500))    .toBe(1_249);
  });
});
