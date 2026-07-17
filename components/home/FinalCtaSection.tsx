import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function FinalCtaSection() {
  const t = useTranslations('home.finalCta');

  return (
    <section id="kontakt" className="py-28" style={{ borderTop: '1px solid var(--color-line)' }}>
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2
          className="text-h2 mb-6"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>
        <p className="text-body mb-10 mx-auto" style={{ color: 'var(--color-ink-soft)' }}>
          {t('body')}
        </p>
        <Link
          href="/kontakt"
          className="inline-flex items-center justify-center px-10 py-4 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-semibold text-[15px] active:scale-[0.97] transition-all duration-150"
        >
          {t('cta')}
        </Link>
      </div>
    </section>
  );
}
