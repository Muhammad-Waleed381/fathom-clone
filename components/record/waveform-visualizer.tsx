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
      const heightVal = Math.min(1, Math.max(0.08, baseEnergy * (curve * 0.7 + 0.3) + randomNoise * baseEnergy));
      synthetic.push(heightVal);
    }
    return synthetic;
  }, [frequencyData, audioLevel, isListening, isPaused, barCount]);

  // Compute decibel / level readout for visual feedback
  const displayLevel = Math.round(audioLevel * 100);

  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 to-slate-950/90 px-4 py-3 shadow-inner backdrop-blur-md",
        className
      )}
    >
      {/* Visualizer Bars Container */}
      <div
        className="flex w-full items-center justify-center gap-1.5 sm:gap-2 overflow-hidden"
        style={{ height: `${height}px` }}
        role="region"
        aria-label="Live Audio Waveform"
      >
        {bars.map((val, idx) => {
          // Compute bar height percentage (min 10%, max 100%)
          const barHeightPercent = isPaused
            ? 8
            : !isListening
            ? 10
            : Math.max(10, Math.min(100, Math.round(val * 100)));

          // Gradient color changes depending on energy level
          const isHighEnergy = val > 0.65;
          const isMedEnergy = val > 0.3;

          return (
            <div
              key={idx}
              className="flex h-full w-1.5 sm:w-2 items-center justify-center"
            >
              <div
                style={{
                  height: `${barHeightPercent}%`,
                  transition: "height 75ms cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className={cn(
                  "w-full rounded-full transition-all duration-75",
                  isPaused
                    ? "bg-slate-700/50"
                    : !isListening
                    ? "bg-slate-800"
                    : isHighEnergy
                    ? "bg-gradient-to-t from-indigo-500 via-purple-500 to-rose-400 shadow-sm shadow-rose-500/50"
                    : isMedEnergy
                    ? "bg-gradient-to-t from-indigo-600 via-indigo-400 to-emerald-400 shadow-sm shadow-indigo-500/30"
                    : "bg-gradient-to-t from-slate-700 to-indigo-500/60"
                )}
              />
            </div>
          );
        })}
      </div>

      {/* Optional Audio State Readout Badge */}
      {showLevelBadge && (
        <div className="mt-2.5 flex items-center justify-between w-full px-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                isPaused
                  ? "bg-amber-400"
                  : isListening
                  ? "bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/80"
                  : "bg-slate-600"
              )}
            />
            <span className="font-mono text-slate-300">
              {isPaused
                ? "Microphone Paused"
                : isListening
                ? audioLevel > 0.15
                  ? "Speech Detected"
                  : "Listening for speech..."
                : "Standby"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400">
            <span>Input Gain:</span>
            <span
              className={cn(
                "font-semibold",
                displayLevel > 60
                  ? "text-rose-400"
                  : displayLevel > 25
                  ? "text-emerald-400"
                  : "text-slate-400"
              )}
            >
              {displayLevel}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
