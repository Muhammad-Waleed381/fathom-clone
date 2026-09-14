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
        "relative flex w-full flex-col items-center justify-center rounded-xl border border-white/15 bg-surface-raised px-4 py-3 shadow-sm",
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
                    ? "bg-white/15"
                    : !isListening
                    ? "bg-white/10"
                    : isHighEnergy
                    ? "bg-white"
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
        <div className="mt-2.5 flex items-center justify-between w-full pt-2 border-t border-white/10 text-[11px]">
          <div className="flex items-center gap-2 font-semibold text-white">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-sm",
                isPaused
                  ? "bg-zinc-300"
                  : isListening
                  ? "bg-white animate-pulse"
                  : "bg-white/15"
              )}
            />
            <span>
              {isPaused
                ? "MIC PAUSED"
                : isListening
                ? audioLevel > 0.15
                  ? "Speech detected"
                  : "LISTENING..."
                : "Standby"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-white/45">
            <span>Input gain:</span>
            <span className="font-semibold text-white">
              {displayLevel}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
