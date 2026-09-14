"use client";

import React, { useState } from "react";
import {
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
        "rounded-xl border border-zinc-200 bg-white p-4 shadow-sm",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Desk Planner Controls (Removed fake live calendar connected badge) */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* 1-Click Global Bot Switch */}
          <button
            type="button"
            onClick={toggleGlobalBot}
            className={cn(
              "flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
              botActive
                ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
            )}
            title="1-Click Bot Switch"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>Bot: {botActive ? "Auto-Join" : "Paused"}</span>
            {botActive ? (
              <Check className="h-3 w-3 stroke-[2.5]" />
            ) : (
              <Pause className="h-3 w-3" />
            )}
          </button>

          {/* Record Now Trigger */}
          <button
            type="button"
            onClick={handleRecordNow}
            className="flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3 py-1.5 font-mono text-[11px] font-medium uppercase tracking-wider text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-xs"
          >
            <Radio className="h-3 w-3 text-zinc-950" />
            <span>Record Now</span>
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
                  "group relative flex min-w-[240px] flex-1 cursor-pointer flex-col justify-between rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 transition-all hover:bg-white hover:border-zinc-300 hover:shadow-xs",
                  isSimulating && "bg-zinc-100/90 border-zinc-300 ring-1 ring-zinc-300"
                )}
              >
                {/* Time & Bot Toggle */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
                    <Clock className="h-3 w-3 text-zinc-400" />
                    <span className="font-medium text-zinc-800">{m.time}</span>
                    <span className="text-zinc-400 font-normal">({m.duration})</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => toggleMeetingBot(m.id, e)}
                    className={cn(
                      "rounded-sm border px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider transition-colors",
                      isBotConfirmed
                        ? "border-zinc-900 bg-zinc-900 text-white hover:bg-zinc-800"
                        : "border-zinc-200 bg-white text-zinc-500 hover:bg-zinc-100"
                    )}
                    title={isBotConfirmed ? "Click to pause bot" : "Click to activate bot"}
                  >
                    {isBotConfirmed ? "Bot On" : "Off"}
                  </button>
                </div>

                {/* Title */}
                <p className="mt-2 line-clamp-1 text-xs font-semibold text-zinc-900 group-hover:text-zinc-950">
                  {m.title}
                </p>

                {/* Platform & Action */}
                <div className="mt-2.5 flex items-center justify-between border-t border-zinc-200/70 pt-2 text-[10px] font-mono">
                  <span className="rounded-sm border border-zinc-200 bg-white px-1.5 py-0.5 text-zinc-600">
                    {m.platform}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-950 transition-colors">
                    <span>Simulate</span>
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
