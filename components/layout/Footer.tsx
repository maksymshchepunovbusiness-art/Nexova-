import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface FooterProps {
  locale: string;
}

export default function Footer({ locale: _locale }: FooterProps) {
  const t = useTranslations('nav');
  const tFooter = useTranslations('footer');

  const navLinks = [
    { href: '/uslugi', label: t('services') },
    { href: '/jak-pracuje', label: t('process') },
    { href: '/realizacje', label: t('portfolio') },
    { href: '/o-nas', label: t('about') },
    { href: '/kontakt', label: t('contact') },
  ];

  const year = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--color-line)', backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="nx-monogram text-2xl text-indigo leading-none">NX</span>
              <span className="font-semibold text-ink">Nexova</span>
            </div>
            <p className="text-label text-text-muted max-w-[220px]">
              {tFooter('tagline')}
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-label font-semibold text-ink mb-3">{tFooter('menu')}</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-label text-text-muted hover:text-ink transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-label font-semibold text-ink mb-3">{tFooter('contact')}</p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="mailto:kontakt.nexova.agency@gmail.com"
                  className="text-label text-text-muted hover:text-ink transition-colors duration-200"
                >
                  kontakt.nexova.agency@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+48574022812"
                  className="text-label text-text-muted hover:text-ink transition-colors duration-200"
                >
                  +48 574 022 812
                </a>
              </li>
            </ul>
          </div>

          {/* Languages */}
          <div>
            <p className="text-label font-semibold text-ink mb-3">{tFooter('language')}</p>
            <LanguageSwitcher />
          </div>

        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-border">
          <p className="text-label text-text-muted">
            © {year} Nexova
            {/* NIP will be added after registration */}
          </p>
          <Link
            href="/polityka-prywatnosci"
            className="text-label text-text-muted hover:text-ink transition-colors duration-200"
          >
            {tFooter('privacy')}
          </Link>
        </div>

      </div>
    </footer>
  );
}
