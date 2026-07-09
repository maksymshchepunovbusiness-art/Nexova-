---
name: Nexova
description: Modern, trustworthy web studio brand for local small businesses — built to earn trust and convert, not just to impress.
---

# Design System: Nexova

## 1. Overview

**Creative North Star: "The maker you can trust"**

Nexova should feel like the work of a skilled professional who does agency-level websites but talks to you directly, like a person. The craft level is modern and clean (Stripe/Linear-grade polish), but the *feeling* is warm and reassuring — never cold-corporate, never techy-startup-flashy. The audience is non-technical owners of local small businesses in Poland and Czechia (restaurants, workshops, clinics, barbershops, shops). Every design choice must make that owner feel: *this person is reliable, understands my business, and won't rip me off.*

This system deliberately avoids two traps at once: the cold corporate-agency look (faceless navy-gray, stock handshakes, dense tables) **and** the generic AI-SaaS/startup look (cream backgrounds, gradient text, neon, identical icon-tile grids) — the latter reads as "for tech startups" and alienates a local pierogi maker or plumber.

**Key Characteristics:**
- One committed deep indigo carrying real weight (trust + modernity), warmed by a single terracotta accent reserved strictly for actions and highlights.
- Human warmth comes from real photography (local businesses, the actual founder), plain language, soft rounded shapes, and generous space — not from adding more brand colors.
- **Inter** as the single working typeface — chosen because it fully covers Polish, Czech, and Ukrainian glyphs, so all four languages share one consistent look.
- Accessibility as a floor: WCAG AA minimum (≥4.5:1 body), AAA where feasible; mobile-first; keyboard; reduced-motion.

## 2. Colors

Anchored on a deep indigo (trust + modern craft), warmed by a strictly-rationed terracotta accent — warmth as a human signal, not decoration.

### Primary
- **Deep Indigo** (`#4338CA`): The brand anchor — hero elements, key structure, links, primary UI. Deeper shade `#312E81`; light tint `#EEF2FF`.

### Accent
- **Warm Terracotta** (`#EA580C`): Reserved for primary calls-to-action and small highlights **only** — the human-warmth signal. Never used as a large fill. Soft amber `#F59E0B` for subtle highlights.

### Neutral
- **Ink** (`#1C1B29`): Primary text; passes AA/AAA on white.
- **Secondary text** (`#55555F`).
- **Surface** (`#FFFFFF` primary; `#F7F7FA` secondary panel — barely-neutral, never cream/sand/paper).
- **Success** (`#16A34A`): checkmarks and positive states. **Border** (`#E6E6EC`).

### Named Rules
**The Committed Color Rule.** Deep indigo is a real presence (structure, headers, key surfaces), not a lone 10% button. But because warmth comes from photography and space, indigo doesn't need to flood every screen — it works alongside white space and human imagery.

**The Sparing-Accent Rule.** Terracotta appears only on primary CTAs and tiny highlights. If it starts filling backgrounds, pull it back.

## 3. Typography

**Primary Font:** `Inter` (all weights) — every heading, body, and UI element.
**Logo Font:** `Cormorant Garamond Italic` — used **only** in the NX monogram and, very rarely, a single large editorial line. Never for body or UI.

**Character:** One geometric sans (Inter) carries the whole interface. It is chosen specifically for full Latin-Extended coverage (Polish `ł ą ę`, Czech `č ř ž`) **and** Cyrillic (Ukrainian) — so PL, CS, EN, and UA all render cleanly in one family. The serif exists only in the logo, matching the existing Nexova mark.

### Hierarchy
- **Display** (Inter, weight 700, clamp ≤3.5rem): Hero headlines only.
- **Headline** (Inter 600): Section headers.
- **Title** (Inter 600): Card / component titles.
- **Body** (Inter 400, 16–18px, line-height 1.7, max 65–75ch): Paragraph copy, AA contrast minimum.
- **Label** (Inter 500, small): UI labels, nav — used sparingly, never as an eyebrow on every section.

### Named Rules
**The One-Family Working Rule.** Every interface and content element is Inter. The serif (Cormorant) lives only in the logo — no other font families are introduced.

## 4. Elevation

Warm and soft, not hard-flat. Cards sit on white with a gentle shadow and rounded corners (12–16px cards, 8px controls). Elevation appears or deepens on hover and scroll-reveal (earned, not ambient), always with a reduced-motion fallback. Soft rounding and gentle shadow are part of the "approachable" signal that separates Nexova from cold corporate flatness.

### Named Rules
**The Earned, Soft Elevation Rule.** Lift responds to interaction or scroll; corners stay rounded; shadows stay gentle — never harsh, never purely decorative.

## 5. Components

To be captured once built. Expected set: buttons (**primary** = terracotta fill, white text; **secondary** = indigo outline), cards (white, soft shadow, rounded), pricing cards (one *featured* with a 2px indigo accent), the comparison block, FAQ accordion, Telegram-connected contact form, and a PL/CS/EN/UA language switcher. All plain-language, high-contrast, mobile-first.

## 6. Do's and Don'ts

### Do:
- **Do** lead with trust, clarity, and "I understand your business" — expressed through clean modern design and plain language, not corporate stiffness or startup flash.
- **Do** use real photography (local businesses, the actual founder) to carry human warmth.
- **Do** commit to deep indigo for structure and reserve terracotta strictly for actions and highlights.
- **Do** use one typeface (Inter) across all UI and content, in all four languages; keep the serif in the logo only.
- **Do** hold body text to ≥4.5:1 (AA), aiming ≥7:1 (AAA) where feasible; design mobile-first with large tap targets and reduced-motion fallbacks.
- **Do** use soft rounded shapes, generous spacing, and gentle motion.

### Don't:
- **Don't** go cold/corporate-agency: no faceless navy-gray, stock handshake photos, or dense tabular layouts.
- **Don't** go generic AI-SaaS/startup: no cream/sand background, gradient text, neon, identical icon-tile grids, or tiny uppercase eyebrows — it reads "for tech startups" and alienates a local owner.
- **Don't** signal cheap-freelancer: no clutter, loud discount banners, or template vibes.
- **Don't** use technical jargon anywhere in copy.
- **Don't** let terracotta become a background, introduce a third brand color, or mix in extra font families beyond Inter and the logo serif.
