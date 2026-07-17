'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from '@/i18n/navigation';
import AutoProDevice from '@/components/ui/auto-pro-device';

interface HeroSectionProps {
  headline: string;
  h1Accents?: string; // pipe-separated exact words to colour accent blue
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustItems: string[];
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export default function HeroSection({
  headline,
  h1Accents,
  sub,
  ctaPrimary,
  ctaSecondary,
  trustItems,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const els = gsap.utils.toArray<HTMLElement>('[data-hero]');
    if (els.length) {
      gsap.fromTo(
        els,
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: EASE,
          stagger: 0.08,
          clearProps: 'transform,opacity',
        }
      );
    }
  }, { scope: containerRef });

  const words = headline.trim().split(/\s+/);
  const accentSet = h1Accents ? new Set(h1Accents.split('|')) : null;

  return (
    <section className="relative overflow-hidden">
      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl w-full px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >

        {/* ── Left column — copy ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:gap-10">

          {/* H1 — Fraunces display, accent words in blue */}
          <h1
            data-hero
            className="text-display"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {words.map((word, i) => {
              const isAccent = accentSet ? accentSet.has(word) : false;
              return (
                <span key={i} style={isAccent ? { color: 'var(--color-accent)' } : undefined}>
                  {word}{' '}
                </span>
              );
            })}
          </h1>

          {/* Subline */}
          <p data-hero className="text-body" style={{ color: 'var(--color-ink-soft)' }}>
            {sub}
          </p>

          {/* CTAs */}
          <div data-hero className="flex flex-wrap gap-4">
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-7 py-3.5 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-semibold text-[15px] active:scale-[0.97] transition-all duration-150"
            >
              {ctaPrimary}
            </Link>
            <Link
              href="/uslugi"
              className="inline-flex items-center gap-1.5 px-2 py-3.5 text-ink-soft hover:text-accent font-medium text-[15px] transition-all duration-150"
            >
              {ctaSecondary}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>

          {/* Trust row */}
          <div data-hero className="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-[var(--color-line)]">
            {trustItems.map((item) => (
              <span
                key={item}
                className="text-label flex items-center gap-2"
                style={{ color: 'var(--color-ink-soft)' }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2 7l3.5 3.5L12 4" stroke="var(--color-success)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* ── Right column — 3D AutoPro device ──────────────────────────── */}
        <div
          data-hero
          className="hidden lg:block"
          style={{ perspective: '1200px' }}
        >
          <div
            style={{
              transform: 'rotateY(-8deg) rotateX(4deg)',
              transformStyle: 'preserve-3d',
              borderRadius: 12,
              boxShadow: '0 24px 48px -24px rgb(20 22 26 / 0.18)',
            }}
          >
            <AutoProDevice />
          </div>
        </div>

      </div>
    </section>
  );
}
