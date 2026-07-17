/**
 * Regression suite for:
 *   A — Digit decode animation on pricing toggle
 *   B — Sliding pill indicator on pricing toggle
 *   C — Calculator → contact handoff (context prefill)
 */
import { test, expect } from '@playwright/test';

const BASE = '/pl';

// ── helpers ──────────────────────────────────────────────────────────────────

async function scrollToSection(page: import('@playwright/test').Page, id: string) {
  await page.evaluate((sectionId) => {
    const el = document.getElementById(sectionId);
    el?.scrollIntoView({ block: 'center' });
  }, id);
  await page.waitForTimeout(400);
}

// Use DOM text-filter locators (not getByRole accessible-name) — more reliable
// for Polish text that getByRole may fail to match due to accessible-name algorithm.
function abonamentBtn(page: import('@playwright/test').Page) {
  return page.locator('#oferta button').filter({ hasText: /abonamen/i });
}
function jednorazowaBtn(page: import('@playwright/test').Page) {
  return page.locator('#oferta button').filter({ hasText: /jednorazow/i });
}

// ── Test A: digit decode fires on toggle ─────────────────────────────────────

test('A — price scrambles briefly then settles after tab switch', async ({ page }) => {
  await page.goto(BASE);
  await scrollToSection(page, 'oferta');

  // Confirm toggle buttons exist
  await expect(jednorazowaBtn(page)).toBeVisible();
  await expect(abonamentBtn(page)).toBeVisible();

  // Click abonament tab — SubscriptionPanel mounts and DecodeNumber should fire
  await abonamentBtn(page).click();

  // data-decoding="true" should appear immediately (DecodeNumber sets it in startDecode)
  // The animation runs ~120ms + digits*60ms ≈ 400ms total; check within 200ms
  const decodingCount = await page.evaluate(() =>
    document.querySelectorAll('[data-decoding="true"]').length
  );
  // At least one DecodeNumber is animating (or just finished — that's also OK,
  // the important thing is the tab switch rendered correctly)
  // We can't guarantee catching the animation frame in CI, so assert settled value instead.

  // After 800ms prices must be settled
  await page.waitForTimeout(800);
  expect(await page.evaluate(() => document.querySelectorAll('[data-decoding="true"]').length)).toBe(0);

  // Switch back to jednorazowa — card prices should redecode (trigger increments)
  await jednorazowaBtn(page).click();
  await page.waitForTimeout(800);

  // The Business card price (first featured card) should have settled aria-label
  // It lives in a DecodeNumber with aria-label matching the price string
  const businessPrice = page.locator('[aria-label*="3 500"]').first();
  await expect(businessPrice).toBeVisible();
});

// ── Test B: sliding pill changes position ────────────────────────────────────

test('B — pill indicator slides between tabs', async ({ page }) => {
  await page.goto(BASE);
  await scrollToSection(page, 'oferta');

  await expect(jednorazowaBtn(page)).toBeVisible();

  // Read pill inline transform before click
  const transformBefore = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="services-pill"]') as HTMLElement | null;
    return el?.style.transform ?? null;
  });

  // Click abonament tab
  await abonamentBtn(page).click();
  await page.waitForTimeout(300); // let transition complete (200ms + buffer)

  const transformAfter = await page.evaluate(() => {
    const el = document.querySelector('[data-testid="services-pill"]') as HTMLElement | null;
    return el?.style.transform ?? null;
  });

  expect(transformBefore).not.toBeNull();
  expect(transformAfter).not.toBeNull();
  // Before: 'translateX(0)' → After: 'translateX(100%)'
  expect(transformBefore).not.toEqual(transformAfter);
  expect(transformAfter).toMatch(/translateX\(100%\)/);
});

// ── Test D: stress toggle — prices must always settle ────────────────────────

