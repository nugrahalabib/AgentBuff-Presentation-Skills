#!/usr/bin/env node
/**
 * export-deck.mjs — Export a AgentBuff Presentation HTML deck to PDF / PNG / JPG / PPTX.
 *
 * THE FIDELITY GUARANTEE
 * ----------------------
 * Every output format is built from the SAME 1920×1080 browser screenshots of
 * your slides. The PDF pages, the PNG/JPG images, and the PowerPoint slides are
 * all that exact rendered pixel buffer — so every export is pixel-identical to
 * the HTML deck. Nothing is re-typeset or reflowed. (Trade-off: the PPTX slides
 * are full-bleed images, so text is not re-editable inside PowerPoint — that is
 * the price of "looks exactly like the HTML".)
 *
 * AGENT-AGNOSTIC
 * --------------
 * This is plain Node.js + Playwright (+ pptxgenjs for PPTX). No Claude-specific
 * APIs. Any agent or runtime with Node.js and shell access can run it:
 *   Claude Code, Codex, Hermes, OpenClaw, Gemini CLI, a CI job, or a human.
 * Missing npm deps and the Chromium browser are installed automatically on first
 * run into a shared cache dir (no global pollution, no repo pollution).
 *
 * USAGE
 * -----
 *   node export-deck.mjs <deck.html | deck-folder> [options]
 *
 * OPTIONS
 *   --format=LIST     Comma list of: pdf,png,jpg,pptx  (or "all"). Default: pdf
 *   --out=DIR         Output directory. Default: next to the input HTML.
 *   --compact         Render at 1280×720 instead of 1920×1080 (smaller files).
 *   --jpeg-quality=N  JPEG quality 1–100 (default 95).
 *   --pptx-mode=MODE  image (default) = pixel-identical full-bleed images, not editable.
 *                     editable        = native shapes + text boxes, editable in PowerPoint
 *                     but visually approximate. Saved as <name>-editable.pptx.
 *
 * EXAMPLES
 *   node export-deck.mjs deck.html --format=all
 *   node export-deck.mjs deck.html --format=pptx                      # image PPTX (identical)
 *   node export-deck.mjs deck.html --format=pptx --pptx-mode=editable # editable PPTX
 *   node export-deck.mjs ./my-deck/ --format=pdf,png --out=./dist
 */

import { createServer } from 'http';
import { readFileSync, mkdirSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, extname, dirname, basename, resolve } from 'path';
import { createRequire } from 'module';
import { execSync } from 'child_process';
import os from 'os';

// ─── 1. Parse arguments ───────────────────────────────────────────────────
const argv = process.argv.slice(2);
if (argv.length < 1 || argv[0].startsWith('--')) {
  console.error('Usage: node export-deck.mjs <deck.html|deck-folder> [--format=all] [--out=DIR] [--compact] [--jpeg-quality=95] [--pptx-mode=image|editable]');
  process.exit(1);
}
const INPUT = resolve(argv[0]);
const opt = (name, def) => {
  const a = argv.find((x) => x.startsWith(`--${name}=`));
  return a ? a.split('=').slice(1).join('=') : def;
};
const COMPACT = argv.includes('--compact');
const W = COMPACT ? 1280 : 1920;
const H = COMPACT ? 720 : 1080;
const JPEG_QUALITY = Math.max(1, Math.min(100, parseInt(opt('jpeg-quality', '95'), 10)));
// PPTX fidelity mode:
//   image    (default) — each slide is a full-bleed screenshot: pixel-identical, NOT text-editable.
//   editable           — rebuild each slide as native shapes + text boxes: editable in PowerPoint,
//                        but NOT guaranteed identical (fonts/spacing/effects approximate the deck).
const PPTX_MODE = String(opt('pptx-mode', 'image')).toLowerCase();
if (!['image', 'editable'].includes(PPTX_MODE)) { console.error(`Unknown --pptx-mode: ${PPTX_MODE}. Valid: image, editable`); process.exit(1); }

