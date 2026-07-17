import {
  CARE_LIST_PLN,
  CARE_SUBSCRIPTION_DISCOUNT,
  FX,
  cardMonthly,
  discountedCareMonthly,
} from '@/lib/pricing';

// Re-export types so existing consumers (SubscriptionPanel, etc.) keep their imports
export type { SiteKey as SiteType, CareTier } from '@/lib/pricing';

/**
 * Runtime pricing object used by SubscriptionPanel and formatPrice.
 * All monthly values are now derived from the shared lib/pricing formula.
 */
export const pricing = {
  care: {
    basic: { pricePln: CARE_LIST_PLN.basic },
    plus:  { pricePln: CARE_LIST_PLN.plus  },
  },
  subscription: {
    minTermMonths: 12,
    discountPct:   CARE_SUBSCRIPTION_DISCOUNT,
    fromPln: {
      start:    cardMonthly('start',    'basic'),
      business: cardMonthly('business', 'basic'),
      sklep:    cardMonthly('sklep',    'basic'),
    },
  },
  fx: FX,
} as const;

interface CurrencyConfig {
  symbol: string;
  unit: string;
  multiplier: number;
  prefix: boolean;
  round: number;
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  pl: { symbol: 'zł',  unit: '/mies.', multiplier: 1,             prefix: false, round: 10  },
  cs: { symbol: 'Kč',  unit: '/měs.',  multiplier: FX.czk,        prefix: false, round: 100 },
  en: { symbol: '$',   unit: '/mo.',   multiplier: FX.usd,        prefix: true,  round: 5   },
  uk: { symbol: 'грн', unit: '/міс.',  multiplier: FX.uah,        prefix: false, round: 50  },
};

function fmtThousands(n: number): string {
  if (n < 1000) return String(n);
  return String(Math.floor(n / 1000)) + ' ' + String(n % 1000).padStart(3, '0');
}

export function formatPrice(amountPln: number, locale: string): string {
  const cfg = CURRENCIES[locale] ?? CURRENCIES.pl;
  const raw = amountPln * cfg.multiplier;
  const rounded = Math.round(raw / cfg.round) * cfg.round;
  const n = fmtThousands(rounded);
  return cfg.prefix ? `${cfg.symbol}${n}${cfg.unit}` : `${n} ${cfg.symbol}${cfg.unit}`;
}

/** Care monthly price at the 25 % subscription discount */
export function discountedCarePrice(care: 'basic' | 'plus'): number {
  return discountedCareMonthly(care);
}

/** Monthly subscription total for a given site type + care tier (pricing-card config) */
export function calcSubscriptionPrice(
  site: 'start' | 'business' | 'sklep',
  care: 'basic' | 'plus',
): number {
  return cardMonthly(site, care);
}
