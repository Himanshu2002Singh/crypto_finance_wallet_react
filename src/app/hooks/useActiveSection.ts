import { useState, useEffect } from 'react';

const SECTION_IDS = ['home', 'why-us', 'plans', 'blogs'];
const NAVBAR_HEIGHT = 72; // px – matches the h-[72px] navbar

/**
 * Tracks which landing-page section is currently in view and returns its ID.
 * Uses IntersectionObserver with a negative top rootMargin equal to the
 * navbar height so sections aren't considered "in view" while hidden behind it.
 */
export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    // We keep a map of visibility ratios so we can pick the "most visible" section
    const visibilityMap = new Map<string, number>();

    const updateActive = () => {
      let maxRatio = 0;
      let maxId = 'home';

      visibilityMap.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxId = id;
        }
      });

      setActiveSection(maxId);
    };

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            visibilityMap.set(id, entry.intersectionRatio);
          });
          updateActive();
        },
        {
          // Shrink the top of the root by the navbar height so sections
          // hidden behind the navbar are not counted as intersecting.
          rootMargin: `-${NAVBAR_HEIGHT}px 0px 0px 0px`,
          threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  return activeSection;
}
