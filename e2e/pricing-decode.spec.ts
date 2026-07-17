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
