'use client';
import { useEffect, useState } from 'react';

// Cubic ease-in stops: content stays clear for the first ~60%,
// then blur rises sharply near the bottom edge. Single blur layer = no banding.
const STOPS = [
  'transparent 0%',
  'rgba(0,0,0,0.004) 18%',
  'rgba(0,0,0,0.018) 30%',
  'rgba(0,0,0,0.054) 42%',
  'rgba(0,0,0,0.13)  54%',
  'rgba(0,0,0,0.28)  65%',
  'rgba(0,0,0,0.50)  75%',
  'rgba(0,0,0,0.73)  85%',
  'rgba(0,0,0,0.92)  93%',
  'black             100%',
].join(', ');

const MASK = `linear-gradient(to bottom, ${STOPS})`;

export default function PageScrollBlur() {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total    = document.documentElement.scrollHeight;
      const remaining = total - scrolled;
      setOpacity(Math.min(1, Math.max(0, (remaining - 80) / 320)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        height: '220px',
        pointerEvents: 'none',
        zIndex: 40,
        opacity,
        transition: 'opacity 0.4s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          maskImage: MASK,
          WebkitMaskImage: MASK,
        }}
      />
    </div>
  );
}
