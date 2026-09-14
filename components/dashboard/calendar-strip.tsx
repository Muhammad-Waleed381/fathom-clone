"use client";

import React, { useState } from "react";
import {
  Clock,
  PlayCircle,
  Mic,
  Calendar,
  ChevronRight,
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
}

const UPCOMING_MEETINGS: UpcomingMeeting[] = [
  {
    id: "cal-1",
    time: "10:00 AM",
    duration: "45m",
    title: "Sprint Architecture & Database Sharding Review",
    platform: "Google Meet",
    attendeesCount: 6,
  },
  {
    id: "cal-2",
    time: "1:30 PM",
    duration: "30m",
    title: "Customer Advisory Board <> Enterprise Scaling",
    platform: "Zoom",
    attendeesCount: 8,
  },
  {
    id: "cal-3",
    time: "4:00 PM",
    duration: "30m",
    title: "Weekly 1-on-1: Career Growth & Engineering Goals",
    platform: "Teams",
    attendeesCount: 2,
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
  const [meetings] = useState<UpcomingMeeting[]>(UPCOMING_MEETINGS);
  const [simulatedId, setSimulatedId] = useState<string | null>(null);

  // In-Browser Recorder Modal state
  const [recorderOpen, setRecorderOpen] = useState<boolean>(false);
  const [recorderTitle, setRecorderTitle] = useState<string>("");
  const [autoSimulate, setAutoSimulate] = useState<boolean>(false);

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
        "rounded-3xl border border-white/15 bg-black/45 p-5 sm:p-6 backdrop-blur-xl shadow-[0_10px_34px_rgba(0,0,0,0.5)] text-white font-sans",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        {/* Left: Desk Planner Controls */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs text-white">
            <Calendar className="h-3.5 w-3.5 text-white/70" />
            <span className="font-mono text-[11px] uppercase tracking-wider">Daily Agenda</span>
          </div>

          {/* Record Now Trigger (.cta style) */}
          <button
            type="button"
            onClick={handleRecordNow}
            className="cta"
          >
            <span className="cta-bg bg-white"></span>
            <span className="cta-text text-black">Record session</span>
            <span className="cta-circle bg-black text-white ring-1 ring-white/60">
              <Mic className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>

        {/* Right: Editorial Desk Agenda Meetings */}
        <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          {meetings.map((m) => {
            const isSimulating = simulatedId === m.id;

            return (
              <div
                key={m.id}
                onClick={() => handleSimulate(m)}
                className={cn(
                  "group relative flex min-w-[250px] flex-1 cursor-pointer flex-col justify-between rounded-2xl border border-white/15 bg-white/5 p-4 transition-all duration-500 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)]",
                  isSimulating && "bg-white text-black border-white"
                )}
              >
                {/* Time & Platform */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/70 group-hover:text-black/70 transition-colors">
                    <Clock className="h-3 w-3 text-white/50 group-hover:text-black/50" />
                    <span className="font-medium text-white group-hover:text-black">{m.time}</span>
                    <span className="text-white/50 group-hover:text-black/50">({m.duration})</span>
                  </div>

                  <span className="rounded-full border border-white/20 bg-white/10 group-hover:border-black/20 group-hover:bg-black/5 group-hover:text-black/80 px-2.5 py-0.5 font-mono text-[10px] text-white/80 uppercase tracking-wide transition-all">
                    {m.platform}
                  </span>
                </div>

                {/* Title */}
                <p className="mt-3 line-clamp-1 text-xs font-medium text-white group-hover:text-black transition-colors">
                  {m.title}
                </p>

                {/* Platform & Action */}
                <div className="mt-3 flex items-center justify-between border-t border-white/10 group-hover:border-black/10 pt-2.5 text-[10px] font-mono">
                  <span className="text-white/60 group-hover:text-black/60 transition-colors">
                    {m.attendeesCount} participants
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-white/80 group-hover:text-black transition-colors">
                    <span>Simulate</span>
                    <PlayCircle className="h-3.5 w-3.5" />
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
