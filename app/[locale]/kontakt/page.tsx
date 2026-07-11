import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactSidebar from '@/components/contact/ContactSidebar';

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ context?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function KontaktPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { context } = await searchParams;
  const t = await getTranslations({ locale, namespace: 'contact' });

  return (
    <>
      <ContactHero
        eyebrow={t('hero.eyebrow')}
        h1={t('hero.h1')}
        sub={t('hero.sub')}
      />

      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-10 lg:gap-12 lg:items-start">
            <ContactForm locale={locale} initialMessage={context ?? ''} />
            <ContactSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