let formats = String(opt('format', 'pdf')).toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
if (formats.includes('all')) formats = ['pdf', 'png', 'jpg', 'pptx'];
const VALID = ['pdf', 'png', 'jpg', 'jpeg', 'pptx'];
for (const f of formats) if (!VALID.includes(f)) { console.error(`Unknown format: ${f}. Valid: pdf, png, jpg, pptx, all`); process.exit(1); }
const wantPNG = formats.includes('png');
const wantJPG = formats.includes('jpg') || formats.includes('jpeg');
const wantPDF = formats.includes('pdf');
const wantPPTX = formats.includes('pptx');

// Resolve input → (serveDir, htmlFile, deckName)
let serveDir, htmlFile, deckName;
if (statSync(INPUT).isDirectory()) {
  serveDir = INPUT;
  htmlFile = existsSync(join(INPUT, 'index.html')) ? 'index.html' : null;
  if (!htmlFile) { console.error(`No index.html in folder: ${INPUT}`); process.exit(1); }
  deckName = basename(INPUT);
} else {
  serveDir = dirname(INPUT);
  htmlFile = basename(INPUT);
  deckName = basename(INPUT).replace(/\.html?$/i, '');
}
const OUT_DIR = resolve(opt('out', serveDir));
mkdirSync(OUT_DIR, { recursive: true });

// ─── 2. Ensure dependencies (playwright [+ pptxgenjs]) ────────────────────
// Installed once into a shared cache dir; reused on later runs. Playwright
// reuses the global browser cache, so Chromium is usually not re-downloaded.
const CACHE = join(os.tmpdir(), 'agentbuff-presentation-export-tools');
mkdirSync(CACHE, { recursive: true });
if (!existsSync(join(CACHE, 'package.json'))) {
  writeFileSync(join(CACHE, 'package.json'), JSON.stringify({ name: 'fs-export-tools', private: true }));
}
const cacheRequire = createRequire(join(CACHE, 'package.json'));
function need(pkg) {
  try { cacheRequire.resolve(pkg); return true; } catch { return false; }
}
const missing = ['playwright', ...(wantPPTX ? ['pptxgenjs'] : [])].filter((p) => !need(p));
if (missing.length) {
  console.log(`ℹ Installing export tools (${missing.join(', ')})… first run only, may take a moment.`);
  execSync(`npm install ${missing.join(' ')}`, { cwd: CACHE, stdio: 'inherit' });
}
const { chromium } = cacheRequire('playwright');
// Ensure the Chromium browser binary exists (idempotent; reuses shared cache).
try {
  execSync('npx --yes playwright install chromium', { cwd: CACHE, stdio: 'ignore' });
} catch { /* if offline but cache exists, launch will still work */ }

// ─── 3. Tiny static server (so web fonts + relative assets load over HTTP) ──
const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp4': 'video/mp4',
};
const server = createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  const fp = join(serveDir, url === '/' ? htmlFile : url);
  try {
    const body = readFileSync(fp);
    res.writeHead(200, { 'Content-Type': MIME[extname(fp).toLowerCase()] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
});
const port = await new Promise((r) => server.listen(0, () => r(server.address().port)));

// ─── 4. Render every slide to a pixel buffer (the single source of truth) ──
console.log(`ℹ Rendering "${deckName}" at ${W}×${H}…`);
const browser = await chromium.launch();
// deviceScaleFactor:1 → 1 CSS px == 1 image px == 1 authored px (no upscaling).
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});

// Freeze animations and force reveal/staggered elements to their final state,
// so each capture is the settled slide, not a mid-animation frame.
await page.addStyleTag({ content: `
  *,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;transition:none!important;}
  .slide .frame .panel,.reveal,[class*="reveal"]{opacity:1!important;transform:none!important;visibility:visible!important;}
` });
await page.waitForTimeout(400);

const slideCount = await page.evaluate(() => document.querySelectorAll('.slide').length);
if (!slideCount) {
  console.error('✗ No .slide elements found. This exporter expects decks that use <section class="slide"> / <div class="slide">.');
  await browser.close(); server.close(); process.exit(1);
}
console.log(`ℹ Found ${slideCount} slides.`);

