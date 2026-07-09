import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import ContactSidebar from '@/components/contact/ContactSidebar';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.meta' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function KontaktPage({ params }: Props) {
  const { locale } = await params;
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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 lg:items-start">
            <div className="lg:col-span-3">
              <ContactForm locale={locale} />
            </div>
            <div className="lg:col-span-2">
              <ContactSidebar />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
