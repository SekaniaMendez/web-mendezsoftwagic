"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "orbit" | "flow" | "chaos" | "magic" | "wordmark";
type Point = { x: number; y: number };

const modeLabels: Record<Mode, string> = {
  orbit: "Orbit",
  flow: "Flow",
  chaos: "Chaos",
  magic: "MAGIC",
  wordmark: "MendezSoftwagic",
};

const constellationWords: Partial<Record<Mode, string>> = {
  magic: "MAGIC",
  wordmark: "MendezSoftwagic",
};

function createTextConstellation(word: string, width: number, height: number, count: number) {
  const mask = document.createElement("canvas");
  const maskContext = mask.getContext("2d", { willReadFrequently: true });
  if (!maskContext || width <= 0 || height <= 0) return { points: [] as Point[], fontSize: 0 };

  mask.width = Math.max(1, Math.floor(width));
  mask.height = Math.max(1, Math.floor(height));
  let fontSize = Math.min(height * 0.3, word.length > 6 ? width * 0.105 : width * 0.19);
  maskContext.font = `600 ${fontSize}px Space Grotesk, Arial, sans-serif`;
  while (maskContext.measureText(word).width > width * 0.82 && fontSize > 28) {
    fontSize -= 2;
    maskContext.font = `600 ${fontSize}px Space Grotesk, Arial, sans-serif`;
  }
  maskContext.textAlign = "center";
  maskContext.textBaseline = "middle";
  maskContext.fillStyle = "white";
  maskContext.fillText(word, width / 2, height / 2);

  const pixels = maskContext.getImageData(0, 0, mask.width, mask.height).data;
  const candidates: Point[] = [];
  const step = word.length > 6 ? 4 : 3;
  for (let y = 0; y < mask.height; y += step) {
    for (let x = 0; x < mask.width; x += step) {
      if (pixels[(y * mask.width + x) * 4 + 3] > 90) candidates.push({ x, y });
    }
  }
  if (candidates.length === 0) return { points: [] as Point[], fontSize };

  const points = Array.from({ length: count }, (_, index) => {
    const point = candidates[Math.floor((index / count) * candidates.length)] ?? candidates[index % candidates.length];
    return { x: point.x, y: point.y };
  });
  return { points, fontSize };
}

