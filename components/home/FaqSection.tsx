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
    <section className="py-24 bg-surface-2 dark:bg-transparent">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted text-center mb-4">
          FAQ
        </p>
        <h2 className="text-h2 text-ink text-center mb-12">{t('h2')}</h2>
        <FaqAccordion items={items} />
      </div>
    </section>
  );
}
