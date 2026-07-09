'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SubscriptionPanel from './SubscriptionPanel';

type Tab = 'jednorazowa' | 'abonament';

export default function ServicesSection() {
  const t      = useTranslations('home.services');
  const tSub   = useTranslations('pricing.subscription');
  const [tab, setTab] = useState<Tab>('jednorazowa');

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
    <section className="py-24 bg-surface-2 dark:bg-transparent">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted text-center mb-6">
          Oferta
        </p>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-full bg-surface dark:bg-surface-2 border border-border p-1 gap-1">
            <button
              onClick={() => setTab('jednorazowa')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                tab === 'jednorazowa'
                  ? 'bg-indigo text-white shadow-sm'
                  : 'text-text-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              {tSub('toggleOneTime')}
            </button>
            <button
              onClick={() => setTab('abonament')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                tab === 'abonament'
                  ? 'bg-indigo text-white shadow-sm'
                  : 'text-text-muted hover:text-ink dark:hover:text-white'
              }`}
            >
              {tSub('toggleSubscription')}
              {tab !== 'abonament' && (
                <span className="text-[10px] font-bold bg-indigo/10 text-indigo rounded-full px-2 py-0.5 leading-none">
                  {tSub('badge')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Jednorazowa tab ─────────────────────────────────────── */}
        {tab === 'jednorazowa' && (
          <>
            <h2 className="text-h2 text-ink dark:text-white text-center mb-14">{t('h2')}</h2>

            {/* One-time label */}
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-12 text-center">
              {t('oneTime')}
            </p>

            {/* 3 packages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-end mb-16 pb-4">
              {packages.map((pkg) => (
                <div
                  key={pkg.key}
                  className={`relative flex flex-col rounded-2xl transition-all duration-200 ${
                    pkg.featured
                      ? 'bg-indigo text-white shadow-2xl shadow-indigo/30 ring-2 ring-indigo/60 p-9 sm:-translate-y-4 z-10'
                      : 'bg-surface border border-border hover:shadow-md p-8'
                  }`}
                >
                  {pkg.featured && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 bg-terracotta text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg">
                        ★ Najpopularniejszy
                      </span>
                    </div>
                  )}

                  <p className={`text-[10px] uppercase tracking-widest mb-2 ${pkg.featured ? 'text-white/60' : 'text-text-muted'}`}>
                    {pkg.subtitle}
                  </p>
                  <p className={`text-2xl font-black mb-5 ${pkg.featured ? 'text-white' : 'text-ink dark:text-white'}`}>
                    {pkg.name}
                  </p>

                  <p className={`text-3xl font-bold leading-none mb-1 ${pkg.featured ? 'text-white' : 'text-ink dark:text-white'}`}>
                    {pkg.price}
                  </p>
                  <p className={`text-xs mb-5 ${pkg.featured ? 'text-white/50' : 'text-text-muted'}`}>
                    jednorazowo
                  </p>

                  <div className={`border-t mb-5 ${pkg.featured ? 'border-white/15' : 'border-border'}`} />

                  <p className={`text-sm leading-relaxed flex-1 mb-7 ${pkg.featured ? 'text-white/80' : 'text-text-muted'}`}>
                    {pkg.desc}
                  </p>

                  <Link
                    href="/kontakt"
                    className={`inline-flex items-center justify-center px-4 py-3 rounded-[10px] text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                      pkg.featured
                        ? 'bg-white text-indigo hover:bg-indigo-tint shadow-md'
                        : 'border border-border text-ink dark:text-white hover:border-indigo/40 hover:text-indigo'
                    }`}
                  >
                    {t('ctaQuote')}
                  </Link>
                </div>
              ))}
            </div>

            {/* Care plans */}
            <div className="border-t border-border pt-12">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                  {t('care.heading')}
                </p>
                <p className="text-xs text-text-muted italic">{t('care.discount')}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {careOptions.map((care, i) => (
                  <div
                    key={care.key}
                    className="flex gap-5 p-6 rounded-[14px] border border-border bg-surface hover:shadow-sm hover:border-indigo/20 transition-all duration-200"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4338CA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        {i === 0
                          ? <line x1="12" y1="8" x2="12" y2="16" />
                          : <polyline points="9 12 11 14 15 10" />
                        }
                      </svg>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3 mb-0.5 flex-wrap">
                        <p className="font-bold text-ink dark:text-white">{care.name}</p>
                        <p className="font-bold text-indigo text-sm whitespace-nowrap">{care.price}</p>
                      </div>
                      <p className="text-[11px] text-text-muted uppercase tracking-wide mb-2">{care.subtitle}</p>
                      <p className="text-sm text-text-muted leading-relaxed">{care.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Abonament tab ────────────────────────────────────────── */}
        {tab === 'abonament' && <SubscriptionPanel />}

      </div>
    </section>
  );
}
