'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { Link } from '@/i18n/navigation';
import { ContainerScroll } from '@/components/ui/container-scroll';
import MockupCarousel from '@/components/ui/mockup-carousel';
import dynamic from 'next/dynamic';
import { GradualBlur } from '@/components/ui/gradual-blur';

const LightPillar = dynamic(() => import('@/components/ui/light-pillar'), { ssr: false });

interface HeroSectionProps {
  headline: string;
  sub: string;
  ctaPrimary: string;
  ctaSecondary: string;
  trustItems: string[];
}

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

export default function HeroSection({
  headline,
  sub,
  ctaPrimary,
  ctaSecondary,
  trustItems,
}: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === 'dark';

  const words = headline.trim().split(/\s+/).map((word, i, arr) => ({
    text: word,
    className:
      i >= arr.length - 2
        ? 'text-indigo dark:!text-[#818CF8]'
        : '!text-ink dark:!text-white',
  }));

  return (
    <section className="relative [overflow-x:clip]">

      {/* ── LightPillar WebGL — both themes ─────────────────────────────────────
          Both themes use screen blend: black canvas pixels → transparent,
          only the luminous beam is composited. Works on dark bg (adds light)
          and on light bg the page-glow tint gives the beam something to
          screen against. noiseIntensity=0 in light mode removes grainy mesh. */}
      {mounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 right-0 h-[90vh] overflow-hidden"
          style={isDark ? {
            maskImage: 'linear-gradient(to bottom, black 35%, transparent 62%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 35%, transparent 62%)',
          } : {
            maskImage: 'radial-gradient(ellipse 55% 100% at 50% 0%, black 20%, black 48%, transparent 82%)',
            WebkitMaskImage: 'radial-gradient(ellipse 55% 100% at 50% 0%, black 20%, black 48%, transparent 82%)',
          }}
        >
          <LightPillar
            topColor={isDark ? '#818CF8' : '#5227FF'}
            bottomColor={isDark ? '#4338CA' : '#FF9FFC'}
            intensity={isDark ? 1.0 : 1.2}
            mixBlendMode="screen"
            pillarWidth={isDark ? 2.6 : 1.4}
            pillarHeight={0.45}
            rotationSpeed={0.12}
            glowAmount={isDark ? 0.0065 : 0.003}
            noiseIntensity={isDark ? 0.22 : 0.0}
            quality="high"
          />
        </div>
      )}

      {/* Dark mode ambient glow — wide halo that complements the LightPillar streak. */}
      {isDark && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.2 }}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 50% 15%, rgba(99, 102, 241, 0.11) 0%, transparent 70%)',
          }}
        />
      )}


      {/* ── Title block ── */}
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-8 text-center z-10">

        {/* Dark-mode scrim — darkens behind text so the LightPillar glow/particles
            don't wash out the white headline on the dark background.
            Light mode has NO scrim: the beam must show through fully.
            Text legibility in light mode is handled by textShadow on the
            headline and subtitle elements below. */}
        {isDark && (
          <div
            aria-hidden
            className="pointer-events-none absolute"
            style={{
              zIndex: -1,
              left: '50%', top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '160%', height: '220%',
              background:
                'radial-gradient(ellipse 48% 44% at 50% 50%, rgba(13,13,26,0.66) 0%, rgba(13,13,26,0.22) 48%, transparent 68%)',
              filter: 'blur(8px)',
            }}
          />
        )}

        <motion.div
          {...fadeUp(0.15)}
        >
          <TypewriterEffect
            words={words}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
            cursorClassName="bg-indigo"
          />
        </motion.div>

        {/* Subtitle — white/80 in dark mode; full ink in light mode for contrast against beam */}
        <motion.p
          {...fadeUp(0.35)}
          className="text-body dark:text-white/80 mx-auto max-w-2xl mb-10"
          style={mounted && !isDark ? {
            color: '#1a1535',
            fontWeight: 600,
          } : undefined}
        >
          {sub}
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.5)}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Link
            href="/kontakt"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[8px] bg-terracotta text-white font-medium hover:bg-terracotta/90 active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            {ctaPrimary}
          </Link>
          {/* Secondary button: glass-morphism in dark mode so it reads against the purple pillar */}
          <Link
            href="/uslugi"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[8px] border font-medium active:scale-[0.98] transition-all duration-200
              border-indigo text-indigo hover:bg-indigo-tint
              dark:border-white/35 dark:text-white dark:bg-white/8 dark:backdrop-blur-sm dark:hover:bg-white/14"
          >
            {ctaSecondary}
          </Link>
        </motion.div>

        {/* Trust pills — white/70 in dark mode */}
        <motion.div
          {...fadeUp(0.65)}
          className="flex flex-wrap gap-x-6 gap-y-2 justify-center"
        >
          {trustItems.map((item) => (
            <span key={item} className="text-sm text-text-muted dark:text-white/70 flex items-center gap-1.5">
              <span className="text-success dark:text-emerald-400 font-bold text-base">✓</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Mockup card ── */}
      {/* Negative margin pulls the card up so it feels closer to the hero text
          after switching to items-center (which would otherwise push the card
          visually lower in the sticky viewport). */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut', delay: 0.85 }}
        className="-mt-[22vh]"
      >
        <ContainerScroll>
          <MockupCarousel />
        </ContainerScroll>
      </motion.div>

    </section>
  );
}
