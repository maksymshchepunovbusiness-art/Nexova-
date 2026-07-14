import { useTranslations } from 'next-intl';
import FaqAccordion from './FaqAccordion';

export default function FaqSection() {
  const t = useTranslations('home.faq');

  const items = [
    { q: t('items.q1.q'), a: t('items.q1.a') },
    { q: t('items.q2.q'), a: t('items.q2.a') },
    { q: t('items.q3.q'), a: t('items.q3.a') },
    { q: t('items.q4.q'), a: t('items.q4.a') },
    { q: t('items.q5.q'), a: t('items.q5.a') },
  ];

  return (
    <section className="py-28" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-3xl px-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            FAQ
          </span>
        </div>

        <h2
          className="text-h2 mb-12"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
