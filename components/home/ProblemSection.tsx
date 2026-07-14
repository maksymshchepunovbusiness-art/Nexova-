'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

function cleanWord(word: string): string {
  return word.replace(/[.,!?;:–—…’]+$/, '');
}

export default function ProblemSection() {
  const t = useTranslations('home.problem');
  const sectionRef = useRef<HTMLDivElement>(null);
  const wordsContainerRef = useRef<HTMLParagraphElement>(null);

  const body = t('body');
  const keywords = t('keywords').split('|');
  const wordsList = body.split(' ');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced || !wordsContainerRef.current) return;

    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const wordEls = wordsContainerRef.current.querySelectorAll<HTMLSpanElement>('.distill-word');
    const dimEls = Array.from(wordEls).filter((el) => el.dataset.keyword !== 'true');
    const keyEls = Array.from(wordEls).filter((el) => el.dataset.keyword === 'true');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: '+=180%',
      },
    });

    tl.to(dimEls, { opacity: 0.08, duration: 1, stagger: 0.015, ease: 'none' }, 0);
    tl.to(keyEls, { color: 'var(--color-accent)', scale: 1.04, duration: 1, ease: 'none' }, 0);
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative overflow-hidden py-32">
      <div className="mx-auto max-w-3xl px-6">

        {/* Eyebrow — blue rule + small label */}
        <div className="flex items-center gap-3 mb-10">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            Problem
          </span>
        </div>

        {/* H2 */}
        <h2
          className="text-h2 mb-10"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        {/* Distillation paragraph — large body text with per-word spans */}
        <p
          ref={wordsContainerRef}
          style={{
            fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
            lineHeight: 1.55,
            color: 'var(--color-ink)',
            maxWidth: '100%',
          }}
        >
          {wordsList.map((word, i) => {
            const isKey = keywords.includes(cleanWord(word));
            return (
              <span key={i}>
                <span
                  className="distill-word"
                  data-keyword={isKey ? 'true' : 'false'}
                  style={{ display: 'inline-block', willChange: 'opacity, color' }}
                >
                  {word}
                </span>
                {i < wordsList.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </p>
      </div>
    </section>
  );
}
