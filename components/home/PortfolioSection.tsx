import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PortfolioSection() {
  const t = useTranslations('home.portfolio');

  return (
    <section className="py-24 bg-surface-2 dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted text-center mb-4">
          Realizacje
        </p>
        <h2 className="text-h2 text-ink text-center mb-14">{t('h2')}</h2>

        {/* Placeholder grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* First card — call to action placeholder */}
          <div className="col-span-full sm:col-span-1 lg:col-span-1 aspect-[4/3] rounded-[14px] border-2 border-dashed border-indigo/30 bg-indigo-tint/40 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-sm font-medium text-indigo">{t('empty')}</p>
          </div>

          {/* Ghost placeholder cards */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-[14px] border border-border bg-surface animate-pulse"
            />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/realizacje"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo hover:text-indigo-deep transition-colors duration-200"
          >
            Zobacz wszystkie realizacje
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
