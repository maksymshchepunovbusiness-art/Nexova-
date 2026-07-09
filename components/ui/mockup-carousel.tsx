'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from 'next-themes';

// ── Site configs ──────────────────────────────────────────────────────────────
interface SiteConfig {
  url: string;
  tab: string;
  faviconColor: string;
  navBg: string;
  logo: string;
  links: string[];
  navCta: string;
  heroBg: string;
  tag: string;
  h1: string;
  h1accent: string;
  accentColor: string;
  textColor: string;
  sub: string;
  cta1: string;
  cta2: string;
  icon: string;
  statsBg: string;
  stats: { n: string; label: string }[];
}

const sites: SiteConfig[] = [
  {
    url: 'restauracja-mario.pl',
    tab: 'Mario Ristorante',
    faviconColor: '#EA580C',
    navBg: '#1E1B4B',
    logo: 'Mario Ristorante',
    links: ['Menu', 'O nas', 'Galeria', 'Kontakt'],
    navCta: 'Zarezerwuj stolik',
    heroBg: 'linear-gradient(135deg,#0F0B2E 0%,#312E81 100%)',
    tag: 'Restauracja · Warszawa',
    h1: 'Autentyczna',
    h1accent: 'kuchnia włoska',
    accentColor: '#EA580C',
    textColor: '#FCA5A5',
    sub: 'Tradycyjne przepisy, świeże składniki, niezapomniane chwile w sercu miasta',
    cta1: 'Zarezerwuj stolik →',
    cta2: 'Zobacz menu',
    icon: '🍝',
    statsBg: '#4338CA',
    stats: [
      { n: '12+', label: 'lat doświadczenia' },
      { n: '2 000+', label: 'zadowolonych gości' },
      { n: '98%', label: 'opinii Google' },
    ],
  },
  {
    url: 'dentcare-klinika.pl',
    tab: 'DentCare Klinika',
    faviconColor: '#0D9488',
    navBg: '#042F2E',
    logo: 'DentCare',
    links: ['Usługi', 'Cennik', 'Lekarze', 'Kontakt'],
    navCta: 'Umów wizytę',
    heroBg: 'linear-gradient(135deg,#021B1A 0%,#134E4A 100%)',
    tag: 'Klinika Stomatologiczna · Poznań',
    h1: 'Twój uśmiech,',
    h1accent: 'nasza specjalność',
    accentColor: '#0D9488',
    textColor: '#99F6E4',
    sub: 'Nowoczesna stomatologia bez bólu i stresu. Zabiegi dla całej rodziny.',
    cta1: 'Umów wizytę →',
    cta2: 'Sprawdź cennik',
    icon: '🦷',
    statsBg: '#0F766E',
    stats: [
      { n: '10+', label: 'lat doświadczenia' },
      { n: '3 000+', label: 'pacjentów' },
      { n: '4.9★', label: 'Google Reviews' },
    ],
  },
  {
    url: 'autopro-serwis.pl',
    tab: 'AutoPro Serwis',
    faviconColor: '#D97706',
    navBg: '#18130A',
    logo: 'AutoPro',
    links: ['Usługi', 'Cennik', 'Opinie', 'Kontakt'],
    navCta: 'Umów naprawę',
    heroBg: 'linear-gradient(135deg,#0D0900 0%,#292211 100%)',
    tag: 'Warsztat Samochodowy · Wrocław',
    h1: 'Profesjonalny',
    h1accent: 'serwis aut',
    accentColor: '#D97706',
    textColor: '#FDE68A',
    sub: 'Szybka diagnoza, uczciwa wycena, gwarancja na naprawy. Sprawdź nas.',
    cta1: 'Umów naprawę →',
    cta2: 'Sprawdź usługi',
    icon: '🔧',
    statsBg: '#92400E',
    stats: [
      { n: '20+', label: 'lat doświadczenia' },
      { n: '5 000+', label: 'naprawionych aut' },
      { n: '4.8★', label: 'Google Reviews' },
    ],
  },
];

// ── Browser chrome ────────────────────────────────────────────────────────────
function BrowserChrome({ site }: { site: SiteConfig }) {
  return (
    <div className="bg-[#DEE1E6] dark:bg-[#202124] select-none">
      {/* Tab strip */}
      <div className="flex items-end px-2 pt-2 gap-0.5">
        <div className="flex items-center gap-2 bg-white dark:bg-[#35363A] rounded-t-lg px-3 py-1.5 max-w-[220px] border-t border-x border-[#C0C4CC] dark:border-[#3C4043]">
          <div
            className="w-3.5 h-3.5 rounded-sm shrink-0"
            style={{ backgroundColor: site.faviconColor }}
          />
          <span className="text-[11px] text-[#202124] dark:text-[#E8EAED] truncate leading-none">
            {site.tab}
          </span>
          <span className="text-[11px] text-[#80868B] ml-auto pl-2">×</span>
        </div>
        <div className="pb-0.5 px-2 text-[12px] text-[#5F6368]">+</div>
      </div>
      {/* Address bar */}
      <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F1F3F4] dark:bg-[#292A2D] border-t border-[#C0C4CC] dark:border-[#3C4043]">
        <span className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-sm">‹</span>
        <span className="w-6 h-6 flex items-center justify-center text-[#BDC1C6] text-sm">›</span>
        <span className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-sm">↻</span>
        <div className="flex-1 bg-white dark:bg-[#35363A] rounded-full py-1.5 px-4 flex items-center gap-2">
          <span className="text-[10px] text-[#188038]">🔒</span>
          <span className="text-[11px] text-[#202124] dark:text-[#E8EAED]">{site.url}</span>
        </div>
        <span className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-lg">⋮</span>
      </div>
    </div>
  );
}

