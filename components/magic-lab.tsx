"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "orbit" | "flow" | "chaos";
const modeLabels: Record<Mode, string> = { orbit: "Orbit", flow: "Flow", chaos: "Chaos" };

export function MagicLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false, pulse: 0 });
  const [mode, setMode] = useState<Mode>("orbit");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    const particles = Array.from({ length: reduceMotion ? 45 : 92 }, (_, index) => ({
      angle: (index / 92) * Math.PI * 2,
      radius: 42 + (index % 11) * 15 + Math.random() * 24,
      speed: 0.0012 + Math.random() * 0.0022,
      size: 0.7 + Math.random() * 1.8,
      offset: Math.random() * Math.PI * 2,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = () => {
      frame += reduceMotion ? 0 : 1;
      context.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;
      const centerX = pointer.active ? pointer.x * width : width * 0.5;
      const centerY = pointer.active ? pointer.y * height : height * 0.5;
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.42);
      glow.addColorStop(0, "rgba(120,248,228,.17)");
      glow.addColorStop(0.48, "rgba(169,145,255,.055)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      const points = particles.map((particle, index) => {
        const t = frame * particle.speed;
        const radius = particle.radius + Math.sin(t * 5 + particle.offset) * 8;
        let angle = particle.angle + t;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius * 0.62;
        if (mode === "flow") {
          x = ((index * 79 + frame * (0.18 + particle.speed * 30)) % (width + 100)) - 50;
          y = height * 0.5 + Math.sin(index * 0.72 + frame * 0.009) * (55 + (index % 5) * 18);
        }
        if (mode === "chaos") {
          angle = particle.angle + t * 5;
          x = centerX + Math.cos(angle + Math.sin(t * 7)) * radius * (1 + (index % 4) * 0.18);
          y = centerY + Math.sin(angle * 1.7) * radius * 0.72;
        }
        return { x, y, size: particle.size };
      });

      context.lineWidth = 0.55;
      points.forEach((point, index) => {
        for (let next = index + 1; next < points.length; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          if (distance < 72) {
            context.strokeStyle = `rgba(120,248,228,${(1 - distance / 72) * 0.15})`;
            context.beginPath(); context.moveTo(point.x, point.y); context.lineTo(other.x, other.y); context.stroke();
          }
        }
        context.fillStyle = index % 7 === 0 ? "rgba(189,145,255,.92)" : "rgba(190,255,244,.88)";
        context.beginPath(); context.arc(point.x, point.y, point.size, 0, Math.PI * 2); context.fill();
      });

      if (pointer.pulse > 0) {
        const pulseRadius = (1 - pointer.pulse) * 130;
        context.strokeStyle = `rgba(120,248,228,${pointer.pulse * 0.65})`;
        context.lineWidth = 1; context.beginPath(); context.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2); context.stroke();
        pointer.pulse = Math.max(0, pointer.pulse - 0.022);
      }
      animation = window.requestAnimationFrame(render);
    };
    render();
    return () => { observer.disconnect(); window.cancelAnimationFrame(animation); };
  }, [mode]);

  const setPointer = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const bounds = canvas.getBoundingClientRect();
    pointerRef.current.x = (clientX - bounds.left) / bounds.width;
    pointerRef.current.y = (clientY - bounds.top) / bounds.height;
    pointerRef.current.active = true;
  };

  return (
    <div className="lab-console reveal">
      <div className="lab-toolbar"><div><span className="live-dot" /> Constellation engine</div><span>Interactive experiment / 01</span></div>
      <div className="lab-stage" onPointerMove={(event) => setPointer(event.clientX, event.clientY)} onPointerLeave={() => { pointerRef.current.active = false; }} onPointerDown={(event) => { setPointer(event.clientX, event.clientY); pointerRef.current.pulse = 1; }}>
        <canvas ref={canvasRef} aria-label="Interactive particle constellation" />
        <div className="lab-reticle" aria-hidden="true"><span /><span /></div>
        <p className="lab-instruction">Move to bend the field · Click to cast a pulse</p>
      </div>
      <div className="lab-controls" role="group" aria-label="Constellation behavior">
        {(Object.keys(modeLabels) as Mode[]).map((item) => <button key={item} type="button" className={mode === item ? "is-active" : ""} onClick={() => setMode(item)} aria-pressed={mode === item}>{modeLabels[item]}</button>)}
      </div>
    </div>
  );
}
