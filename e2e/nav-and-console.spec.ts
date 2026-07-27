/**
 * Regression suite for the prod-only bug reported as "no animations, console
 * full of 404s and a THREE.Clock warning":
 *
 * 1. No uncaught page errors on load (guards against a WebGL/hydration
 *    regression like the removed LiquidEther cursor effect).
 * 2. Nav items that point at homepage sections (Usługi, Jak pracuję,
 *    Realizacje, O nas) no longer 404 — they're anchor-scrolls now, not
 *    dead routes.
 * 3. /polityka-prywatnosci is a real page (was previously a 404).
 */
import { test, expect } from '@playwright/test';

const BASE = '/pl';

test('no uncaught page errors on homepage load', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(err.message));

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  expect(pageErrors).toEqual([]);
});

test('no 404s for former dead nav routes on homepage load', async ({ page }) => {
  const failed: string[] = [];
  page.on('response', (res) => {
    if (res.status() === 404) failed.push(res.url());
  });

  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(1500);

  expect(failed).toEqual([]);
});

test('clicking a section nav item on the homepage scrolls, does not navigate', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'load' });
  await page.waitForTimeout(800);

  await page.getByRole('link', { name: 'Usługi' }).first().click();
  await page.waitForTimeout(1200);

  expect(page.url()).toBe(`${page.url().split('/pl')[0]}/pl`);
  const scrollY = await page.evaluate(() => window.scrollY);
  expect(scrollY).toBeGreaterThan(1000);
});

test('clicking a section nav item from another page lands on that section', async ({ page }) => {
  await page.goto(`${BASE}/kontakt`, { waitUntil: 'load' });
  await page.waitForTimeout(600);

  await page.getByRole('link', { name: 'Usługi' }).first().click();
  await page.waitForTimeout(1800);

  const ofertaNearTop = await page.evaluate(() => {
    const el = document.getElementById('oferta');
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < 300 && r.bottom > 0;
  });
  expect(ofertaNearTop).toBe(true);
});

test('privacy policy page loads with real content', async ({ page }) => {
  const response = await page.goto(`${BASE}/polityka-prywatnosci`, { waitUntil: 'load' });
  expect(response?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Polityka prywatności');
});
