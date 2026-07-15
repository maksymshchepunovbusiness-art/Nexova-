'use client';

import { useRef, useEffect, useState } from 'react';

function MiniAutoProContent() {
  return (
    <div style={{ background: '#fff', fontSize: 11, lineHeight: 1.5, minHeight: 800 }}>
      {/* Nav */}
      <nav style={{ background: '#18130A', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 12, letterSpacing: '-0.02em' }}>AutoPro</span>
        <div style={{ display: 'flex', gap: 10, marginLeft: 'auto', fontSize: 8.5, color: 'rgba(253,230,138,0.5)' }}>
          <span>Usługi</span><span>Cennik</span>
        </div>
        <div style={{ background: '#D97706', color: '#fff', fontSize: 8, fontWeight: 700, padding: '4px 8px', borderRadius: 4 }}>
          Umów naprawę
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0D0900 0%,#292211 100%)', padding: '28px 16px 22px' }}>
        <div style={{ fontSize: 7.5, color: '#FDE68A', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          Warsztat Samochodowy · Wrocław
        </div>
        <div style={{ color: '#fff', fontSize: 20, fontWeight: 800, lineHeight: 1.15, marginBottom: 6, letterSpacing: '-0.02em' }}>
          Profesjonalny<br /><span style={{ color: '#FDE68A' }}>serwis aut</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8.5, margin: '0 0 14px', lineHeight: 1.65 }}>
          Szybka diagnoza, uczciwa wycena, gwarancja.
        </p>
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ background: '#D97706', color: '#fff', fontSize: 8.5, fontWeight: 700, padding: '6px 12px', borderRadius: 4 }}>Umów →</div>
          <div style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', fontSize: 8.5, padding: '6px 10px', borderRadius: 4 }}>Usługi</div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#92400E' }}>
        {[['20+', 'lat doświadczenia'], ['5 000+', 'aut'], ['4.8★', 'Google']].map(([n, l], i) => (
          <div key={i} style={{ padding: '8px 4px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 12 }}>{n}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 7, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 7, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 10 }}>Nasze usługi</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[['🔧', 'Serwis ogólny'], ['🚗', 'Diagnostyka'], ['🛞', 'Opony'], ['🎨', 'Blacharstwo']].map(([icon, title], i) => (
            <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 8 }}>
              <div style={{ fontSize: 14, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 9.5, color: '#111' }}>{title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div style={{ padding: '14px 16px', background: '#F9FAFB' }}>
        {['Gwarancja 12 miesięcy na naprawy', 'Sprzęt nowej generacji', 'Pisemne kosztorysy', 'Auto zastępcze gratis'].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: 7 }}>
            <span style={{ color: '#D97706', fontWeight: 800, flexShrink: 0 }}>✓</span>
            <span style={{ fontSize: 8.5, color: '#374151', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{ padding: '14px 16px' }}>
        {[['Marcin W.', 'Szybko i uczciwie. Polecam!'], ['Ewa K.', 'Profesjonalna obsługa.']].map(([name, text], i) => (
          <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 6, padding: 8, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 8.5, fontWeight: 700, color: '#111' }}>{name}</span>
              <span style={{ fontSize: 8.5, color: '#D97706' }}>★★★★★</span>
            </div>
            <div style={{ fontSize: 7.5, color: '#6B7280' }}>{text}</div>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '20px 16px', background: '#18130A', textAlign: 'center' }}>
        <div style={{ color: '#FDE68A', fontSize: 13, fontWeight: 800, marginBottom: 8 }}>Gotowy na naprawę?</div>
        <div style={{ background: '#D97706', color: '#fff', fontSize: 8.5, fontWeight: 700, padding: '6px 16px', borderRadius: 5, display: 'inline-block' }}>
          Umów wizytę
        </div>
      </div>
    </div>
  );
}

export function DemoFrame() {
  const ref      = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  // Lazy-render: only mount content when frame enters the viewport
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setReady(true); obs.disconnect(); } },
      { rootMargin: '200px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="demo-frame aspect-[4/3] rounded-[14px] overflow-hidden cursor-pointer group"
      style={{ border: '1px solid var(--color-line)', background: '#DEE1E6', position: 'relative' }}
      title="AutoPro Serwis — demonstracyjny projekt"
    >
      {/* Mini browser chrome */}
      <div style={{ background: '#DEE1E6', padding: '5px 8px', display: 'flex', alignItems: 'center', gap: 5, zIndex: 1, position: 'relative' }}>
        <div style={{ display: 'flex', gap: 3.5 }}>
          {['#FF5F57', '#FEBC2E', '#28C840'].map(c => (
            <div key={c} style={{ width: 6, height: 6, borderRadius: '50%', background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: '#fff', borderRadius: 8, padding: '2px 8px', fontSize: 8.5, color: '#555' }}>
          autopro-serwis.pl
        </div>
      </div>

      {/* Scrolling viewport */}
      <div style={{ height: 'calc(100% - 24px)', overflow: 'hidden' }}>
        {ready ? (
          <div className="demo-frame-content">
            <MiniAutoProContent />
            <MiniAutoProContent />
          </div>
        ) : (
          <div style={{ height: '100%', background: '#F9FAFB' }} />
        )}
      </div>

      {/* Hover label */}
      <div
        className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 60%)' }}
      >
        <span style={{ fontSize: 10, fontWeight: 600, color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '3px 10px', borderRadius: 20 }}>
          AutoPro Serwis · demo
        </span>
      </div>
    </div>
  );
}
