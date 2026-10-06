import { gsap } from 'gsap';

interface Opts {
  motion: boolean;
  rtl: boolean;
}

/**
 * Desktop + motion: chapters are pinned and travel horizontally, each image
 * drifting at its own depth. Mobile or reduced motion: a vertical sequence of
 * chapters with gentle parallax (or none).
 */
export function initJourney({ motion, rtl }: Opts) {
  const section = document.querySelector<HTMLElement>('[data-journey]');
  if (!section || !motion) return;
  const viewport = section.querySelector<HTMLElement>('[data-journey-viewport]')!;
  const track = section.querySelector<HTMLElement>('[data-journey-track]')!;
  const chapters = gsap.utils.toArray<HTMLElement>('[data-chapter]', section);
  const hudIndex = section.querySelector<HTMLElement>('[data-hud-index]');
  const hudBar = section.querySelector<HTMLElement>('[data-hud-bar]');

  const mm = gsap.matchMedia();

  mm.add('(min-width: 960px)', () => {
    section.classList.add('is-horizontal');
    const distance = () => track.scrollWidth - window.innerWidth;
    const dir = rtl ? 1 : -1;

    const scroller = gsap.to(track, {
      x: () => dir * distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: viewport,
        start: 'top top',
        end: () => `+=${distance()}`,
        pin: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        snap: {
          snapTo: 1 / (chapters.length - 1),
          duration: { min: 0.3, max: 0.9 },
          delay: 0.08,
          ease: 'power2.inOut',
        },
        onUpdate: (self) => {
          const i = Math.round(self.progress * (chapters.length - 1)) + 1;
          if (hudIndex) hudIndex.textContent = String(i).padStart(2, '0');
          if (hudBar) hudBar.style.transform = `scaleX(${self.progress})`;
        },
      },
    });

    // Horizontal trigger positions, mirrored when the track travels right-to-left.
    const enter = rtl ? 'right left' : 'left right';
    const exit = rtl ? 'left right' : 'right left';
    const reveal = rtl ? 'right 30%' : 'left 70%';
    const opened = rtl ? 'right 70%' : 'left 30%';

    chapters.forEach((ch, i) => {
      const pic = ch.querySelector('.pic');
      if (pic) {
        gsap.fromTo(
          pic,
          { xPercent: -dir * 8 },
          {
            xPercent: dir * 8,
            ease: 'none',
            scrollTrigger: { trigger: ch, containerAnimation: scroller, start: enter, end: exit, scrub: true },
          }
        );
      }
      const parts = ch.querySelectorAll('[data-chapter-reveal]');
      gsap.from(parts, {
        opacity: 0,
        x: -dir * 60,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        // The first chapter is on screen before the track moves, so it reveals on the vertical approach.
        scrollTrigger:
          i === 0
            ? { trigger: viewport, start: 'top 55%', toggleActions: 'play none none reverse' }
            : { trigger: ch, containerAnimation: scroller, start: reveal, toggleActions: 'play none none reverse' },
      });
      const media = ch.querySelector('.chapter__media');
      if (media && i > 0) {
        gsap.fromTo(
          media,
          { clipPath: rtl ? 'inset(0 0 0 30%)' : 'inset(0 30% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0%)',
            ease: 'none',
            scrollTrigger: { trigger: ch, containerAnimation: scroller, start: enter, end: opened, scrub: true },
          }
        );
      }
    });

    return () => {
      section.classList.remove('is-horizontal');
      gsap.set(track, { clearProps: 'transform' });
    };
  });

  mm.add('(max-width: 959.98px)', () => {
    chapters.forEach((ch) => {
      const pic = ch.querySelector('.pic');
      if (pic) {
        gsap.fromTo(pic, { yPercent: -6 }, {
          yPercent: 6, ease: 'none',
          scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
      gsap.from(ch.querySelectorAll('[data-chapter-reveal]'), {
        opacity: 0, y: 30, duration: 1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: ch, start: 'top 75%', once: true },
      });
    });
  });
}
