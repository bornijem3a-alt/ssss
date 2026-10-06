import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { initJourney } from './journey';
import { initCursor } from './cursor';
import { initSound } from './sound';
import { whenNear } from './util';

gsap.registerPlugin(ScrollTrigger);

const root = document.documentElement;
const motion = root.classList.contains('js-motion');
const rtl = root.dir === 'rtl';

/* ---------- Smooth scroll ---------- */
let lenis: Lenis | null = null;
if (motion) {
  lenis = new Lenis({ lerp: 0.085, anchors: { offset: 0 }, autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ---------- Journey first: its pin spacer shifts every trigger below it ---------- */
initJourney({ motion, rtl });

/* ---------- Nav: scrolled state, light sections, progress, scroll-spy ---------- */
const nav = document.querySelector<HTMLElement>('[data-nav]')!;
ScrollTrigger.create({
  start: 80,
  end: 'max',
  onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
});
document.querySelectorAll<HTMLElement>('.light, .people, .culture').forEach((sec) => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top top+=32',
    end: 'bottom top+=32',
    onToggle: (self) => nav.classList.toggle('is-light', self.isActive),
  });
});
gsap.to('.progress', {
  scaleX: 1,
  ease: 'none',
  scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
});
document.querySelectorAll<HTMLAnchorElement>('[data-spy]').forEach((link) => {
  const target = document.getElementById(link.dataset.spy!);
  if (!target) return;
  ScrollTrigger.create({
    trigger: target,
    start: 'top center',
    end: 'bottom center',
    onToggle: (self) => link.setAttribute('aria-current', String(self.isActive)),
  });
});

/* ---------- Hero ---------- */
if (motion) {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.15 });
  tl.from('.hero__bars span', { scaleY: 2.2, duration: 1.6, transformOrigin: (i: number) => (i ? 'bottom' : 'top') })
    .from('.hero__title .char', { yPercent: 115, duration: 1.5, stagger: 0.07 }, 0.25)
    .from('.hero__title .slash', { opacity: 0, duration: 1 }, 0.8)
    .fromTo('[data-hero-ar]', { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.8, ease: 'power3.inOut' }, 0.9)
    .from('[data-hero-fade]', { opacity: 0, y: 16, duration: 1.2, stagger: 0.12 }, 1.2)
    .from('[data-hero-door]', { opacity: 0, scale: 0.92, duration: 2 }, 1);

  // Scroll away: open the letterbox, drift the title up, deepen the vignette.
  const away = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  away
    .to('.hero__bars span', { scaleY: 0, ease: 'none' }, 0)
    .to('.hero__content', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
    .to('.hero__slides', { scale: 1.08, yPercent: 12, ease: 'none' }, 0)
    .to('[data-hero-door]', { yPercent: -60, opacity: 0, ease: 'none' }, 0);
}

/* ---------- Below the fold: wired up once the browser is idle ---------- */
function setupBelowFold() {
  // Reveals, parallax and the setting sun
  if (motion) {
    ScrollTrigger.batch('[data-reveal]:not([data-reveal="clip"])', {
      start: 'top 88%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', stagger: 0.09 }),
    });
    ScrollTrigger.batch('[data-reveal="clip"]', {
      start: 'top 92%',
      once: true,
      onEnter: (els) =>
        gsap.to(els, { clipPath: 'inset(0% 0 0 0)', duration: 1.4, ease: 'expo.inOut', stagger: 0.08 }),
    });

    // Parallax depth on culture tiles (journey handles its own).
    gsap.utils.toArray<HTMLElement>('.tile .pic').forEach((pic) => {
      gsap.fromTo(
        pic,
        { yPercent: -7 },
        { yPercent: 7, ease: 'none', scrollTrigger: { trigger: pic.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }
      );
    });

    // Closing: the sun sets as you arrive.
    gsap.fromTo('[data-sun]', { yPercent: -60, scale: 1.15 }, {
      yPercent: 30, scale: 1, ease: 'none',
      scrollTrigger: { trigger: '[data-closing]', start: 'top bottom', end: 'bottom bottom', scrub: true },
    });
    gsap.fromTo('[data-closing-bg]', { yPercent: -8 }, {
      yPercent: 8, ease: 'none',
      scrollTrigger: { trigger: '[data-closing]', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }


  // Count-ups & bars
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals ?? 0);
    const fmt = new Intl.NumberFormat(el.dataset.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    if (!motion) return; // server-rendered final value stays
    const state = { v: 0 };
    el.textContent = fmt.format(0);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(state, {
          v: target,
          duration: target > 1000 ? 2.6 : 1.8,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = fmt.format(state.v)),
        }),
    });
  });
  if (motion) {
    gsap.utils.toArray<HTMLElement>('[data-bar]').forEach((bar, i) => {
      gsap.from(bar, {
        scaleX: 0,
        duration: 1.4,
        ease: 'expo.out',
        delay: i * 0.12,
        scrollTrigger: { trigger: bar, start: 'top 90%', once: true },
      });
    });
  }
}
const idle = (fn: () => void) =>
  'requestIdleCallback' in window ? requestIdleCallback(fn, { timeout: 600 }) : setTimeout(fn, 120);
idle(setupBelowFold);

/* ---------- Sections loaded on demand ---------- */
whenNear('[data-map]', () => import('./map').then((m) => m.initMap()));
whenNear('#people', () => import('./charts').then((m) => m.initCharts({ motion, rtl })), '600px');
whenNear('[data-credits]', () => import('./credits').then((m) => m.initCredits()), '800px');

initCursor(motion);
initSound();

// Late-loading fonts shift layout: keep pin positions honest (ScrollTrigger already refreshes on load).
document.fonts?.ready.then(() => ScrollTrigger.refresh());