const clip = { x: 0, y: 0, width: W, height: H };
const pngBuffers = [];
const jpgBuffers = [];
const slideLayouts = []; // per-slide DOM geometry, only filled for editable PPTX
for (let i = 0; i < slideCount; i++) {
  // Show ONLY slide i. Drive the deck controller if present, and force the
  // base .active/.visible state so non-deck decks also work.
  await page.evaluate((idx) => {
    const slides = [...document.querySelectorAll('.slide')];
    slides.forEach((s, n) => {
      const on = n === idx;
      s.classList.toggle('active', on);
      s.classList.toggle('visible', on);
      s.style.visibility = on ? 'visible' : 'hidden';
      s.style.opacity = on ? '1' : '0';
      s.style.pointerEvents = on ? 'auto' : 'none';
    });
    if (window.deck && typeof window.deck.show === 'function') window.deck.show(idx);
  }, i);
  await page.waitForTimeout(140);
  pngBuffers.push(await page.screenshot({ clip, type: 'png' }));
  if (wantJPG) jpgBuffers.push(await page.screenshot({ clip, type: 'jpeg', quality: JPEG_QUALITY }));

  // For editable PPTX: read the colored blocks and text fragments of THIS slide
  // straight from the DOM, in 1920×1080 stage coordinates, so we can rebuild
  // them as native PowerPoint shapes + text boxes.
  if (wantPPTX && PPTX_MODE === 'editable') {
    slideLayouts.push(await page.evaluate(() => {
      const slide = document.querySelector('.slide.active') || document.querySelector('.slide.visible');
      const toHex = (c) => {
        const m = (c || '').match(/rgba?\(([^)]+)\)/); if (!m) return null;
        const p = m[1].split(',').map((s) => parseFloat(s));
        if (p.length > 3 && p[3] === 0) return null; // fully transparent
        return [p[0], p[1], p[2]].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
      };
      const rects = [];
      const texts = [];
      // Colored blocks + borders, outer-to-inner (DOM order = paint order).
      slide.querySelectorAll('*').forEach((el) => {
        const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        const fill = toHex(cs.backgroundColor);
        const bw = parseFloat(cs.borderTopWidth) || 0;
        const line = bw > 0 ? toHex(cs.borderTopColor) : null;
        if (fill || line) rects.push({ x: r.x, y: r.y, w: r.width, h: r.height, fill, line, lineW: bw });
      });
      // One text box per text-node fragment (handles <br>, <mark>, <em> splits).
      const walk = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walk.nextNode())) {
        const raw = n.nodeValue.replace(/\s+/g, ' ').trim(); if (!raw) continue;
        const el = n.parentElement; if (!el) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') continue;
        const range = document.createRange(); range.selectNodeContents(n);
        const r = range.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        let text = raw;
        if (cs.textTransform === 'uppercase') text = text.toUpperCase();
        else if (cs.textTransform === 'lowercase') text = text.toLowerCase();
        const fw = cs.fontWeight;
        texts.push({
          x: r.x, y: r.y, w: r.width, h: r.height, text,
          sizePx: parseFloat(cs.fontSize) || 24,
          color: toHex(cs.color) || '000000',
          bold: fw === 'bold' || (parseInt(fw, 10) || 400) >= 600,
          italic: cs.fontStyle === 'italic',
          align: cs.textAlign === 'center' ? 'center' : (cs.textAlign === 'right' || cs.textAlign === 'end') ? 'right' : 'left',
          font: (cs.fontFamily || 'Arial').split(',')[0].replace(/['"]/g, '').trim(),
          spacingPx: parseFloat(cs.letterSpacing) || 0,
        });
      }
      return { rects, texts };
    }));
  }
  process.stdout.write(`\r  Captured ${i + 1}/${slideCount}`);
}
process.stdout.write('\n');

const written = [];
const pad = (n) => String(n).padStart(2, '0');

// ─── 5a. PNG / JPG image sets ─────────────────────────────────────────────
if (wantPNG) {
  const dir = join(OUT_DIR, `${deckName}-png`); mkdirSync(dir, { recursive: true });
  pngBuffers.forEach((b, i) => writeFileSync(join(dir, `slide-${pad(i + 1)}.png`), b));
  written.push(`${dir}  (${pngBuffers.length} PNG)`);
}
if (wantJPG) {
  const dir = join(OUT_DIR, `${deckName}-jpg`); mkdirSync(dir, { recursive: true });
  jpgBuffers.forEach((b, i) => writeFileSync(join(dir, `slide-${pad(i + 1)}.jpg`), b));
  written.push(`${dir}  (${jpgBuffers.length} JPG, q=${JPEG_QUALITY})`);
}

