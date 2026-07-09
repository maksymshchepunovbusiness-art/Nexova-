'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from './LanguageSwitcher';

interface MobileMenuProps {
  navLinks: Array<{ href: string; label: string }>;
  quoteLabel: string;
}

export default function MobileMenu({ navLinks, quoteLabel }: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  // Close on route change / Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
        className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 cursor-pointer"
      >
        <span
          className={`block w-6 h-0.5 bg-ink transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-ink transition-opacity duration-300 ${open ? 'opacity-0' : ''}`}
        />
        <span
          className={`block w-6 h-0.5 bg-ink transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`}
        />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-surface"
          role="dialog"
          aria-modal="true"
          aria-label="Menu nawigacji"
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 h-16 border-b border-border">
            <span className="nx-monogram text-2xl text-indigo leading-none">NX</span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Zamknij menu"
              className="w-10 h-10 flex items-center justify-center text-ink cursor-pointer"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col px-4 py-6 gap-1" aria-label="Menu mobilne">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="py-3 text-h3 text-ink border-b border-border last:border-0 hover:text-indigo transition-colors duration-200"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Bottom */}
          <div className="mt-auto px-4 pb-8 flex flex-col gap-4">
            <LanguageSwitcher />
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center w-full px-6 py-3.5 rounded-[8px] bg-terracotta text-white font-medium hover:bg-terracotta/90 transition-colors duration-200 cursor-pointer"
            >
              {quoteLabel}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