// ── Single site slide ─────────────────────────────────────────────────────────
function SiteSlide({ site, isDark }: { site: SiteConfig; isDark: boolean }) {
  return (
    <div className="bg-white">
      {/* Nav */}
      <div
        className="flex items-center justify-between px-8 py-4"
        style={{ backgroundColor: site.navBg }}
      >
        <div className="text-white font-bold text-base tracking-tight">{site.logo}</div>
        <div className="hidden sm:flex gap-6 text-xs" style={{ color: '#C7D2FE' }}>
          {site.links.map((l) => <span key={l}>{l}</span>)}
        </div>
        <div
          className="text-white text-xs px-4 py-2 rounded-lg font-medium"
          style={{ backgroundColor: site.accentColor }}
        >
          {site.navCta}
        </div>
      </div>

      {/* Hero */}
      <div
        className="relative px-8 py-12 flex items-center gap-8"
        style={{ background: site.heroBg }}
      >
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: site.accentColor }} />

        {/* Content */}
        <div className="flex-1 relative z-10 min-w-0">
          <div className="flex items-center gap-2 text-xs mb-4 uppercase tracking-widest opacity-70 text-white">
            <span className="inline-block w-5 h-px bg-white/50" />
            {site.tag}
          </div>
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            {site.h1}
            <br />
            <span style={{ color: site.textColor }}>{site.h1accent}</span>
          </h2>
          <p className="text-xs mb-6 max-w-xs leading-relaxed opacity-70 text-white">
            {site.sub}
          </p>
          <div className="flex gap-3 flex-wrap">
            <div
              className="text-white text-xs px-6 py-3 rounded-lg font-medium select-none cursor-default"
              style={{ backgroundColor: site.accentColor }}
            >
              {site.cta1}
            </div>
            <div className="border text-xs px-6 py-3 rounded-lg select-none cursor-default border-white/20 text-white/70">
              {site.cta2}
            </div>
          </div>
        </div>

        {/* Icon visual */}
        <div className="hidden md:flex items-center justify-center w-64 h-48 relative shrink-0">
          <div className="absolute inset-0 rounded-2xl opacity-10" style={{ backgroundColor: site.accentColor }} />
          <div
            className="relative w-36 h-36 rounded-full flex items-center justify-center text-5xl select-none"
            style={{
              background: `radial-gradient(circle, ${site.accentColor}44 0%, ${site.accentColor}11 100%)`,
              border: `3px solid ${site.accentColor}44`,
            }}
          >
            {site.icon}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3" style={{ backgroundColor: site.statsBg }}>
        {site.stats.map(({ n, label }, i) => (
          <div
            key={i}
            className="py-4 text-center border-r last:border-r-0 border-white/10"
          >
            <div className="text-white font-bold text-xl">{n}</div>
            <div className="text-white/70 text-xs mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Feature strip — dark mode uses the browser-chrome color so the
          card's bottom row blends with the chrome, no gray-line seam */}
      <div
        className="grid grid-cols-3 divide-x text-xs"
        style={{
          backgroundColor: isDark ? '#202124' : '#F7F7FA',
          borderColor: isDark ? '#3C4043' : '#E6E6EC',
        }}
      >
        {[
          { label: 'Bezpłatna wycena', sub: 'W 24h odpowiadamy' },
          { label: 'Stała cena', sub: 'Bez ukrytych kosztów' },
          { label: 'Gwarancja', sub: '30 dni napraw błędów' },
        ].map(({ label, sub }, i) => (
          <div
            key={i}
            className="p-4"
            style={{ borderColor: isDark ? '#3C4043' : '#E6E6EC' }}
          >
            <div
              className="w-2 h-2 rounded-full mb-2"
              style={{ backgroundColor: site.accentColor }}
            />
            <div style={{ fontWeight: 600, color: isDark ? '#E8EAED' : '#1C1B29' }}>{label}</div>
            <div style={{ marginTop: '2px', color: isDark ? '#9AA0A6' : '#55555F' }}>{sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Exported carousel ─────────────────────────────────────────────────────────
export default function MockupCarousel() {
  const [index, setIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setIndex((i) => (i + 1) % sites.length), 4000);
    return () => clearInterval(id);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const site = sites[index];

  return (
    <div className="rounded-xl overflow-hidden">
      {/* Browser chrome stays fixed */}
      <BrowserChrome site={site} />

      {/* Website content fades between sites */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <SiteSlide site={site} isDark={isDark} />
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
