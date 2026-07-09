'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { cn } from '@/lib/utils';

export function ContainerScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Tilt from 20° → 0° over the first 55% of the scroll range; then stays flat
  const rotateRaw = useTransform(scrollYProgress, [0, 0.55], [20, 0]);
  const scaleRaw  = useTransform(scrollYProgress, [0, 0.55],
    isMobile ? [0.75, 0.97] : [0.82, 1.02]);

  const rotate = useSpring(rotateRaw, { stiffness: 60, damping: 20, restDelta: 0.001 });
  const scale  = useSpring(scaleRaw,  { stiffness: 60, damping: 20, restDelta: 0.001 });

  return (
    <div ref={containerRef} className={cn('relative h-[120vh]', className)}>
      <div className="sticky top-0 h-screen flex items-center justify-center">

        <div className="relative w-full px-4 sm:px-6 pointer-events-none">

          <div style={{ perspective: '900px', perspectiveOrigin: '50% -5%' }}>
            <motion.div
              style={{ rotateX: rotate, scale }}
              className="mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl"
            >
              {children}
            </motion.div>
          </div>

          {/* Bottom fade — light mode only; in dark mode the seamless background needs no fade */}
          <div
            aria-hidden
            className="dark-hide absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: '32%',
              background:
                'linear-gradient(to top, var(--color-surface) 0%, transparent 100%)',
            }}
          />

        </div>
      </div>
    </div>
  );
}
