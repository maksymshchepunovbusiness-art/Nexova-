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

// ── Bracket table: Firmowa ────────────────────────────────────────────────────
// UI brackets use top-of-bracket page count: '12'→2, '35'→5, '610'→10, '10p'→12
// Rule: low = 3500 + 400×(p−5) for p≥5; 3500 − 300×(5−p) for p<5
//       high = round100(low × 1.25)
describe('bracket pricing — Firmowa (business)', () => {
  it('1–2 pages (p=2): low=2 600, high=3 300, monthly=559', () => {
    expect(estimateLow   ('business', 2)).toBe(2_600);
    expect(estimateHigh  ('business', 2)).toBe(3_300);
    expect(estimateMonthly(2_600))       .toBe(559);
    // verify: ceil10(2600×1.2/12 + 300) − 1 = ceil10(260+300) − 1 = 560 − 1 = 559
  });
  it('3–5 pages (p=5): low=3 500, high=4 400, monthly=649  [anchor]', () => {
    expect(estimateLow   ('business', 5)).toBe(3_500);
    expect(estimateHigh  ('business', 5)).toBe(4_400);
    expect(estimateMonthly(3_500))       .toBe(649);
  });
  it('6–10 pages (p=10): low=5 500, high=6 900, monthly=849', () => {
    expect(estimateLow   ('business', 10)).toBe(5_500);
    expect(estimateHigh  ('business', 10)).toBe(6_900);
    expect(estimateMonthly(5_500))        .toBe(849);
    // verify: ceil10(5500×1.2/12 + 300) − 1 = ceil10(550+300) − 1 = 850 − 1 = 849
  });
  it('10+ pages (p=12): low=6 300, high=7 900, monthly=929', () => {
    expect(estimateLow   ('business', 12)).toBe(6_300);
    expect(estimateHigh  ('business', 12)).toBe(7_900);
    expect(estimateMonthly(6_300))        .toBe(929);
    // verify: ceil10(6300×1.2/12 + 300) − 1 = ceil10(630+300) − 1 = 930 − 1 = 929
  });
  // Legacy mid-bracket values still computable (not a UI bucket, just formula check)
  it('p=8 (mid-bracket): low=4 700, high=5 900, monthly=769', () => {
    expect(estimateLow   ('business', 8)).toBe(4_700);
    expect(estimateHigh  ('business', 8)).toBe(5_900); // was 5600 with old additive formula
    expect(estimateMonthly(4_700))       .toBe(769);
  });
});

// ── Bracket table: Sklep ─────────────────────────────────────────────────────
// Rule: low = 7000 + 500×(p−5) for p≥5; round100(7000 − 350×(5−p)) for p<5
//       high = round100(low × 1.25)
describe('bracket pricing — Sklep', () => {
  it('1–2 pages (p=2): low=6 000, high=7 500, monthly=899', () => {
    expect(estimateLow   ('sklep', 2)).toBe(6_000);
    // verify: round100(7000 − 350×3) = round100(5950) = 6000
    expect(estimateHigh  ('sklep', 2)).toBe(7_500);
    expect(estimateMonthly(6_000))    .toBe(899);
    // verify: ceil10(6000×1.2/12 + 300) − 1 = ceil10(600+300) − 1 = 900 − 1 = 899
  });
  it('3–5 pages (p=5): low=7 000, high=8 800, monthly=999  [anchor]', () => {
    expect(estimateLow   ('sklep', 5)).toBe(7_000);
    expect(estimateHigh  ('sklep', 5)).toBe(8_800);
    expect(estimateMonthly(7_000))    .toBe(999);
  });
  it('6–10 pages (p=10): low=9 500, high=11 900, monthly=1 249', () => {
    expect(estimateLow   ('sklep', 10)).toBe(9_500);
    expect(estimateHigh  ('sklep', 10)).toBe(11_900); // was 11300 with old additive formula
    expect(estimateMonthly(9_500))     .toBe(1_249);
    // verify: ceil10(9500×1.2/12 + 300) − 1 = ceil10(950+300) − 1 = 1250 − 1 = 1249
  });
  it('10+ pages (p=12): low=10 500, high=13 100, monthly=1 349', () => {
    expect(estimateLow   ('sklep', 12)).toBe(10_500);
    expect(estimateHigh  ('sklep', 12)).toBe(13_100);
    expect(estimateMonthly(10_500))    .toBe(1_349);
    // verify: ceil10(10500×1.2/12 + 300) − 1 = ceil10(1050+300) − 1 = 1350 − 1 = 1349
  });
});

// ── Landing (start) — always fixed regardless of page count ──────────────────
describe('Landing / wizytówka (start) — podstrony has no effect', () => {
  it('always 1 500 / 1 900 / 449 regardless of pages', () => {
    for (const p of [1, 2, 5, 8, 10, 12, 15]) {
      expect(estimateLow   ('start', p)).toBe(1_500);
      expect(estimateHigh  ('start', p)).toBe(1_900);
      expect(estimateMonthly(1_500))    .toBe(449);
    }
  });
});
