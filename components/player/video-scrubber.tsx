"use client";

import React, { useState, useRef, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { MeetingHighlight } from "@/types/meeting";
import { cn } from "@/lib/utils";

export interface VideoScrubberProps {
  currentTime?: number;
  duration?: number;
  highlights?: MeetingHighlight[];
  onSeek?: (time: number) => void;
  className?: string;
  showSpeakerSegments?: boolean;
}

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

const CATEGORY_COLORS: Record<
  MeetingHighlight["category"],
  { border: string; bg: string; text: string; badge: string; label: string }
> = {
  key_moment: {
    border: "border-amber-400",
    bg: "bg-amber-400",
    text: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    label: "Key Moment",
  },
  decision: {
    border: "border-emerald-400",
    bg: "bg-emerald-400",
    text: "text-emerald-300",
    badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    label: "Decision",
  },
  action: {
    border: "border-indigo-400",
    bg: "bg-indigo-400",
    text: "text-indigo-300",
    badge: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    label: "Action Item",
  },
  risk: {
    border: "border-rose-400",
    bg: "bg-rose-400",
    text: "text-rose-300",
    badge: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    label: "Risk / Blocker",
  },
};

export function VideoScrubber({
  currentTime: propCurrentTime,
  duration: propDuration,
  highlights: propHighlights,
  onSeek: propOnSeek,
  className,
  showSpeakerSegments = true,
}: VideoScrubberProps) {
  const storeCurrentTime = useMeetingStore((s) => s.currentTime);
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const storeSeekTo = useMeetingStore((s) => s.seekTo);

  const currentTime = propCurrentTime !== undefined ? propCurrentTime : storeCurrentTime;
  const duration =
    propDuration !== undefined
      ? propDuration
      : currentMeeting?.duration || 100;
  const highlights =
    propHighlights !== undefined
      ? propHighlights
      : currentMeeting?.highlights || [];
  const handleSeek = propOnSeek || storeSeekTo;

  const [hoverPosition, setHoverPosition] = useState<{
    x: number;
    time: number;
  } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Group highlights or speaker segments for visualization
  const speakerSegments = useMemo(() => {
    if (!showSpeakerSegments || !currentMeeting?.transcript) return [];
    return currentMeeting.transcript.slice(0, 120); // Keep reasonable sample for track ticks
  }, [showSpeakerSegments, currentMeeting]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || duration <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;
    setHoverPosition({ x, time });
  };

  const handleMouseLeave = () => {
    setHoverPosition(null);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("w-full select-none space-y-1.5", className)}>
        {/* Scrubber track container */}
        <div
          ref={trackRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative flex h-6 w-full items-center cursor-pointer"
        >
          {/* Hover Time Tooltip Tag */}
          {hoverPosition && (
            <div
              className="pointer-events-none absolute -top-8 z-30 -translate-x-1/2 rounded bg-slate-900/95 border border-slate-700 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-200 shadow-md backdrop-blur-sm"
              style={{ left: `${hoverPosition.x}px` }}
            >
              {formatTime(hoverPosition.time)}
            </div>
          )}

          {/* Underlay: Speaker colored segments tick bar */}
          {showSpeakerSegments && speakerSegments.length > 0 && duration > 0 && (
            <div className="pointer-events-none absolute inset-x-0 h-1.5 rounded-full overflow-hidden opacity-35">
              {speakerSegments.map((segment) => {
                const left = (segment.start / duration) * 100;
                const width = Math.max(0.3, ((segment.end - segment.start) / duration) * 100);
                const speaker = currentMeeting?.participants.find(
                  (p) => p.id === segment.speakerId
                );
                return (
                  <div
                    key={segment.id}
                    className="absolute top-0 bottom-0"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      backgroundColor: speaker?.color || "#6366F1",
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Highlight Markers along the scrubber track */}
          {duration > 0 &&
            highlights.map((hl) => {
              const leftPercent = Math.min(100, Math.max(0, (hl.start / duration) * 100));
              const widthPercent = Math.max(
                0.8,
                Math.min(100 - leftPercent, ((hl.end - hl.start) / duration) * 100)
              );
              const styleConfig =
                CATEGORY_COLORS[hl.category] || CATEGORY_COLORS.key_moment;

              return (
                <Tooltip key={hl.id}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSeek(hl.start);
                      }}
                      className={cn(
                        "absolute z-20 h-3 -translate-y-1/2 top-1/2 rounded-sm transition-all hover:h-4.5 hover:z-30",
                        styleConfig.bg,
                        "shadow-[0_0_8px_rgba(0,0,0,0.4)] opacity-90 hover:opacity-100 ring-1 ring-black/40"
                      )}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.max(widthPercent, 0.9)}%`,
                        minWidth: "6px",
                      }}
                      aria-label={`Jump to highlight: ${hl.title}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs border border-slate-700 bg-slate-900/95 p-2 text-slate-100 shadow-xl backdrop-blur-md"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0", styleConfig.badge)}
                      >
                        {styleConfig.label}
                      </Badge>
                      <span className="font-mono text-[11px] text-slate-400">
                        {formatTime(hl.start)} – {formatTime(hl.end)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-200 line-clamp-2">
                      {hl.title}
                    </p>
                    <p className="text-[10px] text-indigo-400 mt-1 font-mono">
                      Click to jump
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

          {/* Core Interactive Slider */}
          <Slider
            value={[Math.min(Math.max(0, currentTime), duration || 100)]}
            min={0}
            max={duration > 0 ? duration : 100}
            step={0.1}
            onValueChange={([val]) => handleSeek(val)}
            className="w-full relative z-10 py-1"
          />
        </div>

        {/* Timestamps and Progress Indicators */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-0.5">
          <div className="flex items-center gap-2">
            <span className="text-slate-200 font-semibold">
              {formatTime(currentTime)}
            </span>
            <span className="text-slate-600">/</span>
            <span>{formatTime(duration)}</span>
          </div>

          {highlights.length > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>
                {highlights.length} highlight{highlights.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
