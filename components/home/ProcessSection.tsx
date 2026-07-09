import { useTranslations } from 'next-intl';

export default function ProcessSection() {
  const t = useTranslations('home.process');

  const steps = [
    { n: '01', title: t('steps.1.title'), desc: t('steps.1.desc') },
    { n: '02', title: t('steps.2.title'), desc: t('steps.2.desc') },
    { n: '03', title: t('steps.3.title'), desc: t('steps.3.desc') },
    { n: '04', title: t('steps.4.title'), desc: t('steps.4.desc') },
  ];

  return (
    <section className="py-24 bg-surface dark:bg-transparent">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-muted text-center mb-4">
          Proces
        </p>
        <h2 className="text-h2 text-ink text-center mb-16">{t('h2')}</h2>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Connecting line — desktop only */}
          <div
            aria-hidden
            className="hidden lg:block absolute top-7 left-[12.5%] right-[12.5%] h-px border-t-2 border-dashed border-border z-0"
          />

          {steps.map(({ n, title, desc }) => (
            <div key={n} className="relative z-10 flex flex-col items-center text-center sm:items-start sm:text-left lg:items-center lg:text-center">
              {/* Number circle */}
              <div className="w-14 h-14 rounded-full bg-indigo-tint border-2 border-indigo flex items-center justify-center mb-5 shrink-0">
                <span className="text-indigo font-bold text-base">{n}</span>
              </div>
              <h3 className="text-h3 text-ink mb-2">{title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
