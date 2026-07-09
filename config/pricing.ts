// ⚠ PLACEHOLDER PRICES — Maks confirms before deploy
export const pricing = {
  care: {
    basic: { pricePln: 400 },
    plus:  { pricePln: 800 },
  },
  subscription: {
    minTermMonths: 12,
    // Lower bound of monthly total when paired with Care Basic
    fromPln: {
      start:    600,
      business: 800,
      sklep:    1100,
    },
  },
  // Approximate exchange rates — update before deploy
  fx: {
    czk: 5.8,   // 1 PLN ≈ 5.8 CZK
    usd: 0.25,  // 1 PLN ≈ 0.25 USD
    uah: 10.5,  // 1 PLN ≈ 10.5 UAH
  },
} as const;

export type SiteType = keyof typeof pricing.subscription.fromPln;
export type CareTier = keyof typeof pricing.care;

interface CurrencyConfig {
  symbol: string;
  unit: string;
  multiplier: number;
  prefix: boolean;
  round: number;
}

const CURRENCIES: Record<string, CurrencyConfig> = {
  pl: { symbol: 'zł',  unit: '/mies.', multiplier: 1,             prefix: false, round: 10  },
  cs: { symbol: 'Kč',  unit: '/měs.',  multiplier: pricing.fx.czk, prefix: false, round: 100 },
  en: { symbol: '$',   unit: '/mo.',   multiplier: pricing.fx.usd, prefix: true,  round: 5   },
  uk: { symbol: 'грн', unit: '/міс.',  multiplier: pricing.fx.uah, prefix: false, round: 50  },
};

function fmtThousands(n: number): string {
  if (n < 1000) return String(n);
  return String(Math.floor(n / 1000)) + ' ' + String(n % 1000).padStart(3, '0');
}

export function formatPrice(amountPln: number, locale: string): string {
  const cfg = CURRENCIES[locale] ?? CURRENCIES.pl;
  const raw = amountPln * cfg.multiplier;
  const rounded = Math.round(raw / cfg.round) * cfg.round;
  const n = fmtThousands(rounded);
  return cfg.prefix ? `${cfg.symbol}${n}${cfg.unit}` : `${n} ${cfg.symbol}${cfg.unit}`;
}

export function calcSubscriptionPrice(
  site: SiteType,
  care: CareTier,
): number {
  const base = pricing.subscription.fromPln[site];
  const careDiff = pricing.care[care].pricePln - pricing.care.basic.pricePln;
  return base + careDiff;
}
