"use client";

import React, { useState } from "react";
import { Mic, Play } from "lucide-react";
import { MeetingRecorderModal } from "@/components/record/meeting-recorder-modal";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
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

  const [recorderOpen, setRecorderOpen] = useState(false);
  const [recorderTitle, setRecorderTitle] = useState("");
  const [autoSimulate, setAutoSimulate] = useState(false);

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

  const handleRecordNow = () => {
    if (onRecordNow) {
      onRecordNow();
    } else {
      setRecorderTitle("");
      setAutoSimulate(false);
      setRecorderOpen(true);
    }
  };

  return (
    <div className={cn("text-white", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Today</p>
          <h2 className="mt-2 font-display text-2xl font-normal tracking-tight sm:text-3xl">
            {meetings.length} meetings on the calendar
          </h2>
        </div>
        <button type="button" onClick={handleRecordNow} className="cta border border-white bg-white text-black">
          <span className="cta-bg bg-white" />
          <span className="cta-text text-black">Record now</span>
          <span className="cta-circle bg-black text-white">
            <Mic className="h-3.5 w-3.5" />
          </span>
        </button>
      </div>

      <ItemGroup className="mt-8 border-t border-white/15">
        {meetings.map((m, i) => {
          const active = simulatedId === m.id;
          return (
            <React.Fragment key={m.id}>
              <Item
                asChild
                size="sm"
                className={cn(
                  "group cursor-pointer rounded-none px-0 py-5 transition-colors hover:bg-transparent",
                  active && "text-white"
                )}
              >
                <button type="button" onClick={() => handleSimulate(m)} className="w-full text-left">
                  <span className="step-number w-8 shrink-0 self-start pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ItemContent className="gap-1">
                    <ItemTitle className="text-base font-medium text-white sm:text-lg">
                      {m.title}
                    </ItemTitle>
                    <ItemDescription className="text-sm text-white/60">
                      {m.time} · {m.duration} · {m.platform} · {m.attendeesCount} people
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="text-sm font-medium text-white/60 transition-colors group-hover:text-white">
                    <span className="hidden sm:inline">Simulate</span>
                    <Play className="h-4 w-4 fill-current" />
                  </ItemActions>
                </button>
              </Item>
              {i < meetings.length - 1 && <ItemSeparator className="bg-white/15" />}
            </React.Fragment>
          );
        })}
      </ItemGroup>

      <MeetingRecorderModal
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
        initialTitle={recorderTitle}
        autoStartSimulation={autoSimulate}
      />
    </div>
  );
}
