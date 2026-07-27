// Shared smooth-scroll-to-#id helper — Lenis-aware with a native fallback.
// Used by nav components (Header, Footer, MobileMenu) and the sitewide ink
// progress line so there's a single source of truth for the scroll offset.
export function scrollToSection(id: string, offset = -80): boolean {
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = (window as unknown as {
    __lenis?: { scrollTo: (target: Element, opts?: { offset?: number; duration?: number }) => void };
  }).__lenis;

  if (lenis?.scrollTo) {
    lenis.scrollTo(el, { offset, duration: 1.2 });
  } else {
    window.scrollTo({ top: Math.max(0, el.getBoundingClientRect().top + window.scrollY + offset), behavior: 'smooth' });
  }
  return true;
}
