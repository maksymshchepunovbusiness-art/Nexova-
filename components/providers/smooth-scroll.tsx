'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Next.js hydrates content progressively — defer resize so Lenis
    // measures the full document height after all components mount.
    const t1 = setTimeout(() => lenis.resize(), 200);
    const t2 = setTimeout(() => lenis.resize(), 800);

    // Also resize whenever the document body grows (lazy images, dynamic content)
    const ro = new ResizeObserver(() => lenis.resize());
    ro.observe(document.body);

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      ro.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
