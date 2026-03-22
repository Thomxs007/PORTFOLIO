import { useEffect, useRef } from 'react';

export default function useScrollReveal(deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    // Small delay to ensure DOM is fully rendered after async state updates
    const timer = setTimeout(() => {
      const container = ref.current;
      if (!container) return;

      const items = container.querySelectorAll('.animate-in');

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.05, rootMargin: '0px 0px -30px 0px' }
      );

      items.forEach((item, i) => {
        // Stagger the animation with transition-delay
        item.style.transitionDelay = `${i * 80}ms`;

        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight + 50) {
          // Element is already in view — reveal it
          setTimeout(() => item.classList.add('visible'), i * 80);
        } else {
          observer.observe(item);
        }
      });

      return () => observer.disconnect();
    }, 50);

    return () => clearTimeout(timer);
  }, deps);

  return ref;
}
