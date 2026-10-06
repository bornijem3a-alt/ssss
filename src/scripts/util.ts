/** Runs `fn` once, when the element comes within `margin` of the viewport. */
export function whenNear(selector: string, fn: () => void, margin = '400px') {
  const el = document.querySelector(selector);
  if (!el) return;
  if (!('IntersectionObserver' in window)) return fn();
  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        fn();
      }
    },
    { rootMargin: margin }
  );
  io.observe(el);
}

export function readJson<T>(selector: string): T | null {
  const el = document.querySelector(selector);
  return el?.textContent ? (JSON.parse(el.textContent) as T) : null;
}
