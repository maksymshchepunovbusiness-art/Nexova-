'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: EASE, delay },
});

interface Props {
  eyebrow: string;
  h1: string;
  sub: string;
}

export default function ContactHero({ eyebrow, h1, sub }: Props) {
  return (
    <section className="pt-24 pb-14 text-center">
      <div className="mx-auto max-w-3xl px-6">
        <motion.p
          {...fadeUp(0.1)}
          className="text-label text-indigo font-semibold uppercase tracking-widest mb-4"
        >
          {eyebrow}
        </motion.p>
        <motion.h1
          {...fadeUp(0.22)}
          className="text-display text-ink dark:text-white mb-6 leading-tight"
        >
          {h1}
        </motion.h1>
        <motion.p
          {...fadeUp(0.38)}
          className="text-body text-text-muted dark:text-white/75 mx-auto"
        >
          {sub}
        </motion.p>
      </div>
    </section>
  );
}
