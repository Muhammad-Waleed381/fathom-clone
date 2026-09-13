"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TranscriptSegment as ITranscriptSegment, Speaker, TranscriptWord } from "@/types/meeting";
import { cn } from "@/lib/utils";
import { formatTime } from "@/components/player/video-scrubber";
import { Clock } from "lucide-react";

export interface TranscriptSegmentProps {
  segment: ITranscriptSegment;
  speaker?: Speaker;
  currentTime: number;
  isPlaying: boolean;
  isActiveSegment: boolean;
  onWordClick: (word: TranscriptWord) => void;
  onTimestampClick: (time: number) => void;
  className?: string;
}

export const TranscriptSegment = React.forwardRef<HTMLDivElement, TranscriptSegmentProps>(
  (
    {
      segment,
      speaker,
      currentTime,
      isPlaying,
      isActiveSegment,
      onWordClick,
      onTimestampClick,
      className,
    },
    ref
  ) => {
    const speakerName = speaker?.name || "Unknown Speaker";
    const speakerColor = speaker?.color || "#6366F1";
    const initials = speakerName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    return (
      <div
        ref={ref}
        data-segment-id={segment.id}
        data-speaker-id={segment.speakerId}
        className={cn(
          "group relative rounded-xl p-3.5 transition-all duration-200 border text-left",
          isActiveSegment
            ? "bg-slate-900/90 border-indigo-500/60 shadow-[0_0_20px_rgba(99,102,241,0.08)] ring-1 ring-indigo-500/30"
            : "bg-slate-900/30 border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700/60",
          className
        )}
      >
        {/* Left Color Indicator Accent */}
        <div
          className={cn(
            "absolute left-0 top-3 bottom-3 w-1 rounded-r transition-all",
            isActiveSegment ? "opacity-100 scale-y-100" : "opacity-40 group-hover:opacity-80"
          )}
          style={{ backgroundColor: speakerColor }}
        />

        {/* Header: Speaker Avatar, Name, Role, and Seekable Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2 pl-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-7 w-7 border border-slate-700 shrink-0">
              {speaker?.avatarUrl && (
                <AvatarImage src={speaker.avatarUrl} alt={speakerName} />
              )}
              <AvatarFallback
                style={{ backgroundColor: speakerColor }}
                className="text-[10px] font-bold text-white"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-semibold text-slate-100">
                {speakerName}
              </span>
              {speaker?.role && (
                <span className="truncate text-[10px] text-slate-400">
                  {speaker.role} {speaker.company ? `• ${speaker.company}` : ""}
                </span>
              )}
            </div>
          </div>

          {/* Timestamp seeking button */}
          <button
            type="button"
            onClick={() => onTimestampClick(segment.start)}
            className="flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-indigo-300 hover:underline px-2 py-0.5 rounded bg-slate-800/60 border border-slate-700/60 transition-colors shrink-0"
            title={`Jump to ${formatTime(segment.start)}`}
          >
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{formatTime(segment.start)}</span>
          </button>
        </div>

        {/* Word-by-word interactive spans */}
        <div className="pl-2 text-sm leading-relaxed tracking-normal select-text">
          {segment.words && segment.words.length > 0 ? (
            segment.words.map((word, idx) => {
              const isWordActive =
                currentTime >= word.start && currentTime <= word.end;

              return (
                <span
                  key={`${segment.id}-w-${idx}`}
                  data-word-start={word.start}
                  data-word-end={word.end}
                  data-segment-id={segment.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onWordClick(word);
                  }}
                  className={cn(
                    "inline-block rounded px-0.5 mx-0.5 transition-colors duration-100 cursor-pointer",
                    isWordActive
                      ? "bg-indigo-500/35 text-indigo-100 font-semibold shadow-sm ring-1 ring-indigo-400/50 scale-[1.03]"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  )}
                  title={`${formatTime(word.start)} – Click to seek`}
                >
                  {word.text}
                </span>
              );
            })
          ) : (
            // Fallback if words array is empty
            <span
              onClick={() => onTimestampClick(segment.start)}
              className="text-slate-300 hover:text-white cursor-pointer"
            >
              {segment.text}
            </span>
          )}
        </div>
      </div>
    );
  }
);

TranscriptSegment.displayName = "TranscriptSegment";
