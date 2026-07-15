import { useTranslations } from 'next-intl';
import { InkLineSegment } from '@/components/ui/ink-line-segment';

export default function ComparisonTable() {
  const t = useTranslations('home.comparison');

  const rows = [
    { concern: t('rows.budget.concern'),      freelancer: t('rows.budget.freelancer'),      nexova: t('rows.budget.nexova'),      agency: t('rows.budget.agency') },
    { concern: t('rows.timeline.concern'),    freelancer: t('rows.timeline.freelancer'),    nexova: t('rows.timeline.nexova'),    agency: t('rows.timeline.agency') },
    { concern: t('rows.ghosting.concern'),    freelancer: t('rows.ghosting.freelancer'),    nexova: t('rows.ghosting.nexova'),    agency: t('rows.ghosting.agency') },
    { concern: t('rows.contact.concern'),     freelancer: t('rows.contact.freelancer'),     nexova: t('rows.contact.nexova'),     agency: t('rows.contact.agency') },
    { concern: t('rows.bugs.concern'),        freelancer: t('rows.bugs.freelancer'),        nexova: t('rows.bugs.nexova'),        agency: t('rows.bugs.agency') },
    { concern: t('rows.understanding.concern'), freelancer: t('rows.understanding.freelancer'), nexova: t('rows.understanding.nexova'), agency: t('rows.understanding.agency') },
  ];

  return (
    <section className="py-28 relative">
      <InkLineSegment />
      <div className="mx-auto max-w-6xl px-6">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span aria-hidden style={{ width: '1.5rem', height: '1px', backgroundColor: 'var(--color-accent)', display: 'inline-block' }} />
          <span className="text-label uppercase tracking-widest" style={{ color: 'var(--color-ink-soft)' }}>
            Porównanie
          </span>
        </div>

        <h2
          className="text-h2 mb-4"
          style={{ fontFamily: 'var(--font-display), Georgia, serif', color: 'var(--color-ink)' }}
        >
          {t('h2')}
        </h2>

        <p className="text-body mb-12" style={{ color: 'var(--color-ink-soft)' }}>
          {t('intro')}
        </p>

        {/* Table wrapper — horizontal scroll on mobile with sticky first column */}
        <div className="overflow-x-auto -mx-6 px-6">
          <table
            className="w-full min-w-[560px] border-collapse"
            style={{ borderTop: '1px solid var(--color-line)' }}
          >
            <thead>
              {/* Nexova badge row */}
              <tr>
                <td style={{ width: '28%', padding: '0.5rem 1rem' }} />
                <td style={{ width: '24%', padding: '0.5rem 1rem', textAlign: 'center' }} />
                <td
                  style={{
                    width: '24%',
                    padding: '0.5rem 1rem',
                    textAlign: 'center',
                    borderTop: '2px solid var(--color-accent)',
                    backgroundColor: 'var(--color-surface)',
                  }}
                >
                  <span
                    className="inline-flex items-center gap-1 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    ★ Wybór klientów
                  </span>
                </td>
                <td style={{ width: '24%', padding: '0.5rem 1rem' }} />
              </tr>

              {/* Column labels */}
              <tr style={{ borderBottom: '1px solid var(--color-line)' }}>
                <th
                  className="text-left text-label font-semibold"
                  style={{ padding: '1rem', color: 'var(--color-ink-soft)', position: 'sticky', left: 0, backgroundColor: 'var(--color-bg)', zIndex: 1 }}
                >
                  {t('col.concern')}
                </th>
                <th className="text-center text-label font-semibold" style={{ padding: '1rem', color: 'var(--color-ink-soft)' }}>
                  {t('col.freelancer')}
                </th>
                <th
                  className="text-center text-label font-bold"
                  style={{ padding: '1rem', color: 'var(--color-accent)', backgroundColor: 'var(--color-surface)' }}
                >
                  {t('col.nexova')}
                </th>
                <th className="text-center text-label font-semibold" style={{ padding: '1rem', color: 'var(--color-ink-soft)' }}>
                  {t('col.agency')}
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--color-line)' : undefined }}
                >
                  <td
                    className="text-label font-medium italic"
                    style={{ padding: '1rem', color: 'var(--color-ink)', position: 'sticky', left: 0, backgroundColor: 'var(--color-bg)', zIndex: 1 }}
                  >
                    {row.concern}
                  </td>
                  <td className="text-label text-center" style={{ padding: '1rem', color: 'var(--color-ink-soft)' }}>
                    {row.freelancer}
                  </td>
                  <td
                    className="text-label font-semibold text-center"
                    style={{ padding: '1rem', color: 'var(--color-accent)', backgroundColor: 'var(--color-surface)' }}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="2 6.5 5 9.5 10 3" />
                      </svg>
                      {row.nexova}
                    </span>
                  </td>
                  <td className="text-label text-center" style={{ padding: '1rem', color: 'var(--color-ink-soft)' }}>
                    {row.agency}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
