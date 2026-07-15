'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { pricing, calcSubscriptionPrice } from '@/config/pricing';

type SiteKey  = 'start' | 'business' | 'sklep';
type PagesKey = '12' | '35' | '610' | '10p';
type CareKey  = 'none' | 'basic' | 'plus';

const BASE_PLN: Record<SiteKey, [number, number]> = {
  start:    [1500, 2200],
  business: [3500, 5500],
  sklep:    [7000, 12000],
};

const PAGE_MULT: Record<PagesKey, number> = {
  '12':  1.0,
  '35':  1.30,
  '610': 1.65,
  '10p': 2.10,
};

const CARE_PLN: Record<CareKey, number> = {
  none:  0,
  basic: pricing.care.basic.pricePln,
  plus:  pricing.care.plus.pricePln,
};

type CurrencyCfg = { mult: number; round: number; sym: string; pre: boolean };

const CURRENCIES: Record<string, CurrencyCfg> = {
  pl: { mult: 1,              round: 100, sym: 'zł',  pre: false },
  cs: { mult: pricing.fx.czk, round: 100, sym: 'Kč',  pre: false },
  en: { mult: pricing.fx.usd, round: 5,   sym: '$',   pre: true  },
  uk: { mult: pricing.fx.uah, round: 50,  sym: 'грн', pre: false },
};

function fmtN(n: number, c: CurrencyCfg): string {
  const val = Math.round(n * c.mult / c.round) * c.round;
  const s = val < 1000 ? String(val) : `${Math.floor(val / 1000)} ${String(val % 1000).padStart(3, '0')}`;
  return c.pre ? `${c.sym}${s}` : `${s} ${c.sym}`;
}

function fmtMonthly(n: number, c: CurrencyCfg, locale: string): string {
  const val = Math.round(n * c.mult / c.round) * c.round;
  const s = val < 1000 ? String(val) : `${Math.floor(val / 1000)} ${String(val % 1000).padStart(3, '0')}`;
  const unit = locale === 'cs' ? '/měs.' : locale === 'en' ? '/mo.' : locale === 'uk' ? '/міс.' : '/mies.';
  return c.pre ? `${c.sym}${s}${unit}` : `${s} ${c.sym}${unit}`;
}

