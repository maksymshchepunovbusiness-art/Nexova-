/**
 * Single source of truth for all Nexova pricing math.
 * Used by pricing cards (config/pricing.ts) AND the quote calculator.
 */

export type SiteKey  = 'start' | 'business' | 'sklep';
export type CareTier = 'basic' | 'plus';
export type PagesKey = '12' | '35' | '610' | '10p';

// ── Constants ────────────────────────────────────────────────────────────────

/** Base one-time project prices at the 3–5 page bracket (PLN) */
export const BASE_ONE_TIME: Record<SiteKey, number> = {
  start:    1500,
  business: 3500,
  sklep:    7000,
};

/** Extra PLN per subpage above 5 (bracket pricing: p > 5 adds this per page) */
export const EXTRA_PER_PAGE: Record<SiteKey, number> = {
  start:    0,
  business: 400,
  sklep:    500,
};

/** Discount PLN per subpage below 5 (bracket pricing: p < 5 subtracts this per page) */
const BELOW_BASE_RATE: Record<SiteKey, number> = {
  start:    0,
  business: 300,
  sklep:    350,
};

/** Care Basic monthly PLN — always included in the subscription formula */
export const CARE_BASIC_MONTHLY = 300;

/** Care standalone (list) monthly prices */
export const CARE_LIST_PLN: Record<CareTier, number> = {
  basic: 400,
  plus:  800,
};

/** Subscription discount applied to care (25 % off list) */
export const CARE_SUBSCRIPTION_DISCOUNT = 0.25;

/** FX rates — 1 PLN = ... */
export const FX = { czk: 5.8, usd: 0.25, uah: 10.5 } as const;

/**
 * Page bucket → representative page count (top of bracket) for the estimator.
 * Using top-of-bracket counts gives conservative (higher) estimates within each
 * range and avoids discontinuities at bracket boundaries.
 *   '12':  1–2  pages  → p = 2
 *   '35':  3–5  pages  → p = 5   (base; anchors 3 500 / 7 000 hold here)
 *   '610': 6–10 pages  → p = 10
 *   '10p': 10+  pages  → p = 12
 */
export const PAGE_COUNTS: Record<PagesKey, number> = {
  '12':  2,
  '35':  5,
  '610': 10,
  '10p': 12,
};

/** Page count used for the pricing card headline prices (always the 3–5 base) */
const CARD_PAGES: Record<SiteKey, number> = {
  start:    1,
  business: 5,
  sklep:    5,
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function round100(n: number): number {
  return Math.round(n / 100) * 100;
}

function ceil10(n: number): number {
  return Math.ceil(n / 10) * 10;
}

// ── Formula functions ────────────────────────────────────────────────────────

/**
 * Bracket adjustment: pages vs. the 5-page base.
 * Positive for p > 5 (extra pages), negative for p < 5 (fewer pages).
 * Start is always 0 (single-page landing, no subpages).
 */
export function subpageExtras(site: SiteKey, pages: number): number {
  if (site === 'start') return 0;
  if (pages === 5) return 0;
  if (pages > 5) return (pages - 5) * EXTRA_PER_PAGE[site];
  return -(5 - pages) * BELOW_BASE_RATE[site];
}

/**
 * Low end of the one-time project estimate (PLN).
 * Sklep's below-base discount is rounded to nearest 100 per spec.
 */
export function estimateLow(site: SiteKey, pages: number): number {
  const raw = BASE_ONE_TIME[site] + subpageExtras(site, pages);
  return pages < 5 && site === 'sklep' ? round100(raw) : raw;
}

/** High end of the one-time project estimate (PLN): low × 1.25, rounded to nearest 100 */
export function estimateHigh(site: SiteKey, pages: number): number {
  return round100(estimateLow(site, pages) * 1.25);
}

/**
 * Monthly subscription price (PLN).
 * Formula: ceil10(low × 1.20 / 12 + 300) − 1
 * - Project repaid over 12 months at +20 % margin
 * - Care Basic (300 zł/mies.) always included
 * - Charm pricing: round up to nearest 10, then −1
 *
 * Anchors (asserted in unit tests):
 *   estimateMonthly(1500) === 449
 *   estimateMonthly(3500) === 649
 *   estimateMonthly(7000) === 999
 */
export function estimateMonthly(lowPln: number): number {
  return ceil10(lowPln * 1.20 / 12 + CARE_BASIC_MONTHLY) - 1;
}

/** Discounted care monthly price for subscription (list − 25 %) */
export function discountedCareMonthly(care: CareTier): number {
  return Math.round(CARE_LIST_PLN[care] * (1 - CARE_SUBSCRIPTION_DISCOUNT));
}

/**
 * Monthly subscription including a specific care tier.
 * Care Basic is already baked into estimateMonthly; Plus adds the delta.
 */
export function monthlyWithCare(lowPln: number, care: CareTier): number {
  const base = estimateMonthly(lowPln);
  if (care === 'basic') return base;
  return base + (discountedCareMonthly(care) - CARE_BASIC_MONTHLY);
}

/**
 * Monthly subscription for the pricing-card configuration.
 * Start anchors at 1 page; Business and Sklep at 5 pages.
 */
export function cardMonthly(site: SiteKey, care: CareTier): number {
  return monthlyWithCare(estimateLow(site, CARD_PAGES[site]), care);
}
