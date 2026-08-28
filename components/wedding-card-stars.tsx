"use client";

import { useEffect, useRef } from "react";

type Star = {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  alpha: number;
  color: string;
};

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  color: string;
};

const STAR_COLORS = ["#ffffff", "#ffffff", "#d9e9ff", "#fff1cf"];

function createStar(): Star {
  return {
    x: Math.random(),
    y: Math.random(),
    size: 0.45 + Math.random() * 1.2,
    phase: Math.random() * Math.PI * 2,
    speed: 0.45 + Math.random() * 1.25,
    alpha: 0.18 + Math.random() * 0.62,
    color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
  };
}

export function WeddingCardStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 1;
    let height = 1;
    let stars: Star[] = [];
    let shooters: ShootingStar[] = [];
    let animationFrame = 0;
    let lastFrame = performance.now();
    let nextShooter = lastFrame + 1800 + Math.random() * 2200;
    let isVisible = true;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const targetCount = width < 600 ? 42 : 72;
      stars = Array.from({ length: targetCount }, createStar);
    };

    const spawnShooter = () => {
      const speed = 145 + Math.random() * 95;
      const angle = 0.48 + Math.random() * 0.28;
      shooters.push({
        x: width * (0.08 + Math.random() * 0.68),
        y: height * (0.05 + Math.random() * 0.34),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        age: 0,
        life: 0.72 + Math.random() * 0.48,
        color: Math.random() > 0.7 ? "#d9e9ff" : "#ffffff",
      });
    };

    const draw = (now: number) => {
      const delta = Math.min((now - lastFrame) / 1000, 0.05);
      lastFrame = now;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const star of stars) {
        const pulse = (Math.sin(now * 0.001 * star.speed + star.phase) + 1) * 0.5;
        const opacity = star.alpha * (0.28 + pulse * 0.72);
        const x = star.x * width;
        const y = star.y * height;

        context.globalAlpha = opacity;
        context.fillStyle = star.color;
        context.shadowBlur = star.size > 1.15 ? 9 : 5;
        context.shadowColor = star.color;
        context.beginPath();
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();

        if (star.size > 1.35 && pulse > 0.72) {
          context.globalAlpha = opacity * 0.48;
          context.strokeStyle = star.color;
          context.lineWidth = 0.55;
          context.beginPath();
          context.moveTo(x - 4, y);
          context.lineTo(x + 4, y);
          context.moveTo(x, y - 4);
          context.lineTo(x, y + 4);
          context.stroke();
        }
      }

      if (now >= nextShooter) {
        spawnShooter();
        nextShooter = now + 2600 + Math.random() * 3400;
      }

      shooters = shooters.filter((shooter) => {
        shooter.age += delta;
        shooter.vy += 42 * delta;
        shooter.x += shooter.vx * delta;
        shooter.y += shooter.vy * delta;
        const progress = shooter.age / shooter.life;
        if (progress >= 1 || shooter.x > width + 60 || shooter.y > height + 60) return false;

        const tailLength = 46 + Math.hypot(shooter.vx, shooter.vy) * 0.12;
        const magnitude = Math.hypot(shooter.vx, shooter.vy) || 1;
        const tailX = shooter.x - (shooter.vx / magnitude) * tailLength;
        const tailY = shooter.y - (shooter.vy / magnitude) * tailLength;
        const gradient = context.createLinearGradient(tailX, tailY, shooter.x, shooter.y);
        gradient.addColorStop(0, "rgba(255,255,255,0)");
        gradient.addColorStop(1, shooter.color);

        context.globalAlpha = Math.sin(Math.PI * progress) * 0.9;
        context.strokeStyle = gradient;
        context.lineWidth = 1.25;
        context.shadowBlur = 12;
        context.shadowColor = shooter.color;
        context.beginPath();
        context.moveTo(tailX, tailY);
        context.lineTo(shooter.x, shooter.y);
        context.stroke();
        context.fillStyle = shooter.color;
        context.beginPath();
        context.arc(shooter.x, shooter.y, 1.25, 0, Math.PI * 2);
        context.fill();
        return true;
      });

      context.globalAlpha = 1;
      context.globalCompositeOperation = "source-over";
      context.shadowBlur = 0;
      if (isVisible && !reduceMotion) animationFrame = requestAnimationFrame(draw);
    };

    const start = () => {
      if (animationFrame || reduceMotion) return;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(draw);
    };

    const stop = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(performance.now());
    });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) start();
      else stop();
    }, { rootMargin: "120px" });

    resize();
    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    if (reduceMotion) draw(performance.now());
    else start();

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="wedding-card-stars" aria-hidden="true" />;
}
