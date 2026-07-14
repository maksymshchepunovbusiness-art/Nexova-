import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function GuaranteeSection() {
  const t = useTranslations('home.guarantee');
  const tCta = useTranslations('cta');

  return (
    <section
      className="py-28 relative"
      style={{ backgroundColor: 'var(--color-ink)' }}
    >
      <div className="mx-auto max-w-3xl px-6 text-center">

        {/* Shield icon */}
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-8"
          style={{ backgroundColor: 'rgba(43,99,250,0.15)' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{ stroke: 'var(--color-accent)' }}
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 11 14 15 10" />
          </svg>
        </div>

        <h2
          className="text-h2 mb-6"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-bg)' }}
        >
          {t('h2')}
        </h2>
        <p
          className="text-body mb-10 mx-auto"
          style={{ color: 'rgba(250,249,246,0.70)' }}
        >
          {t('body')}
        </p>

        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center px-8 py-4 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-semibold text-[15px] active:scale-[0.97] transition-all duration-150"
        >
          {tCta('quote')}
        </Link>
      </div>
    </section>
  );
}
