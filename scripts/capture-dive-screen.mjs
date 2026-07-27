// Captures the high-res "device screen" asset for the S2 dive scene.
// Source: the standalone /dive-capture route (see app/dive-capture/page.tsx),
// which renders the AutoPro PageContent at a fixed 1280px width with no
// Nexova chrome around it. Crops the top 1280x1600 css px (the "hero area")
// at deviceScaleFactor 3 (~3840px wide), then encodes to WebP so the asset
// stays sharp at full zoom without shipping a multi-MB PNG.
//
// Usage: node scripts/capture-dive-screen.mjs [baseURL]
// Requires the dev server running (default http://localhost:3002).
import { chromium } from '@playwright/test';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const baseURL = process.argv[2] ?? 'http://localhost:3002';
const outDir = path.resolve('public/images/dive');
const rawPng = path.join(outDir, '_autopro-screen-raw.png');

const CSS_WIDTH = 1280;
const CSS_HEIGHT = 1600;
const SCALE = 3;
const MAX_BYTES = 600 * 1024;

async function encode() {
  // WebP q82 first; step down, then AVIF, until under budget.
  const attempts = [
    { format: 'webp', quality: 82 },
    { format: 'webp', quality: 78 },
    { format: 'avif', quality: 78 },
    { format: 'avif', quality: 65 },
  ];

  for (const { format, quality } of attempts) {
    const buf = format === 'webp'
      ? await sharp(rawPng).webp({ quality }).toBuffer()
      : await sharp(rawPng).avif({ quality }).toBuffer();
    if (buf.length <= MAX_BYTES || format === attempts[attempts.length - 1].format) {
      return { buf, format, quality };
    }
  }
  throw new Error('unreachable');
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: CSS_WIDTH, height: CSS_HEIGHT },
    deviceScaleFactor: SCALE,
  });

  await page.goto(`${baseURL}/dive-capture`, { waitUntil: 'networkidle' });

  // Hide the Next.js dev-mode route indicator badge (<nextjs-portal>) so it
  // doesn't contaminate the captured asset.
  await page.addStyleTag({ content: 'nextjs-portal { display: none !important; }' });

  await page.screenshot({
    path: rawPng,
    clip: { x: 0, y: 0, width: CSS_WIDTH, height: CSS_HEIGHT },
  });
  await browser.close();

  const { buf, format, quality } = await encode();
  const outFile = path.join(outDir, `autopro-screen.${format}`);
  await writeFile(outFile, buf);
  await unlink(rawPng);

  // Clean up a stale asset from a previous run in the other format.
  const staleExt = format === 'webp' ? 'avif' : 'webp';
  await unlink(path.join(outDir, `autopro-screen.${staleExt}`)).catch(() => {});
  await unlink(path.join(outDir, 'autopro-screen.png')).catch(() => {});

  const meta = await sharp(buf).metadata();
  console.log(
    `Saved ${outFile} — ${meta.width}x${meta.height}px, ${(buf.length / 1024).toFixed(0)}KB ` +
    `(${format} q${quality}, budget ${MAX_BYTES / 1024}KB)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
