import { useTranslations } from 'next-intl';
import { InkLineSegment } from '@/components/ui/ink-line-segment';

export default function ProcessSection() {
  const t = useTranslations('home.process');

  const steps = [
    { n: '01', title: t('steps.1.title'), desc: t('steps.1.desc') },
    { n: '02', title: t('steps.2.title'), desc: t('steps.2.desc') },
    { n: '03', title: t('steps.3.title'), desc: t('steps.3.desc') },
    { n: '04', title: t('steps.4.title'), desc: t('steps.4.desc') },
  ];

  return (
    <section className="py-28 relative">
      <InkLineSegment startPct="top 80%" endPct="bottom 25%" />
      <div className="mx-auto max-w-6xl px-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            Proces
          </span>
        </div>

        <h2
          className="text-h2 mb-16"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        {/* Rail — horizontal on desktop, vertical on mobile */}
        <div className="relative">

          {/* Connecting line — desktop */}
          <div
            aria-hidden
            className="hidden lg:block absolute"
            style={{
              top: '1.25rem',
              left: 'calc(12.5% + 1.25rem)',
              right: 'calc(12.5% + 1.25rem)',
              height: '1px',
              backgroundColor: 'var(--color-line)',
            }}
          />

          {/* Connecting line — mobile (vertical) */}
          <div
            aria-hidden
            className="block lg:hidden absolute"
            style={{
              top: '2.5rem',
              bottom: '2.5rem',
              left: '1.25rem',
              width: '1px',
              backgroundColor: 'var(--color-line)',
            }}
          />

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-8">
            {steps.map(({ n, title, desc }) => (
              <div
                key={n}
                className="relative flex lg:flex-col gap-6 lg:gap-5 lg:items-center lg:text-center pl-12 lg:pl-0"
              >
                {/* Node circle */}
                <div
                  className="z-10 shrink-0 w-10 h-10 rounded-full flex items-center justify-center absolute left-0 top-0 lg:static lg:top-auto"
                  style={{
                    border: '1.5px solid var(--color-accent)',
                    backgroundColor: 'var(--color-bg)',
                  }}
                >
                  <span
                    className="text-label font-semibold"
                    style={{ color: 'var(--color-accent)', letterSpacing: '0' }}
                  >
                    {n}
                  </span>
                </div>

                <div>
                  <h3 className="text-h3 mb-2" style={{ color: 'var(--color-ink)' }}>{title}</h3>
                  <p className="text-label leading-relaxed" style={{ color: 'var(--color-ink-soft)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
