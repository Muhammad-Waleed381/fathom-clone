"use client";

import React, { useState, useRef, useMemo, useCallback } from "react";
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
    border: "border-zinc-300",
    bg: "bg-zinc-200",
    text: "text-zinc-900",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-300",
    label: "Key Moment",
  },
  decision: {
    border: "border-zinc-300",
    bg: "bg-zinc-300",
    text: "text-zinc-900",
    badge: "bg-zinc-200 text-zinc-700 border-zinc-300",
    label: "Decision",
  },
  action: {
    border: "border-zinc-400",
    bg: "bg-zinc-400",
    text: "text-zinc-900",
    badge: "bg-zinc-300 text-zinc-800 border-zinc-400",
    label: "Action Item",
  },
  risk: {
    border: "border-zinc-500",
    bg: "bg-zinc-600",
    text: "text-white",
    badge: "bg-zinc-700 text-zinc-100 border-zinc-600",
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

  const currentTime =
    propCurrentTime !== undefined ? propCurrentTime : storeCurrentTime;
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
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  // Group highlights or speaker segments for visualization
  const speakerSegments = useMemo(() => {
    if (!showSpeakerSegments || !currentMeeting?.transcript) return [];
    return currentMeeting.transcript.slice(0, 120);
  }, [showSpeakerSegments, currentMeeting]);

  const getTimeFromEvent = useCallback(
    (clientX: number) => {
      if (!trackRef.current || duration <= 0) return 0;
      const rect = trackRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percentage = x / rect.width;
      return percentage * duration;
    },
    [duration]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const newTime = getTimeFromEvent(e.clientX);
    handleSeek(newTime);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const movedTime = getTimeFromEvent(moveEvent.clientX);
      handleSeek(movedTime);
      if (trackRef.current) {
        const rect = trackRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(moveEvent.clientX - rect.left, rect.width));
        setHoverPosition({ x, time: movedTime });
      }
    };

    const onPointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current || duration <= 0) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;
    const time = percentage * duration;
    setHoverPosition({ x, time });
  };

  const handleMouseLeave = () => {
    if (!isDragging) {
      setHoverPosition(null);
    }
  };

  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className={cn("w-full select-none space-y-1.5", className)}>
        {/* Scrubber track container */}
        <div
          ref={trackRef}
          onPointerDown={handlePointerDown}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="group relative flex h-7 w-full items-center cursor-pointer touch-none"
        >
          {/* Hover Time Tooltip */}
          {hoverPosition && (
            <div
              className="pointer-events-none absolute -top-8 z-40 -translate-x-1/2 rounded-md border border-zinc-200 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] font-medium text-white shadow-sm"
              style={{ left: `${hoverPosition.x}px` }}
            >
              {formatTime(hoverPosition.time)}
            </div>
          )}

          {/* Sleek neutral track: h-2 rounded-sm bg-zinc-100 border border-zinc-200 */}
          <div className="relative h-2 w-full rounded-sm border border-zinc-200 bg-zinc-100 overflow-hidden">
            {/* Underlay: Speaker colored segments tick bar — monochrome zinc tones */}
            {showSpeakerSegments && speakerSegments.length > 0 && duration > 0 && (
              <div className="pointer-events-none absolute inset-0 flex opacity-30">
                {speakerSegments.map((segment) => {
                  const left = (segment.start / duration) * 100;
                  const width = Math.max(0.3, ((segment.end - segment.start) / duration) * 100);
                  const speaker = currentMeeting?.participants.find(
                    (p) => p.id === segment.speakerId
                  );
                  // Map speaker index to a zinc shade rather than pastel color
                  const speakerIdx = currentMeeting?.participants.findIndex(
                    (p) => p.id === segment.speakerId
                  ) ?? 0;
                  const shades = ["#71717a", "#a1a1aa", "#52525b", "#d4d4d8", "#3f3f46"];
                  const shade = shades[speakerIdx % shades.length];
                  return (
                    <div
                      key={segment.id}
                      className="absolute top-0 bottom-0"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: shade,
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Dark progress bar: bg-zinc-950 */}
            <div
              className="h-full bg-zinc-950 transition-[width] duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Highlight Markers along the scrubber track — monochrome */}
          {duration > 0 &&
            highlights.map((hl) => {
              const leftPercent = Math.min(100, Math.max(0, (hl.start / duration) * 100));
              const widthPercent = Math.max(
                1,
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
                        "absolute z-20 h-3 -translate-y-1/2 top-1/2 rounded-sm border transition-all hover:h-4 hover:z-30",
                        styleConfig.bg,
                        styleConfig.border
                      )}
                      style={{
                        left: `${leftPercent}%`,
                        width: `${Math.max(widthPercent, 1.2)}%`,
                        minWidth: "8px",
                      }}
                      aria-label={`Jump to highlight: ${hl.title}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="max-w-xs rounded-md border border-zinc-200 bg-white p-2.5 text-zinc-950 shadow-sm"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase",
                          styleConfig.badge
                        )}
                      >
                        {styleConfig.label}
                      </span>
                      <span className="font-mono text-[11px] text-zinc-500">
                        {formatTime(hl.start)} – {formatTime(hl.end)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-zinc-900 line-clamp-2">
                      {hl.title}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-400 mt-1">
                      Click to jump
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

          {/* Rectangular scrubber thumb with soft shadow */}
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-sm border border-zinc-300 bg-white shadow-sm transition-transform",
              isDragging ? "scale-125 border-zinc-950 bg-zinc-950" : "group-hover:scale-110 group-hover:border-zinc-400"
            )}
            style={{ left: `${progressPercent}%` }}
          >
            {/* Center tactile dot */}
            <div className="h-1.5 w-1.5 rounded-xs bg-zinc-400 mx-auto mt-1" />
          </div>
        </div>

        {/* Timestamps and Progress Indicators */}
        <div className="flex items-center justify-between font-mono text-xs text-zinc-500 px-0.5">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-950 font-semibold">
              {formatTime(currentTime)}
            </span>
            <span className="text-zinc-300">/</span>
            <span className="text-zinc-400">{formatTime(duration)}</span>
          </div>

          {highlights.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded-sm border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-600">
                {highlights.length} highlight{highlights.length === 1 ? "" : "s"}
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
