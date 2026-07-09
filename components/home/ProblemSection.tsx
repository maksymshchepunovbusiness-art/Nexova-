import { useTranslations } from 'next-intl';

export default function ProblemSection() {
  const t = useTranslations('home.problem');

  return (
    <section className="bg-indigo-deep dark:bg-transparent py-24 relative overflow-hidden">
      {/* Gradient fades — light mode only; hidden in dark mode via globals.css .dark-hide rule */}
      <div aria-hidden className="dark-hide absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-surface), transparent)' }} />
      <div aria-hidden className="dark-hide absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-surface), transparent)' }} />

      {/* Decorative glow — hidden in dark mode: section is transparent and
          overflow-hidden clips the blur-3xl at the boundary, creating a
          visible seam at the bottom edge. DarkPageGlow handles the page glow. */}
      <div aria-hidden className="dark-hide absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-indigo/30 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted dark:text-indigo-tint/60 mb-6">
          Problem
        </p>
        <h2 className="text-h2 text-ink dark:text-white mb-8 leading-snug">{t('h2')}</h2>
        <p className="text-body text-text-muted dark:text-white/70 mx-auto">{t('body')}</p>
      </div>
    </section>
  );
}
