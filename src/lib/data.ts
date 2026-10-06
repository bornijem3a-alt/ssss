import { existsSync } from 'node:fs';
import population from '../../data/population.json';
import images from '../../data/images.json';
import credits from '../../data/credits.json';
import generated from '../generated/images.json';
import type { Lang } from '../i18n/strings';

export { population, credits };

export interface Governorate {
  iso: string;
  name: string;
  nameAr: string;
  capital: string;
  capitalAr: string;
  population: number;
  year: number;
  source: string;
  status: string;
}

export const governorates = population.governorates as Governorate[];
export const govByIso = new Map(governorates.map((g) => [g.iso, g]));
export const sourceById = new Map(population.sources.map((s) => [s.id, s]));

interface Slot {
  file: string | null;
  tone: string;
  alt: Record<Lang, string>;
  category?: string;
  TODO?: string;
}
interface Generated {
  width: number;
  height: number;
  widths: number[];
  blur: string;
}

const slots = images.slots as Record<string, Slot>;
const local = generated as Record<string, Generated>;

/** Width steps that Wikimedia's thumbnailer serves from cache. */
const REMOTE_WIDTHS = [500, 960, 1280, 1920];

const commonsUrl = (file: string, width: number) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;

export interface ImageSource {
  slot: string;
  alt: string;
  tone: string;
  blur: string | null;
  avif: string | null;
  webp: string | null;
  /** srcset for the <img> fallback */
  srcset: string | null;
  src: string | null;
  width: number;
  height: number;
  pending: boolean;
}

/**
 * Resolves an image slot to responsive sources. Optimised AVIF/WebP produced by
 * `npm run images` win; otherwise the original is served from Wikimedia Commons.
 */
export function image(slot: string, lang: Lang): ImageSource {
  const s = slots[slot];
  if (!s) throw new Error(`Unknown image slot: ${slot}`);
  // Use the optimised files only if they are really on disk (public/images is not committed).
  const g = local[slot] && existsSync(`public/images/${slot}-${local[slot].widths[0]}.avif`) ? local[slot] : undefined;
  const base = { slot, alt: s.alt[lang], tone: s.tone };
  if (g) {
    const set = (ext: string) => g.widths.map((w) => `/images/${slot}-${w}.${ext} ${w}w`).join(', ');
    return {
      ...base,
      blur: g.blur,
      avif: set('avif'),
      webp: set('webp'),
      srcset: set('webp'),
      src: `/images/${slot}-${g.widths.at(-2) ?? g.widths[0]}.webp`,
      width: g.width,
      height: g.height,
      pending: false,
    };
  }
  if (s.file) {
    return {
      ...base,
      blur: null,
      avif: null,
      webp: null,
      srcset: REMOTE_WIDTHS.map((w) => `${commonsUrl(s.file!, w)} ${w}w`).join(', '),
      src: commonsUrl(s.file, 1280),
      width: 1600,
      height: 1067,
      pending: false,
    };
  }
  return { ...base, blur: null, avif: null, webp: null, srcset: null, src: null, width: 1600, height: 1067, pending: true };
}
