'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SubscriptionPanel from './SubscriptionPanel';
import DecodeNumber from '@/components/ui/decode-number';

type Tab = 'jednorazowa' | 'abonament';

export default function ServicesSection() {
  const t    = useTranslations('home.services');
  const tSub = useTranslations('pricing.subscription');

  const [tab,         setTab]         = useState<Tab>('jednorazowa');
  const [switchCount, setSwitchCount] = useState(0);

  function handleTabChange(next: Tab) {
    if (next === tab) return;
    setTab(next);
    setSwitchCount(c => c + 1);
  }

  const packages = [
    { key: 'start',    name: t('packages.start.name'),    subtitle: t('packages.start.subtitle'),    desc: t('packages.start.desc'),    price: t('packages.start.price'),    featured: false },
    { key: 'business', name: t('packages.business.name'), subtitle: t('packages.business.subtitle'), desc: t('packages.business.desc'), price: t('packages.business.price'), featured: true  },
    { key: 'shop',     name: t('packages.shop.name'),     subtitle: t('packages.shop.subtitle'),     desc: t('packages.shop.desc'),     price: t('packages.shop.price'),     featured: false },
  ];

  const careOptions = [
    { key: 'basic', name: t('care.basic.name'), subtitle: t('care.basic.subtitle'), desc: t('care.basic.desc'), price: t('care.basic.price') },
    { key: 'plus',  name: t('care.plus.name'),  subtitle: t('care.plus.subtitle'),  desc: t('care.plus.desc'),  price: t('care.plus.price')  },
  ];

  return (
    <section id="oferta" className="py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)', fontSize: '0.8125rem', fontWeight: 500 }}>
            Oferta
          </span>
        </div>

        {/* ── Pill toggle ─────────────────────────────────────────────── */}
        <div className="mb-12 flex flex-col items-center gap-2">

          {/* "Recommended" chip floats above the abonament half */}
          <div className="w-full max-w-md flex justify-end pr-4">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full text-white"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {tSub('recommended')}
            </span>
          </div>

          {/* Segmented pill */}
          <div
            className="relative flex items-center w-full max-w-md p-1 rounded-full border"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-line)' }}
          >
            {/* Sliding accent pill */}
            <div
              aria-hidden={true}
              data-testid="services-pill"
              className="absolute inset-y-1 rounded-full"
              style={{
                backgroundColor: 'var(--color-accent)',
                left: 4,
                width: 'calc(50% - 4px)',
                transform: tab === 'jednorazowa' ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            />
            <button
              type="button"
              onClick={() => handleTabChange('jednorazowa')}
              className="relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors duration-150"
              style={{ color: tab === 'jednorazowa' ? '#fff' : 'var(--color-ink-soft)' }}
            >
              {tSub('toggleOneTime')}
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('abonament')}
              className="relative z-10 flex-1 py-2.5 text-sm font-semibold rounded-full transition-colors duration-150"
              style={{ color: tab === 'abonament' ? '#fff' : 'var(--color-ink-soft)' }}
            >
              {tSub('toggleSubscription')}
            </button>
          </div>
        </div>

        {/* ── Jednorazowa tab ─────────────────────────────────────────── */}
        {tab === 'jednorazowa' && (
          <div className="nexova-fade-in">
            <h2 className="text-h2 text-center mb-14" style={{ color: 'var(--color-ink)' }}>{t('h2')}</h2>
            <p className="text-xs font-semibold uppercase tracking-widest mb-12 text-center" style={{ color: 'var(--color-ink-soft)' }}>
              {t('oneTime')}
            </p>

            {/* 3 packages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mb-16 pb-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.key}
                  className={`relative flex flex-col rounded-2xl transition-all duration-200 ${
                    pkg.featured
                      ? 'text-white shadow-2xl shadow-indigo/30 ring-2 ring-indigo/60 p-9 sm:-translate-y-4 z-10 hover:-translate-y-5'
                      : 'border hover:shadow-md hover:-translate-y-1 p-8'
                  }`}
                  style={pkg.featured
                    ? { backgroundColor: 'var(--color-accent)' }
                    : { backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-line)' }
                  }
                >
                  {pkg.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-white text-[11px] font-bold px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--color-accent-ink)' }}>
                        ★ Najpopularniejszy
                      </span>
                    </div>
                  )}

                  <p className={`text-[10px] uppercase tracking-widest mb-2 ${pkg.featured ? 'text-white/60' : ''}`} style={!pkg.featured ? { color: 'var(--color-ink-soft)' } : {}}>
                    {pkg.subtitle}
                  </p>
                  <p className={`text-2xl font-black mb-5 ${pkg.featured ? 'text-white' : ''}`} style={!pkg.featured ? { color: 'var(--color-ink)' } : {}}>
                    {pkg.name}
                  </p>

                  {/* Price with decode effect on tab switch */}
                  <DecodeNumber
                    value={pkg.price}
                    trigger={switchCount}
                    className={`text-3xl font-bold leading-none mb-1 ${pkg.featured ? 'text-white' : ''}`}
                    style={!pkg.featured ? { color: 'var(--color-ink)' } : {}}
                  />
                  <p className={`text-xs mb-5 ${pkg.featured ? 'text-white/50' : ''}`} style={!pkg.featured ? { color: 'var(--color-ink-soft)' } : {}}>
                    jednorazowo
                  </p>

                  <div className={`border-t mb-5 ${pkg.featured ? 'border-white/15' : ''}`} style={!pkg.featured ? { borderColor: 'var(--color-line)' } : {}} />

                  <p className={`text-sm leading-relaxed flex-1 mb-7 ${pkg.featured ? 'text-white/80' : ''}`} style={!pkg.featured ? { color: 'var(--color-ink-soft)' } : {}}>
                    {pkg.desc}
                  </p>

                  <Link
                    href="/kontakt"
                    className={`inline-flex items-center justify-center px-4 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      pkg.featured
                        ? 'bg-white text-indigo hover:bg-indigo-tint shadow-md'
                        : 'border hover:border-accent/40 hover:text-accent'
                    }`}
                    style={!pkg.featured ? { borderColor: 'var(--color-line)', color: 'var(--color-ink)' } : {}}
                  >
                    {t('ctaQuote')}
                  </Link>
                </div>
              ))}
            </div>

            {/* Care plans */}
            <div className="pt-12" style={{ borderTop: '1px solid var(--color-line)' }}>
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
                  {t('care.heading')}
                </p>
                <p className="text-xs italic" style={{ color: 'var(--color-ink-soft)' }}>{t('care.discount')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {careOptions.map((care, i) => (
                  <div
                    key={care.key}
                    className="flex gap-5 p-6 rounded-[14px] border hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                    style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-accent) 10%, transparent)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        {i === 0
                          ? <line x1="12" y1="8" x2="12" y2="16" />
                          : <polyline points="9 12 11 14 15 10" />
                        }
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-0.5 flex-wrap">
                        <p className="font-bold" style={{ color: 'var(--color-ink)' }}>{care.name}</p>
                        <p className="font-bold text-sm whitespace-nowrap" style={{ color: 'var(--color-accent)' }}>{care.price}</p>
                      </div>
                      <p className="text-[11px] uppercase tracking-wide mb-2" style={{ color: 'var(--color-ink-soft)' }}>{care.subtitle}</p>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>{care.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Abonament tab ────────────────────────────────────────────── */}
        {tab === 'abonament' && (
          <div className="nexova-fade-in">
            <SubscriptionPanel />
          </div>
        )}

      </div>
    </section>
  );
}
