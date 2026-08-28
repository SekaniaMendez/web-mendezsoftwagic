"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import { TechnologyIcon } from "@/components/technology-badge";

const orbitTechnologies = [
  { name: "C++", ring: "outer", angle: 8 },
  { name: "TypeScript", ring: "outer", angle: 80 },
  { name: "Swift", ring: "outer", angle: 152 },
  { name: "Unreal Engine 5", ring: "outer", angle: 224 },
  { name: "Docker", ring: "outer", angle: 296 },
  { name: "Python", ring: "middle", angle: 42 },
  { name: "React", ring: "middle", angle: 162 },
  { name: "PostgreSQL", ring: "middle", angle: 282 },
  { name: "AI Engineering", ring: "inner", angle: 15 },
  { name: "ROS2", ring: "inner", angle: 135 },
  { name: "3D", ring: "inner", angle: 255 },
] as const;

const rings = ["outer", "middle", "inner"] as const;

export function TechnologyOrbit() {
  const orbitRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const orbit = orbitRef.current;
    if (!orbit || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let visible = true;
    let sparkleTimer = 0;
    const glowTimers = new Set<number>();
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }, { threshold: 0.08 });

    const scheduleSparkle = () => {
      sparkleTimer = window.setTimeout(() => {
        const icons = Array.from(orbit.querySelectorAll<HTMLElement>(".orbit-tech-icon"));
        if (visible && document.visibilityState === "visible" && icons.length > 0) {
          const firstIndex = Math.floor(Math.random() * icons.length);
          const selected = [icons[firstIndex]];
          if (Math.random() > 0.7) selected.push(icons[(firstIndex + 3 + Math.floor(Math.random() * 4)) % icons.length]);

          selected.forEach((icon) => {
            icon.classList.add("is-glowing");
            const timer = window.setTimeout(() => {
              icon.classList.remove("is-glowing");
              glowTimers.delete(timer);
            }, 850 + Math.random() * 550);
            glowTimers.add(timer);
          });
        }
        scheduleSparkle();
      }, 1200 + Math.random() * 2400);
    };

    observer.observe(orbit);
    scheduleSparkle();
    return () => {
      observer.disconnect();
      window.clearTimeout(sparkleTimer);
      glowTimers.forEach((timer) => window.clearTimeout(timer));
      orbit.querySelectorAll(".is-glowing").forEach((icon) => icon.classList.remove("is-glowing"));
    };
  }, []);

  return (
    <div ref={orbitRef} className="technology-orbit" aria-label="Technology logos orbiting the MendezSoftwagic core">
      <div className="core-haze" aria-hidden="true" />
      {rings.map((ring) => (
        <div className={`tech-orbit-ring tech-orbit-ring-${ring}`} aria-hidden="true" key={ring}>
          {orbitTechnologies.filter((technology) => technology.ring === ring).map((technology) => (
            <span className="orbit-tech-position" style={{ "--angle": `${technology.angle}deg` } as CSSProperties} key={technology.name}>
              <span className="orbit-tech-icon" title={technology.name}>
                <TechnologyIcon name={technology.name} />
              </span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
