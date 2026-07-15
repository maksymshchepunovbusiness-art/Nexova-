import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const DemoFrame = dynamic(
  () => import('@/components/ui/demo-frame').then(m => m.DemoFrame),
  { ssr: false }
);

export default function PortfolioSection() {
  const t = useTranslations('home.portfolio');

  return (
    <section className="py-24" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            Realizacje
          </span>
        </div>
        <h2
          className="text-h2 mb-14"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        {/* Grid — 3 cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Slot 1 — AutoPro demo frame (hover to scroll) */}
          <DemoFrame />

          {/* Slots 2 & 3 — honest empty state */}
          {[0, 1].map((i) => (
            <div
              key={i}
              className="aspect-[4/3] rounded-[14px] flex flex-col items-center justify-center gap-3 p-6 text-center"
              style={{
                border: '1.5px dashed var(--color-line)',
                backgroundColor: 'var(--color-bg)',
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: 'var(--color-line)' }}
                aria-hidden
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              <p className="text-label" style={{ color: 'var(--color-ink-soft)' }}>
                {t('empty')}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
