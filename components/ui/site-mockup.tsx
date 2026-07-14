export default function SiteMockup() {
  return (
    <div className="rounded-t-xl overflow-hidden shadow-2xl">
      {/* Browser chrome — Chrome/Edge on Windows style */}
      <div className="bg-[#DEE1E6] dark:bg-[#202124] select-none">
        {/* Tab strip */}
        <div className="flex items-end px-2 pt-2 gap-0.5">
          <div className="flex items-center gap-2 bg-white dark:bg-[#35363A] rounded-t-lg px-3 py-1.5 min-w-0 max-w-[220px] border-t border-x border-[#C0C4CC] dark:border-[#3C4043]">
            <div className="w-4 h-4 rounded-sm bg-[#EA580C] shrink-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white/70 rounded-[1px]" />
            </div>
            <span className="text-[11px] text-[#202124] dark:text-[#E8EAED] truncate leading-none">Mario Ristorante</span>
            <span className="text-[11px] text-[#80868B] dark:text-[#9AA0A6] ml-auto pl-2 cursor-pointer hover:text-[#202124]">×</span>
          </div>
          <div className="pb-0.5 px-2 text-[12px] text-[#5F6368] cursor-pointer">+</div>
        </div>
        {/* Address bar */}
        <div className="flex items-center gap-1.5 px-3 py-2 bg-[#F1F3F4] dark:bg-[#292A2D] border-t border-[#C0C4CC] dark:border-[#3C4043]">
          <button className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-sm rounded hover:bg-[#DADCE0] dark:hover:bg-[#3C4043]">‹</button>
          <button className="w-6 h-6 flex items-center justify-center text-[#BDC1C6] text-sm rounded">›</button>
          <button className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-sm rounded hover:bg-[#DADCE0] dark:hover:bg-[#3C4043]">↻</button>
          <div className="flex-1 bg-white dark:bg-[#35363A] rounded-full py-1.5 px-4 flex items-center gap-2 border border-transparent hover:border-[#DADCE0] dark:hover:border-[#3C4043] cursor-text">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#188038" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="#188038" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-[11px] text-[#202124] dark:text-[#E8EAED] select-all">restauracja-mario.pl</span>
          </div>
          <button className="w-6 h-6 flex items-center justify-center text-[#5F6368] dark:text-[#9AA0A6] text-lg leading-none">⋮</button>
        </div>
      </div>

      {/* Website content */}
      <div className="bg-white">
        {/* Site nav */}
        <div className="flex items-center justify-between px-8 py-4 bg-[#1E1B4B]">
          <div className="text-white font-bold text-base tracking-tight">
            Mario
            <span className="text-[#C7D2FE] font-normal text-sm ml-1.5">Ristorante</span>
          </div>
          <div className="hidden sm:flex gap-6 text-[#A5B4FC] text-xs">
            <span>Menu</span>
            <span>O nas</span>
            <span>Galeria</span>
            <span>Kontakt</span>
          </div>
          <div className="bg-[#EA580C] text-white text-xs px-4 py-2 rounded-lg font-medium select-none">
            Zarezerwuj stolik
          </div>
        </div>

        {/* Hero */}
        <div className="relative bg-gradient-to-br from-[#0F0B2E] via-[#1E1B4B] to-[#312E81] px-8 py-12 flex items-center gap-8">

          <div className="flex-1 relative z-10 min-w-0">
            <div className="flex items-center gap-2 text-[#C7D2FE] text-xs mb-4 uppercase tracking-widest">
              <span className="inline-block w-5 h-px bg-[#C7D2FE]" />
              Restauracja · Warszawa
            </div>
            <h2 className="text-white text-3xl font-bold leading-tight mb-4">
              Autentyczna
              <br />
              <span className="text-[#FCA5A5]">kuchnia włoska</span>
            </h2>
            <p className="text-[#A5B4FC] text-sm mb-6 max-w-xs leading-relaxed">
              Tradycyjne przepisy, świeże składniki,<br />niezapomniane chwile w sercu miasta
            </p>
            <div className="flex gap-3 flex-wrap">
              <div className="bg-[#EA580C] text-white text-xs px-6 py-3 rounded-lg font-medium select-none">
                Zarezerwuj stolik →
              </div>
              <div className="border border-[#4338CA] text-[#C7D2FE] text-xs px-6 py-3 rounded-lg select-none">
                Zobacz menu
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center justify-center w-72 h-52 relative shrink-0">
            <div className="absolute inset-0 rounded-2xl border border-[#4338CA]/30 bg-[#4338CA]/10" />
            <div className="relative w-40 h-40 rounded-full bg-gradient-to-br from-[#EA580C]/30 to-[#F59E0B]/20 flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#1E1B4B] to-[#312E81] border-4 border-[#EA580C]/30 flex items-center justify-center text-5xl select-none">
                🍝
              </div>
            </div>
            <div className="absolute top-3 right-3 bg-[#1E1B4B]/90 border border-[#4338CA]/30 rounded-xl px-3 py-2 text-xs text-white select-none">
              <div className="text-yellow-400 text-[11px] mb-0.5">★★★★★</div>
              <div className="text-[#A5B4FC] text-[10px]">Google 4.9/5</div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 bg-[#4338CA]">
          {[
            { n: '12+', label: 'lat doświadczenia' },
            { n: '2 000+', label: 'zadowolonych gości' },
            { n: '98%', label: 'pozytywnych opinii' },
          ].map(({ n, label }, i) => (
            <div key={i} className="py-5 text-center border-r last:border-r-0 border-[#4F46E5]">
              <div className="text-white font-bold text-2xl">{n}</div>
              <div className="text-[#C7D2FE] text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-3 divide-x divide-[#E6E6EC] bg-[#F7F7FA]">
          {[
            { icon: '🍕', title: 'Oryginalne Przepisy', desc: 'Rodzinne receptury od 1995 roku' },
            { icon: '🌿', title: 'Świeże Składniki', desc: 'Lokalni dostawcy, najwyższa jakość' },
            { icon: '🥂', title: 'Wyjątkowa Atmosfera', desc: 'Idealne na każdą okazję' },
          ].map(({ icon, title, desc }, i) => (
            <div key={i} className="p-6">
              <div className="text-2xl mb-3 select-none">{icon}</div>
              <div className="font-semibold text-[#1C1B29] text-sm mb-1">{title}</div>
              <div className="text-[#55555F] text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