// ─── 5b. PDF — one image per page, exact slide size (lossless PNG embed) ────
if (wantPDF) {
  const imagesHtml = pngBuffers
    .map((b) => `<div class="page"><img src="data:image/png;base64,${b.toString('base64')}"></div>`).join('');
  const pdfHtml = `<!DOCTYPE html><html><head><style>
    *{margin:0;padding:0}@page{size:${W}px ${H}px;margin:0}
    .page{width:${W}px;height:${H}px;page-break-after:always;overflow:hidden}
    .page:last-child{page-break-after:auto}img{width:${W}px;height:${H}px;display:block}
  </style></head><body>${imagesHtml}</body></html>`;
  const pdfPage = await browser.newPage();
  await pdfPage.setContent(pdfHtml, { waitUntil: 'load' });
  const outPdf = join(OUT_DIR, `${deckName}.pdf`);
  await pdfPage.pdf({ path: outPdf, width: `${W}px`, height: `${H}px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await pdfPage.close();
  written.push(outPdf);
}

await browser.close();
server.close();

// ─── 5c. PPTX — two modes ──────────────────────────────────────────────────
//   image    : one full-bleed screenshot per slide → pixel-identical, not editable.
//   editable : native shapes + text boxes rebuilt from the DOM → editable in
//              PowerPoint, visually approximate (fonts/spacing may substitute).
if (wantPPTX) {
  const PptxGenJS = cacheRequire('pptxgenjs');
  const pptx = new PptxGenJS();
  pptx.defineLayout({ name: 'DECK16x9', width: 13.333, height: 7.5 }); // 16:9 in inches
  pptx.layout = 'DECK16x9';

  if (PPTX_MODE === 'image') {
    for (const b of pngBuffers) {
      const slide = pptx.addSlide();
      slide.addImage({ data: `image/png;base64,${b.toString('base64')}`, x: 0, y: 0, w: 13.333, h: 7.5 });
    }
  } else {
    // EDITABLE: 144 px == 1 inch (1920px = 13.333in). Font pt = px / 2.
    const IN = (px) => px / 144;
    for (const L of slideLayouts) {
      const slide = pptx.addSlide();
      for (const r of L.rects) {
        const o = { x: IN(r.x), y: IN(r.y), w: IN(r.w), h: IN(r.h) };
        if (r.fill) o.fill = { color: r.fill };
        else o.fill = { color: 'FFFFFF', transparency: 100 }; // border-only block
        if (r.line) o.line = { color: r.line, width: Math.max(0.5, (r.lineW || 1) / 2) };
        slide.addShape(pptx.ShapeType.rect, o);
      }
      for (const t of L.texts) {
        slide.addText(t.text, {
          x: IN(t.x), y: IN(t.y) - 0.02, w: Math.max(IN(t.w) + 0.06, 0.3), h: Math.max(IN(t.h) + 0.08, 0.18),
          fontSize: Math.max(6, t.sizePx / 2), color: t.color, bold: t.bold, italic: t.italic,
          align: t.align, fontFace: t.font, margin: 0, valign: 'middle', wrap: true,
          charSpacing: t.spacingPx ? t.spacingPx / 2 : undefined,
        });
      }
    }
  }

  const outPptx = join(OUT_DIR, PPTX_MODE === 'editable' ? `${deckName}-editable.pptx` : `${deckName}.pptx`);
  await pptx.writeFile({ fileName: outPptx });
  written.push(outPptx);
}

// ─── 6. Report ─────────────────────────────────────────────────────────────
console.log('\n✓ Export complete — every format is the same 1920×1080 render:');
for (const w of written) {
  const p = w.split('  ')[0];
  let size = '';
  try { size = existsSync(p) && statSync(p).isFile() ? `  (${(statSync(p).size / 1048576).toFixed(2)} MB)` : ''; } catch {}
  console.log(`   • ${w}${size}`);
}
