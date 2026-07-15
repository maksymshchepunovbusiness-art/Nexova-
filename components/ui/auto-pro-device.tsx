'use client';

function Chrome() {
  return (
    <div style={{ background: '#DEE1E6', userSelect: 'none' }}>
      {/* Tab strip */}
      <div style={{ display: 'flex', alignItems: 'flex-end', padding: '6px 8px 0', gap: 4 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: '#fff', borderRadius: '8px 8px 0 0',
          padding: '6px 10px', maxWidth: 190,
          border: '1px solid #C0C4CC', borderBottom: 'none',
        }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: '#D97706', flexShrink: 0 }} />
          <span style={{ fontSize: 10, color: '#202124', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            AutoPro Serwis
          </span>
          <span style={{ fontSize: 9, color: '#80868B', marginLeft: 'auto', paddingLeft: 4 }}>✕</span>
        </div>
      </div>
      {/* Address bar */}
      <div style={{
        background: '#F1F3F4', borderTop: '1px solid #C0C4CC',
        padding: '5px 8px', display: 'flex', gap: 6, alignItems: 'center',
      }}>
        <div style={{
          flex: 1, background: '#fff', borderRadius: 20,
          padding: '4px 12px', display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 10, color: '#202124',
        }}>
          <span style={{ fontSize: 9, color: '#188038' }}>🔒</span>
          autopro-serwis.pl
        </div>
      </div>
    </div>
  );
}

function PageContent() {
  return (
    <div style={{ background: '#fff', fontSize: 12, lineHeight: 1.5 }}>
      {/* Nav */}
      <nav style={{
        background: '#18130A', padding: '11px 20px',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        <span style={{ color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '-0.02em' }}>AutoPro</span>
        <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', fontSize: 9.5, color: 'rgba(253,230,138,0.5)' }}>
          <span>Usługi</span><span>Cennik</span><span>Opinie</span>
        </div>
        <div style={{
          background: '#D97706', color: '#fff', fontSize: 9, fontWeight: 700,
          padding: '5px 10px', borderRadius: 5, whiteSpace: 'nowrap',
        }}>
          Umów naprawę
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#0D0900 0%,#292211 100%)', padding: '34px 20px 26px' }}>
        <div style={{ fontSize: 8.5, color: '#FDE68A', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
          Warsztat Samochodowy · Wrocław
        </div>
        <div style={{ color: '#fff', fontSize: 25, fontWeight: 800, lineHeight: 1.15, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Profesjonalny<br /><span style={{ color: '#FDE68A' }}>serwis aut</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 18px', lineHeight: 1.65 }}>
          Szybka diagnoza, uczciwa wycena,<br />gwarancja na naprawy.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ background: '#D97706', color: '#fff', fontSize: 10, fontWeight: 700, padding: '7px 14px', borderRadius: 5 }}>
            Umów naprawę →
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.55)', fontSize: 10, padding: '7px 12px', borderRadius: 5 }}>
            Sprawdź usługi
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: '#92400E' }}>
        {[['20+', 'lat doświadczenia'], ['5 000+', 'naprawionych aut'], ['4.8★', 'Google Reviews']].map(([n, l], i) => (
          <div key={i} style={{ padding: '10px 6px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
            <div style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>{n}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 8, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Services */}
      <div style={{ padding: '22px 20px' }}>
        <div style={{ fontSize: 8, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 14 }}>Nasze usługi</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['🔧', 'Serwis ogólny', 'Przeglądy, wymiana płynów'],
            ['🚗', 'Diagnostyka', 'Komputerowa diagnostyka usterek'],
            ['🛞', 'Opony i felgi', 'Wymiana i wyważanie kół'],
            ['🎨', 'Blacharstwo', 'Naprawy po kolizjach, lakier'],
          ].map(([icon, title, desc], i) => (
            <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '10px 10px 8px' }}>
              <div style={{ fontSize: 18, marginBottom: 5 }}>{icon}</div>
              <div style={{ fontWeight: 700, fontSize: 11, color: '#111', marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why us */}
      <div style={{ padding: '18px 20px', background: '#F9FAFB' }}>
        <div style={{ fontSize: 8, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12 }}>Dlaczego AutoPro?</div>
        {[
          'Gwarancja 12 miesięcy na naprawy',
          'Sprzęt diagnostyczny nowej generacji',
          'Pisemne kosztorysy przed naprawą',
          'Bezpłatny samochód zastępczy',
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 9 }}>
            <span style={{ color: '#D97706', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>✓</span>
            <span style={{ fontSize: 10, color: '#374151', lineHeight: 1.5 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Testimonials */}
      <div style={{ padding: '18px 20px' }}>
        <div style={{ fontSize: 8, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 14 }}>Opinie klientów</div>
        {[
          ['Marcin W.', 'Szybko i bez zbędnych kosztów. Wróciłem już po raz trzeci.'],
          ['Ewa K.', 'Profesjonalna obsługa, uczciwa wycena. Polecam całej rodzinie.'],
          ['Tomasz R.', 'Diagnoza tego samego dnia, naprawa nazajutrz.'],
        ].map(([name, text], i) => (
          <div key={i} style={{ border: '1px solid #E5E7EB', borderRadius: 8, padding: '9px 10px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#111' }}>{name}</span>
              <span style={{ fontSize: 10, color: '#D97706' }}>★★★★★</span>
            </div>
            <div style={{ fontSize: 9, color: '#6B7280', lineHeight: 1.5 }}>{text}</div>
          </div>
        ))}
      </div>

      {/* Pricing preview */}
      <div style={{ padding: '18px 20px', background: '#F9FAFB' }}>
        <div style={{ fontSize: 8, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, marginBottom: 12 }}>Cennik</div>
        {[
          ['Wymiana oleju + filtr', 'od 199 zł'],
          ['Diagnostyka komputerowa', 'od 99 zł'],
          ['Wymiana klocków hamulcowych', 'od 299 zł'],
          ['Geometria kół', 'od 149 zł'],
        ].map(([service, price], i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: i < 3 ? '1px solid #E5E7EB' : 'none' }}>
            <span style={{ fontSize: 10, color: '#374151' }}>{service}</span>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#D97706' }}>{price}</span>
          </div>
        ))}
      </div>

      {/* Footer CTA */}
      <div style={{ padding: '26px 20px', background: '#18130A', textAlign: 'center' }}>
        <div style={{ color: '#FDE68A', fontSize: 15, fontWeight: 800, marginBottom: 5, letterSpacing: '-0.02em' }}>
          Gotowy na naprawę?
        </div>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 9, marginBottom: 14, lineHeight: 1.7 }}>
          Umów się online lub zadzwoń:<br />+48 71 123 45 67
        </div>
        <div style={{ background: '#D97706', color: '#fff', fontSize: 10, fontWeight: 700, padding: '8px 20px', borderRadius: 6, display: 'inline-block' }}>
          Umów wizytę online
        </div>
      </div>
    </div>
  );
}

export default function AutoProDevice() {
  return (
    <div style={{ borderRadius: 12, overflow: 'hidden', background: '#DEE1E6' }}>
      <Chrome />
      <div style={{ height: 440, overflow: 'hidden', position: 'relative' }}>
        <div className="autopro-scroll">
          <PageContent />
          <PageContent />
        </div>
      </div>
    </div>
  );
}
