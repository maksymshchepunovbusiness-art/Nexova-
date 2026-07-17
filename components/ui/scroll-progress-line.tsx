'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Stable hand-drawn S-curve — 4 Bezier bends, ±4px horizontal wobble in 20-unit space
const PATH = 'M 10 0 C 6 80, 14 170, 10 260 C 6 350, 13 440, 10 550 C 7 640, 14 740, 10 860 C 8 920, 11 970, 10 1000';

const SECTION_IDS = ['hero', 'problem', 'porownanie', 'oferta', 'proces', 'realizacje', 'kontakt'] as const;
type SectionId = typeof SECTION_IDS[number];

const LABELS: Record<SectionId, Record<string, string>> = {
  hero:       { pl: 'Start',       en: 'Start',       cs: 'Start',      uk: 'Початок'    },
  problem:    { pl: 'Problem',     en: 'Problem',     cs: 'Problém',    uk: 'Проблema'   },
  porownanie: { pl: 'Porównanie',  en: 'Comparison',  cs: 'Srovnání',   uk: 'Порівняння' },
  oferta:     { pl: 'Oferta',      en: 'Services',    cs: 'Nabídka',    uk: 'Послуги'    },
  proces:     { pl: 'Proces',      en: 'Process',     cs: 'Proces',     uk: 'Процес'     },
  realizacje: { pl: 'Realizacje',  en: 'Portfolio',   cs: 'Realizace',  uk: 'Реалізації' },
  kontakt:    { pl: 'Kontakt',     en: 'Contact',     cs: 'Kontakt',    uk: 'Kontakt'    },
};

type WaypointData = { id: SectionId; fraction: number };

interface Props { locale: string }

export function ScrollProgressLine({ locale }: Props) {
  const progressRef = useRef<SVGPathElement>(null);
  const totalLenRef = useRef(0);
  const rafRef      = useRef<number>(0);

  const [waypoints,  setWaypoints]  = useState<WaypointData[]>([]);
  const [scrollFrac, setScrollFrac] = useState(0);
  const [hoveredId,  setHoveredId]  = useState<SectionId | null>(null);
  const [reduced,    setReduced]    = useState(false);

  const scrollTotal = () => document.documentElement.scrollHeight - window.innerHeight;

  const measure = useCallback(() => {
    const path = progressRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    totalLenRef.current = len;
    path.style.strokeDasharray  = String(len);

    const total = scrollTotal();
    if (total <= 0) return;

    const wps = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      // getBoundingClientRect + scrollY = document-relative top, correct at scrollY≈0
      const top = el.getBoundingClientRect().top + window.scrollY;
      return { id, fraction: Math.min(1, Math.max(0, top / total)) };
    }).filter((w): w is WaypointData => w !== null);

    setWaypoints(wps);

    // Sync to current scroll immediately
    const frac = Math.min(1, Math.max(0, window.scrollY / total));
    path.style.strokeDashoffset = String(len * (1 - frac));
    setScrollFrac(frac);
  }, []);

  const updateProgress = useCallback(() => {
    const path = progressRef.current;
    const len  = totalLenRef.current;
    if (!path || len === 0) return;

    const total = scrollTotal();
    if (total <= 0) return;
    const frac = Math.min(1, Math.max(0, window.scrollY / total));
    path.style.strokeDashoffset = String(len * (1 - frac));
    setScrollFrac(frac);
  }, []);

  const onScroll = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(updateProgress);
  }, [updateProgress]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onMQ = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onMQ);

    // Measure after initial render, then again after GSAP pin setup
    const t1 = setTimeout(measure, 250);
    const t2 = setTimeout(measure, 1100);

    window.addEventListener('scroll',  onScroll, { passive: true });
    window.addEventListener('resize',  measure,  { passive: true });
    ScrollTrigger.addEventListener('refresh', measure);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      mq.removeEventListener('change', onMQ);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      ScrollTrigger.removeEventListener('refresh', measure);
      cancelAnimationFrame(rafRef.current);
    };
  }, [measure, onScroll]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const lenis = (window as any).__lenis;
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset: -80, duration: 1.2 });
    } else {
      window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - 80), behavior: 'smooth' });
    }
  }, []);

  const getLabel = (id: SectionId) => LABELS[id][locale] ?? LABELS[id].pl;

  return (
    <div
      className="fixed hidden lg:block pointer-events-none"
      style={{ top: 96, bottom: 96, left: 8, width: 16, zIndex: 40 }}
    >
      {/* Track (dim) + progress stroke */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 20 1000"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden
      >
        <path
          d={PATH}
          stroke="var(--color-line)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeOpacity={0.45}
        />
        <path
          ref={progressRef}
          d={PATH}
          stroke="var(--color-accent)"
          strokeWidth={2}
          strokeLinecap="round"
        />
      </svg>

      {/* Waypoint buttons */}
      {waypoints.map((wp, i) => {
        const isPassed  = wp.fraction <= scrollFrac + 0.01;
        const nextFrac  = waypoints[i + 1]?.fraction ?? 1.01;
        const isActive  = scrollFrac >= wp.fraction - 0.005 && scrollFrac < nextFrac;
        const isHovered = hoveredId === wp.id;
        const dotSize   = isActive ? 8 : 5;

        return (
          <button
            key={wp.id}
            className="pointer-events-auto absolute"
            style={{
              top: `${wp.fraction * 100}%`,
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: 6,
              lineHeight: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '50%',
              outlineOffset: 2,
            }}
            aria-label={getLabel(wp.id)}
            onClick={() => scrollToSection(wp.id)}
            onMouseEnter={() => setHoveredId(wp.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(wp.id)}
            onBlur={() => setHoveredId(null)}
          >
            <span
              style={{
                display: 'block',
                width: dotSize,
                height: dotSize,
                borderRadius: '50%',
                backgroundColor: isPassed ? 'var(--color-accent)' : 'transparent',
                border: `1.5px solid ${isPassed ? 'var(--color-accent)' : 'var(--color-line)'}`,
                transition: reduced ? 'none' : 'width 150ms, height 150ms, background-color 150ms',
              }}
            />

            {isHovered && (
              <span
                role="tooltip"
                style={{
                  position: 'absolute',
                  left: 'calc(100% + 8px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  whiteSpace: 'nowrap',
                  padding: '3px 8px',
                  backgroundColor: 'var(--color-bg)',
                  border: '1px solid var(--color-line)',
                  borderRadius: 6,
                  fontSize: '0.725rem',
                  fontWeight: 500,
                  letterSpacing: '0.025em',
                  color: 'var(--color-ink)',
                  pointerEvents: 'none',
                  boxShadow: '0 2px 8px rgb(20 22 26 / 0.08)',
                  zIndex: 1,
                  fontFamily: 'var(--font-instrument-sans), sans-serif',
                }}
              >
                {getLabel(wp.id)}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
