'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

interface InkLineSegmentProps {
  // Optional fine-tuning per section
  startPct?: string; // ScrollTrigger start, e.g. 'top 85%'
  endPct?: string;   // ScrollTrigger end,   e.g. 'bottom 20%'
}

export function InkLineSegment({
  startPct = 'top 85%',
  endPct = 'bottom 20%',
}: InkLineSegmentProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useGSAP(() => {
    // Desktop only — skip below 1024px
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    const path = pathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

    // Trigger on the parent section element
    const trigger = wrapRef.current?.parentElement ?? wrapRef.current;

    gsap.to(path, {
      strokeDashoffset: 0,
      ease: 'none',
      scrollTrigger: {
        trigger,
        start: startPct,
        end: endPct,
        scrub: 1.5,
      },
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="hidden lg:block absolute inset-y-0 pointer-events-none"
      style={{ left: 4, width: 20, zIndex: 0 }}
    >
      {/* hand-drawn S-curve path, fills the full section height */}
      <svg
        width="20"
        height="100%"
        viewBox="0 0 20 1000"
        preserveAspectRatio="none"
        fill="none"
      >
        <path
          ref={pathRef}
          d="M 10 0 C 3 140, 18 300, 10 450 S 2 620, 11 760 S 17 880, 10 1000"
          stroke="var(--color-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
