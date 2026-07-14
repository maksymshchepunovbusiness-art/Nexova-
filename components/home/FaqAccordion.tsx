'use client';
import { useState } from 'react';

interface FaqItem { q: string; a: string }

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      {items.map(({ q, a }, i) => (
        <div
          key={i}
          style={{ borderTop: i === 0 ? '1px solid var(--color-line)' : undefined, borderBottom: '1px solid var(--color-line)' }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex items-center justify-between w-full py-5 text-left gap-4 group cursor-pointer"
          >
            <span
              className="font-medium transition-colors duration-200"
              style={{ color: open === i ? 'var(--color-accent)' : 'var(--color-ink)' }}
            >
              {q}
            </span>
            {/* Chevron — rotates 180° when open */}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{
                flexShrink: 0,
                transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 200ms ease-out',
                color: open === i ? 'var(--color-accent)' : 'var(--color-ink-soft)',
              }}
            >
              <path d="M3 6.5l6 5 6-5" />
            </svg>
          </button>

          {/* Answer — CSS-driven height transition for reduced-motion safety */}
          <div
            style={{
              overflow: 'hidden',
              maxHeight: open === i ? '600px' : '0',
              opacity: open === i ? 1 : 0,
              transition: 'max-height 0.28s ease, opacity 0.2s ease',
            }}
          >
            <p className="pb-5 text-body leading-relaxed" style={{ color: 'var(--color-ink-soft)', fontSize: '1rem' }}>{a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
