'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { pricing, formatPrice, calcSubscriptionPrice, discountedCarePrice } from '@/config/pricing';
import DecodeNumber from '@/components/ui/decode-number';
import type { SiteType, CareTier } from '@/config/pricing';
import FaqAccordion from './FaqAccordion';

const SITE_TYPES: SiteType[] = ['start', 'business', 'sklep'];
const CARE_TIERS: CareTier[] = ['basic', 'plus'];

export default function SubscriptionPanel() {
  const t = useTranslations('pricing.subscription');
  const locale = useLocale();

  const [selectedSite, setSelectedSite] = useState<SiteType>('business');
  const [selectedCare, setSelectedCare] = useState<CareTier>('basic');

  const totalPln = calcSubscriptionPrice(selectedSite, selectedCare);
  const displayPrice = formatPrice(totalPln, locale);
  // After 12 months, care continues at the discounted subscription rate (300 zł/mies for Basic)
  const basicCarePrice = formatPrice(discountedCarePrice('basic'), locale);

  const siteLabels: Record<SiteType, string> = {
    start:    t('siteStart'),
    business: t('siteBusiness'),
    sklep:    t('siteSklep'),
  };
  const careLabels: Record<CareTier, string> = {
    basic: t('careBasic'),
    plus:  t('carePlus'),
  };
  const careOriginalLabels: Record<CareTier, string> = {
    basic: formatPrice(pricing.care.basic.pricePln, locale),
    plus:  formatPrice(pricing.care.plus.pricePln, locale),
  };
  const careDiscountedLabels: Record<CareTier, string> = {
    basic: formatPrice(discountedCarePrice('basic'), locale),
    plus:  formatPrice(discountedCarePrice('plus'), locale),
  };

  const contextParam = encodeURIComponent(
    t('contextMessage', { site: siteLabels[selectedSite], care: careLabels[selectedCare] })
  );

  const faqItems = [
    { q: t('faq.q1.q'), a: t('faq.q1.a') },
    { q: t('faq.q2.q'), a: t('faq.q2.a') },
    { q: t('faq.q3.q'), a: t('faq.q3.a') },
    { q: t('faq.q4.q'), a: t('faq.q4.a') },
  ];

  return (
    <div>
      {/* Heading */}
      <div className="text-center mb-10">
        <h2 className="text-h2 text-ink dark:text-white mb-3">{t('heading')}</h2>
        <p className="text-body text-text-muted dark:text-white/75 mx-auto max-w-2xl">
          {t('subheading')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── Selectors + price preview ────────────────────────────── */}
        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-sm">

          {/* Savings banner */}
          <div className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl bg-accent/8 border border-accent/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-accent" aria-hidden>
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm font-medium text-accent leading-snug">
              {t('savingsBanner')}
            </p>
          </div>

          {/* Care tier */}
          <fieldset className="mb-6">
            <legend className="text-label font-semibold text-ink dark:text-white mb-3">
              {t('careLabel')}
            </legend>
            <div className="flex flex-col sm:flex-row gap-3">
              {CARE_TIERS.map((tier) => (
                <label
                  key={tier}
                  className={`flex-1 flex items-center justify-between gap-3 cursor-pointer px-4 py-3.5 rounded-xl border transition-all duration-150 ${
                    selectedCare === tier
                      ? 'border-indigo bg-indigo/5 dark:bg-indigo/10'
                      : 'border-border hover:border-indigo/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="care"
                    value={tier}
                    checked={selectedCare === tier}
                    onChange={() => setSelectedCare(tier)}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${selectedCare === tier ? 'text-indigo' : 'text-ink dark:text-white'}`}>
                    {careLabels[tier]}
                  </span>
                  <span className="flex flex-col items-end gap-0.5">
                    <span className="text-xs line-through text-text-muted/70">
                      {careOriginalLabels[tier]}
                    </span>
                    <span className={`text-sm font-semibold ${selectedCare === tier ? 'text-indigo' : 'text-ink dark:text-white'}`}>
                      {careDiscountedLabels[tier]}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Site type */}
          <fieldset className="mb-8">
            <legend className="text-label font-semibold text-ink dark:text-white mb-3">
              {t('siteLabel')}
            </legend>
            <div className="flex gap-2 flex-wrap">
              {SITE_TYPES.map((site) => (
                <label
                  key={site}
                  className={`cursor-pointer px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-150 ${
                    selectedSite === site
                      ? 'border-indigo bg-indigo text-white shadow-sm'
                      : 'border-border text-ink dark:text-white hover:border-indigo/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="site"
                    value={site}
                    checked={selectedSite === site}
                    onChange={() => setSelectedSite(site)}
                    className="sr-only"
                  />
                  {siteLabels[site]}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Price preview */}
          <div className="bg-indigo/5 dark:bg-indigo/10 border border-indigo/20 dark:border-indigo/30 rounded-xl p-5 mb-6">
            <p className="text-2xl font-bold text-ink dark:text-white mb-1">
              <DecodeNumber
                value={t('priceNote', { price: displayPrice })}
                decodeOnMount
              />
            </p>
            <p className="text-sm text-text-muted dark:text-white/60 mb-2">
              {t('priceAfter', { carePrice: basicCarePrice })}
            </p>
            <span className="inline-block text-xs font-semibold text-indigo dark:text-indigo/80 bg-indigo/10 dark:bg-indigo/20 rounded-full px-3 py-1">
              {t('minTerm')}
            </span>
          </div>

          {/* CTA */}
          <Link
            href={`/kontakt?context=${contextParam}`}
            className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-[10px] bg-accent text-white font-semibold hover:bg-accent-ink active:scale-[0.97] transition-all duration-150 shadow-sm"
          >
            {t('cta')}
          </Link>
        </div>

        {/* ── Jak to działa + FAQ ───────────────────────────────── */}
        <div className="flex flex-col gap-10">

          {/* Steps */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-6">
              {t('howHeading')}
            </p>
            <ol className="flex flex-col gap-5">
              {([1, 2, 3, 4] as const).map((n) => (
                <li key={n} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo/10 dark:bg-indigo/20 text-indigo text-xs font-bold flex items-center justify-center">
                    {n}
                  </span>
                  <div>
                    <p className="font-semibold text-ink dark:text-white text-sm mb-0.5">
                      {t(`steps.${n}.title`)}
                    </p>
                    <p className="text-sm text-text-muted dark:text-white/60 leading-relaxed">
                      {t(`steps.${n}.desc`)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Mini-FAQ */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-4">
              {t('faqHeading')}
            </p>
            <FaqAccordion items={faqItems} />
          </div>

        </div>
      </div>
    </div>
  );
}
