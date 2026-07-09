'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing, type Locale } from '@/i18n/routing';

const labels: Record<Locale, string> = {
  pl: 'PL',
  cs: 'CS',
  en: 'EN',
  uk: 'UA',
};

export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(next: Locale) {
    router.replace(pathname, { locale: next });
  }

  return (
    <div className="flex items-center gap-1" role="navigation" aria-label="Language switcher">
      {routing.locales.map((l) => (
        <button
          key={l}
          onClick={() => handleChange(l)}
          aria-label={`Switch to ${labels[l]}`}
          aria-current={l === locale ? 'true' : undefined}
          className={[
            'text-label px-2 py-1 rounded transition-colors duration-200 cursor-pointer',
            l === locale
              ? 'text-indigo font-600'
              : 'text-text-muted hover:text-ink',
          ].join(' ')}
        >
          {labels[l]}
        </button>
      ))}
    </div>
  );
}
