import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyPolicy.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function PrivacyPolicyPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacyPolicy' });
  const sections = t.raw('sections') as Array<{ title: string; body: string }>;

  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-6">
        <h1
          className="text-h2 mb-3"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h1')}
        </h1>
        <p className="text-label mb-10" style={{ color: 'var(--color-ink-soft)' }}>
          {t('updated')}
        </p>
        <p className="text-body mb-14" style={{ color: 'var(--color-ink-soft)' }}>
          {t('intro')}
        </p>

        <div className="flex flex-col gap-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-h3 mb-3" style={{ color: 'var(--color-ink)' }}>
                {s.title}
              </h2>
              <p className="text-body" style={{ color: 'var(--color-ink-soft)' }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
