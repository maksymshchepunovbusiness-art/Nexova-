'use client';

import { useEffect } from 'react';
import { scrollToSection } from '@/lib/scroll-to-section';

// Landing on the homepage with a #section hash — e.g. nav'd here from
// /kontakt via a Link to "/#oferta". Placed at the PAGE level (not in
// SmoothScrollProvider, which lives in the persistent layout and only ever
// mounts once) so this effect re-runs on every homepage landing, including
// client-side navigations from other pages where the layout never remounts.
export default function HashScrollOnMount() {
  useEffect(() => {
    const hashId = window.location.hash.slice(1);
    if (!hashId) return;
    // Give Lenis + layout (pin heights etc.) a moment to settle first.
    const t = setTimeout(() => scrollToSection(hashId), 700);
    return () => clearTimeout(t);
  }, []);

  return null;
}
