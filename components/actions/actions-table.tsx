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
    bg: "border border-red-500/30 bg-red-500/100/10 text-red-300",
    label: "High",
  },
  medium: {
    bg: "border border-amber-500/30 bg-amber-500/10 text-amber-300",
    label: "Medium",
  },
  low: {
    bg: "border border-sky-500/30 bg-sky-500/10 text-sky-300",
    label: "Low",
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
          colors: ["#a1a1aa", "#71717a", "#3f3f46", "#27272a", "#18181b"],
        });
      } catch {
        // Graceful fallback
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-white/15 bg-surface-raised py-16 px-4 text-center ">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/15 bg-surface-raised mb-4">
          {hasActiveFilters ? (
            <Inbox className="h-6 w-6 text-white/45" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-white/45" />
          )}
        </div>
        <h3 className="text-base font-medium text-white">
          {hasActiveFilters
            ? "No matching action items"
            : "All action items completed"}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs font-sans text-white/60 font-medium">
          {hasActiveFilters
            ? "No tasks match your current filter parameters. Adjust or clear filters to view items."
            : "Zero pending action items across workspace meetings. High team velocity achieved."}
        </p>
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 flex items-center gap-1.5 rounded-full border border-white/15 bg-surface-raised px-3 py-1.5 text-xs text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset all filters</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="rounded-xl border border-white/15 bg-surface-raised  overflow-hidden">
        {/* Table / List Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-white/10 bg-surface-raised text-xs font-semibold text-white/60">
          <div className="col-span-5 flex items-center gap-2">
            <span>Action item</span>
          </div>
          <div className="col-span-3">Meeting</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1 text-right">Due date</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-white/10">
          {items.map((item) => {
            const priorityConfig = item.priority
              ? PRIORITY_BADGES[item.priority]
              : null;

            return (
              <div
                key={`${item.meetingId}-${item.id}`}
                className={cn(
                  "group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center px-4 py-3.5 transition-colors hover:bg-white/5/80",
                  item.completed && "bg-surface-raised/50",
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
                        "h-4 w-4 rounded-sm border border-white/25 data-[state=checked]:bg-white data-[state=checked]:border-white data-[state=checked]:text-white transition-all cursor-pointer",
                        item.completed && "bg-white border-white text-black",
                      )}
                      aria-label={`Mark task as ${item.completed ? "pending" : "completed"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <label
                      htmlFor={`check-${item.id}`}
                      className={cn(
                        "font-sans text-xs sm:text-sm font-medium leading-snug cursor-pointer select-none transition-colors",
                        item.completed
                          ? "line-through text-white/45 decoration-zinc-300"
                          : "text-white",
                      )}
                    >
                      {item.text}
                    </label>

                    {/* Mobile-only badges row */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 lg:hidden">
                      {priorityConfig && (
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-medium",
                            priorityConfig.bg,
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                      )}
                      {item.timestamp !== undefined && (
                        <Link
                          href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                          className="inline-flex items-center gap-1 rounded-sm border border-white/15 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-white/70 hover:bg-white/10 transition-colors"
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
                    className="group/link inline-flex items-center gap-1.5 max-w-full rounded-full border border-white/15 bg-surface-raised px-2.5 py-1 text-xs font-medium text-white/80 hover:bg-white/5 hover:border-white/25 transition-colors"
                    title={`Open meeting: ${item.meetingTitle}`}
                  >
                    <Video className="h-3 w-3 text-white/45 shrink-0" />
                    <span className="truncate font-sans font-medium">
                      {item.meetingTitle}
                    </span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-40 shrink-0 group-hover/link:opacity-70" />
                  </Link>

                  {/* Timestamp deep link tag */}
                  {item.timestamp !== undefined && (
                    <Link
                      href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                      className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-white/15 bg-surface-raised px-2 py-0.5 text-xs font-medium text-white/70 hover:bg-white/10 transition-colors"
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
                          <Avatar className="h-6 w-6 border border-white/15 shrink-0 transition-transform group-hover/user:scale-105">
                            {item.assignee.avatarUrl && (
                              <AvatarImage
                                src={item.assignee.avatarUrl}
                                alt={item.assignee.name}
                              />
                            )}
                            <AvatarFallback
                              style={{
                                backgroundColor:
                                  item.assignee.color || "#e4e4e7",
                              }}
                              className="text-[9px] font-semibold text-white"
                            >
                              {getInitials(item.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-sans text-xs font-medium text-white group-hover/user:underline">
                              {item.assignee.name}
                            </span>
                            {item.assignee.role && (
                              <span className="truncate text-[11px] text-white/45">
                                {item.assignee.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border border-white/15 bg-surface-raised p-2.5 text-white shadow-lg rounded-xl max-w-xs"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-sans font-semibold text-xs text-white">
                            {item.assignee.name}
                          </p>
                          {item.assignee.role && (
                            <p className="text-[10px] font-medium text-white/60 uppercase">
                              {item.assignee.role}
                            </p>
                          )}
                          {item.assignee.company && (
                            <p className="font-sans text-[10px] text-white/45">
                              {item.assignee.company}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex items-center gap-1.5 text-white/45 text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-surface-raised">
                        <User className="h-3 w-3 text-white/45" />
                      </div>
                      <span className="text-[11px] font-medium uppercase">
                        Unassigned
                      </span>
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="col-span-1 hidden lg:flex items-center">
                  {priorityConfig ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase",
                        priorityConfig.bg,
                      )}
                    >
                      {priorityConfig.label}
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-white/35">—</span>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-1 hidden lg:flex items-center justify-end">
                  {item.dueDate ? (
                    <div
                      className="flex items-center gap-1 text-xs font-medium text-white/70"
                      title={`Due Date: ${item.dueDate}`}
                    >
                      <Calendar className="h-3 w-3 text-white/45" />
                      <span>{item.dueDate}</span>
                    </div>
                  ) : (
                    <span className="text-xs font-medium text-white/35">—</span>
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
