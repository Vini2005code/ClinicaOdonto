"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = entry.target as HTMLElement;
        item.animate([
          { opacity: .01, transform: "translate3d(0, 12px, 0)" },
          { opacity: 1, transform: "translate3d(0, 0, 0)" },
        ], {
          duration: 380,
          easing: "cubic-bezier(.22,.75,.25,1)",
          fill: "both",
        });
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -5%", threshold: .04 });

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return null;
}