export function MagicLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5, active: false, pressed: false, pulse: 0, disruption: -1 });
  const [mode, setMode] = useState<Mode>("orbit");
  const word = constellationWords[mode];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const textMode = Boolean(word);
    const particleCount = textMode ? (word === "MendezSoftwagic" ? 360 : 280) : 96;
    let frame = 0;
    let animation = 0;
    let width = 0;
    let height = 0;
    let targetPoints: Point[] = [];
    let textFontSize = 0;

    const particles = Array.from({ length: reduceMotion && textMode ? Math.ceil(particleCount * 0.72) : particleCount }, (_, index) => ({
      angle: (index / particleCount) * Math.PI * 2,
      radius: 42 + (index % 13) * 14 + Math.random() * 22,
      speed: 0.0012 + Math.random() * 0.0022,
      size: 0.7 + Math.random() * 1.7,
      offset: Math.random() * Math.PI * 2,
      scatterAngle: Math.random() * Math.PI * 2,
      scatterDistance: 64 + Math.random() * 116,
      startX: Math.random(),
      startY: Math.random(),
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (word) {
        const constellation = createTextConstellation(word, width, height, particles.length);
        targetPoints = constellation.points;
        textFontSize = constellation.fontSize;
      }
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const render = () => {
      frame += reduceMotion ? 0 : 1;
      context.clearRect(0, 0, width, height);
      const pointer = pointerRef.current;
      const centerX = pointer.active && !textMode ? pointer.x * width : width * 0.5;
      const centerY = pointer.active && !textMode ? pointer.y * height : height * 0.5;
      const disruptionAge = pointer.disruption;
      const disruptionAttack = disruptionAge < 0 ? 0 : Math.min(1, disruptionAge / 14);
      const disruptionRelease = disruptionAge < 18 ? 1 : Math.max(0, 1 - (disruptionAge - 18) / 96);
      const disruptionAmount = reduceMotion ? 0 : Math.sin(disruptionAttack * Math.PI * 0.5) * disruptionRelease * disruptionRelease;
      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.min(width, height) * 0.46);
      glow.addColorStop(0, "rgba(120,248,228,.17)");
      glow.addColorStop(0.48, "rgba(169,145,255,.055)");
      glow.addColorStop(1, "rgba(0,0,0,0)");
      context.fillStyle = glow;
      context.fillRect(0, 0, width, height);

      if (word && textFontSize > 0) {
        context.save();
        context.font = `600 ${textFontSize}px Space Grotesk, Arial, sans-serif`;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillStyle = "rgba(120,248,228,.025)";
        context.shadowColor = "rgba(120,248,228,.2)";
        context.shadowBlur = 28;
        context.fillText(word, width / 2, height / 2);
        context.restore();
      }

      const points = particles.map((particle, index) => {
        const t = frame * particle.speed;
        const radius = particle.radius + Math.sin(t * 5 + particle.offset) * 8;
        let angle = particle.angle + t;
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius * 0.62;

        if (mode === "flow") {
          x = ((index * 79 + frame * (0.18 + particle.speed * 30)) % (width + 100)) - 50;
          y = height * 0.5 + Math.sin(index * 0.72 + frame * 0.009) * (55 + (index % 5) * 18);
        } else if (mode === "chaos") {
          angle = particle.angle + t * 5;
          x = centerX + Math.cos(angle + Math.sin(t * 7)) * radius * (1 + (index % 4) * 0.18);
          y = centerY + Math.sin(angle * 1.7) * radius * 0.72;
        } else if (word && targetPoints.length > 0) {
          const target = targetPoints[index % targetPoints.length];
          const settle = reduceMotion ? 1 : 1 - Math.exp(-frame * 0.036);
          const wander = (1 - settle) * 42;
          x = particle.startX * width + (target.x - particle.startX * width) * settle + Math.cos(particle.offset + frame * 0.015) * wander;
          y = particle.startY * height + (target.y - particle.startY * height) * settle + Math.sin(particle.offset + frame * 0.012) * wander;

          if (pointer.active) {
            const pointerX = pointer.x * width;
            const pointerY = pointer.y * height;
            const deltaX = pointerX - x;
            const deltaY = pointerY - y;
            const distance = Math.max(1, Math.hypot(deltaX, deltaY));
            const influence = Math.max(0, 1 - distance / 135) * 24;
            x -= (deltaX / distance) * influence;
            y -= (deltaY / distance) * influence;
          }
        }

        if (disruptionAmount > 0) {
          const pointerX = pointer.x * width;
          const pointerY = pointer.y * height;
          const radialAngle = Math.atan2(y - pointerY, x - pointerX);
          const disorderAngle = radialAngle + Math.sin(particle.scatterAngle + disruptionAge * 0.055) * 1.15;
          const scatter = particle.scatterDistance * disruptionAmount;
          x += Math.cos(disorderAngle) * scatter;
          y += Math.sin(disorderAngle) * scatter * 0.78;
        }
        return { x, y, size: particle.size };
      });

      context.lineWidth = 0.55;
      points.forEach((point, index) => {
        const searchLimit = textMode ? Math.min(points.length, index + 5) : points.length;
        for (let next = index + 1; next < searchLimit; next += 1) {
          const other = points[next];
          const distance = Math.hypot(point.x - other.x, point.y - other.y);
          const threshold = textMode ? 22 : 72;
          if (distance < threshold) {
            context.strokeStyle = `rgba(120,248,228,${(1 - distance / threshold) * (textMode ? 0.25 : 0.15)})`;
            context.beginPath();
            context.moveTo(point.x, point.y);
            context.lineTo(other.x, other.y);
            context.stroke();
          }
        }
        context.fillStyle = index % 7 === 0 ? "rgba(189,145,255,.95)" : "rgba(190,255,244,.92)";
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fill();
      });

      if (pointer.pulse > 0) {
        const pulseX = pointer.x * width;
        const pulseY = pointer.y * height;
        const pulseRadius = (1 - pointer.pulse) * 130;
        context.strokeStyle = `rgba(120,248,228,${pointer.pulse * 0.65})`;
        context.lineWidth = 1;
        context.beginPath();
        context.arc(pulseX, pulseY, pulseRadius, 0, Math.PI * 2);
        context.stroke();
        pointer.pulse = Math.max(0, pointer.pulse - 0.022);
      }
      if (pointer.disruption >= 0) {
        if (pointer.pressed && pointer.disruption >= 18) pointer.disruption = 18;
        else if (pointer.disruption >= 114) pointer.disruption = -1;
        else pointer.disruption += 1;
      }
      animation = window.requestAnimationFrame(render);
    };
    render();
    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animation);
    };
  }, [mode, word]);

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
      <div className="lab-stage" onPointerMove={(event) => setPointer(event.clientX, event.clientY)} onPointerLeave={() => { pointerRef.current.active = false; pointerRef.current.pressed = false; }} onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); setPointer(event.clientX, event.clientY); pointerRef.current.pressed = true; pointerRef.current.pulse = 1; pointerRef.current.disruption = 0; }} onPointerUp={() => { pointerRef.current.pressed = false; }} onPointerCancel={() => { pointerRef.current.pressed = false; }}>
        <canvas ref={canvasRef} aria-label={word ? `Interactive particle constellation forming ${word}` : "Interactive particle constellation"} />
        {!word && <div className="lab-reticle" aria-hidden="true"><span /><span /></div>}
        <div className="lab-mode-caption" aria-live="polite"><span>Formation</span><strong>{word ?? modeLabels[mode]}</strong></div>
        <p className="lab-instruction">Move to bend · Press and drag to scatter · Release to reform</p>
      </div>
      <div className="lab-controls" role="group" aria-label="Constellation behavior">
        {(Object.keys(modeLabels) as Mode[]).map((item) => <button key={item} type="button" className={mode === item ? "is-active" : ""} onClick={() => setMode(item)} aria-pressed={mode === item}>{modeLabels[item]}</button>)}
      </div>
    </div>
  );
}
