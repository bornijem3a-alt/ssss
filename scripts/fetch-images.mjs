#!/usr/bin/env node
/**
 * Image pipeline.
 *
 * For every slot in data/images.json:
 *   1. asks the Wikimedia Commons API for the file (or, when `file` is null and
 *      `category` is set, the first freely licensed photo in that category);
 *   2. refuses anything that is not CC0 / CC BY / CC BY-SA / public domain;
 *   3. downloads a 1920px rendition and converts it to AVIF + WebP at several
 *      widths with sharp, plus a tiny blurred WebP used as a blur-up placeholder;
 *   4. writes author + license straight from the Commons metadata into
 *      data/credits.json, so attribution is never typed by hand.
 *
 * Usage:  npm run images            (fails loudly on errors)
 *         npm run images -- --soft  (logs and continues; used by `prebuild`)
 *         npm run images -- --force (re-download everything)
 */
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SOFT = process.argv.includes('--soft');
const FORCE = process.argv.includes('--force');
const WIDTHS = [480, 960, 1440, 1920];
const OUT_DIR = path.join(ROOT, 'public/images');
const MANIFEST = path.join(ROOT, 'src/generated/images.json');
const API = 'https://commons.wikimedia.org/w/api.php';
const UA = 'TunisiaCinematicSite/1.0 (image pipeline; https://github.com/bornijem3a-alt/ssss)';
const FREE = /^(cc0|cc[ -]by(-sa)?([ -]\d(\.\d)?)?|public domain|pd\b|pd-)/i;

const readJson = async (p) => JSON.parse(await readFile(path.join(ROOT, p), 'utf8'));
const exists = (p) => access(p).then(() => true, () => false);
const stripHtml = (s = '') => s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Commons API ${res.status} for ${url}`);
  return res.json();
}

async function imageInfo(titles) {
  const data = await api({
    action: 'query',
    prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata',
    iiurlwidth: '1920',
    titles: titles.map((t) => `File:${t}`).join('|'),
  });
  return (data.query?.pages ?? []).filter((p) => p.imageinfo?.[0]);
}

function describe(page) {
  const info = page.imageinfo[0];
  const meta = info.extmetadata ?? {};
  return {
    file: page.title.replace(/^File:/, ''),
    page: info.descriptionurl,
    download: info.thumburl ?? info.url,
    width: info.width,
    height: info.height,
    mime: info.mime,
    author: stripHtml(meta.Artist?.value) || 'Unknown (see file page)',
    license: stripHtml(meta.LicenseShortName?.value),
    licenseUrl: meta.LicenseUrl?.value ?? null,
  };
}

async function resolveSlot(slot) {
  if (slot.file) {
    const [page] = await imageInfo([slot.file]);
    if (!page) throw new Error(`File not found on Commons: ${slot.file}`);
    return describe(page);
  }
  if (slot.category) {
    const list = await api({
      action: 'query',
      list: 'categorymembers',
      cmtitle: `Category:${slot.category}`,
      cmtype: 'file',
      cmlimit: '40',
    });
    const titles = (list.query?.categorymembers ?? []).map((m) => m.title.replace(/^File:/, ''));
    const pages = titles.length ? await imageInfo(titles.slice(0, 40)) : [];
    const pick = pages
      .map(describe)
      .filter((d) => d.mime === 'image/jpeg' && d.width >= 1600 && FREE.test(d.license))
      .sort((a, b) => b.width - a.width)[0];
    if (!pick) throw new Error(`No suitable free JPEG in Category:${slot.category}`);
    return pick;
  }
  return null;
}

async function processSlot(id, slot, cached) {
  const d = await resolveSlot(slot);
  if (!d) return null;
  if (!FREE.test(d.license)) throw new Error(`${id}: license "${d.license}" is not free enough — skipped`);
  const credit = { file: d.file, page: d.page, author: d.author, license: d.license, licenseUrl: d.licenseUrl };

  // Already converted on a previous run: only refresh the credit line.
  if (!FORCE && cached && (await exists(path.join(OUT_DIR, `${id}-${cached.widths[0]}.avif`)))) {
    return { entry: cached, credit };
  }

  const res = await fetch(d.download, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`${id}: download failed (${res.status})`);
  const src = Buffer.from(await res.arrayBuffer());

  const base = sharp(src).rotate();
  const { width: w0, height: h0 } = await base.metadata();
  const widths = WIDTHS.filter((w) => w <= w0);
  if (!widths.length) widths.push(w0);
  for (const w of widths) {
    const resized = base.clone().resize({ width: w, withoutEnlargement: true });
    await resized.clone().avif({ quality: 52, effort: 4 }).toFile(path.join(OUT_DIR, `${id}-${w}.avif`));
    await resized.clone().webp({ quality: 74 }).toFile(path.join(OUT_DIR, `${id}-${w}.webp`));
  }
  const blur = await base.clone().resize({ width: 24 }).blur(1.2).webp({ quality: 40 }).toBuffer();

  return {
    entry: {
      width: w0,
      height: h0,
      widths,
      blur: `data:image/webp;base64,${blur.toString('base64')}`,
    },
    credit,
  };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST), { recursive: true });
  const { slots } = await readJson('data/images.json');
  const credits = await readJson('data/credits.json');
  const manifest = (await exists(MANIFEST)) ? JSON.parse(await readFile(MANIFEST, 'utf8')) : {};
  let failures = 0;

  for (const [id, slot] of Object.entries(slots)) {
    try {
      const out = await processSlot(id, slot, manifest[id]);
      if (!out) {
        console.log(`·  ${id}: no file yet (${slot.TODO ?? 'skipped'})`);
        continue;
      }
      manifest[id] = out.entry;
      const i = credits.images.findIndex((c) => c.slot === id);
      const credit = { slot: id, ...out.credit };
      if (i >= 0) credits.images[i] = credit;
      else credits.images.push(credit);
      console.log(`✓  ${id}: ${out.credit.file} — ${out.credit.author} (${out.credit.license})`);
    } catch (err) {
      failures++;
      console.warn(`✗  ${id}: ${err.message}`);
    }
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  await writeFile(path.join(ROOT, 'data/credits.json'), JSON.stringify(credits, null, 2) + '\n');
  console.log(`\n${Object.keys(manifest).length} images ready, ${failures} failed.`);
  if (failures && !SOFT) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  if (!SOFT) process.exitCode = 1;
});
