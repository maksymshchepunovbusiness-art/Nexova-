import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function AboutSection() {
  const t = useTranslations('home.about');
  const tCta = useTranslations('cta');

  return (
    <section className="py-24 bg-surface dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-text-muted mb-4">
              O nas
            </p>
            <h2 className="text-h2 text-ink mb-6">{t('h2')}</h2>
            <p className="text-body text-text-muted mb-8">{t('body')}</p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[8px] bg-terracotta text-white font-medium hover:bg-terracotta/90 active:scale-[0.98] transition-all duration-200"
            >
              {tCta('quote')}
            </Link>
          </div>

          {/* Visual — monogram card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72">
              {/* Background decorative circles — transparent in dark mode; bg-indigo-tint (#EEF2FF) is too bright on #0D0D1A */}
              <div aria-hidden className="dark-bg-none absolute inset-0 rounded-full bg-indigo-tint border-2 border-indigo/10" />
              <div aria-hidden className="dark-bg-none absolute inset-6 rounded-full bg-indigo-tint/50 border border-indigo/10" />

              {/* Center monogram */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="nx-monogram text-7xl text-indigo leading-none select-none"
                  style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontStyle: 'italic', fontWeight: 600 }}
                >
                  NX
                </span>
                <span className="text-sm font-semibold text-text-muted mt-2 tracking-wider uppercase">Nexova</span>
              </div>

              {/* Floating badge — guarantee */}
              <div className="absolute -bottom-4 -right-4 bg-surface border border-border rounded-[10px] shadow-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-success text-lg">✓</span>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">Gwarancja</p>
                    <p className="text-[10px] text-text-muted">30 dni napraw błędów</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — direct contact */}
              <div className="absolute -top-4 -left-4 bg-surface border border-border rounded-[10px] shadow-md px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-indigo text-lg">◎</span>
                  <div>
                    <p className="text-xs font-semibold text-ink leading-tight">Bezpośredni kontakt</p>
                    <p className="text-[10px] text-text-muted">Zawsze z wykonawcą</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
