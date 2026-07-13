'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('@/components/ui/liquid-ether'), { ssr: false });

export default function HomeCursorEffect() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = resolvedTheme === 'dark';

  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        // Dark mode: screen blend — black canvas pixels are invisible, light
        //   particles add luminance on top of the dark background.
        // Light mode: multiply blend — white canvas pixels are invisible, dark
        //   indigo particles darken the light background, making the trail visible.
        mixBlendMode: isDark ? 'screen' : 'multiply',
        opacity: isDark ? 0.8 : 0.42,
      }}
    >
      <LiquidEther
        colors={
          isDark
            ? ['#2B63FA', '#4B7FFF', '#7AA3FF', '#A8C4FF']
            : ['#1E4BD1', '#2B63FA', '#4B7FFF', '#6B9BFF']
        }
        mouseForce={18}
        cursorSize={100}
        autoDemo={false}
        autoResumeDelay={2500}
        resolution={0.4}
        iterationsPoisson={20}
        iterationsViscous={16}
      />
    </div>
  );
}
