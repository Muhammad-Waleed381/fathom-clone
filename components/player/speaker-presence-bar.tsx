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
import { Mic, X, Users, Filter, Check } from "lucide-react";

export interface SpeakerPresenceBarProps {
  speakers?: Speaker[];
  activeSpeakerFilter?: string | null;
  onSelectSpeaker?: (speakerId: string | null) => void;
  className?: string;
}

const PASTEL_PALETTE = [
  "#FEF08A", // neo yellow
  "#A7F3D0", // neo mint
  "#DDD6FE", // neo lavender
  "#FED7AA", // neo orange
  "#BAE6FD", // neo sky
  "#FECDD3", // neo pink
  "#E9D5FF", // neo purple
  "#CCFBF1", // neo teal
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
          pastelColor: string;
        }
      > = {};

      speakers.forEach((s, idx) => {
        stats[s.id] = {
          totalSeconds: 0,
          percentage: 0,
          segmentCount: 0,
          pastelColor: PASTEL_PALETTE[idx % PASTEL_PALETTE.length],
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
              pastelColor: PASTEL_PALETTE[idx % PASTEL_PALETTE.length],
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
          "w-full rounded-xl border-2 border-black bg-white p-3.5 space-y-3 shadow-[4px_4px_0px_0px_#000]",
          className
        )}
      >
        {/* Presence Header & Active Filter Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-mono text-xs font-black uppercase tracking-wider text-black">
              <Users className="w-3.5 h-3.5 text-black" />
              <span>Speaker Talk-Time</span>
            </span>
            <span className="rounded border border-black bg-[#FAF8F5] px-1.5 py-0.2 font-mono text-[10px] font-black text-black shadow-neo-sm">
              {speakers.length} SPEAKERS
            </span>
          </div>

          {activeFilteredSpeaker && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95">
              <span className="text-[11px] font-mono font-bold text-black flex items-center gap-1 bg-[#FEF08A] border border-black px-1.5 py-0.5 rounded shadow-neo-sm">
                <Filter className="w-3 h-3 text-black" />
                <span>ISOLATED: {activeFilteredSpeaker.name}</span>
              </span>
              <button
                type="button"
                onClick={() => setSpeakerFilter(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded border-2 border-black bg-black text-white text-[10px] font-black hover:bg-neutral-800 transition-transform active:scale-95 shadow-neo-sm"
                title="Clear speaker filter"
              >
                <X className="w-3 h-3" />
                CLEAR
              </button>
            </div>
          )}
        </div>

        {/* Pastel Color-Blocked Talk Time Distribution Meter */}
        {totalSpokenSeconds > 0 && (
          <div className="relative flex h-3.5 w-full overflow-hidden rounded-md border-2 border-black bg-zinc-200 shadow-neo-sm">
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
                        "h-full transition-all focus:outline-none border-r border-black last:border-r-0 cursor-pointer",
                        isOtherSelected ? "opacity-35 hover:opacity-75" : "opacity-100 hover:brightness-95",
                        isSelected && "ring-2 ring-inset ring-black brightness-105"
                      )}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: stats?.pastelColor || "#DDD6FE",
                      }}
                      aria-label={`${speaker.name}: ${pct}%`}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="border-2 border-black bg-white p-2 text-black shadow-neo"
                  >
                    <p className="font-mono text-xs font-black">{speaker.name}</p>
                    <p className="font-mono text-[11px] text-neutral-600">
                      {pct}% • {formatTime(stats?.totalSeconds || 0)}
                    </p>
                    <p className="text-[10px] font-mono font-bold underline mt-1">
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
              pastelColor: "#FEF08A",
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
                      "group relative flex items-center gap-2 rounded-md border-2 border-black px-2 py-1 text-xs transition-all duration-150 text-left select-none",
                      isFiltered
                        ? "bg-[#FEF08A] ring-2 ring-black shadow-neo text-black font-black -translate-x-0.5 -translate-y-0.5"
                        : "bg-white text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0",
                      isDimmed && "opacity-40 hover:opacity-90",
                      isSpeakingNow && !isFiltered && "bg-[#FAF8F5] border-black ring-2 ring-[#FEF08A]"
                    )}
                  >
                    {/* Avatar with speaking ring indicator */}
                    <div className="relative shrink-0">
                      <Avatar className="h-5 w-5 border border-black shadow-neo-sm">
                        {speaker.avatarUrl && (
                          <AvatarImage
                            src={speaker.avatarUrl}
                            alt={speaker.name}
                          />
                        )}
                        <AvatarFallback
                          style={{ backgroundColor: stats.pastelColor }}
                          className="text-[9px] font-mono font-black text-black"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Live Speaking Pulsing Dot */}
                      {isSpeakingNow && (
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FEF08A] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FEF08A] border border-black" />
                        </span>
                      )}
                    </div>

                    {/* Speaker name */}
                    <span className="truncate font-mono font-bold text-xs max-w-[90px] sm:max-w-[120px]">
                      {speaker.name}
                    </span>

                    {/* Live Mic icon if currently speaking */}
                    {isSpeakingNow && (
                      <Mic className="w-3 h-3 text-black animate-pulse shrink-0" />
                    )}

                    {/* Talk Time Percentage Pill */}
                    <span
                      className="ml-auto rounded border border-black px-1 py-0.2 font-mono text-[10px] font-black shrink-0"
                      style={{
                        backgroundColor: stats.pastelColor,
                        color: "#000",
                      }}
                    >
                      {stats.percentage}%
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  className="border-2 border-black bg-white p-2.5 text-black shadow-neo font-mono text-xs"
                >
                  <p className="font-black text-xs">{speaker.name}</p>
                  <p className="text-[11px] text-neutral-600">
                    {speaker.role || "Participant"}
                    {speaker.company ? ` • ${speaker.company}` : ""}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-4 border-t border-black/20 pt-1 text-[11px]">
                    <span>Talk time: {formatTime(stats.totalSeconds)}</span>
                    <span className="font-black">{stats.percentage}%</span>
                  </div>
                  <p className="text-[10px] font-bold underline mt-1">
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
