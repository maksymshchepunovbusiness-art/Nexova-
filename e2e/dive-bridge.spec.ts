/**
 * S2 dive scene — Stage 1 (straighten + computed zoom) geometry regression,
 * and Stage 1.5 (sharp asset + JIT preload + ink warp streaks) checks.
 *
 * Stage 1: verifies that at ScrollTrigger progress 0.7 (comfortably past the
 * zoom act's end at 0.62 — the tween holds its final value), the device's
 * "screen" rect fully covers the viewport on desktop widths, per DESIGN.md
 * S2 stage 1 acceptance criteria.
 *
 * Stage 1.5: verifies the served asset stays high-resolution at full zoom
 * (never a downscaled srcset variant), that it isn't fetched on initial page
 * load but is preloaded as the user approaches, and that the ink warp
 * streaks are hard-gated to their progress window.
 */
import { test, expect, type Page } from '@playwright/test';
import { PIN_DISTANCE_VH_MULTIPLIER } from '../components/home/DiveBridgeSection';

const BASE = '/pl';
const SECTION_ID = 'dive-bridge';

async function scrollToDiveProgress(page: Page, target: number): Promise<number> {
  const approxStart = await page.evaluate((id) => {
    const el = document.getElementById(id)!;
    return el.getBoundingClientRect().top + window.scrollY;
  }, SECTION_ID);
  const pinDistance = await page.evaluate(
    (m) => Math.round(window.innerHeight * m),
    PIN_DISTANCE_VH_MULTIPLIER
  );

  let y = approxStart + target * pinDistance;
  for (let i = 0; i < 8; i++) {
    await page.evaluate((yy) => {
      const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: { immediate: boolean }) => void } }).__lenis;
      if (lenis?.scrollTo) lenis.scrollTo(yy, { immediate: true });
      else window.scrollTo(0, yy);
    }, y);
    await page.waitForTimeout(400);
    const p = await page.evaluate(
      (id) => parseFloat(document.getElementById(id)?.dataset.diveProgress ?? '-1'),
      SECTION_ID
    );
    if (p < 0) { y += 500; continue; }
    const err = target - p;
    if (Math.abs(err) < 0.001) break;
    y += err * pinDistance;
  }
  await page.waitForTimeout(200);
  return page.evaluate(
    (id) => parseFloat(document.getElementById(id)?.dataset.diveProgress ?? '-1'),
    SECTION_ID
  );
}

for (const width of [1280, 1440, 1920]) {
  test(`dive screen covers the viewport at progress 0.7 — ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(BASE);

    const reached = await scrollToDiveProgress(page, 0.7);
    expect(reached).toBeCloseTo(0.7, 2);

    const rect = await page.evaluate((id) => {
      const img = document.getElementById(id)!.querySelector('img')!;
      const r = img.parentElement!.getBoundingClientRect(); // screenRef
      return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
    }, SECTION_ID);

    const vw = width;
    const vh = 900;
    const EPS = 2; // px tolerance

    expect(rect.left).toBeLessThanOrEqual(EPS);
    expect(rect.top).toBeLessThanOrEqual(EPS);
    expect(rect.right).toBeGreaterThanOrEqual(vw - EPS);
    expect(rect.bottom).toBeGreaterThanOrEqual(vh - EPS);
  });
}

// ── Fix A — sharpness: the served asset must never be a downscaled variant ──
test.describe('dive asset resolution guard (DPR2)', () => {
  test.use({ deviceScaleFactor: 2 });

  for (const width of [1280, 1440, 1920]) {
    test(`naturalWidth >= viewportWidth x 2 at progress 0.7 — ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(BASE);
      await scrollToDiveProgress(page, 0.7);

      const naturalWidth = await page.evaluate((id) => {
        const img = document.getElementById(id)!.querySelector('img') as HTMLImageElement;
        return img.naturalWidth;
      }, SECTION_ID);

      expect(naturalWidth).toBeGreaterThanOrEqual(width * 2);
    });
  }
});

// ── Fix A — network: JIT preload, not loaded on initial page ────────────────
test('dive asset is not requested on initial load, but preloads near Process', async ({ page }) => {
  await page.goto(BASE);
  await page.waitForTimeout(500);

  const requestedBeforeScroll = await page.evaluate(() =>
    performance.getEntriesByType('resource').some((r) => r.name.includes('autopro-screen'))
  );
  expect(requestedBeforeScroll).toBe(false);

  const responsePromise = page.waitForResponse((r) => r.url().includes('autopro-screen'), { timeout: 5000 });
  await page.evaluate(() => document.getElementById('proces')?.scrollIntoView({ block: 'center' }));
  const response = await responsePromise;

  expect(response.ok()).toBe(true);
  const body = await response.body();
  expect(body.byteLength).toBeLessThanOrEqual(600 * 1024);

  const preloadLinkPresent = await page.evaluate(
    () => !!document.querySelector('link[rel="preload"][as="image"]')
  );
  expect(preloadLinkPresent).toBe(true);
});

// ── Fix B — ink warp streaks: hard progress-window gate ──────────────────────
test('streak intensity stays at 0 outside the 0.38-0.72 progress window', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE);

  // Jump around rapidly well before the window opens — even with real
  // velocity, intensity must stay gated to exactly 0.
  await scrollToDiveProgress(page, 0.1);
  await scrollToDiveProgress(page, 0.3);
  await scrollToDiveProgress(page, 0.05);
  await scrollToDiveProgress(page, 0.2);

  const intensity = await page.evaluate(
    (id) => document.getElementById(id)?.dataset.diveStreakIntensity,
    SECTION_ID
  );
  expect(intensity).toBe('0.000');
});
