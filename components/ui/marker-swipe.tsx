'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface MarkerSwipeProps {
  delay?: number;
}

export function MarkerSwipe({ delay = 0.55 }: MarkerSwipeProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useGSAP(() => {
    if (!svgRef.current) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    gsap.fromTo(
      svgRef.current,
      { scaleX: 0, rotation: -1, transformOrigin: 'left center' },
      { scaleX: 1, rotation: -1, transformOrigin: 'left center', duration: 0.4, ease: 'power2.out', delay }
    );
  });

  return (
    <svg
      ref={svgRef}
      aria-hidden
      style={{
        position: 'absolute',
        bottom: '0.05em',
        left: 0,
        width: '100%',
        height: '0.5em',
        pointerEvents: 'none',
        zIndex: 0,
        transform: 'rotate(-1deg) scaleX(0)',
        transformOrigin: 'left center',
      }}
      viewBox="0 0 200 14"
      preserveAspectRatio="none"
    >
      {/* hand-drawn highlighter blob shape */}
      <path
        d="M 2 9 C 22 5, 58 12, 98 7 C 138 2, 172 11, 198 8 L 198 12 C 172 14, 138 11, 98 12 C 58 13, 22 11, 2 12 Z"
        fill="var(--color-marker)"
      />
    </svg>
  );
}
