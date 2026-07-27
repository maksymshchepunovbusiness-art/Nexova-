'use client';

import { useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const DIVE_ASSET_SRC = '/images/dive/autopro-screen.webp';

// Pin distance as a multiple of viewport height. Exported so e2e tests derive
// their scroll-target math from this exact value instead of hardcoding a
// second copy that silently drifts out of sync on the next retime.
export const PIN_DISTANCE_VH_MULTIPLIER = 1.7;

const SCREEN_ASPECT = 1280 / 1600;
// Vertical focal point within the screen crop that the zoom centers on —
// biased toward the hero headline rather than the crop's geometric middle.
const FOCAL_Y_FRACTION = 0.22;

interface Geometry {
  scale: number;
  originX: number;
  originY: number;
  tx: number;
  ty: number;
}

// ── Ink warp streaks — tunable constants (taste call, tune freely) ─────────
// Stage 2's screenshot→live crossfade is planned to happen at the same
// window as the streak intensity peak — keep WINDOW_START/END as the shared
// reference point rather than inlining the numbers elsewhere.
const STREAK_COUNT = 24;
const STREAK_SEED = 20260727; // fixed seed — deterministic layout across renders
// Progress range streaks are allowed to exist in (hard gate — zero outside
// this window regardless of velocity). Kept aligned to the zoom act
// (0.15–0.62) at the same relative position it held before the retime —
// zoom's new end lands mid-window rather than at the window's edge.
const STREAK_WINDOW_START = 0.38;
const STREAK_WINDOW_END = 0.72;
const STREAK_LENGTH_MIN_VMIN = 8; // per-streak max length is randomized in this range;
const STREAK_LENGTH_MAX_VMIN = 20; // actual length scales 0 → max with velocity intensity
const STREAK_TRAVEL_VMIN = 14; // outward "fly past camera" distance across the window
const STREAK_INK_OPACITY = 0.25; // base opacity for --ink streaks (~70% of streaks)
const STREAK_ACCENT_OPACITY = 0.35; // base opacity for --accent streaks (~30% of streaks)
const STREAK_ACCENT_RATIO = 0.3;
const STREAK_VELOCITY_SENSITIVITY = 45; // smoothed |Δprogress|/tick → intensity 0..1 — tune live
const VIGNETTE_MAX_OPACITY = 0.08;

interface StreakDef {
  angle: number;
  isAccent: boolean;
  lengthFraction: number;
  strokeWidth: number;
}

// Deterministic PRNG (mulberry32) — same 24 streaks every render/reload.
function mulberry32(seed: number) {
  let s = seed;
  return function rng() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildStreaks(count: number): StreakDef[] {
  const rng = mulberry32(STREAK_SEED);
  return Array.from({ length: count }, () => ({
    angle: rng() * Math.PI * 2,
    isAccent: rng() < STREAK_ACCENT_RATIO,
    lengthFraction: rng(),
    strokeWidth: rng() < 0.5 ? 1 : 2,
  }));
}

const STREAKS = buildStreaks(STREAK_COUNT);

export default function DiveBridgeSection() {
  const t = useTranslations('home.portfolio.dive');

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef   = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const deviceRef  = useRef<HTMLDivElement>(null);
  const shadowRef  = useRef<HTMLDivElement>(null);
  const chromeRef  = useRef<HTMLDivElement>(null);
  const screenRef  = useRef<HTMLDivElement>(null);

  const streakRefs    = useRef<(SVGLineElement | null)[]>([]);
  const vignetteRef   = useRef<HTMLDivElement>(null);
  const prevProgressRef = useRef(0);
  const deltaBufRef     = useRef<[number, number, number]>([0, 0, 0]);
  const deltaIdxRef     = useRef(0);

  // JIT preload — warm the browser cache for the dive asset once the Process
  // section (the one right before this bridge) approaches the viewport, so
  // it's never fetched on initial load but is ready well before the user
  // scrolls into the pin. Independent of the animation setup below: runs
  // regardless of reduced-motion/mobile since the Image itself always needs it.
  useEffect(() => {
    const target = document.getElementById('proces');
    if (!target || typeof IntersectionObserver === 'undefined') return;

    let injected = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (injected || !entries.some((e) => e.isIntersecting)) return;
        injected = true;
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = DIVE_ASSET_SRC;
        link.setAttribute('fetchpriority', 'high');
        document.head.appendChild(link);
        observer.disconnect();
      },
      { rootMargin: '50%' }
    );
    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useGSAP(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceEl = deviceRef.current!;
    const screenEl = screenRef.current!;
    const chromeEl = chromeRef.current!;
    const shadowEl = shadowRef.current!;
    const eyebrowEl = eyebrowRef.current;

    // Reduced motion — static, flat, no pin.
    if (prefersReduced) {
      gsap.set(deviceEl, { clearProps: 'all' });
      return;
    }

    // Mobile/tablet — no pin, gentle scale across the section's own scroll range.
    if (window.innerWidth < 1024) {
      gsap.set(deviceEl, { clearProps: 'all' });
      gsap.to(deviceEl, {
        scale: 1.06,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current!,
          scrub: true,
          start: 'top bottom',
          end: 'bottom top',
        },
      });
      return;
    }

    // ── Desktop dive scene ────────────────────────────────────────────────
    // geo is mutated by measure() and read by function-based tween values so
    // invalidateOnRefresh can recompute it on resize without rebuilding the timeline.
    let geo: Geometry = { scale: 1, originX: 0, originY: 0, tx: 0, ty: 0 };

    function measure() {
      // Reset to identity before measuring — 3D transforms skew getBoundingClientRect.
      gsap.set(deviceEl, { rotateX: 0, rotateY: 0, x: 0, y: 0, scale: 1 });

      // Measure relative to the stage box, not raw viewport coordinates.
      // ScrollTrigger.refresh() briefly un-pins everything to remeasure natural
      // document flow — if that happens while the page is scrolled deep into the
      // pin, getBoundingClientRect() against the viewport would pick up a huge,
      // scroll-position-dependent offset. The stage always matches the viewport
      // 1:1 while pinned (100vw × 100vh), so diffing against its own rect keeps
      // tx/ty scroll-invariant regardless of when refresh happens to fire.
      const stageRect  = stageRef.current!.getBoundingClientRect();
      const deviceRect = deviceEl.getBoundingClientRect();
      const screenRect = screenEl.getBoundingClientRect();

      const vw = stageRect.width;
      const vh = stageRect.height;

      // Cover formula for an off-center anchor: scaling around a point that sits
      // at fraction `f` from an edge, the tighter margin is whichever side of the
      // anchor is closer to that edge — min(f, 1-f) of the scaled size must
      // reach half the viewport on that axis.
      const coverScale = (viewportSize: number, screenSize: number, focalFraction: number) =>
        viewportSize / (2 * Math.min(focalFraction, 1 - focalFraction) * screenSize);

      const scale = Math.max(
        coverScale(vw, screenRect.width, 0.5),
        coverScale(vh, screenRect.height, FOCAL_Y_FRACTION),
      ) * 1.02;

      // Zoom toward the hero moment of the screenshot, not its geometric middle —
      // the focal point sits ~22% down the screen crop (nav + hero headline),
      // horizontally centered.
      const focalX = screenRect.width * 0.5;
      const focalY = screenRect.height * FOCAL_Y_FRACTION;

      const originX = screenRect.left - deviceRect.left + focalX;
      const originY = screenRect.top - deviceRect.top + focalY;
      const focalLocalX = screenRect.left - stageRect.left + focalX;
      const focalLocalY = screenRect.top - stageRect.top + focalY;
      const tx = vw / 2 - focalLocalX;
      const ty = vh / 2 - focalLocalY;

      geo = { scale, originX, originY, tx, ty };

      gsap.set(deviceEl, {
        transformPerspective: 1400,
        transformOrigin: `${originX}px ${originY}px`,
        rotateY: -8,
        rotateX: 4,
      });

      layoutStreaks(vw, vh);
    }

    // Streaks radiate from the SAME point the zoom converges on. Act 1's
    // translate finishes at progress 0.18 (well before the streak window
    // starts at 0.38), and tx/ty are solved so that point lands exactly at
    // viewport center — so for the entire streak window the focal point IS
    // the viewport center. Base geometry (full-length line at each streak's
    // randomized max) is set once here; per-tick updates only touch
    // transform/opacity so the streaks stay GPU-composited.
    function layoutStreaks(vw: number, vh: number) {
      const cx = vw / 2;
      const cy = vh / 2;
      const vmin = Math.min(vw, vh) / 100;
      STREAKS.forEach((s, i) => {
        const el = streakRefs.current[i];
        if (!el) return;
        const lenPx = (STREAK_LENGTH_MIN_VMIN + s.lengthFraction * (STREAK_LENGTH_MAX_VMIN - STREAK_LENGTH_MIN_VMIN)) * vmin;
        el.setAttribute('x1', String(cx));
        el.setAttribute('y1', String(cy));
        el.setAttribute('x2', String(cx + Math.cos(s.angle) * lenPx));
        el.setAttribute('y2', String(cy + Math.sin(s.angle) * lenPx));
        el.style.transformOrigin = `${cx}px ${cy}px`;
      });
    }

    function updateStreaks(progress: number) {
      const raw = Math.abs(progress - prevProgressRef.current);
      prevProgressRef.current = progress;
      const buf = deltaBufRef.current;
      buf[deltaIdxRef.current % 3] = raw;
      deltaIdxRef.current += 1;
      const smoothed = (buf[0] + buf[1] + buf[2]) / 3;

      const inWindow = progress >= STREAK_WINDOW_START && progress <= STREAK_WINDOW_END;
      const intensity = inWindow ? Math.min(1, smoothed * STREAK_VELOCITY_SENSITIVITY) : 0;
      const windowProgress = Math.min(1, Math.max(0,
        (progress - STREAK_WINDOW_START) / (STREAK_WINDOW_END - STREAK_WINDOW_START)
      ));

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const travelPx = STREAK_TRAVEL_VMIN * (Math.min(vw, vh) / 100);

      STREAKS.forEach((s, i) => {
        const el = streakRefs.current[i];
        if (!el) return;
        const ox = Math.cos(s.angle) * travelPx * windowProgress;
        const oy = Math.sin(s.angle) * travelPx * windowProgress;
        el.style.transform = `translate(${ox}px, ${oy}px) scale(${intensity})`;
        el.style.opacity = String((s.isAccent ? STREAK_ACCENT_OPACITY : STREAK_INK_OPACITY) * intensity);
      });

      if (vignetteRef.current) {
        vignetteRef.current.style.opacity = String(intensity * VIGNETTE_MAX_OPACITY);
      }

      // Exposed for automated verification (velocity-driven intensity checks).
      sectionRef.current!.dataset.diveStreakIntensity = intensity.toFixed(3);
    }

    measure();
    ScrollTrigger.addEventListener('refreshInit', measure);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current!,
        pin: true,
        scrub: 0.4,
        start: 'top top',
        end: () => '+=' + Math.round(window.innerHeight * PIN_DISTANCE_VH_MULTIPLIER),
        invalidateOnRefresh: true,
        onToggle: (self) => {
          deviceEl.style.willChange = self.isActive ? 'transform' : 'auto';
        },
        onUpdate: (self) => {
          // Exposed for automated verification (progress-driven geometry checks).
          sectionRef.current!.dataset.diveProgress = self.progress.toFixed(4);
        },
      },
    });

    // Act 1 (0 → 0.18) — straighten + center
    if (eyebrowEl) {
      tl.to(eyebrowEl, { autoAlpha: 0, y: -8, duration: 0.1, ease: 'none' }, 0);
    }
    tl.to(shadowEl, { opacity: 0, duration: 0.4, ease: 'none' }, 0);
    tl.to(deviceEl, {
      rotateX: 0,
      rotateY: 0,
      x: () => geo.tx,
      y: () => geo.ty,
      ease: 'power2.out',
      duration: 0.18,
    }, 0);

    // Act 2 (0.15 → 0.62) — zoom to cover viewport. Overlaps Act 1's tail by
    // 0.03 and starts with 'power1.out' (fast start, no ease-in ramp) rather
    // than 'power1.inOut' — Act 1 is already decelerating into its landing by
    // 0.15, so Act 2 needs real velocity right away or the handoff reads as a
    // dead-zone pause even though the two acts numerically overlap.
    tl.to(deviceEl, {
      scale: () => geo.scale,
      ease: 'power1.out',
      duration: 0.47,
    }, 0.15);

    // Browser chrome fades 0.3 → 0.5
    tl.to(chromeEl, { opacity: 0, duration: 0.2, ease: 'none' }, 0.3);

    // Pad timeline so authored positions (0–1) map 1:1 to ScrollTrigger progress.
    tl.set({}, {}, 1);

    // Streaks are driven off the GSAP ticker, not onUpdate — onUpdate only
    // fires while progress is actively changing, so an idle-decay ("stopped
    // = none") would otherwise freeze at whatever the last tick computed.
    // Running every frame means the velocity delta naturally settles to 0
    // (and the streaks fade out) within a few frames of the user stopping.
    const st = tl.scrollTrigger!;
    const tick = () => updateStreaks(st.progress);
    gsap.ticker.add(tick);

    return () => {
      ScrollTrigger.removeEventListener('refreshInit', measure);
      gsap.ticker.remove(tick);
    };
  }, { scope: sectionRef });

  return (
    <section
      id="dive-bridge"
      ref={sectionRef}
      className="relative"
      // Above the sticky Header/ink line (z-40) — at full zoom the screen
      // must cover the entire viewport, nav included.
      style={{ height: '100vh', zIndex: 50 }}
    >
      <div ref={stageRef} className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">

        {/* Intro label — normal flex flow so it always sits clear of the device
            regardless of device size; dissolves as the dive begins */}
        <div
          ref={eyebrowRef}
          aria-hidden
          className="flex items-center gap-3 mb-8"
        >
          <span style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            {t('eyebrow')}
          </span>
        </div>

        {/* Device */}
        <div
          ref={deviceRef}
          aria-hidden
          className="relative"
          // Sized so the whole device (chrome + 4:5 screen) fits comfortably
          // within the stage at rest, with room for the eyebrow label above.
          style={{ width: 'min(620px, 78vw, 52vh)' }}
        >
          {/* Shadow — separate layer so only its opacity fades, never the blur radius */}
          <div
            ref={shadowRef}
            className="absolute inset-0 rounded-[12px] pointer-events-none"
            style={{
              boxShadow: '0 40px 90px -24px rgba(20,22,26,0.38), 0 12px 28px -10px rgba(20,22,26,0.22)',
            }}
          />

          {/* Frame */}
          <div
            className="relative rounded-[12px] overflow-hidden"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
          >
            {/* Chrome — fades out 0.3–0.5 so only screen content remains */}
            <div ref={chromeRef} style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-line)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', padding: '8px 10px 0', gap: 4 }}>
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 7,
                    background: 'var(--color-surface)', borderRadius: '8px 8px 0 0',
                    padding: '7px 12px', maxWidth: 220,
                    border: '1px solid var(--color-line)', borderBottom: 'none',
                  }}
                >
                  <div style={{ width: 13, height: 13, borderRadius: 3, background: '#D97706', flexShrink: 0 }} />
                  <span style={{ fontSize: 11, color: 'var(--color-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    AutoPro Serwis
                  </span>
                </div>
              </div>
              <div style={{ padding: '6px 10px 7px', display: 'flex', gap: 6, alignItems: 'center' }}>
                <div
                  style={{
                    flex: 1, background: 'var(--color-surface)', borderRadius: 20,
                    border: '1px solid var(--color-line)',
                    padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 7,
                    fontSize: 11, color: 'var(--color-ink-soft)',
                  }}
                >
                  <span style={{ fontSize: 10, color: '#188038' }}>🔒</span>
                  autopro-serwis.pl
                </div>
              </div>
            </div>

            {/* Screen — the measured rect the zoom targets */}
            <div
              ref={screenRef}
              className="relative w-full"
              style={{ aspectRatio: String(SCREEN_ASPECT), overflow: 'hidden' }}
            >
              <Image
                src={DIVE_ASSET_SRC}
                alt=""
                fill
                unoptimized
                style={{ objectFit: 'cover', objectPosition: 'top' }}
              />
            </div>
          </div>
        </div>

        {/* Ink warp streaks — velocity-driven speed lines, radiating from the
            zoom's focal point (= viewport center once Act 1 settles). Hard-gated
            to progress 0.38–0.72; opacity/length track scroll velocity. */}
        <svg
          className="dive-ink-streaks hidden lg:block absolute inset-0 pointer-events-none"
          width="100%"
          height="100%"
          aria-hidden
        >
          {STREAKS.map((s, i) => (
            <line
              key={i}
              ref={(el) => { streakRefs.current[i] = el; }}
              stroke={s.isAccent ? 'var(--color-accent)' : 'var(--color-ink)'}
              strokeWidth={s.strokeWidth}
              strokeLinecap="round"
              style={{ opacity: 0 }}
            />
          ))}
        </svg>

        {/* Vignette — subtle radial darkening tied to the same intensity value */}
        <div
          ref={vignetteRef}
          aria-hidden
          className="dive-ink-streaks hidden lg:block absolute inset-0 pointer-events-none"
          style={{
            opacity: 0,
            background: 'radial-gradient(ellipse at center, transparent 55%, var(--color-ink) 100%)',
          }}
        />

      </div>
    </section>
  );
}
