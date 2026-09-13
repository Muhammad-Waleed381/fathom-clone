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
    border: "border-black",
    bg: "bg-[#FEF08A]",
    text: "text-black",
    badge: "bg-[#FEF08A] text-black border-black",
    label: "Key Moment",
  },
  decision: {
    border: "border-black",
    bg: "bg-[#A7F3D0]",
    text: "text-black",
    badge: "bg-[#A7F3D0] text-black border-black",
    label: "Decision",
  },
  action: {
    border: "border-black",
    bg: "bg-[#DDD6FE]",
    text: "text-black",
    badge: "bg-[#DDD6FE] text-black border-black",
    label: "Action Item",
  },
  risk: {
    border: "border-black",
    bg: "bg-[#FECDD3]",
    text: "text-black",
    badge: "bg-[#FECDD3] text-black border-black",
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
              className="pointer-events-none absolute -top-8 z-40 -translate-x-1/2 rounded border-2 border-black bg-black px-2 py-0.5 font-mono text-[11px] font-black text-white shadow-neo-sm"
              style={{ left: `${hoverPosition.x}px` }}
            >
              {formatTime(hoverPosition.time)}
            </div>
          )}

          {/* Solid black border track (border-2 border-black bg-zinc-200) */}
          <div className="relative h-3.5 w-full rounded-md border-2 border-black bg-zinc-200 overflow-hidden shadow-neo-sm">
            {/* Underlay: Speaker colored segments tick bar */}
            {showSpeakerSegments && speakerSegments.length > 0 && duration > 0 && (
              <div className="pointer-events-none absolute inset-0 flex opacity-40">
                {speakerSegments.map((segment) => {
                  const left = (segment.start / duration) * 100;
                  const width = Math.max(0.3, ((segment.end - segment.start) / duration) * 100);
                  const speaker = currentMeeting?.participants.find(
                    (p) => p.id === segment.speakerId
                  );
                  return (
                    <div
                      key={segment.id}
                      className="absolute top-0 bottom-0 border-r border-black/20"
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                        backgroundColor: speaker?.color || "#DDD6FE",
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Vibrant electric yellow progress bar (bg-[#FEF08A]) */}
            <div
              className="h-full bg-[#FEF08A] border-r-2 border-black transition-[width] duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Highlight Markers along the scrubber track */}
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
                        "absolute z-20 h-4 -translate-y-1/2 top-1/2 rounded-xs border border-black transition-all hover:h-5 hover:z-30",
                        styleConfig.bg,
                        "shadow-[1px_1px_0px_0px_#000] hover:scale-110"
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
                    className="max-w-xs border-2 border-black bg-white p-2.5 text-black shadow-neo"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "rounded border border-black px-1.5 py-0.2 font-mono text-[10px] font-black uppercase",
                          styleConfig.badge
                        )}
                      >
                        {styleConfig.label}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-neutral-600">
                        {formatTime(hl.start)} – {formatTime(hl.end)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-black line-clamp-2">
                      {hl.title}
                    </p>
                    <p className="text-[10px] font-mono font-bold text-black underline mt-1">
                      Click to jump
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}

          {/* Physical square or pill scrubber thumb with hard shadow */}
          <div
            className={cn(
              "pointer-events-none absolute top-1/2 z-30 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-md border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] transition-transform",
              isDragging ? "scale-125 bg-[#FEF08A]" : "group-hover:scale-110"
            )}
            style={{ left: `${progressPercent}%` }}
          >
            {/* Center tactile dot */}
            <div className="h-1.5 w-1.5 rounded-full bg-black mx-auto mt-1" />
          </div>
        </div>

        {/* Timestamps and Progress Indicators */}
        <div className="flex items-center justify-between font-mono text-xs text-black px-0.5">
          <div className="flex items-center gap-1.5 font-bold">
            <span className="text-black font-black">
              {formatTime(currentTime)}
            </span>
            <span className="text-neutral-400">/</span>
            <span className="text-neutral-600">{formatTime(duration)}</span>
          </div>

          {highlights.length > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center rounded border border-black bg-[#FEF08A] px-1.5 py-0.2 font-mono text-[10px] font-black text-black shadow-neo-sm">
                {highlights.length} HIGHLIGHT{highlights.length === 1 ? "" : "S"}
              </span>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
