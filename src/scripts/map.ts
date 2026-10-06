import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { readJson } from './util';

interface Gov {
  iso: string;
  name: string;
  alt: string;
  capital: string;
  population: number;
  rank: number;
  share: number;
  photo: string | null;
}

// Sequential whitewash → Sidi Bou Said blue → night blue.
const STOPS = ['#ece5d6', '#c5d3df', '#8fb0d6', '#3f74b8', '#1b4f9c', '#0b2a57'];
function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function colour(t: number) {
  const x = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.floor(x);
  const a = hex(STOPS[i]);
  const b = hex(STOPS[i + 1]);
  const f = x - i;
  return `rgb(${a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(',')})`;
}

export async function initMap() {
  const el = document.querySelector<HTMLElement>('[data-map]');
  const data = readJson<{ locale: string; govs: Gov[] }>('[data-map-data]');
  if (!el || !data) return;

  const byIso = new Map(data.govs.map((g) => [g.iso, g]));
  const nf = new Intl.NumberFormat(data.locale);
  const pf = new Intl.NumberFormat(data.locale, { style: 'percent', maximumFractionDigits: 1 });
  const logs = data.govs.map((g) => Math.log(g.population));
  const lo = Math.min(...logs);
  const hi = Math.max(...logs);
  const fill = (g: Gov) => colour((Math.log(g.population) - lo) / (hi - lo));

  const card = document.querySelector<HTMLElement>('[data-govcard]')!;
  const q = <T extends HTMLElement>(s: string) => card.querySelector<T>(s)!;
  const buttons = new Map(
    [...document.querySelectorAll<HTMLButtonElement>('[data-govlist] button')].map((b) => [b.dataset.iso!, b])
  );

  const geo = await fetch('/data/governorates.geojson').then((r) => r.json());

  const map = L.map(el, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
    dragging: false,
    touchZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomSnap: 0.1,
  });

  let locked: string | null = null;
  let current: L.Path | null = null;
  const layers = new Map<string, L.Path>();

  const show = (iso: string) => {
    const g = byIso.get(iso);
    if (!g) return;
    q('[data-gov-name]').textContent = g.name;
    q('[data-gov-alt]').textContent = g.alt;
    q('[data-gov-pop]').textContent = nf.format(g.population);
    q('[data-gov-capital]').textContent = g.capital;
    q('[data-gov-share]').textContent = pf.format(g.share);
    q('[data-gov-rank]').textContent = String(g.rank);
    card.querySelectorAll<HTMLElement>('[data-photo-for]').forEach((p) => (p.hidden = p.dataset.photoFor !== iso));
    q('[data-photo-empty]').hidden = !!g.photo;
    q('[data-photo-empty-name]').textContent = g.name;
    buttons.forEach((b, k) => b.setAttribute('aria-pressed', String(k === iso)));
    current?.getElement()?.classList.remove('is-active');
    current = layers.get(iso) ?? null;
    const node = current?.getElement();
    node?.classList.add('is-active');
    current?.bringToFront();
  };

  const layer = L.geoJSON(geo, {
    style: (f) => {
      const g = byIso.get(f?.properties.iso);
      return {
        color: '#f6f3ec',
        weight: 1.2,
        fillColor: g ? fill(g) : '#ddd',
        fillOpacity: 1,
        className: 'gov',
      };
    },
    onEachFeature: (f, lyr) => {
      const g = byIso.get(f.properties.iso);
      if (!g) return;
      const path = lyr as L.Path;
      layers.set(g.iso, path);
      path.bindTooltip(`${g.name} · ${nf.format(g.population)}`, { sticky: true, direction: 'top', offset: [0, -8] });
      path.on({
        mouseover: () => !locked && show(g.iso),
        click: () => {
          locked = locked === g.iso ? null : g.iso;
          show(g.iso);
        },
      });
    },
  }).addTo(map);

  const fit = () => map.fitBounds(layer.getBounds(), { padding: [12, 12] });
  fit();
  new ResizeObserver(() => {
    map.invalidateSize();
    fit();
  }).observe(el);

  buttons.forEach((b, iso) =>
    b.addEventListener('click', () => {
      locked = iso;
      show(iso);
    })
  );

  show(locked ?? data.govs[0].iso);
}
