"use client";

import React, { useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
  const activeSpeakerFilter = propFilter !== undefined ? propFilter : storeFilter;
  const setSpeakerFilter = propOnSelect || storeSetFilter;

  // Calculate talk-time metrics per speaker
  const { speakerStats, totalSpokenSeconds, currentActiveSpeakerId } = useMemo(() => {
    const stats: Record<
      string,
      { totalSeconds: number; percentage: number; segmentCount: number }
    > = {};

    speakers.forEach((s) => {
      stats[s.id] = { totalSeconds: 0, percentage: 0, segmentCount: 0 };
    });

    let totalSpoken = 0;
    let activeId: string | null = null;

    if (currentMeeting?.transcript) {
      for (const seg of currentMeeting.transcript) {
        const segDuration = Math.max(0, seg.end - seg.start);
        totalSpoken += segDuration;

        if (!stats[seg.speakerId]) {
          stats[seg.speakerId] = { totalSeconds: 0, percentage: 0, segmentCount: 0 };
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
      <div className={cn("w-full rounded-xl bg-slate-900/60 border border-slate-800/80 p-3 space-y-2.5", className)}>
        {/* Presence Header & Active Filter Bar */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 font-medium text-slate-300">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span>Speakers & Talk Time</span>
            </span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4.5 bg-slate-800 text-slate-300">
              {speakers.length} Participants
            </Badge>
          </div>

          {activeFilteredSpeaker && (
            <div className="flex items-center gap-1.5 animate-in fade-in zoom-in-95">
              <span className="text-[11px] text-indigo-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-indigo-400" />
                Filtered: <strong className="text-white">{activeFilteredSpeaker.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSpeakerFilter(null)}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                title="Clear speaker filter"
              >
                <X className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Talk Time Proportion Distribution Bar */}
        {totalSpokenSeconds > 0 && (
          <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
            {speakers.map((speaker) => {
              const pct = speakerStats[speaker.id]?.percentage || 0;
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
                        "h-full transition-all focus:outline-none",
                        isOtherSelected ? "opacity-30 hover:opacity-75" : "opacity-90 hover:opacity-100",
                        isSelected && "ring-1 ring-white"
                      )}
                      style={{
                        width: `${pct}%`,
                        backgroundColor: speaker.color || "#6366F1",
                      }}
                      aria-label={`${speaker.name}: ${pct}%`}
                    />
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs font-mono bg-slate-900 border-slate-700">
                    {speaker.name}: {pct}% ({formatTime(speakerStats[speaker.id]?.totalSeconds || 0)})
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        )}

        {/* Speaker Chips / Avatars Grid */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          {speakers.map((speaker) => {
            const stats = speakerStats[speaker.id] || { totalSeconds: 0, percentage: 0 };
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
                      "group relative flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all duration-200 border text-left",
                      isFiltered
                        ? "bg-indigo-950/80 border-indigo-500 ring-1 ring-indigo-500 shadow-md text-white"
                        : "bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-850",
                      isDimmed && "opacity-40 hover:opacity-90",
                      isSpeakingNow && !isFiltered && "border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.2)] ring-1 ring-emerald-500/50"
                    )}
                  >
                    {/* Avatar with speaking ring indicator */}
                    <div className="relative shrink-0">
                      <Avatar className="h-6 w-6 border border-slate-700">
                        {speaker.avatarUrl && (
                          <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                        )}
                        <AvatarFallback
                          style={{ backgroundColor: speaker.color }}
                          className="text-[10px] font-bold text-white"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Live Speaking Pulsing Dot */}
                      {isSpeakingNow && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 border border-slate-900" />
                        </span>
                      )}
                    </div>

                    {/* Speaker name */}
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate font-medium text-[11px] max-w-[100px] sm:max-w-[120px]">
                          {speaker.name}
                        </span>
                        {isSpeakingNow && (
                          <Mic className="w-3 h-3 text-emerald-400 animate-pulse shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Talk Time Percentage Pill */}
                    <span
                      className="ml-auto rounded px-1.5 py-0.2 text-[10px] font-mono font-medium shrink-0"
                      style={{
                        backgroundColor: `${speaker.color}20`,
                        color: speaker.color,
                        border: `1px solid ${speaker.color}40`,
                      }}
                    >
                      {stats.percentage}%
                    </span>
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="bottom"
                  className="bg-slate-900 border border-slate-700 text-slate-100 p-2 shadow-xl"
                >
                  <p className="font-semibold text-xs text-white">{speaker.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {speaker.role || "Participant"}
                    {speaker.company ? ` • ${speaker.company}` : ""}
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-4 font-mono text-[10px] text-slate-300 border-t border-slate-800 pt-1">
                    <span>Talk time: {formatTime(stats.totalSeconds)}</span>
                    <span className="text-indigo-400 font-bold">{stats.percentage}%</span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    {isFiltered ? "Click to clear filter" : "Click to filter transcript"}
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
