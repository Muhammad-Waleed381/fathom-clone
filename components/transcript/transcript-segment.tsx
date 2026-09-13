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
    const speakerColor = speaker?.color || "#FEF08A";
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
          "relative rounded-lg p-3.5 transition-colors duration-150 border-2 text-left",
          isActiveSegment
            ? "bg-[#FEF08A]/15 border-black shadow-neo-sm"
            : "bg-white border-black/20 hover:border-black",
          className
        )}
      >
        {/* Left Color Indicator Accent */}
        <div
          className={cn(
            "absolute left-0 top-3 bottom-3 w-1.5 rounded-r border-r border-y border-black transition-all",
            isActiveSegment ? "opacity-100" : "opacity-60"
          )}
          style={{ backgroundColor: speakerColor }}
        />

        {/* Header: Speaker Avatar, Name, Role tag, and Seekable Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-2 pl-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar className="h-7 w-7 border-2 border-black rounded-full shadow-neo-sm shrink-0">
              {speaker?.avatarUrl && (
                <AvatarImage src={speaker.avatarUrl} alt={speakerName} />
              )}
              <AvatarFallback
                style={{ backgroundColor: speakerColor }}
                className="font-mono text-[10px] font-black text-black"
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <span className="truncate font-bold text-xs text-black">
                {speakerName}
              </span>
              {speaker?.role && (
                <span className="inline-flex items-center rounded border border-black bg-[#DDD6FE] px-1.5 py-0.2 font-mono text-[10px] font-bold text-black shadow-neo-sm truncate max-w-[140px]">
                  {speaker.role}
                </span>
              )}
            </div>
          </div>

          {/* Timestamp seeking badge */}
          <button
            type="button"
            onClick={() => onTimestampClick(segment.start)}
            className="flex items-center gap-1 font-mono text-xs font-bold text-black bg-white hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm px-2 py-0.5 rounded border border-black shadow-neo-sm transition-all shrink-0 cursor-pointer"
            title={`Jump to ${formatTime(segment.start)}`}
          >
            <Clock className="w-3 h-3 text-black" />
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
                    "inline-block rounded-xs mx-0.5 transition-colors duration-75 cursor-pointer",
                    isWordActive
                      ? "bg-[#FEF08A] text-black font-bold ring-1 ring-black px-1 rounded-xs"
                      : "text-zinc-800 hover:text-black hover:bg-zinc-100 px-0.5"
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
              className="text-zinc-800 hover:text-black cursor-pointer"
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
