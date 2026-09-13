"use client";

import React from "react";
import Link from "next/link";
import { ActionItem, Speaker } from "@/types/meeting";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "@/components/player/video-scrubber";
import confetti from "canvas-confetti";
import {
  Video,
  Play,
  Calendar,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Inbox,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnrichedActionItem extends ActionItem {
  meetingId: string;
  meetingTitle: string;
  meetingDate?: string;
  assignee?: Speaker;
}

export interface ActionsTableProps {
  items: EnrichedActionItem[];
  onToggle: (meetingId: string, itemId: string, completed: boolean) => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

const PRIORITY_BADGES: Record<
  "high" | "medium" | "low",
  { bg: string; label: string }
> = {
  high: {
    bg: "bg-[#FECDD3] text-black border-2 border-black",
    label: "HIGH",
  },
  medium: {
    bg: "bg-[#FEF08A] text-black border-2 border-black",
    label: "MED",
  },
  low: {
    bg: "bg-[#BAE6FD] text-black border-2 border-black",
    label: "LOW",
  },
};

export function ActionsTable({
  items,
  onToggle,
  onResetFilters,
  hasActiveFilters = false,
}: ActionsTableProps) {
  const handleToggle = (item: EnrichedActionItem) => {
    const nextCompleted = !item.completed;
    onToggle(item.meetingId, item.id, nextCompleted);

    // If item is being marked as complete, celebrate with confetti burst!
    if (nextCompleted && typeof window !== "undefined") {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ["#FEF08A", "#A7F3D0", "#DDD6FE", "#000000", "#FECDD3"],
        });
      } catch {
        // Graceful fallback
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-black bg-white py-16 px-4 text-center shadow-[4px_4px_0px_0px_#000]">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-black bg-[#FEF08A] mb-4 shadow-neo-sm">
          {hasActiveFilters ? (
            <Inbox className="h-6 w-6 text-black stroke-[2.5]" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-black stroke-[2.5]" />
          )}
        </div>
        <h3 className="font-mono text-base font-black uppercase text-black">
          {hasActiveFilters
            ? "No matching action items"
            : "All action items completed"}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs font-sans text-neutral-600 font-medium">
          {hasActiveFilters
            ? "No tasks match your current filter parameters. Adjust or clear filters to view items."
            : "Zero pending action items across workspace meetings. High team velocity achieved."}
        </p>
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>RESET ALL FILTERS</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="rounded-xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] overflow-hidden">
        {/* Table / List Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 py-3 border-b-2 border-black bg-[#FAF8F5] font-mono text-xs font-black text-black uppercase tracking-wider">
          <div className="col-span-5 flex items-center gap-2">
            <span>ACTION ITEM</span>
          </div>
          <div className="col-span-3">MEETING SOURCE</div>
          <div className="col-span-2">ASSIGNEE</div>
          <div className="col-span-1">PRIORITY</div>
          <div className="col-span-1 text-right">DUE DATE</div>
        </div>

        {/* Rows */}
        <div className="divide-y-2 divide-black">
          {items.map((item) => {
            const priorityConfig = item.priority
              ? PRIORITY_BADGES[item.priority]
              : null;

            return (
              <div
                key={`${item.meetingId}-${item.id}`}
                className={cn(
                  "group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center px-4 py-3.5 transition-colors hover:bg-[#FEF08A]/15",
                  item.completed && "bg-[#FAF8F5]/80"
                )}
              >
                {/* Checkbox & Action Item Text */}
                <div className="col-span-5 flex items-start gap-3 min-w-0">
                  <div className="pt-0.5 shrink-0">
                    <Checkbox
                      id={`check-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() => handleToggle(item)}
                      className={cn(
                        "h-5 w-5 rounded-none border-2 border-black shadow-neo-sm data-[state=checked]:bg-black data-[state=checked]:text-white transition-all cursor-pointer",
                        item.completed && "bg-black text-white"
                      )}
                      aria-label={`Mark task as ${item.completed ? "pending" : "completed"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <label
                      htmlFor={`check-${item.id}`}
                      className={cn(
                        "font-sans text-xs sm:text-sm font-bold leading-snug cursor-pointer select-none transition-colors",
                        item.completed
                          ? "line-through text-neutral-400 decoration-black decoration-2"
                          : "text-black"
                      )}
                    >
                      {item.text}
                    </label>

                    {/* Mobile-only badges row */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 lg:hidden">
                      {priorityConfig && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 font-mono text-[10px] font-black uppercase rounded shadow-neo-sm",
                            priorityConfig.bg
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                      )}
                      {item.timestamp !== undefined && (
                        <Link
                          href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                          className="inline-flex items-center gap-1 rounded border border-black bg-[#FEF08A] px-1.5 py-0.5 font-mono text-[10px] font-bold text-black shadow-neo-sm hover:bg-black hover:text-white transition-all"
                        >
                          <Play className="h-2 w-2 fill-current" />
                          <span>{formatTime(item.timestamp)}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meeting Source Badge & Clickable Deep-link Timestamp */}
                <div className="col-span-3 flex flex-wrap items-center gap-2 min-w-0">
                  <Link
                    href={`/meetings/${item.meetingId}${
                      item.timestamp !== undefined ? `?t=${item.timestamp}` : ""
                    }`}
                    className="group/link inline-flex items-center gap-1.5 max-w-full rounded-md border-2 border-black bg-white px-2.5 py-1 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#BAE6FD] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title={`Open meeting: ${item.meetingTitle}`}
                  >
                    <Video className="h-3 w-3 stroke-[2.5] text-black shrink-0" />
                    <span className="truncate font-sans font-bold">{item.meetingTitle}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-60 shrink-0 group-hover/link:opacity-100" />
                  </Link>

                  {/* Timestamp deep link tag */}
                  {item.timestamp !== undefined && (
                    <Link
                      href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                      className="hidden sm:inline-flex items-center gap-1 rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-xs font-black text-black shadow-neo-sm hover:bg-black hover:text-white hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      title={`Jump directly to ${formatTime(item.timestamp)} in call`}
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>{formatTime(item.timestamp)}</span>
                    </Link>
                  )}
                </div>

                {/* Assignee Avatar with Role Tooltip */}
                <div className="col-span-2 flex items-center min-w-0">
                  {item.assignee ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-2 cursor-pointer group/user max-w-full">
                          <Avatar className="h-6 w-6 border-2 border-black shadow-neo-sm shrink-0 transition-transform group-hover/user:scale-110">
                            {item.assignee.avatarUrl && (
                              <AvatarImage
                                src={item.assignee.avatarUrl}
                                alt={item.assignee.name}
                              />
                            )}
                            <AvatarFallback
                              style={{
                                backgroundColor: item.assignee.color || "#DDD6FE",
                              }}
                              className="font-mono text-[9px] font-black text-black"
                            >
                              {getInitials(item.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-sans text-xs font-bold text-black group-hover/user:underline">
                              {item.assignee.name}
                            </span>
                            {item.assignee.role && (
                              <span className="truncate font-mono text-[9px] font-semibold uppercase text-neutral-600">
                                {item.assignee.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border-2 border-black bg-white p-2.5 text-black shadow-neo max-w-xs"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-sans font-bold text-xs text-black">
                            {item.assignee.name}
                          </p>
                          {item.assignee.role && (
                            <p className="font-mono text-[10px] font-semibold text-neutral-600 uppercase">
                              {item.assignee.role}
                            </p>
                          )}
                          {item.assignee.company && (
                            <p className="font-sans text-[10px] text-neutral-500">
                              {item.assignee.company}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex items-center gap-1.5 text-neutral-500 font-mono text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-black bg-[#FAF8F5]">
                        <User className="h-3 w-3 text-black stroke-[2]" />
                      </div>
                      <span className="text-[11px] font-bold uppercase">Unassigned</span>
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="col-span-1 hidden lg:flex items-center">
                  {priorityConfig ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase shadow-neo-sm",
                        priorityConfig.bg
                      )}
                    >
                      {priorityConfig.label}
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-bold text-neutral-400">—</span>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-1 hidden lg:flex items-center justify-end">
                  {item.dueDate ? (
                    <div
                      className="flex items-center gap-1 font-mono text-xs font-bold text-neutral-800"
                      title={`Due Date: ${item.dueDate}`}
                    >
                      <Calendar className="h-3 w-3 stroke-[2.5]" />
                      <span>{item.dueDate}</span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs font-bold text-neutral-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
