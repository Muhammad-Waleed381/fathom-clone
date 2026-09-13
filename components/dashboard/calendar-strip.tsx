"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Bot,
  PlayCircle,
  Radio,
  Check,
  Pause,
} from "lucide-react";
import { MeetingRecorderModal } from "@/components/record/meeting-recorder-modal";
import { cn } from "@/lib/utils";

export interface UpcomingMeeting {
  id: string;
  time: string;
  duration: string;
  title: string;
  platform: "Zoom" | "Google Meet" | "Teams";
  attendeesCount: number;
  botStatus: "confirmed" | "joining" | "paused";
}

const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  {
    id: "cal-1",
    time: "10:00 AM",
    duration: "45m",
    title: "Sprint Architecture & Database Sharding Review",
    platform: "Google Meet",
    attendeesCount: 6,
    botStatus: "confirmed",
  },
  {
    id: "cal-2",
    time: "1:30 PM",
    duration: "30m",
    title: "Customer Advisory Board <> Enterprise Scaling",
    platform: "Zoom",
    attendeesCount: 8,
    botStatus: "confirmed",
  },
  {
    id: "cal-3",
    time: "4:00 PM",
    duration: "30m",
    title: "Weekly 1-on-1: Career Growth & Engineering Goals",
    platform: "Teams",
    attendeesCount: 2,
    botStatus: "confirmed",
  },
];

export interface CalendarStripProps {
  onSimulateCall?: (meeting?: UpcomingMeeting) => void;
  onRecordNow?: () => void;
  className?: string;
}

export function CalendarStrip({
  onSimulateCall,
  onRecordNow,
  className,
}: CalendarStripProps) {
  const [meetings, setMeetings] = useState<UpcomingMeeting[]>(UPCOMING_MEETINGS);
  const [botActive, setBotActive] = useState<boolean>(true);
  const [simulatedId, setSimulatedId] = useState<string | null>(null);

  // In-Browser Recorder Modal state
  const [recorderOpen, setRecorderOpen] = useState<boolean>(false);
  const [recorderTitle, setRecorderTitle] = useState<string>("");
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);

  const toggleGlobalBot = () => {
    setBotActive((prev) => {
      const next = !prev;
      setMeetings((current) =>
        current.map((m) => ({
          ...m,
          botStatus: next ? "confirmed" : "paused",
        }))
      );
      return next;
    });
  };

  const toggleMeetingBot = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMeetings((prev) =>
      prev.map((m) => {
        if (m.id !== id) return m;
        const nextStatus = m.botStatus === "confirmed" ? "paused" : "confirmed";
        return { ...m, botStatus: nextStatus };
      })
    );
  };

  const handleSimulate = (m: UpcomingMeeting) => {
    setSimulatedId(m.id);
    if (onSimulateCall) {
      onSimulateCall(m);
    } else {
      setRecorderTitle(m.title);
      setAutoSimulate(true);
      setRecorderOpen(true);
    }
  };

  const handleRecordNow = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (onRecordNow) {
      onRecordNow();
    } else {
      setRecorderTitle("");
      setAutoSimulate(false);
      setRecorderOpen(true);
    }
  };

  return (
    <div
      className={cn(
        "rounded-lg border-2 border-black bg-white p-3.5 sm:p-4 shadow-neo",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Desk Planner Controls */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Google Calendar Connected Badge */}
          <div className="flex items-center gap-2 rounded-md border-2 border-black bg-white px-3 py-1.5 shadow-neo-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px] font-black uppercase tracking-wider text-black">
              CALENDAR CONNECTED
            </span>
          </div>

          {/* 1-Click Global Bot Switch */}
          <button
            type="button"
            onClick={toggleGlobalBot}
            className={cn(
              "flex items-center gap-2 rounded-md border-2 border-black px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0",
              botActive
                ? "bg-[#A7F3D0] text-black hover:bg-[#86efac]"
                : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
            )}
            title="1-Click Bot Switch"
          >
            <Bot className="h-3.5 w-3.5 text-black" />
            <span>BOT: {botActive ? "AUTO-JOIN ON" : "PAUSED"}</span>
            {botActive ? (
              <Check className="h-3 w-3 stroke-[3]" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>

          {/* Record Now Trigger */}
          <button
            type="button"
            onClick={handleRecordNow}
            className="flex items-center gap-2 rounded-md border-2 border-black bg-black px-3 py-1.5 font-mono text-[11px] font-black uppercase tracking-wider text-white shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-neutral-900 active:translate-x-0 active:translate-y-0"
          >
            <Radio className="h-3 w-3 text-red-400 animate-pulse" />
            <span>RECORD NOW</span>
          </button>
        </div>

        {/* Right: Editorial Desk Agenda Meetings */}
        <div className="flex flex-1 items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {meetings.map((m) => {
            const isSimulating = simulatedId === m.id;
            const isBotConfirmed = m.botStatus === "confirmed";

            return (
              <div
                key={m.id}
                onClick={() => handleSimulate(m)}
                className={cn(
                  "group relative flex min-w-[250px] flex-1 cursor-pointer flex-col justify-between rounded-md border-2 border-black bg-[#FAF8F5] p-2.5 transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-white hover:shadow-neo-sm active:translate-x-0 active:translate-y-0",
                  isSimulating && "bg-[#FEF08A] hover:bg-[#FEF08A]"
                )}
              >
                {/* Time & Bot Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-black">
                    <Clock className="h-3 w-3" />
                    <span>{m.time}</span>
                    <span className="text-neutral-500 font-normal">({m.duration})</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleMeetingBot(m.id, e)}
                    className={cn(
                      "rounded border border-black px-1.5 py-0.2 font-mono text-[10px] font-black uppercase tracking-wider transition-all",
                      isBotConfirmed
                        ? "bg-[#A7F3D0] text-black hover:bg-[#6ee7b7]"
                        : "bg-neutral-200 text-neutral-600 hover:bg-neutral-300"
                    )}
                    title={isBotConfirmed ? "Click to pause bot" : "Click to activate bot"}
                  >
                    {isBotConfirmed ? "BOT ON" : "OFF"}
                  </button>
                </div>

                {/* Title */}
                <p className="mt-1.5 line-clamp-1 text-xs font-bold text-black group-hover:underline">
                  {m.title}
                </p>

                {/* Platform & Action */}
                <div className="mt-2 flex items-center justify-between border-t border-black/15 pt-1.5 text-[10px] font-mono">
                  <span className="rounded border border-black bg-white px-1.5 py-0.2 font-bold text-black">
                    {m.platform}
                  </span>
                  <div className="flex items-center gap-1 font-bold text-black group-hover:text-black">
                    <span>SIMULATE</span>
                    <PlayCircle className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* In-Browser Meeting Recorder Modal */}
      <MeetingRecorderModal
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
        initialTitle={recorderTitle}
        autoStartSimulation={autoSimulate}
      />
    </div>
  );
}
