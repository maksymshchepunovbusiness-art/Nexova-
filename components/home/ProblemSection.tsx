'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// Stable pseudo-random in [min, max] seeded by index — same value every render
function stableRand(seed: number, min: number, max: number): number {
  const s = Math.abs(Math.sin(seed * 127.1 + 311.7) * 43758.5453) % 1;
  return min + s * (max - min);
}

function cleanWord(w: string): string {
  return w.replace(/[.,!?;:–—…''"]+$/, '');
}

export default function ProblemSection() {
  const t = useTranslations('home.problem');

  const sectionRef  = useRef<HTMLElement>(null);
  const paraRef     = useRef<HTMLParagraphElement>(null);
  const stackRef    = useRef<HTMLDivElement>(null);
  const punchRef    = useRef<HTMLParagraphElement>(null);

  const body       = t('body');
  const keywords   = t('keywords').split('|');
  const wordsList  = body.split(' ');
  const punchline  = t('punchline');

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced-motion fallback: reveal everything statically, no pin
    if (prefersReduced) {
      if (stackRef.current)  gsap.set(stackRef.current,  { autoAlpha: 1 });
      if (punchRef.current)  gsap.set(punchRef.current,  { autoAlpha: 1, y: 0 });
      return;
    }

    const isMobile = window.innerWidth < 768;

    const paraWords = paraRef.current!.querySelectorAll<HTMLSpanElement>('[data-pw]');
    const nonKeyEls = Array.from(paraWords).filter(el => el.dataset.kw !== 'true');
    const paraKeyEls = Array.from(paraWords).filter(el => el.dataset.kw === 'true');
    const stackWordEls = stackRef.current!.querySelectorAll<HTMLElement>('.s-word');
    const punchEl = punchRef.current!;

    // Stack is rendered at opacity 0 but in layout — measure positions before hiding
    // (autoAlpha 0 keeps visibility:hidden which still lays out)
    gsap.set(stackRef.current!, { autoAlpha: 0 });
    gsap.set(punchEl, { autoAlpha: 0, y: 8 });

    // Capture offset: each stack word should start from its corresponding para keyword
    const offsets = Array.from(stackWordEls).map((sw, i) => {
      const pk = paraKeyEls[i];
      if (!pk) return { x: 0, y: 0, scale: 1 };
      const pkR = pk.getBoundingClientRect();
      const swR = sw.getBoundingClientRect();
      return {
        x: pkR.left + pkR.width / 2 - (swR.left + swR.width / 2),
        y: pkR.top  + pkR.height / 2 - (swR.top  + swR.height / 2),
        scale: pkR.height / Math.max(swR.height, 1),
      };
    });

    // Park stack words at para keyword positions
    Array.from(stackWordEls).forEach((sw, i) => {
      gsap.set(sw, { x: offsets[i].x, y: offsets[i].y, scale: offsets[i].scale, opacity: 0 });
    });

    // ── Main scrub timeline ──────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current!,
        pin:     true,
        scrub:   0.6,
        start:   'top top',
        end:     '+=250%',
      },
    });

    // Phase 1 — 0 → 0.15: static, reader reads
    tl.to({}, { duration: 0.15 });

    // Phase 2 — 0.15 → 0.55: fly-out non-keywords to the right
    const FLY_START  = 0.15;
    const FLY_END    = 0.55;
    const flySpan    = FLY_END - FLY_START;
    const xMax = isMobile ? 70 : 110;
    const xMin = isMobile ? 40 : 60;

    nonKeyEls.forEach((el, i) => {
      const spread  = (i / Math.max(nonKeyEls.length - 1, 1)) * flySpan * 0.4;
      const dur     = flySpan * 0.6;
      tl.to(el, {
        x:        `${stableRand(i * 3 + 1, xMin, xMax)}vw`,
        y:        stableRand(i * 5 + 2, -30, 30),
        rotation: stableRand(i * 7 + 3, -6, 6),
        opacity:  0,
        ease:     'power2.in',
        duration: dur,
      }, FLY_START + spread);
    });

    // Phase 3 — 0.45 → 0.80: assembly (overlaps fly-out)
    const ASM_START = 0.45;
    const ASM_END   = 0.80;
    const asmSpan   = ASM_END - ASM_START;

    // Fade para keywords as stack words swoop in
    tl.to(paraKeyEls, { opacity: 0, duration: 0.12, ease: 'none' }, ASM_START);

    // Show stack container
    tl.set(stackRef.current!, { autoAlpha: 1 }, ASM_START);

    // Animate each stack word from para position → its natural stack position
    Array.from(stackWordEls).forEach((sw, i) => {
      const staggerOff = (i / Math.max(stackWordEls.length - 1, 1)) * 0.08;
      const isLast     = i === stackWordEls.length - 1;
      tl.to(sw, {
        x:       0,
        y:       0,
        scale:   1,
        opacity: 1,
        color:   isLast ? 'var(--color-accent)' : 'var(--color-ink)',
        ease:    'power2.out',
        duration: asmSpan - staggerOff,
      }, ASM_START + staggerOff);
    });

    // Phase 4 — 0.80 → 1.00: punchline rises in
    tl.to(punchEl, {
      autoAlpha: 1,
      y:         0,
      ease:      'power2.out',
      duration:  0.20,
    }, ASM_END);

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative py-32"
      style={{ overflowX: 'clip' }}
    >
      {/* Screen-reader paragraph — always in DOM, visually hidden */}
      <p className="sr-only">{body} {punchline}</p>

      <div className="mx-auto max-w-3xl px-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span
            aria-hidden
            style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }}
          />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            Problem
          </span>
        </div>

        {/* H2 */}
        <h2
          className="text-h2 mb-12"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        {/* Stage: para + stack overlay share the same bounding box */}
        <div className="relative" style={{ minHeight: '14rem' }}>

          {/* Animated paragraph — aria-hidden, word spans */}
          <p
            ref={paraRef}
            aria-hidden
            style={{
              fontSize: 'clamp(1.25rem, 2.5vw, 1.625rem)',
              lineHeight: 1.55,
              color: 'var(--color-ink)',
            }}
          >
            {wordsList.map((word, i) => {
              const isKey = keywords.includes(cleanWord(word));
              return (
                <span key={i}>
                  <span
                    data-pw
                    data-kw={isKey ? 'true' : 'false'}
                    style={{ display: 'inline-block', willChange: 'transform, opacity' }}
                  >
                    {word}
                  </span>
                  {i < wordsList.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </p>

          {/* Stack overlay — keywords assemble here */}
          <div
            ref={stackRef}
            className="absolute inset-0 flex flex-col items-start justify-center gap-4 pointer-events-none"
            style={{ opacity: 0 }}
            aria-hidden
          >
            {keywords.map((kw, i) => (
              <span
                key={kw}
                className="s-word"
                style={{
                  fontFamily:   'var(--font-display), Georgia, serif',
                  fontSize:     'clamp(2rem, 4vw, 3.25rem)',
                  fontWeight:   580,
                  lineHeight:   1.08,
                  letterSpacing: '-0.02em',
                  color:        i === keywords.length - 1 ? 'var(--color-accent)' : 'var(--color-ink)',
                  display:      'block',
                  willChange:   'transform, opacity, color',
                }}
              >
                {kw}.
              </span>
            ))}
          </div>
        </div>

        {/* Punchline */}
        <p
          ref={punchRef}
          className="text-body mt-8"
          style={{
            color:     'var(--color-ink-soft)',
            opacity:   0,
            transform: 'translateY(8px)',
          }}
          aria-hidden
        >
          {punchline}
        </p>

      </div>
    </section>
  );
}
