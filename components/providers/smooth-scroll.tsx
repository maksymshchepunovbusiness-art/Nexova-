'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect user preference — no smooth scroll or GSAP scroll scenes if reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      ScrollTrigger.normalizeScroll(false);
      return;
    }

    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });
    (window as any).__lenis = lenis;

    // Keep GSAP ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Drive Lenis inside the GSAP ticker so both run at the same frame
    const gsapTicker = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(gsapTicker);
    gsap.ticker.lagSmoothing(0);

    // Defer resize so Lenis measures the full document after hydration
    const t1 = setTimeout(() => lenis.resize(), 200);
    const t2 = setTimeout(() => lenis.resize(), 800);

    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      gsap.ticker.remove(gsapTicker);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}
