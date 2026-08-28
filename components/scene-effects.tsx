"use client";

import { useEffect, useRef } from "react";

export function SceneEffects() {
  const auraRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-motion");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    reveals.forEach((element) => observer.observe(element));

    const onPointerMove = (event: PointerEvent) => {
      if (auraRef.current) auraRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    if (!reduceMotion && hasFinePointer) window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer.disconnect();
      if (!reduceMotion && hasFinePointer) window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      root.classList.remove("has-motion");
    };
  }, []);

  return <><div className="cursor-aura" ref={auraRef} aria-hidden="true" /><div className="scroll-progress" ref={progressRef} aria-hidden="true" /><div className="film-grain" aria-hidden="true" /></>;
}