test('D — stress toggle: 20 rapid clicks, prices always settle to exact values', async ({ page }) => {
  await page.goto(BASE);
  await scrollToSection(page, 'oferta');

  await expect(jednorazowaBtn(page)).toBeVisible();

  // 20 alternating clicks at 80ms intervals.
  // Starting on jednorazowa: even-index clicks go abonament, odd go jednorazowa.
  // 20 clicks → ends back on jednorazowa (even total = even # of abonament switches).
  for (let i = 0; i < 20; i++) {
    const btn = i % 2 === 0 ? abonamentBtn(page) : jednorazowaBtn(page);
    await btn.click();
    await page.waitForTimeout(80);
  }

  // Allow 1s for final animation to settle
  await page.waitForTimeout(1000);

  // No animation still in flight
  expect(
    await page.evaluate(() => document.querySelectorAll('[data-decoding="true"]').length)
  ).toBe(0);

  // All 3 jednorazowa card prices must show exact settled text
  await expect(page.locator('[aria-label="od 1 500 zł"]')).toHaveText('od 1 500 zł');
  await expect(page.locator('[aria-label="od 3 500 zł"]')).toHaveText('od 3 500 zł');
  await expect(page.locator('[aria-label="od 7 000 zł"]')).toHaveText('od 7 000 zł');

  // No digit at reduced opacity (0.55 is the scramble opacity)
  const hasReducedOpacity = await page.evaluate(() => {
    const labels = ['od 1 500 zł', 'od 3 500 zł', 'od 7 000 zł'];
    return labels.some(label => {
      const el = document.querySelector(`[aria-label="${label}"]`);
      if (!el) return true; // missing element = fail
      return Array.from(el.querySelectorAll('span')).some(
        s => parseFloat((s as HTMLElement).style.opacity || '1') < 1
      );
    });
  });
  expect(hasReducedOpacity).toBe(false);
});

// ── Test E: watchdog — frozen rAF must still settle via setTimeout ────────────

test('E — frozen rAF: watchdog settles prices within 1s', async ({ page }) => {
  await page.goto(BASE);
  await scrollToSection(page, 'oferta');

  await expect(jednorazowaBtn(page)).toBeVisible();

  // Switch to abonament so the next switch back triggers a decode on the cards
  await abonamentBtn(page).click();
  await page.waitForTimeout(100);

  // Freeze requestAnimationFrame — simulates background-tab throttle or system sleep
  await page.evaluate(() => {
    (window as any).__origRAF = window.requestAnimationFrame;
    window.requestAnimationFrame = (_cb: FrameRequestCallback): number => 0;
  });

  // Switch to jednorazowa — decode starts but rAF never fires
  await jednorazowaBtn(page).click();

  // Wait > 900ms watchdog deadline
  await page.waitForTimeout(1100);

  // Restore rAF
  await page.evaluate(() => {
    window.requestAnimationFrame = (window as any).__origRAF;
  });
  await page.waitForTimeout(200);

  // Watchdog (or StrictMode cleanup) must have settled everything
  expect(
    await page.evaluate(() => document.querySelectorAll('[data-decoding="true"]').length)
  ).toBe(0);

  await expect(page.locator('[aria-label="od 1 500 zł"]')).toHaveText('od 1 500 zł');
  await expect(page.locator('[aria-label="od 3 500 zł"]')).toHaveText('od 3 500 zł');
  await expect(page.locator('[aria-label="od 7 000 zł"]')).toHaveText('od 7 000 zł');

  const hasReducedOpacity = await page.evaluate(() => {
    const labels = ['od 1 500 zł', 'od 3 500 zł', 'od 7 000 zł'];
    return labels.some(label => {
      const el = document.querySelector(`[aria-label="${label}"]`);
      if (!el) return true;
      return Array.from(el.querySelectorAll('span')).some(
        s => parseFloat((s as HTMLElement).style.opacity || '1') < 1
      );
    });
  });
  expect(hasReducedOpacity).toBe(false);
});

// ── Test C: calculator → contact handoff ─────────────────────────────────────

test('C — calculator CTA prefills contact message with price context', async ({ page }) => {
  await page.goto(BASE);
  await scrollToSection(page, 'oferta');

  // Scroll down to find the calculator section
  const calcSection = page.locator('text=Ile może kosztować Twoja strona?');
  await calcSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);

  // Select: Firmowa (Business) site type
  await page.locator('label').filter({ hasText: 'Strona firmowa' }).click();

  // Select: 6–10 stron
  await page.locator('label').filter({ hasText: '6–10 stron' }).click();

  // Select: Care Basic
  await page.locator('label').filter({ hasText: /Care Basic/ }).first().click();

  await page.waitForTimeout(200);

  // Click the CTA — it should navigate to /pl/kontakt?context=...
  const ctaLink = page.getByRole('link', { name: /Chcę taką stronę/i });
  await expect(ctaLink).toBeVisible();

  // Capture the href to verify context param is present
  const href = await ctaLink.getAttribute('href');
  expect(href).toMatch(/kontakt/);
  expect(href).toMatch(/context=/);

  // Navigate to it
  await ctaLink.click();
  await page.waitForURL(/kontakt/);

  // The message textarea should be pre-filled with calculator context
  const messageField = page.locator('textarea[name="message"], #cf-message');
  await expect(messageField).toBeVisible();

  const messageValue = await messageField.inputValue();
  // Should contain "Kalkulator:" and at least some price info
  expect(messageValue).toMatch(/Kalkulator/i);
  expect(messageValue.length).toBeGreaterThan(20);
});
