import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function FinalCtaSection() {
  const t = useTranslations('home.finalCta');

  return (
    <section className="py-28 bg-indigo-deep dark:bg-transparent relative overflow-hidden">
      {/* Gradient fade at top — light mode only; .dark-hide rule in globals.css removes it in dark mode */}
      <div aria-hidden className="dark-hide absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-surface), transparent)' }} />

      {/* Decorative glow — hidden in both themes: section is transparent so
          overflow-hidden clips blur-3xl at the boundary, leaving a rectangular
          artefact. The page-glow layer provides the ambient indigo. */}
      <div aria-hidden className="dark-hide absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-indigo/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-display text-ink dark:text-white mb-6 leading-tight">{t('h2')}</h2>
        <p className="text-body text-text-muted dark:text-white/70 mb-10 mx-auto">{t('body')}</p>

        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center px-10 py-4 rounded-[8px] bg-terracotta text-white font-semibold text-lg hover:bg-terracotta/90 active:scale-[0.98] transition-all duration-200 shadow-lg"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
