"use client";

import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { Speaker } from "@/types/meeting";
import { cn } from "@/lib/utils";
import { formatTime } from "./video-scrubber";
import { Mic, X, Users, Filter } from "lucide-react";

export interface SpeakerPresenceBarProps {
  speakers?: Speaker[];
  activeSpeakerFilter?: string | null;
  onSelectSpeaker?: (speakerId: string | null) => void;
  className?: string;
}

// Monochrome zinc shades for speaker differentiation
const MONO_PALETTE = [
 "#09090b", // zinc-950
 "#27272a", // zinc-800
 "#52525b", // zinc-600
 "#71717a", // zinc-500
 "#a1a1aa", // zinc-400
 "#d4d4d8", // zinc-300
 "#3f3f46", // zinc-700
 "#18181b", // zinc-900
];

export function SpeakerPresenceBar({
  speakers: propSpeakers,
  activeSpeakerFilter: propFilter,
  onSelectSpeaker: propOnSelect,
  className,
}: SpeakerPresenceBarProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const storeFilter = useMeetingStore((s) => s.activeSpeakerFilter);
  const storeSetFilter = useMeetingStore((s) => s.setActiveSpeakerFilter);

  const speakers = propSpeakers || currentMeeting?.participants || [];
  const activeSpeakerFilter =
    propFilter !== undefined ? propFilter : storeFilter;
  const setSpeakerFilter = propOnSelect || storeSetFilter;

  // Calculate talk-time metrics per speaker
  const { speakerStats, totalSpokenSeconds, currentActiveSpeakerId } =
    useMemo(() => {
      const stats: Record<
        string,
        {
          totalSeconds: number;
          percentage: number;
          segmentCount: number;
          monoColor: string;
        }
      > = {};

      speakers.forEach((s, idx) => {
        stats[s.id] = {
          totalSeconds: 0,
          percentage: 0,
          segmentCount: 0,
          monoColor: MONO_PALETTE[idx % MONO_PALETTE.length],
        };
      });

      let totalSpoken = 0;
      let activeId: string | null = null;

      if (currentMeeting?.transcript) {
        for (const seg of currentMeeting.transcript) {
          const segDuration = Math.max(0, seg.end - seg.start);
          totalSpoken += segDuration;

          if (!stats[seg.speakerId]) {
            const idx = Object.keys(stats).length;
            stats[seg.speakerId] = {
              totalSeconds: 0,
              percentage: 0,
              segmentCount: 0,
              monoColor: MONO_PALETTE[idx % MONO_PALETTE.length],
            };
          }
          stats[seg.speakerId].totalSeconds += segDuration;
          stats[seg.speakerId].segmentCount += 1;

          if (seg.start <= currentTime && currentTime <= seg.end) {
            activeId = seg.speakerId;
          }
        }

        // Calculate percentages
        if (totalSpoken > 0) {
          speakers.forEach((s) => {
            const spkSecs = stats[s.id]?.totalSeconds || 0;
            stats[s.id].percentage = Math.round((spkSecs / totalSpoken) * 100);
          });
        }
      }

      return {
        speakerStats: stats,
        totalSpokenSeconds: totalSpoken,
        currentActiveSpeakerId: activeId,
      };
    }, [speakers, currentMeeting, currentTime]);

  const activeFilteredSpeaker = useMemo(() => {
    if (!activeSpeakerFilter) return null;
    return speakers.find((s) => s.id === activeSpeakerFilter) || null;
  }, [activeSpeakerFilter, speakers]);

  const handleSpeakerClick = (speakerId: string) => {
    if (activeSpeakerFilter === speakerId) {
      setSpeakerFilter(null);
    } else {
      setSpeakerFilter(speakerId);
    }
  };

  if (speakers.length === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn(
 "w-full rounded-2xl border border-white/15 bg-surface-raised p-4 space-y-3.5  text-white",
          className
        )}
      >
        {/* Presence Header & Active Filter Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[13px] font-medium text-white">
              <Users className="w-3.5 h-3.5 text-white/60" />
              <span>Talk Time Distribution</span>
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-white/60">
              {speakers.length} speakers
            </span>
          </div>

          {activeFilteredSpeaker && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95">
              <span className="text-[11px] font-medium text-white flex items-center gap-1 border border-white/20 bg-white/10 px-2 py-0.5 rounded-full">
                <Filter className="w-3 h-3 text-white/60" />
                <span>{activeFilteredSpeaker.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setSpeakerFilter(null)}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-white/15 bg-white/5 text-white/80 text-[10px] font-medium hover:bg-white hover:text-black transition-all"
                title="Clear speaker filter"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Monochrome Talk Time Distribution Meter */}
        {totalSpokenSeconds > 0 && (
          <div className="relative flex h-2 w-full overflow-hidden rounded-xl border border-white/15 bg-white/10">
            {speakers.map((speaker) => {
              const stats = speakerStats[speaker.id];
              const pct = stats?.percentage || 0;
              if (pct === 0) return null;
              const isSelected = activeSpeakerFilter === speaker.id;
              const isOtherSelected = activeSpeakerFilter && !isSelected;

              return (
                <Tooltip key={`bar-${speaker.id}`}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={() => handleSpeakerClick(speaker.id)}
                      className={cn(
 "h-full transition-all focus:outline-none border-r border-black/40 last:border-r-0 cursor-pointer",
                        isOtherSelected ? "opacity-30 hover:opacity-60" : "opacity-100 hover:brightness-110",
                        isSelected && "ring-1 ring-inset ring-white"
                      )}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: stats?.monoColor || "#71717a",
                      }}
                      aria-label={`${speaker.name}: ${pct}%`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="rounded-2xl border border-white/15 bg-black/95 p-2.5 text-white"
                  >
                    <p className="font-semibold text-xs text-white">{speaker.name}</p>
                    <p className="text-[11px] text-white/60">
                      {pct}% · {formatTime(stats?.totalSeconds || 0)}
                    </p>
                    <p className="text-[10px] text-white/40 mt-1">
                      {isSelected ? "Click to clear isolation" : "Click to isolate speaker"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* 1-Click Speaker Isolation Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {speakers.map((speaker) => {
            const stats = speakerStats[speaker.id] || {
              totalSeconds: 0,
              percentage: 0,
              monoColor: "#71717a",
            };
            const isSpeakingNow = currentActiveSpeakerId === speaker.id;
            const isFiltered = activeSpeakerFilter === speaker.id;
            const isDimmed = activeSpeakerFilter !== null && !isFiltered;

            const initials = speaker.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <Tooltip key={speaker.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleSpeakerClick(speaker.id)}
                    className={cn(
 "group relative flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs transition-all duration-150 text-left select-none",
                      isFiltered
                        ? "border-white bg-white text-black shadow-md font-semibold"
                        : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10",
                      isDimmed && "opacity-40 hover:opacity-80",
                      isSpeakingNow && !isFiltered && "border-white/40 bg-white/10 ring-1 ring-white/20"
                    )}
                  >
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <Avatar className="h-5 w-5 rounded-full border border-white/15">
                        {speaker.avatarUrl && (
                          <AvatarImage
                            src={speaker.avatarUrl}
                            alt={speaker.name}
                          />
                        )}
                        <AvatarFallback
                          className={cn(
 "rounded-full text-[9px] font-medium",
                            isFiltered
                              ? "bg-black text-white"
                              : "bg-white/10 text-white"
                          )}
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    {/* Speaker name */}
                    <span className="truncate font-medium text-xs max-w-[90px] sm:max-w-[120px]">
                      {speaker.name}
                    </span>

                    {/* Mic icon if currently active */}
                    {isSpeakingNow && (
                      <Mic className={cn("w-3 h-3 shrink-0", isFiltered ? "text-black" : "text-white")} />
                    )}

                    {/* Talk Time Percentage Badge */}
                    <span
                      className={cn(
 "ml-auto rounded-xl border px-1.5 py-0.5 text-[10px] font-medium shrink-0",
                        isFiltered
                          ? "border-black/20 bg-black/10 text-black font-semibold"
                          : "border-white/15 bg-white/5 text-white/70"
                      )}
                    >
                      {stats.percentage}%
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  className="rounded-2xl border border-white/15 bg-black/95 p-3 text-white text-xs"
                >
                  <p className="font-semibold text-xs text-white">{speaker.name}</p>
                  <p className="text-[11px] text-white/60">
                    {speaker.role || "Participant"}
                    {speaker.company ? ` · ${speaker.company}` : ""}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-4 border-t border-white/10 pt-1 text-[11px]">
                    <span className="text-white/60">Talk time: {formatTime(stats.totalSeconds)}</span>
                    <span className="font-semibold text-white">{stats.percentage}%</span>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">
                    {isFiltered
                      ? "Click to clear filter"
                      : "Click to isolate speaker in transcript"}
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
