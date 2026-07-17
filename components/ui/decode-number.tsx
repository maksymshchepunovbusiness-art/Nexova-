'use client';

import { useEffect, useRef, useState } from 'react';

const DIGITS = '0123456789';

type CharState = { ch: string; isDigit: boolean; opacity: number };

function parseTarget(str: string): CharState[] {
  return [...str].map(ch => ({ ch, isDigit: /\d/.test(ch), opacity: 1 }));
}

export interface DecodeNumberProps {
  /** Final formatted string — digits scramble, non-digits crossfade if they change. */
  value: string;
  /**
   * Pass true to decode on first mount (for content that only appears after
   * a user interaction, e.g. a tab panel that's hidden by default on page load).
   */
  decodeOnMount?: boolean;
  /**
   * Increment to force a decode when `value` hasn't changed but the component
   * remounted due to a user action (tab switch with conditional render).
   */
  trigger?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function DecodeNumber({
  value,
  decodeOnMount,
  trigger,
  className,
  style,
}: DecodeNumberProps) {
  const [chars, setChars] = useState<CharState[]>(() => parseTarget(value));

  const rafRef         = useRef<number>(0);
  // watchdog: setTimeout handle — forces settle if rAF freezes (background tab, etc.)
  const watchdogRef    = useRef<number>(0);
  const spanRef        = useRef<HTMLSpanElement>(null);
  // single source of truth for the value each animation is converging toward
  const targetRef      = useRef(value);
  const hasMountedRef  = useRef(false);
  const prevValueRef   = useRef(value);
  const prevTriggerRef = useRef(trigger ?? 0);
  const reducedRef     = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const isFirstMount   = !hasMountedRef.current;
    const valueChanged   = value !== prevValueRef.current;
    const triggerNum     = trigger ?? 0;
    const triggerChanged = triggerNum !== prevTriggerRef.current;

    hasMountedRef.current  = true;
    prevValueRef.current   = value;
    prevTriggerRef.current = triggerNum;

    if (isFirstMount) {
      if (decodeOnMount || triggerNum > 0) startDecode(value);
      return;
    }
    if (valueChanged || triggerChanged) startDecode(value);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, trigger]);

  function startDecode(target: string) {
    // ── convergent by construction ──────────────────────────────────────────
    // Cancel any in-flight animation and snap it to its target FIRST.
    // This ensures the previous animation is never left mid-scramble.
    cancelAnimationFrame(rafRef.current);
    clearTimeout(watchdogRef.current);
    setChars(parseTarget(targetRef.current)); // crash-land previous animation

    targetRef.current = target;
    const node = spanRef.current;
    node?.setAttribute('data-decoding', 'true');

    if (reducedRef.current) {
      setChars(parseTarget(target));
      node?.removeAttribute('data-decoding');
      return;
    }

    // Safety watchdog: if rAF is throttled (background tab, system sleep, etc.),
    // force-settle after 900ms via setTimeout which is not paused by visibility.
    watchdogRef.current = window.setTimeout(() => {
      node?.removeAttribute('data-decoding');
      setChars(parseTarget(target));
    }, 900) as unknown as number;

    const targetChars    = parseTarget(target);
    const digitPositions = targetChars.reduce<number[]>((acc, c, i) => {
      if (c.isDigit) acc.push(i);
      return acc;
    }, []);

    // Immediately show scrambled chars at correct final width (layout never shifts).
    setChars(targetChars.map(c =>
      c.isDigit ? { ...c, ch: DIGITS[Math.floor(Math.random() * 10)], opacity: 0.55 } : c
    ));

    const start     = performance.now();
    const lockTimes = new Map(digitPositions.map((pos, i) => [pos, start + 120 + i * 60]));

    const tick = (now: number) => {
      let anyScrambling = false;
      const next = targetChars.map((c, i) => {
        if (!c.isDigit) return c;
        const lockAt = lockTimes.get(i)!;
        if (now < lockAt) {
          anyScrambling = true;
          return { ...c, ch: DIGITS[Math.floor(Math.random() * 10)], opacity: 0.55 };
        }
        return { ...c, opacity: 1 };
      });
      setChars(next);
      if (anyScrambling) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        clearTimeout(watchdogRef.current);
        setChars(parseTarget(target));
        node?.removeAttribute('data-decoding');
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  // Cleanup: capture node and target ref NOW (refs are nulled before passive cleanup runs).
  useEffect(() => {
    const node = spanRef.current;
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(watchdogRef.current);
      node?.removeAttribute('data-decoding');
      // Snap to current target — critical fix for React 18 StrictMode double-invoke:
      // the first effect run sets chars=scrambled; without this the second run (which
      // sees hasMountedRef=true and skips startDecode) would leave chars scrambled forever.
      setChars(parseTarget(targetRef.current));
    };
  }, []);

  return (
    <span
      ref={spanRef}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', display: 'inline', ...style }}
      aria-label={value}
    >
      {chars.map((c, i) => (
        <span
          key={i}
          style={{
            opacity: c.opacity,
            display: 'inline',
            transition: c.isDigit ? undefined : 'opacity 150ms',
          }}
        >
          {c.ch}
        </span>
      ))}
    </span>
  );
}
