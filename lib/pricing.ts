/**
 * Single source of truth for all Nexova pricing math.
 * Used by pricing cards (config/pricing.ts) AND the quote calculator.
 */

export type SiteKey  = 'start' | 'business' | 'sklep';
export type CareTier = 'basic' | 'plus';
export type PagesKey = '12' | '35' | '610' | '10p';

// ── Constants ────────────────────────────────────────────────────────────────

/** Base one-time project prices (PLN) */
export const BASE_ONE_TIME: Record<SiteKey, number> = {
  start:    1500,
  business: 3500,
  sklep:    7000,
};

/** Extra PLN per subpage beyond the first 5 */
export const EXTRA_PER_PAGE: Record<SiteKey, number> = {
  start:    0,     // landing is always a single page
  business: 400,
  sklep:    500,
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

/** Page bucket → representative page count for the estimator */
export const PAGE_COUNTS: Record<PagesKey, number> = {
  '12':  1,   // 1–2 pages: use low end
  '35':  5,   // 3–5 pages: use high end (no extras triggered for business/sklep)
  '610': 8,   // 6–10 pages: midpoint
  '10p': 15,  // 10+ pages: reasonable midpoint
};

/** Page count used for the pricing card headline prices */
const CARD_PAGES: Record<SiteKey, number> = {
  start:    1,  // landing is 1 page
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

/** Additional cost for subpages beyond the first 5 */
export function subpageExtras(site: SiteKey, pages: number): number {
  if (pages <= 5) return 0;
  return (pages - 5) * EXTRA_PER_PAGE[site];
}

/** Low end of the one-time project estimate (PLN) */
export function estimateLow(site: SiteKey, pages: number): number {
  return BASE_ONE_TIME[site] + subpageExtras(site, pages);
}

/** High end of the one-time project estimate (PLN), rounded to nearest 100 */
export function estimateHigh(site: SiteKey, pages: number): number {
  return round100(BASE_ONE_TIME[site] * 1.25 + subpageExtras(site, pages));
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
