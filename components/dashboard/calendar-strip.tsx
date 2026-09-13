"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Video,
  Bot,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Zap,
  PlayCircle,
} from "lucide-react";
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
  onSimulateCall?: () => void;
  className?: string;
}

export function CalendarStrip({ onSimulateCall, className }: CalendarStripProps) {
  const [meetings, setMeetings] = useState<UpcomingMeeting[]>(UPCOMING_MEETINGS);
  const [botActive, setBotActive] = useState<boolean>(true);
  const [simulatedId, setSimulatedId] = useState<string | null>(null);

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
      onSimulateCall();
    } else {
      setTimeout(() => {
        setSimulatedId(null);
      }, 2000);
    }
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 backdrop-blur-md transition-all hover:border-slate-700/80",
        className
      )}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Google Calendar Connected Indicator & Bot Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2.5 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-white">
                  Google Calendar
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Connected & Synced
              </p>
            </div>
          </div>

          {/* Bot Status Pill */}
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/60 px-3.5 py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-200">
                  Fathom Notetaker
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "px-1.5 py-0 text-[10px] font-medium transition-colors",
                    botActive
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-700 bg-slate-800 text-slate-400"
                  )}
                >
                  {botActive ? "Active & Auto-Joining" : "Paused"}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">
                Scheduled for {meetings.filter((m) => m.botStatus === "confirmed").length} calls today
              </p>
            </div>
          </div>
        </div>

        {/* Center/Right: Quick Interactive Schedule Strip */}
        <div className="flex flex-1 items-center gap-2.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-thin">
          {meetings.map((m) => {
            const isSimulating = simulatedId === m.id;
            return (
              <div
                key={m.id}
                onClick={() => handleSimulate(m)}
                className={cn(
                  "group relative flex min-w-[240px] flex-1 cursor-pointer flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-950/70 p-3 transition-all hover:border-slate-700 hover:bg-slate-950 hover:shadow-md",
                  isSimulating && "ring-1 ring-primary border-primary/50"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                    <Clock className="h-3 w-3 text-indigo-400" />
                    <span className="text-slate-200 font-semibold">{m.time}</span>
                    <span className="text-slate-500">({m.duration})</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleMeetingBot(m.id, e)}
                    className="transition-transform active:scale-90"
                    title={m.botStatus === "confirmed" ? "Click to pause bot" : "Click to enable bot"}
                  >
                    <Badge
                      variant="outline"
                      className={cn(
                        "gap-1 px-1.5 py-0 text-[10px] cursor-pointer transition-all",
                        m.botStatus === "confirmed"
                          ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                          : "border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      )}
                    >
                      <Bot className="h-2.5 w-2.5" />
                      <span>{m.botStatus === "confirmed" ? "Bot Scheduled" : "Paused"}</span>
                    </Badge>
                  </button>
                </div>

                <p className="mt-1.5 line-clamp-1 text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {m.title}
                </p>

                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] text-slate-300 border border-slate-800">
                    {m.platform}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-primary transition-colors">
                    <span>Simulate</span>
                    <PlayCircle className="h-3 w-3" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
