import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DarkPageGlow from '@/components/layout/DarkPageGlow';
import { ThemeProvider } from '@/components/providers/theme-provider';
import SmoothScrollProvider from '@/components/providers/smooth-scroll';
import PageScrollBlur from '@/components/layout/PageScrollBlur';
import '../globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  style: ['italic'],
  weight: ['600'],
  variable: '--font-cormorant',
  display: 'swap',
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const base = 'https://nexova.pl';
  const locales = routing.locales;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${base}/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${base}/${l}`])
      ),
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: `${base}/${locale}`,
      siteName: 'Nexova',
      locale,
      type: 'website',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorant.variable} min-h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SmoothScrollProvider>
            <DarkPageGlow />
            <PageScrollBlur />
            <NextIntlClientProvider messages={messages}>
              <Header locale={locale} />
              <main className="flex-1">{children}</main>
              <Footer locale={locale} />
            </NextIntlClientProvider>
          </SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
