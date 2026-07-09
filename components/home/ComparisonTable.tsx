import { useTranslations } from 'next-intl';

export default function ComparisonTable() {
  const t = useTranslations('home.comparison');

  const rows = [
    {
      concern: t('rows.budget.concern'),
      freelancer: t('rows.budget.freelancer'),
      nexova: t('rows.budget.nexova'),
      agency: t('rows.budget.agency'),
    },
    {
      concern: t('rows.timeline.concern'),
      freelancer: t('rows.timeline.freelancer'),
      nexova: t('rows.timeline.nexova'),
      agency: t('rows.timeline.agency'),
    },
    {
      concern: t('rows.ghosting.concern'),
      freelancer: t('rows.ghosting.freelancer'),
      nexova: t('rows.ghosting.nexova'),
      agency: t('rows.ghosting.agency'),
    },
    {
      concern: t('rows.contact.concern'),
      freelancer: t('rows.contact.freelancer'),
      nexova: t('rows.contact.nexova'),
      agency: t('rows.contact.agency'),
    },
    {
      concern: t('rows.bugs.concern'),
      freelancer: t('rows.bugs.freelancer'),
      nexova: t('rows.bugs.nexova'),
      agency: t('rows.bugs.agency'),
    },
    {
      concern: t('rows.understanding.concern'),
      freelancer: t('rows.understanding.freelancer'),
      nexova: t('rows.understanding.nexova'),
      agency: t('rows.understanding.agency'),
    },
  ];

  return (
    <section className="py-24 bg-surface dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted text-center mb-4">
          Porównanie
        </p>
        <h2 className="text-h2 text-ink text-center mb-12">{t('h2')}</h2>

        <div className="overflow-x-auto rounded-[14px] border border-border shadow-sm">
          <table className="w-full min-w-[620px] border-collapse">
            <thead>
              {/* Badge row — elevates the Nexova column visually */}
              <tr>
                <td className="bg-surface-2 py-2 w-[28%]" />
                <td className="bg-surface-2 py-2 w-[24%]" />
                <td
                  className="py-2 px-5 w-[24%]"
                  style={{
                    background: 'linear-gradient(180deg, #6056F2 0%, #4741CC 100%)',
                  }}
                >
                  <div className="flex justify-center">
                    <span className="inline-flex items-center gap-1 bg-terracotta text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                      ★ Wybór klientów
                    </span>
                  </div>
                </td>
                <td className="bg-surface-2 py-2 w-[24%]" />
              </tr>

              {/* Column labels */}
              <tr className="border-b border-border">
                <th className="text-left py-4 px-5 text-label font-semibold text-text-muted bg-surface-2">
                  {t('col.concern')}
                </th>
                <th className="text-center py-4 px-5 text-label font-semibold text-text-muted bg-surface-2">
                  {t('col.freelancer')}
                </th>
                <th
                  className="text-center py-4 px-5 text-label font-bold text-white"
                  style={{
                    background: 'linear-gradient(180deg, #4741CC 0%, #3D39C4 100%)',
                  }}
                >
                  {t('col.nexova')}
                </th>
                <th className="text-center py-4 px-5 text-label font-semibold text-text-muted bg-surface-2">
                  {t('col.agency')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-surface-2/60 transition-colors duration-150"
                >
                  <td className="py-4 px-5 text-sm font-medium text-ink italic">
                    {row.concern}
                  </td>
                  <td className="py-4 px-5 text-sm text-text-muted text-center">
                    {row.freelancer}
                  </td>
                  <td
                    className="py-4 px-5 text-sm font-semibold text-center border-x border-indigo/[0.15]"
                    style={{ background: 'rgba(99,102,241,0.07)' }}
                  >
                    <span className="inline-flex items-center gap-1.5 text-indigo">
                      <svg width="13" height="13" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                        <polyline points="2 6.5 5 9.5 10 3" />
                      </svg>
                      {row.nexova}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm text-text-muted text-center">
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
