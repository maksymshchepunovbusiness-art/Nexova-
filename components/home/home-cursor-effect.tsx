'use client';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('@/components/ui/liquid-ether'), { ssr: false });

export default function HomeCursorEffect() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 0,
        // Light mode: multiply blend — white canvas pixels invisible, dark-blue
        // particles darken the paper background, making the trail visible.
        mixBlendMode: 'multiply',
        opacity: 0.42,
      }}
    >
      <LiquidEther
        colors={['#1E4BD1', '#2B63FA', '#4B7FFF', '#6B9BFF']}
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
