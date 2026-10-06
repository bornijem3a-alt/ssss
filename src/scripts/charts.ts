import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
  ArcElement,
  BarController,
  BarElement,
} from 'chart.js';
import { readJson } from './util';

Chart.register(
  LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Filler,
  DoughnutController, ArcElement, BarController, BarElement
);

interface Data {
  locale: string;
  labels: Record<'census' | 'estimate' | 'urban' | 'rural' | 'population', string>;
  censuses: { x: number; y: number }[];
  estimates: { x: number; y: number }[];
  urban: [number, number];
  govs: { name: string; value: number }[];
}

const INK = '#0e141c';
const BLUE = '#1b4f9c';
const TEAL = '#0d5c63';
const TERRA = '#a44b30';
const GRID = 'rgba(14,20,28,0.08)';

export function initCharts({ motion, rtl }: { motion: boolean; rtl: boolean }) {
  const d = readJson<Data>('[data-chart-data]');
  if (!d) return;
  const nf = new Intl.NumberFormat(d.locale);
  const compact = new Intl.NumberFormat(d.locale, { notation: 'compact', maximumFractionDigits: 1 });
  const ar = document.documentElement.lang === 'ar';

  Chart.defaults.font.family = ar ? 'Amiri, serif' : "'Inter Variable', Inter, system-ui, sans-serif";
  Chart.defaults.font.size = ar ? 14 : 12;
  Chart.defaults.color = '#3a3f48';
  Chart.defaults.animation = motion ? { duration: 1600, easing: 'easeOutQuart' } : false;
  Chart.defaults.plugins.legend.rtl = rtl;
  Chart.defaults.plugins.tooltip.rtl = rtl;
  Chart.defaults.plugins.tooltip.backgroundColor = INK;
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.maintainAspectRatio = false;

  const canvas = (k: string) => document.querySelector<HTMLCanvasElement>(`[data-chart="${k}"]`);

  // Charts animate in when first visible.
  const lazy = (k: string, make: (c: HTMLCanvasElement) => void) => {
    const c = canvas(k);
    if (!c) return;
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          io.disconnect();
          make(c);
        }
      },
      { threshold: 0.25 }
    );
    io.observe(c);
  };

  lazy('growth', (c) => {
    const ctx = c.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, c.height);
    grad.addColorStop(0, 'rgba(27,79,156,0.28)');
    grad.addColorStop(1, 'rgba(27,79,156,0)');
    new Chart(c, {
      type: 'line',
      data: {
        datasets: [
          {
            label: d.labels.estimate,
            data: d.estimates,
            borderColor: BLUE,
            backgroundColor: grad,
            fill: true,
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 4,
            tension: 0.25,
          },
          {
            label: d.labels.census,
            data: d.censuses,
            borderColor: TERRA,
            backgroundColor: TERRA,
            showLine: true,
            borderDash: [4, 4],
            borderWidth: 1.5,
            pointRadius: 5,
            pointHoverRadius: 7,
          },
        ],
      },
      options: {
        interaction: { mode: 'nearest', intersect: false },
        scales: {
          x: {
            type: 'linear',
            reverse: rtl,
            min: 1955,
            max: 2026,
            ticks: { stepSize: 10, callback: (v) => String(v) },
            grid: { display: false },
          },
          y: {
            position: rtl ? 'right' : 'left',
            min: 3_000_000,
            ticks: { callback: (v) => compact.format(Number(v)) },
            grid: { color: GRID },
            border: { display: false },
          },
        },
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: {
            callbacks: {
              title: (items) => String(items[0].parsed.x),
              label: (item) => `${item.dataset.label}: ${nf.format(item.parsed.y ?? 0)}`,
            },
          },
        },
      },
    });
  });

  lazy('urban', (c) =>
    new Chart(c, {
      type: 'doughnut',
      data: {
        labels: [d.labels.urban, d.labels.rural],
        datasets: [{ data: d.urban, backgroundColor: [TEAL, '#c9a876'], borderWidth: 0, hoverOffset: 6 }],
      },
      options: {
        cutout: '68%',
        plugins: {
          legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } },
          tooltip: { callbacks: { label: (i) => `${i.label}: ${i.parsed}%` } },
        },
      },
    })
  );

  lazy('gov', (c) =>
    new Chart(c, {
      type: 'bar',
      data: {
        labels: d.govs.map((g) => g.name),
        datasets: [
          {
            label: d.labels.population,
            data: d.govs.map((g) => g.value),
            backgroundColor: d.govs.map((_, i) => (i < 6 ? BLUE : i < 14 ? '#3f74b8' : '#8fb0d6')),
            borderRadius: 2,
            barPercentage: 0.8,
          },
        ],
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: {
            reverse: rtl,
            ticks: { callback: (v) => compact.format(Number(v)) },
            grid: { color: GRID },
            border: { display: false },
          },
          y: { position: rtl ? 'right' : 'left', grid: { display: false }, ticks: { autoSkip: false } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (i) => nf.format(i.parsed.x ?? 0) } },
        },
      },
    })
  );
}
