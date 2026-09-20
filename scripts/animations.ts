import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin safely in browser environments
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Editorial Motion Preset Configuration
 * Matches reference luxury architectural portfolio timing and curves:
 * - Precise 40px Y-axis entry translation offset
 * - Refined opacity transition from 0 to 1
 * - Elegant deceleration curve: 'power2.out' for smooth entrance transitions
 * - Refined 0.8s duration for smoother, stately element entries
 */
export const REVEAL_PRESETS = {
  timing: {
    duration: 0.8,
    stagger: 0.1,
    ease: 'power2.out',
  },
  offset: {
    y: 40,
    opacity: 0,
    scale: 0.985,
  },
  imageReveal: {
    duration: 0.8,
    y: 40,
    scale: 1.04,
    ease: 'power2.out',
  },
  viewport: {
    start: 'top 87%',
    once: true,
  },
} as const;

/**
 * Initializes and binds GSAP ScrollTrigger reveal animations across the application.
 * Returns a cleanup function to tear down triggers and matchMedia listeners.
 */
export const initGsapAnimations = (): (() => void) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return () => {};
  }

  // Clear existing ScrollTrigger instances to prevent stale trigger duplicates
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    gsap.set(
      '.gsap-card, .stat-card, .gsap-image, .gsap-fade, .stack-layer-card',
      {
        opacity: 1,
        y: 0,
        yPercent: 0,
        scale: 1,
        clearProps: 'all',
      }
    );
    return () => {};
  }

  const mm = gsap.matchMedia();

  mm.add('(min-width: 320px)', () => {
    // 1. CARDS STAGGERED ENTRANCE (.gsap-card, .stat-card, [data-gsap="card"])
    const cardSelectors = [
      '.gsap-card',
      '[data-gsap="card"]',
      '.stat-card',
      '[data-gsap="stat-card"]',
      '.property-card',
      '.editorial-card',
      '.discover-card',
    ].join(', ');

    const cardElements = gsap.utils.toArray<HTMLElement>(cardSelectors);
    if (cardElements.length > 0) {
      ScrollTrigger.batch(cardElements, {
        start: 'top 87%',
        once: true,
        batchMax: 4,
        fastScrollEnd: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              y: 40,
              scale: 0.985,
              willChange: 'transform, opacity',
              force3D: true,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              overwrite: 'auto',
            }
          );
        },
      });
    }

    // 2. IMAGE ELEMENTS SUBTLE REVEAL MOTION (.gsap-image, [data-gsap="image"], .reveal-image)
    const imageSelectors = [
      '.gsap-image',
      '[data-gsap="image"]',
      '.reveal-image',
      '.architectural-image',
    ].join(', ');

    const imageElements = gsap.utils.toArray<HTMLElement>(imageSelectors);
    if (imageElements.length > 0) {
      ScrollTrigger.batch(imageElements, {
        start: 'top 89%',
        once: true,
        batchMax: 4,
        fastScrollEnd: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              y: 40,
              scale: 1.04,
              willChange: 'transform, opacity',
              force3D: true,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              overwrite: 'auto',
            }
          );
        },
      });
    }

    // 3. EDITORIAL TEXT & SECTION HEADERS FADE REVEAL (.gsap-fade, [data-gsap="fade"])
    const fadeElements = gsap.utils.toArray<HTMLElement>('.gsap-fade, [data-gsap="fade"]');
    if (fadeElements.length > 0) {
      ScrollTrigger.batch(fadeElements, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            {
              opacity: 0,
              y: 40,
              willChange: 'transform, opacity',
              force3D: true,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              overwrite: 'auto',
            }
          );
        },
      });
    }

    // 4. 3D CARD STACK LAYER REVEAL (Section 08 - Aesthetic Room Stack)
    const stackCards = gsap.utils.toArray<HTMLElement>('.stack-layer-card');
    if (stackCards.length > 0) {
      gsap.fromTo(
        stackCards,
        {
          opacity: 0,
          y: 40,
          scale: 0.94,
          rotateZ: (index) => (index === 0 ? -3 : index === 1 ? 2 : 0),
          willChange: 'transform, opacity',
          force3D: true,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateZ: (index) => (index === 0 ? -2 : index === 1 ? 2 : 0),
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stackCards[0].parentElement || stackCards[0],
            start: 'top 85%',
            once: true,
          },
        }
      );
    }
  });

  // Ensure calculations update after fonts and network images load
  const refreshTimer = setTimeout(() => {
    ScrollTrigger.refresh();
  }, 400);

  // Return teardown function for clean React component unmounting
  return () => {
    clearTimeout(refreshTimer);
    mm.revert();
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
};

/**
 * Programmatically triggers ScrollTrigger to recalculate all DOM triggers.
 */
export const refreshGsapAnimations = (): void => {
  if (typeof window !== 'undefined' && ScrollTrigger) {
    ScrollTrigger.refresh();
  }
};
