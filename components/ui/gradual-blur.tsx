'use client';
import { CSSProperties } from 'react';

type Direction = 'top' | 'bottom' | 'left' | 'right';

interface GradualBlurProps {
  direction?: Direction;
  blur?: number;
  className?: string;
  style?: CSSProperties;
}

const AXIS: Record<Direction, string> = {
  bottom: 'to bottom',
  top:    'to top',
  left:   'to left',
  right:  'to right',
};

// Cubic ease-in sampled stops: content stays sharp for most of the zone,
// then blurs sharply near the edge. Single layer = zero banding.
const CUBIC_STOPS = [
  'transparent 0%',
  'rgba(0,0,0,0.004) 20%',
  'rgba(0,0,0,0.018) 32%',
  'rgba(0,0,0,0.054) 44%',
  'rgba(0,0,0,0.13)  56%',
  'rgba(0,0,0,0.28)  67%',
  'rgba(0,0,0,0.50)  77%',
  'rgba(0,0,0,0.73)  87%',
  'rgba(0,0,0,0.92)  94%',
  'black             100%',
].join(', ');

export function GradualBlur({
  direction = 'bottom',
  blur = 18,
  className = '',
  style,
}: GradualBlurProps) {
  const mask = `linear-gradient(${AXIS[direction]}, ${CUBIC_STOPS})`;

  return (
    <div
      aria-hidden
      className={className}
      style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, pointerEvents: 'none', ...style }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        }}
      />
    </div>
  );
}