function useAnimatedNumber(target: number, duration = 250): number {
  const [displayed, setDisplayed] = useState(target);
  const rafRef    = useRef<number>(0);
  const startRef  = useRef<number>(0);
  const fromRef   = useRef<number>(target);

  useEffect(() => {
    const from = fromRef.current;
    if (from === target) return;
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();

    const tick = (now: number) => {
      const t   = Math.min((now - startRef.current) / duration, 1);
      const ease = 1 - (1 - t) ** 3;
      setDisplayed(Math.round(from + (target - from) * ease));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else { fromRef.current = target; setDisplayed(target); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return displayed;
}

type RadioCardProps = {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  sub?: string;
};

function RadioCard({ name, value, checked, onChange, label, sub }: RadioCardProps) {
  return (
    <label
      className={`cursor-pointer flex flex-col gap-0.5 px-4 py-3 rounded-[10px] border select-none transition-all duration-150 ${
        checked
          ? 'border-accent bg-accent text-white shadow-sm'
          : 'border-[var(--color-line)] text-[var(--color-ink)] hover:border-accent/40'
      }`}
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className="text-sm font-semibold leading-tight">{label}</span>
      {sub && (
        <span className={`text-[11px] leading-tight ${checked ? 'text-white/70' : 'text-[var(--color-ink-soft)]'}`}>
          {sub}
        </span>
      )}
    </label>
  );
}

export default function QuoteCalculator() {
  const t      = useTranslations('home.calculator');
  const locale = useLocale();
  const cur    = CURRENCIES[locale] ?? CURRENCIES.pl;

  const [site,  setSite]  = useState<SiteKey>('business');
  const [pages, setPages] = useState<PagesKey>('35');
  const [care,  setCare]  = useState<CareKey>('basic');

  const mult          = PAGE_MULT[pages];
  const [rawMin, rawMax] = BASE_PLN[site];
  const minPln        = Math.round(rawMin * mult / 100) * 100;
  const maxPln        = Math.round(rawMax * mult / 100) * 100;
  const carePln       = CARE_PLN[care];
  const subPln        = calcSubscriptionPrice(site, 'basic');

  // Raw integer targets for animation (keep in PLN space, convert for display)
  const animRawMin  = useAnimatedNumber(minPln);
  const animRawMax  = useAnimatedNumber(maxPln);
  const animRawCare = useAnimatedNumber(carePln);
  const animRawSub  = useAnimatedNumber(subPln);

  // Contact form context string
  const siteLabel  = [t('siteStart'), t('siteBusiness'), t('siteSklep')][(['start','business','sklep'] as SiteKey[]).indexOf(site)];
  const pagesLabel = [t('pages12'), t('pages35'), t('pages610'), t('pages10p')][(['12','35','610','10p'] as PagesKey[]).indexOf(pages)];
  const careLabel  = [t('careNone'), t('careBasic'), t('carePlus')][(['none','basic','plus'] as CareKey[]).indexOf(care)];
  const ctx        = encodeURIComponent(t('ctaContext', { site: siteLabel, pages: pagesLabel, care: careLabel }));

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-4xl px-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            {t('eyebrow')}
          </span>
        </div>
        <h2
          className="text-h2 mb-10"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10 lg:gap-12 items-start">

          {/* ── Steps ─────────────────────────────────────────────────────────── */}
          <div>

            {/* Step 1 — site type */}
            <fieldset className="mb-7">
              <legend className="text-label font-semibold mb-3 block" style={{ color: 'var(--color-ink)' }}>
                {t('step1')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {(['start', 'business', 'sklep'] as SiteKey[]).map((v) => (
                  <RadioCard
                    key={v}
                    name="calc-site"
                    value={v}
                    checked={site === v}
                    onChange={() => setSite(v)}
                    label={v === 'start' ? t('siteStart') : v === 'business' ? t('siteBusiness') : t('siteSklep')}
                    sub={v === 'start' ? t('siteStartSub') : v === 'business' ? t('siteBusinessSub') : t('siteSklep2Sub')}
                  />
                ))}
              </div>
            </fieldset>

            {/* Step 2 — pages */}
            <fieldset className="mb-7">
              <legend className="text-label font-semibold mb-3 block" style={{ color: 'var(--color-ink)' }}>
                {t('step2')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {(['12', '35', '610', '10p'] as PagesKey[]).map((v) => (
                  <RadioCard
                    key={v}
                    name="calc-pages"
                    value={v}
                    checked={pages === v}
                    onChange={() => setPages(v)}
                    label={v === '12' ? t('pages12') : v === '35' ? t('pages35') : v === '610' ? t('pages610') : t('pages10p')}
                  />
                ))}
              </div>
            </fieldset>

            {/* Step 3 — care */}
            <fieldset>
              <legend className="text-label font-semibold mb-3 block" style={{ color: 'var(--color-ink)' }}>
                {t('step3')}
              </legend>
              <div className="flex flex-wrap gap-2">
                {(['none', 'basic', 'plus'] as CareKey[]).map((v) => (
                  <RadioCard
                    key={v}
                    name="calc-care"
                    value={v}
                    checked={care === v}
                    onChange={() => setCare(v)}
                    label={v === 'none' ? t('careNone') : v === 'basic' ? t('careBasic') : t('carePlus')}
                  />
                ))}
              </div>
            </fieldset>

          </div>

          {/* ── Result card ────────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-7 sticky top-8"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
          >
            <p className="text-label mb-2" style={{ color: 'var(--color-ink-soft)' }}>
              {t('resultPrefix')}
            </p>

            {/* Animated price range */}
            <p
              className="font-bold mb-1 tabular-nums"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', lineHeight: 1.2 }}
            >
              {fmtN(animRawMin, cur)}–{fmtN(animRawMax, cur)}
            </p>

            {care !== 'none' && (
              <p className="text-label font-semibold mb-3 tabular-nums" style={{ color: 'var(--color-accent)' }}>
                + {fmtMonthly(animRawCare, cur, locale)}
              </p>
            )}

            {/* Divider */}
            <div className="my-4" style={{ height: '1px', backgroundColor: 'var(--color-line)' }} />

            {/* Subscription alternative */}
            <p className="text-label leading-relaxed mb-5 tabular-nums" style={{ color: 'var(--color-ink-soft)' }}>
              {locale === 'pl'
                ? `Albo ${fmtMonthly(animRawSub, cur, locale)} w abonamencie (opieka w cenie)`
                : locale === 'cs'
                  ? `Nebo ${fmtMonthly(animRawSub, cur, locale)} v předplatném (péče v ceně)`
                  : locale === 'uk'
                    ? `Або ${fmtMonthly(animRawSub, cur, locale)} у підписці (підтримка в ціні)`
                    : `Or ${fmtMonthly(animRawSub, cur, locale)} in subscription (care included)`}
            </p>

            <Link
              href={`/kontakt?context=${ctx}`}
              className="inline-flex items-center justify-center w-full px-5 py-3.5 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-semibold text-[15px] active:scale-[0.97] transition-all duration-150"
            >
              {t('cta')}
            </Link>

            <p className="text-[10px] text-center mt-3" style={{ color: 'var(--color-ink-soft)' }}>
              {locale === 'pl' ? 'Szacunek. Dokładna wycena jest bezpłatna.'
               : locale === 'cs' ? 'Odhad. Přesná nabídka je zdarma.'
               : locale === 'uk' ? 'Орієнтовно. Точна оцінка безкоштовно.'
               : 'Estimate only. Exact quote is free.'}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
