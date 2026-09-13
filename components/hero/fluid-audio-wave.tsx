"use client";

import React, { useEffect, useRef } from "react";

interface WaveLayer {
  baseFreq: number;
  freqMod: number;
  baseAmp: number;
  ampMod: number;
  speed: number;
  phase: number;
  fillGradient: (
    ctx: CanvasRenderingContext2D,
    height: number
  ) => CanvasGradient;
  strokeColor: string;
  lineWidth: number;
}

export function FluidAudioWave({
  className = "",
}: {
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse tracking with dampening
    const mouse = {
      x: 0.5,
      y: 0.5,
      targetX: 0.5,
      targetY: 0.5,
      lerpSpeed: 0.04,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        mouse.targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        mouse.targetY = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      }
    };

    const handleMouseLeave = () => {
      mouse.targetX = 0.5;
      mouse.targetY = 0.5;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Handle Retina / HiDPI sizing
    const updateSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      if (width === 0 || height === 0) return;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });
    resizeObserver.observe(canvas);
    updateSize();

    // 5 Layered acoustic ribbons with soft graphite-to-charcoal gradients on pure white
    const layers: WaveLayer[] = [
      {
        baseFreq: 0.0035,
        freqMod: 0.0015,
        baseAmp: 38,
        ampMod: 18,
        speed: 0.008,
        phase: 0,
        fillGradient: (c, h) => {
          const g = c.createLinearGradient(0, h * 0.2, 0, h);
          g.addColorStop(0, "rgba(24, 24, 27, 0.045)");
          g.addColorStop(0.6, "rgba(39, 39, 42, 0.015)");
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          return g;
        },
        strokeColor: "rgba(24, 24, 27, 0.16)",
        lineWidth: 1.5,
      },
      {
        baseFreq: 0.0048,
        freqMod: 0.002,
        baseAmp: 44,
        ampMod: 22,
        speed: -0.0065,
        phase: Math.PI * 0.35,
        fillGradient: (c, h) => {
          const g = c.createLinearGradient(0, h * 0.25, 0, h);
          g.addColorStop(0, "rgba(39, 39, 42, 0.04)");
          g.addColorStop(0.55, "rgba(82, 82, 91, 0.012)");
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          return g;
        },
        strokeColor: "rgba(39, 39, 42, 0.14)",
        lineWidth: 1.25,
      },
      {
        baseFreq: 0.0062,
        freqMod: 0.0025,
        baseAmp: 32,
        ampMod: 16,
        speed: 0.0105,
        phase: Math.PI * 0.8,
        fillGradient: (c, h) => {
          const g = c.createLinearGradient(0, h * 0.3, 0, h);
          g.addColorStop(0, "rgba(9, 9, 11, 0.05)");
          g.addColorStop(0.65, "rgba(63, 63, 70, 0.015)");
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          return g;
        },
        strokeColor: "rgba(9, 9, 11, 0.18)",
        lineWidth: 1.4,
      },
      {
        baseFreq: 0.0078,
        freqMod: 0.003,
        baseAmp: 26,
        ampMod: 14,
        speed: -0.009,
        phase: Math.PI * 1.25,
        fillGradient: (c, h) => {
          const g = c.createLinearGradient(0, h * 0.35, 0, h);
          g.addColorStop(0, "rgba(82, 82, 91, 0.035)");
          g.addColorStop(0.6, "rgba(113, 113, 122, 0.01)");
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          return g;
        },
        strokeColor: "rgba(82, 82, 91, 0.12)",
        lineWidth: 1.1,
      },
      {
        baseFreq: 0.0095,
        freqMod: 0.0035,
        baseAmp: 20,
        ampMod: 12,
        speed: 0.013,
        phase: Math.PI * 1.7,
        fillGradient: (c, h) => {
          const g = c.createLinearGradient(0, h * 0.4, 0, h);
          g.addColorStop(0, "rgba(9, 9, 11, 0.03)");
          g.addColorStop(0.7, "rgba(161, 161, 170, 0.008)");
          g.addColorStop(1, "rgba(255, 255, 255, 0)");
          return g;
        },
        strokeColor: "rgba(9, 9, 11, 0.1)",
        lineWidth: 1.0,
      },
    ];

    let time = 0;

    const render = () => {
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation (spring dampening)
      mouse.x += (mouse.targetX - mouse.x) * mouse.lerpSpeed;
      mouse.y += (mouse.targetY - mouse.y) * mouse.lerpSpeed;

      time += 1;

      ctx.clearRect(0, 0, width, height);

      // Mouse influence deltas
      const mouseInfluenceX = (mouse.x - 0.5) * 1.8;
      const mouseInfluenceY = (mouse.y - 0.5) * 1.4;

      const baselineY = height * 0.48;

      // Draw each wave layer
      layers.forEach((layer, index) => {
        const freq = layer.baseFreq + mouseInfluenceX * layer.freqMod * 0.5;
        const amp =
          layer.baseAmp * (1 + mouseInfluenceY * 0.35) +
          Math.sin(time * 0.012 + index) * 4;
        const currentPhase = layer.phase + time * layer.speed + mouseInfluenceX * 0.8;

        ctx.beginPath();
        ctx.moveTo(0, height);

        // Step through x with adaptive step size for smoothness and performance
        const step = 4;
        let firstPoint = true;

        for (let x = 0; x <= width + step; x += step) {
          // Acoustic harmonic superposition simulating speech frequencies
          const harmonic1 = Math.sin(x * freq + currentPhase);
          const harmonic2 = Math.sin(x * freq * 2.15 - currentPhase * 0.7) * 0.38;
          const harmonic3 = Math.cos(x * freq * 0.45 + currentPhase * 1.2) * 0.25;

          // Envelope windowing: soft taper at extremes
          const normX = x / width;
          const envelope = Math.sin(Math.PI * Math.max(0, Math.min(1, normX)));
          const shapedAmp = amp * (0.45 + 0.55 * envelope);

          const y = baselineY + (harmonic1 + harmonic2 + harmonic3) * shapedAmp + (index * 12 - 24);

          if (firstPoint) {
            ctx.lineTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.lineTo(width, height);
        ctx.closePath();

        // Fill wave ribbon
        ctx.fillStyle = layer.fillGradient(ctx, height);
        ctx.fill();

        // Stroke wave crest
        ctx.beginPath();
        firstPoint = true;
        for (let x = 0; x <= width + step; x += step) {
          const harmonic1 = Math.sin(x * freq + currentPhase);
          const harmonic2 = Math.sin(x * freq * 2.15 - currentPhase * 0.7) * 0.38;
          const harmonic3 = Math.cos(x * freq * 0.45 + currentPhase * 1.2) * 0.25;

          const normX = x / width;
          const envelope = Math.sin(Math.PI * Math.max(0, Math.min(1, normX)));
          const shapedAmp = amp * (0.45 + 0.55 * envelope);

          const y = baselineY + (harmonic1 + harmonic2 + harmonic3) * shapedAmp + (index * 12 - 24);

          if (firstPoint) {
            ctx.moveTo(x, y);
            firstPoint = false;
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.strokeStyle = layer.strokeColor;
        ctx.lineWidth = layer.lineWidth;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ pointerEvents: "auto" }}
        aria-hidden="true"
      />
    </div>
  );
}
