import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { InkLineSegment } from '@/components/ui/ink-line-segment';

export default function AboutSection() {
  const t = useTranslations('home.about');
  const tCta = useTranslations('cta');

  return (
    <section className="py-28 relative" style={{ backgroundColor: 'var(--color-surface)' }}>
      <InkLineSegment />
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-8">
              <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
              <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
                O nas
              </span>
            </div>

            <h2
              className="text-h2 mb-6"
              style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
            >
              {t('h2')}
            </h2>
            <p className="text-body mb-8" style={{ color: 'var(--color-ink-soft)' }}>{t('body')}</p>
            <Link
              href="/kontakt"
              className="inline-flex items-center justify-center px-6 py-3 rounded-[8px] bg-accent hover:bg-accent-ink text-white font-medium active:scale-[0.97] transition-all duration-150"
            >
              {tCta('quote')}
            </Link>
          </div>

          {/* Visual — monogram card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-72 h-72">
              {/* Background decorative circles */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: 'var(--color-indigo-tint)', border: '2px solid rgba(43,99,250,0.08)' }}
              />
              <div
                aria-hidden
                className="absolute inset-6 rounded-full"
                style={{ backgroundColor: 'rgba(235,241,255,0.5)', border: '1px solid rgba(43,99,250,0.06)' }}
              />

              {/* Center monogram */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span
                  className="nx-monogram text-7xl leading-none select-none"
                  style={{ color: 'var(--color-accent)' }}
                >
                  NX
                </span>
                <span className="text-label font-semibold mt-2 tracking-wider uppercase" style={{ color: 'var(--color-ink-soft)' }}>
                  Nexova
                </span>
              </div>

              {/* Floating badge — guarantee */}
              <div
                className="absolute -bottom-4 -right-4 rounded-[10px] shadow-md px-4 py-3"
                style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--color-success)', fontSize: '1.125rem' }}>✓</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>Gwarancja</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-ink-soft)' }}>30 dni napraw błędów</p>
                  </div>
                </div>
              </div>

              {/* Floating badge — direct contact */}
              <div
                className="absolute -top-4 -left-4 rounded-[10px] shadow-md px-4 py-3"
                style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-line)' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ color: 'var(--color-accent)', fontSize: '1.125rem' }}>◎</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: 'var(--color-ink)' }}>Bezpośredni kontakt</p>
                    <p className="text-[10px]" style={{ color: 'var(--color-ink-soft)' }}>Zawsze z wykonawcą</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
