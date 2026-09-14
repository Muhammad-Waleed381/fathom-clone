"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

export interface WaveformVisualizerProps {
  frequencyData?: number[];
  audioLevel?: number;
  isListening?: boolean;
  isPaused?: boolean;
  barCount?: number;
  height?: number;
  className?: string;
  showLevelBadge?: boolean;
}

export function WaveformVisualizer({
  frequencyData,
  audioLevel = 0,
  isListening = false,
  isPaused = false,
  barCount = 24,
  height = 56,
  className,
  showLevelBadge = true,
}: WaveformVisualizerProps) {
  // Generate bars array normalized from frequencyData or synthesized from audioLevel
  const bars = useMemo(() => {
    if (frequencyData && frequencyData.length >= barCount) {
      return frequencyData.slice(0, barCount);
    }

    // Synthesize bars based on barCount and audioLevel with natural harmonic curve
    const synthetic: number[] = [];
    const baseEnergy = isListening && !isPaused ? Math.max(0.12, audioLevel) : 0.06;

    for (let i = 0; i < barCount; i++) {
      // Bell curve factor so center bars are higher
      const normalizedPos = (i / (barCount - 1)) * 2 - 1; // -1 to 1
      const curve = Math.cos((normalizedPos * Math.PI) / 2); // 0 to 1 bell

      // Organic variation
      const randomNoise = (Math.sin(i * 1.7) * 0.5 + 0.5) * 0.3;
      const heightVal = Math.min(
        1,
        Math.max(0.08, baseEnergy * (curve * 0.7 + 0.3) + randomNoise * baseEnergy)
      );
      synthetic.push(heightVal);
    }
    return synthetic;
  }, [frequencyData, audioLevel, isListening, isPaused, barCount]);

  // Compute decibel / level readout for visual feedback
  const displayLevel = Math.round(audioLevel * 100);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm",
        className
      )}
    >
      {/* Visualizer Bars Container */}
      <div
        className="flex w-full items-end justify-center gap-1.5 sm:gap-2 overflow-hidden px-2"
        style={{ height: `${height}px` }}
        role="region"
        aria-label="Live Audio Waveform"
      >
        {bars.map((val, idx) => {
          // Compute bar height percentage (min 12%, max 100%)
          const barHeightPercent = isPaused
            ? 12
            : !isListening
            ? 12
            : Math.max(12, Math.min(100, Math.round(val * 100)));

          // Energy levels for shading
          const isHighEnergy = val > 0.65;
          const isMedEnergy = val > 0.35;

          return (
            <div
              key={idx}
              className="flex h-full w-2 sm:w-2.5 items-end justify-center"
            >
              <div
                style={{
                  height: `${barHeightPercent}%`,
                  transition: "height 60ms ease-out",
                }}
                className={cn(
                  "w-full rounded-sm transition-all",
                  isPaused
                    ? "bg-zinc-200"
                    : !isListening
                    ? "bg-zinc-100"
                    : isHighEnergy
                    ? "bg-zinc-950"
                    : isMedEnergy
                    ? "bg-zinc-600"
                    : "bg-zinc-300"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Audio State & Gain Readout */}
      {showLevelBadge && (
        <div className="mt-2.5 flex items-center justify-between w-full pt-2 border-t border-zinc-100 font-mono text-[11px]">
          <div className="flex items-center gap-2 font-semibold uppercase text-zinc-950">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-sm",
                isPaused
                  ? "bg-zinc-300"
                  : isListening
                  ? "bg-zinc-950 animate-pulse"
                  : "bg-zinc-200"
              )}
            />
            <span>
              {isPaused
                ? "MIC PAUSED"
                : isListening
                ? audioLevel > 0.15
                  ? "SPEECH DETECTED"
                  : "LISTENING..."
                : "STANDBY"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium uppercase text-zinc-400">
            <span>INPUT GAIN:</span>
            <span className="font-semibold text-zinc-950">
              {displayLevel}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
