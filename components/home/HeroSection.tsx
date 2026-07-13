'use client';

import { motion } from 'framer-motion';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';
import { Link } from '@/i18n/navigation';
import { ContainerScroll } from '@/components/ui/container-scroll';
import MockupCarousel from '@/components/ui/mockup-carousel';

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
  const words = headline.trim().split(/\s+/).map((word, i, arr) => ({
    text: word,
    className:
      i >= arr.length - 2
        ? 'text-accent'
        : '!text-ink',
  }));

  return (
    <section className="relative [overflow-x:clip]">

      {/* ── Title block ── */}
      <div className="relative mx-auto max-w-4xl px-6 pt-20 pb-8 text-center z-10">

        <motion.div {...fadeUp(0.15)}>
          <TypewriterEffect
            words={words}
            className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6"
            cursorClassName="bg-accent"
          />
        </motion.div>

        <motion.p
          {...fadeUp(0.35)}
          className="text-body text-ink-soft mx-auto max-w-2xl mb-10"
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
          <Link
            href="/uslugi"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-[8px] border font-medium active:scale-[0.98] transition-all duration-200
              border-accent text-accent hover:bg-indigo-tint"
          >
            {ctaSecondary}
          </Link>
        </motion.div>

        {/* Trust pills */}
        <motion.div
          {...fadeUp(0.65)}
          className="flex flex-wrap gap-x-6 gap-y-2 justify-center"
        >
          {trustItems.map((item) => (
            <span key={item} className="text-sm text-ink-soft flex items-center gap-1.5">
              <span className="text-success font-bold text-base">✓</span>
              {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Mockup card ── */}
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
