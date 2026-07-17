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
   * Jednorazowa cards use `trigger` instead (they're the default tab).
   */
  decodeOnMount?: boolean;
  /**
   * Increment this number to force a decode when `value` hasn't changed but
   * the component remounted due to a user action (tab switch with conditional render).
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
  const rafRef        = useRef<number>(0);
  const spanRef       = useRef<HTMLSpanElement>(null);
  const hasMountedRef = useRef(false);
  const prevValueRef  = useRef(value);
  const prevTriggerRef = useRef(trigger ?? 0);
  const reducedRef   = useRef(false);

  // Capture prefers-reduced-motion once, in the same effect-order as the main effect.
  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  useEffect(() => {
    const isFirstMount    = !hasMountedRef.current;
    const valueChanged    = value !== prevValueRef.current;
    const triggerNum      = trigger ?? 0;
    const triggerChanged  = triggerNum !== prevTriggerRef.current;

    hasMountedRef.current  = true;
    prevValueRef.current   = value;
    prevTriggerRef.current = triggerNum;

    if (isFirstMount) {
      // Only decode on mount when it's a deliberate user-triggered appearance.
      // Page-load renders (trigger=0, decodeOnMount=false) show the final value instantly.
      if (decodeOnMount || triggerNum > 0) {
        startDecode(value);
      }
      return;
    }

    if (valueChanged || triggerChanged) {
      startDecode(value);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, trigger]);

  function startDecode(target: string) {
    cancelAnimationFrame(rafRef.current);
    spanRef.current?.setAttribute('data-decoding', 'true');

    if (reducedRef.current) {
      setChars(parseTarget(target));
      spanRef.current?.removeAttribute('data-decoding');
      return;
    }

    const targetChars    = parseTarget(target);
    const digitPositions = targetChars.reduce<number[]>((acc, c, i) => {
      if (c.isDigit) acc.push(i);
      return acc;
    }, []);

    setChars(targetChars.map((c) =>
      c.isDigit
        ? { ...c, ch: DIGITS[Math.floor(Math.random() * 10)], opacity: 0.55 }
        : c
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
        setChars(parseTarget(target));
        spanRef.current?.removeAttribute('data-decoding');
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => {
    // Capture node now (refs are already null by the time cleanup runs).
    const node = spanRef.current;
    return () => {
      cancelAnimationFrame(rafRef.current);
      node?.removeAttribute('data-decoding');
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
            // Non-digits crossfade 150 ms when text changes (e.g. currency on locale switch)
            transition: c.isDigit ? undefined : 'opacity 150ms',
          }}
        >
          {c.ch}
        </span>
      ))}
    </span>
  );
}
