'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ContactSidebar() {
  const t = useTranslations('contact');

  const trust = [
    t('sidebar.trust1'),
    t('sidebar.trust2'),
    t('sidebar.trust3'),
    t('sidebar.trust4'),
    t('sidebar.trust5'),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.28 }}
      className="flex flex-col gap-8"
    >

      {/* Why Nexova — primary trust block */}
      <div className="bg-surface border border-border rounded-2xl p-6 hover:shadow-sm transition-shadow duration-300">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-muted mb-5">
          {t('sidebar.trustHeading')}
        </p>
        <ul className="flex flex-col gap-4">
          {trust.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-ink dark:text-white/90 leading-snug">
              <span className="flex-shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-success/15 dark:bg-success/20">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" strokeWidth="3"
                  strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-success">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Contact details */}
      <div className="flex flex-col gap-5 px-1">

        {/* Email */}
        <a href="mailto:kontakt.nexova.agency@gmail.com" className="group flex items-start gap-4">
          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo/10 dark:bg-indigo/20 group-hover:bg-indigo/20 transition-colors duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-indigo">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="2,4 12,13 22,4" />
            </svg>
          </span>
          <div>
            <p className="text-label text-text-muted mb-0.5">E-mail</p>
            <p className="text-label font-medium text-ink dark:text-white/90 group-hover:text-indigo dark:group-hover:text-indigo/80 transition-colors break-all">
              {t('sidebar.email')}
            </p>
          </div>
        </a>

        {/* Phone */}
        <a href="tel:+48574022812" className="group flex items-start gap-4">
          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo/10 dark:bg-indigo/20 group-hover:bg-indigo/20 transition-colors duration-200">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-indigo">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 0 0 0 1.17 2 2 0 0 1 2 0h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L6.91 7.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </span>
          <div>
            <p className="text-label text-text-muted mb-0.5">Telefon</p>
            <p className="text-label font-medium text-ink dark:text-white/90 group-hover:text-indigo dark:group-hover:text-indigo/80 transition-colors">
              {t('sidebar.phone')}
            </p>
          </div>
        </a>

        {/* Response time */}
        <div className="flex items-start gap-4">
          <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-indigo/10 dark:bg-indigo/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round" aria-hidden className="stroke-indigo">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </span>
          <div>
            <p className="text-label text-text-muted mb-0.5">Czas odpowiedzi</p>
            <p className="text-label font-medium text-ink dark:text-white/90">
              {t('sidebar.response')}
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
