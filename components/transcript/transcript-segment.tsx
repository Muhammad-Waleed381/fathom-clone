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
    const speakerColor = speaker?.color || "#E4E4E7";
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
          "relative rounded-xl p-3.5 transition-colors duration-150 border text-left",
          isActiveSegment
            ? "bg-amber-50/60 border-amber-200 shadow-sm"
            : "bg-white border-zinc-200 hover:border-zinc-300",
          className
        )}
      >
        {/* Left Color Indicator Accent */}
        <div
          className={cn(
            "absolute left-0 top-3 bottom-3 w-1 rounded-r transition-all",
            isActiveSegment ? "opacity-100" : "opacity-40"
          )}
          style={{ backgroundColor: speakerColor }}
        />

        {/* Header: Speaker Avatar, Name, Role tag, and Seekable Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2 pl-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-7 w-7 border border-zinc-200 rounded-md shrink-0">
              {speaker?.avatarUrl && (
                <AvatarImage src={speaker.avatarUrl} alt={speakerName} />
              )}
              <AvatarFallback
                style={{ backgroundColor: speakerColor }}
                className="font-mono text-[10px] font-semibold text-zinc-950 rounded-md"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="truncate font-semibold text-xs text-zinc-950">
                {speakerName}
              </span>
              {speaker?.role && (
                <span className="inline-flex items-center rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-600 truncate max-w-[140px]">
                  {speaker.role}
                </span>
              )}
            </div>
          </div>

          {/* Monospace timestamp badge — click to seek */}
          <button
            type="button"
            onClick={() => onTimestampClick(segment.start)}
            className="flex items-center gap-1 font-mono text-xs font-medium text-zinc-600 bg-zinc-50 hover:bg-zinc-100 hover:text-zinc-950 px-2 py-0.5 rounded-md border border-zinc-200 transition-colors shrink-0 cursor-pointer"
            title={`Jump to ${formatTime(segment.start)}`}
          >
            <Clock className="w-3 h-3" />
            <span>{formatTime(segment.start)}</span>
          </button>
        </div>

        {/* Word-by-word interactive spans */}
        <div className="pl-2 text-sm leading-relaxed tracking-normal select-text font-sans">
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
                    "inline-block mx-0.5 transition-colors duration-75 cursor-pointer",
                    isWordActive
                      ? "bg-amber-100 text-zinc-950 font-medium px-1 rounded-sm"
                      : "text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 px-0.5 rounded-sm"
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
              className="text-zinc-700 hover:text-zinc-950 cursor-pointer"
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
