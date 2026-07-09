import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function GuaranteeSection() {
  const t = useTranslations('home.guarantee');
  const tCta = useTranslations('cta');

  return (
    <section className="py-24 bg-indigo dark:bg-transparent relative overflow-hidden">
      {/* Gradient fades — light mode only; .dark-hide rule in globals.css removes them in dark mode */}
      <div aria-hidden className="dark-hide absolute top-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, var(--color-surface), transparent)' }} />
      <div aria-hidden className="dark-hide absolute bottom-0 inset-x-0 h-28 pointer-events-none"
        style={{ background: 'linear-gradient(to top, var(--color-surface), transparent)' }} />

      {/* Decorative blobs — hidden in dark mode: section is transparent, overflow-hidden clips the
          blurred circles at the section boundary and creates rectangular corner artifacts */}
      <div aria-hidden className="dark-hide absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div aria-hidden className="dark-hide absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        {/* Shield icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo/10 dark:bg-white/10 mb-8">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden
            className="stroke-indigo dark:stroke-white">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <h2 className="text-h2 text-ink dark:text-white mb-6">{t('h2')}</h2>
        <p className="text-body text-text-muted dark:text-white/75 mb-10 mx-auto">{t('body')}</p>

        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center px-8 py-4 rounded-[8px] bg-indigo text-white dark:bg-white dark:text-indigo font-semibold hover:bg-indigo-deep dark:hover:bg-indigo-tint active:scale-[0.98] transition-all duration-200 shadow-sm"
        >
          {tCta('quote')}
        </Link>
      </div>
    </section>
  );
}
