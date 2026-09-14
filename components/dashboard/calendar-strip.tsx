"use client";

import React, { useState } from "react";
import {
  Clock,
  PlayCircle,
  Mic,
  Calendar,
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
        "rounded-2xl border border-[#E4E4E7] bg-white p-5 shadow-xs",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 font-mono">
        {/* Left: Desk Planner Controls */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2 rounded-xl border border-[#E4E4E7] bg-[#F4F4F5]/70 px-3.5 py-2 text-xs text-[#0B0B0B]">
            <Calendar className="h-3.5 w-3.5 text-[#737373]" />
            <span className="font-medium uppercase tracking-wider text-[11px]">Daily Agenda</span>
          </div>

          {/* Record Now Trigger */}
          <button
            type="button"
            onClick={handleRecordNow}
            className="flex items-center gap-2 rounded-xl bg-[#0B0B0B] px-3.5 py-2 text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
          >
            <Mic className="h-3.5 w-3.5 text-white" />
            <span>Record Session</span>
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
                  "group relative flex min-w-[240px] flex-1 cursor-pointer flex-col justify-between rounded-xl border border-[#E4E4E7] bg-[#FAFAFA] p-3.5 transition-all hover:bg-white hover:border-[#0B0B0B]/40 hover:shadow-xs",
                  isSimulating && "bg-white border-[#0B0B0B]"
                )}
              >
                {/* Time & Platform */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#737373]">
                    <Clock className="h-3 w-3 text-[#A1A1AA]" />
                    <span className="font-medium text-[#0B0B0B]">{m.time}</span>
                    <span className="text-[#A1A1AA]">({m.duration})</span>
                  </div>

                  <span className="rounded-lg border border-[#E4E4E7] bg-white px-2 py-0.5 text-[10px] text-[#737373] uppercase tracking-wide">
                    {m.platform}
                  </span>
                </div>

                {/* Title */}
                <p className="mt-2.5 line-clamp-1 text-xs font-semibold text-[#0B0B0B] group-hover:text-black">
                  {m.title}
                </p>

                {/* Platform & Action */}
                <div className="mt-3 flex items-center justify-between border-t border-[#E4E4E7]/60 pt-2 text-[10px]">
                  <span className="text-[#737373]">
                    {m.attendeesCount} participants
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#737373] group-hover:text-[#0B0B0B] transition-colors">
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
