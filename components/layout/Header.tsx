'use client';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { scrollToSection } from '@/lib/scroll-to-section';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';

interface HeaderProps {
  locale: string;
}

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const tCta = useTranslations('cta');
  const pathname = usePathname();

  // These are homepage sections, not standalone routes — anchor-scroll on the
  // homepage, or navigate to `/#id` and let the hash handler in
  // SmoothScrollProvider correct for the sticky header once landed.
  const navLinks = [
    { href: '/#oferta', label: t('services'), sectionId: 'oferta' },
    { href: '/#proces', label: t('process'), sectionId: 'proces' },
    { href: '/#realizacje', label: t('portfolio'), sectionId: 'realizacje' },
    { href: '/#o-nas', label: t('about'), sectionId: 'o-nas' },
    { href: '/kontakt', label: t('contact') },
  ];

  const handleNavClick = (e: React.MouseEvent, sectionId?: string) => {
    if (!sectionId || pathname !== '/') return;
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors duration-200"
      style={{ borderColor: 'var(--color-line)', backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)' }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link
            href="/"
            locale={locale as 'pl' | 'cs' | 'en' | 'uk'}
            className="flex items-center gap-2 shrink-0"
            aria-label="Nexova — strona główna"
          >
            <span className="nx-monogram text-2xl text-indigo leading-none select-none">
              NX
            </span>
            <span className="font-semibold text-ink tracking-tight hidden sm:block">
              Nexova
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-6"
            aria-label="Główna nawigacja"
          >
            {navLinks.map(({ href, label, sectionId }) => (
              <Link
                key={href}
                href={href}
                onClick={(e) => handleNavClick(e, sectionId)}
                className="text-label text-text-muted hover:text-ink transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            <Link
              href="/kontakt"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-[8px] bg-accent text-white text-label font-medium hover:bg-accent-ink active:scale-[0.97] transition-all duration-150 cursor-pointer"
            >
              {tCta('quote')}
            </Link>

            {/* Mobile menu trigger */}
            <MobileMenu navLinks={navLinks} quoteLabel={tCta('quote')} />
          </div>

        </div>
      </div>
    </motion.header>
  );
}
