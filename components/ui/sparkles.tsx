"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SparkleParticle {
  x: number;
  y: number;
  size: number;
  baseSize: number;
  alpha: number;
  targetAlpha: number;
  twinkleSpeed: number;
  vx: number;
  vy: number;
  spikes: number;
}

export interface SparklesCoreProps {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleColor?: string;
  particleDensity?: number;
  speed?: number;
}

export function SparklesCore({
  id,
  className,
  background = "transparent",
  minSize = 0.8,
  maxSize = 2.4,
  particleColor = "#18181b",
  particleDensity = 60,
  speed = 0.5,
}: SparklesCoreProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    let particles: SparkleParticle[] = [];

    const createParticles = () => {
      particles = [];
      const count = Math.floor((width * height) / (100000 / particleDensity));
      for (let i = 0; i < count; i++) {
        const base = Math.random() * (maxSize - minSize) + minSize;
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: base,
          baseSize: base,
          alpha: Math.random() * 0.7 + 0.1,
          targetAlpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: (Math.random() * 0.02 + 0.008) * (speed * 1.5),
          vx: (Math.random() - 0.5) * 0.2 * speed,
          vy: (Math.random() - 0.5) * 0.2 * speed,
          spikes: Math.random() > 0.65 ? 4 : 0, // Gleam 4-point star for subset of particles
        });
      }
    };

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      createParticles();
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(canvas);
    handleResize();

    // Star draw helper (4-point gleaming star)
    const drawStar = (
      cx: number,
      cy: number,
      outerRadius: number,
      color: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.5;

      const spikes = 4;
      const innerRadius = outerRadius * 0.3;
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();

      // Gleam halo
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, outerRadius * 1.8);
      grad.addColorStop(0, color);
      grad.addColorStop(1, "transparent");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, outerRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift slowly
        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Twinkle
        if (Math.abs(p.alpha - p.targetAlpha) < 0.05) {
          p.targetAlpha = Math.random() * 0.85 + 0.1;
        } else {
          p.alpha += (p.targetAlpha - p.alpha) * p.twinkleSpeed;
        }

        // Gleam particle
        if (p.spikes === 4 && p.alpha > 0.4) {
          drawStar(p.x, p.y, p.size * 2.2, particleColor, p.alpha);
        } else {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = particleColor;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [minSize, maxSize, particleColor, particleDensity, speed]);

  return (
    <div id={id} className={cn("relative h-full w-full pointer-events-none", className)}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ background }}
        aria-hidden="true"
      />
    </div>
  );
}
