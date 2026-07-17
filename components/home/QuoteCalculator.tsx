'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  estimateLow,
  estimateHigh,
  estimateMonthly,
  PAGE_COUNTS,
  CARE_LIST_PLN,
  FX,
} from '@/lib/pricing';
import type { SiteKey, PagesKey } from '@/lib/pricing';
import DecodeNumber from '@/components/ui/decode-number';

type CareKey = 'none' | 'basic' | 'plus';

type CurrencyCfg = { mult: number; round: number; sym: string; pre: boolean };

const CURRENCIES: Record<string, CurrencyCfg> = {
  pl: { mult: 1,       round: 100, sym: 'zł',  pre: false },
  cs: { mult: FX.czk,  round: 500, sym: 'Kč',  pre: false },
  en: { mult: FX.usd,  round: 25,  sym: '$',   pre: true  },
  uk: { mult: FX.uah,  round: 500, sym: 'грн', pre: false },
};

const CURRENCIES_MO: Record<string, CurrencyCfg> = {
  pl: { mult: 1,       round: 1,  sym: 'zł',  pre: false },
  cs: { mult: FX.czk,  round: 50, sym: 'Kč',  pre: false },
  en: { mult: FX.usd,  round: 5,  sym: '$',   pre: true  },
  uk: { mult: FX.uah,  round: 50, sym: 'грн', pre: false },
};

const CARE_PLN: Record<CareKey, number> = {
  none:  0,
  basic: CARE_LIST_PLN.basic,
  plus:  CARE_LIST_PLN.plus,
};

function fmtN(n: number, c: CurrencyCfg): string {
  const val = Math.round(n * c.mult / c.round) * c.round;
  const s = val < 1000 ? String(val) : `${Math.floor(val / 1000)} ${String(val % 1000).padStart(3, '0')}`;
  return c.pre ? `${c.sym}${s}` : `${s} ${c.sym}`;
}

function fmtMonthly(n: number, locale: string): string {
  const mo   = CURRENCIES_MO[locale] ?? CURRENCIES_MO.pl;
  const val  = Math.round(n * mo.mult / mo.round) * mo.round;
  const s    = val < 1000 ? String(val) : `${Math.floor(val / 1000)} ${String(val % 1000).padStart(3, '0')}`;
  const unit = locale === 'cs' ? '/měs.' : locale === 'en' ? '/mo.' : locale === 'uk' ? '/міс.' : '/mies.';
  return mo.pre ? `${mo.sym}${s}${unit}` : `${s} ${mo.sym}${unit}`;
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

  // Derive prices from shared lib (single source of truth)
  const pageCount  = PAGE_COUNTS[pages];
  const lowPln     = estimateLow(site, pageCount);
  const highPln    = estimateHigh(site, pageCount);
  const monthlyPln = estimateMonthly(lowPln);
  const carePln    = CARE_PLN[care];

  // Build contact context with both figures
  const siteLabel  = [t('siteStart'), t('siteBusiness'), t('siteSklep')][(['start','business','sklep'] as SiteKey[]).indexOf(site)];
  const pagesLabel = [t('pages12'), t('pages35'), t('pages610'), t('pages10p')][(['12','35','610','10p'] as PagesKey[]).indexOf(pages)];
  const careLabel  = [t('careNone'), t('careBasic'), t('carePlus')][(['none','basic','plus'] as CareKey[]).indexOf(care)];
  const ctx = encodeURIComponent(
    t('ctaContext', {
      site:    siteLabel,
      pages:   pagesLabel,
      care:    careLabel,
      low:     fmtN(lowPln, cur),
      high:    fmtN(highPln, cur),
      monthly: fmtMonthly(monthlyPln, locale),
    })
  );

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-12 items-start">

          {/* ── Steps ─────────────────────────────────────────────────── */}
          <div>
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

          {/* ── Result card ─────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-7 sticky top-8"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
          >
            {/* ONE-TIME block */}
            <p className="text-label font-semibold mb-2" style={{ color: 'var(--color-ink-soft)' }}>
              {t('resultOneTimeLabel')}
            </p>
            <p
              className="font-bold"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)', fontSize: 'clamp(1.4rem, 2.8vw, 1.9rem)', lineHeight: 1.2 }}
            >
              {t('resultApprox')}{' '}
              <DecodeNumber value={`${fmtN(lowPln, cur)}–${fmtN(highPln, cur)}`} />
            </p>

            {care !== 'none' && (
              <p className="text-label font-semibold mt-1.5" style={{ color: 'var(--color-accent)' }}>
                + <DecodeNumber value={fmtMonthly(carePln, locale)} />{' '}{care === 'basic' ? 'Care Basic' : 'Care Plus'}
              </p>
            )}

            <div className="my-5" style={{ height: '1px', backgroundColor: 'var(--color-line)' }} />

            {/* SUBSCRIPTION block */}
            <p className="text-label font-semibold mb-2" style={{ color: 'var(--color-ink-soft)' }}>
              {t('resultSubLabel')}
            </p>
            <p
              className="font-bold"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)', fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', lineHeight: 1.2 }}
            >
              <DecodeNumber value={t('resultSubFrom', { price: fmtMonthly(monthlyPln, locale) })} />
            </p>
            <p className="text-[11px] mt-2 leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>
              {t('resultSubNote')}
            </p>
            {care === 'none' && (
              <p className="text-[11px] mt-1" style={{ color: 'var(--color-ink-soft)', fontStyle: 'italic' }}>
                {t('resultCareNote')}
              </p>
            )}

            <div className="my-5" style={{ height: '1px', backgroundColor: 'var(--color-line)' }} />

            <Link
              href={`/kontakt?context=${ctx}`}
              className="inline-flex items-center justify-center w-full px-5 py-3.5 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-semibold text-[15px] active:scale-[0.97] transition-all duration-150"
            >
              {t('cta')}
            </Link>

            <p className="text-[10px] text-center mt-3" style={{ color: 'var(--color-ink-soft)' }}>
              {t('resultDisclaimer')}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
