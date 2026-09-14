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
 "relative rounded-full p-3.5 transition-colors duration-150 border text-left",
          isActiveSegment
            ? "bg-amber-500/10/60 border-amber-500/30 shadow-sm"
            : "bg-surface-raised border-white/15 hover:border-white/25",
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
            <Avatar className="h-7 w-7 border border-white/15 rounded-md shrink-0">
              {speaker?.avatarUrl && (
                <AvatarImage src={speaker.avatarUrl} alt={speakerName} />
              )}
              <AvatarFallback
                style={{ backgroundColor: speakerColor }}
                className=" text-[10px] font-semibold text-white rounded-md"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="truncate font-semibold text-xs text-white">
                {speakerName}
              </span>
              {speaker?.role && (
                <span className="inline-flex items-center rounded-sm border border-white/15 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-white/70 truncate max-w-[140px]">
                  {speaker.role}
                </span>
              )}
            </div>
          </div>

          {/* Monospace timestamp badge — click to seek */}
          <button
            type="button"
            onClick={() => onTimestampClick(segment.start)}
            className="flex items-center gap-1 text-xs font-medium text-white/70 bg-surface-raised hover:bg-white/10 hover:text-white px-2 py-0.5 rounded-md border border-white/15 transition-colors shrink-0 cursor-pointer"
            title={`Jump to ${formatTime(segment.start)}`}
          >
            <Clock className="tabular-nums w-3 h-3" />
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
                      ? "bg-amber-400/30 text-white font-medium px-1 rounded-sm"
                      : "text-white/80 hover:text-white hover:bg-white/10 px-0.5 rounded-sm"
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
              className="text-white/80 hover:text-white cursor-pointer"
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
