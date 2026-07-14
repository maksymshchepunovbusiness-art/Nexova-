'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Link } from '@/i18n/navigation';
import MockupCarousel from '@/components/ui/mockup-carousel';

interface HeroSectionProps {
  headline: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustItems: string[];
}

const EASE = 'cubic-bezier(0.23, 1, 0.32, 1)';

export default function HeroSection({
  headline,
  sub,
  ctaPrimary,
  ctaSecondary,
  trustItems,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const markARef = useRef<HTMLSpanElement>(null);
  const markBRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

    if (prefersReduced || !markARef.current || !markBRef.current) return;

    const qtA = gsap.quickTo(markARef.current, 'x', { duration: 1.4, ease: 'power2.out' });
    const qtB = gsap.quickTo(markBRef.current, 'x', { duration: 1.9, ease: 'power2.out' });

    const onMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const dx = (e.clientX - cx) / cx; // -1 → 1
      qtA(dx * 28);
      qtB(dx * -18);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, { scope: containerRef });

  // Last 2 words of headline get the accent blue
  const words = headline.trim().split(/\s+/);
  const accentStart = Math.max(0, words.length - 2);

  return (
    <section className="relative overflow-hidden">
      {/* NX drift marks — decorative, mouse-parallax */}
      <span
        ref={markARef}
        aria-hidden
        className="nx-monogram pointer-events-none select-none absolute -top-10 -left-8 text-[22rem] leading-none"
        style={{ color: 'var(--color-accent)', opacity: 0.03, willChange: 'transform' }}
      >
        NX
      </span>
      <span
        ref={markBRef}
        aria-hidden
        className="nx-monogram pointer-events-none select-none absolute -bottom-16 right-0 text-[16rem] leading-none"
        style={{ color: 'var(--color-accent)', opacity: 0.025, willChange: 'transform' }}
      >
        NX
      </span>

      <div
        ref={containerRef}
        className="relative mx-auto max-w-7xl w-full px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
      >

        {/* ── Left column — copy ─────────────────────────────────────────── */}
        <div className="flex flex-col gap-8 lg:gap-10">

          {/* H1 — Fraunces display size, blue on last 2 words */}
          <h1
            data-hero
            className="text-display"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {words.map((word, i) => (
              <span key={i} style={i >= accentStart ? { color: 'var(--color-accent)' } : undefined}>
                {word}
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
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

          {/* Trust row — hairline separated, small, ink-soft */}
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

        {/* ── Right column — 3D device mockup ───────────────────────────── */}
        <div
          data-hero
          className="hidden lg:block"
          style={{ perspective: '1200px' }}
        >
          <div
            className="rounded-xl overflow-hidden shadow-2xl"
            style={{ transform: 'rotateY(-8deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}
          >
            <MockupCarousel />
          </div>
        </div>

      </div>
    </section>
  );
}

