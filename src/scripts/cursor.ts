import { gsap } from 'gsap';

/** A soft ring that trails the pointer and opens over interactive media. Fine pointers only. */
export function initCursor(motion: boolean) {
  if (!motion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const ring = document.querySelector<HTMLElement>('.cursor');
  const dot = document.querySelector<HTMLElement>('.cursor-dot');
  if (!ring || !dot) return;
  const label = ring.querySelector('span')!;

  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });

  addEventListener(
    'pointermove',
    (e) => {
      ring.classList.add('is-visible');
      dot.classList.add('is-visible');
      rx(e.clientX);
      ry(e.clientY);
      dx(e.clientX);
      dy(e.clientY);
    },
    { passive: true }
  );
  document.addEventListener('pointerleave', () => {
    ring.classList.remove('is-visible');
    dot.classList.remove('is-visible');
  });

  const hoverables = 'a, button, [data-cursor], .leaflet-interactive';
  document.addEventListener('pointerover', (e) => {
    const t = (e.target as Element).closest<HTMLElement>(hoverables);
    if (!t) return;
    const text = t.dataset.cursorLabel ?? '';
    label.textContent = text;
    ring.classList.toggle('is-hover', !!text);
    if (!text) gsap.to(ring, { scale: 1.5, duration: 0.3 });
  });
  document.addEventListener('pointerout', (e) => {
    const t = (e.target as Element).closest(hoverables);
    if (!t) return;
    ring.classList.remove('is-hover');
    gsap.to(ring, { scale: 1, duration: 0.3 });
  });
}
