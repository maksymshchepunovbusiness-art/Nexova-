import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['pl', 'cs', 'en', 'uk'],
  defaultLocale: 'pl',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];
