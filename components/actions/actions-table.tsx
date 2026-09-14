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
    bg: "bg-rose-50 text-rose-700 border border-rose-200",
    label: "HIGH",
  },
  medium: {
    bg: "bg-amber-50 text-amber-700 border border-amber-200",
    label: "MED",
  },
  low: {
    bg: "bg-sky-50 text-sky-700 border border-sky-200",
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
          colors: ["#a1a1aa", "#71717a", "#3f3f46", "#27272a", "#18181b"],
        });
      } catch {
        // Graceful fallback
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-white py-16 px-4 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 mb-4">
          {hasActiveFilters ? (
            <Inbox className="h-6 w-6 text-zinc-400" />
          ) : (
            <CheckCircle2 className="h-6 w-6 text-zinc-400" />
          )}
        </div>
        <h3 className="font-mono text-base font-semibold uppercase text-zinc-950">
          {hasActiveFilters
            ? "No matching action items"
            : "All action items completed"}
        </h3>
        <p className="mt-1.5 max-w-sm text-xs font-sans text-zinc-500 font-medium">
          {hasActiveFilters
            ? "No tasks match your current filter parameters. Adjust or clear filters to view items."
            : "Zero pending action items across workspace meetings. High team velocity achieved."}
        </p>
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="mt-4 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 font-mono text-xs font-medium uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>RESET ALL FILTERS</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <div className="rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
        {/* Table / List Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-zinc-100 bg-zinc-50 font-mono text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          <div className="col-span-5 flex items-center gap-2">
            <span>ACTION ITEM</span>
          </div>
          <div className="col-span-3">MEETING SOURCE</div>
          <div className="col-span-2">ASSIGNEE</div>
          <div className="col-span-1">PRIORITY</div>
          <div className="col-span-1 text-right">DUE DATE</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-zinc-100">
          {items.map((item) => {
            const priorityConfig = item.priority
              ? PRIORITY_BADGES[item.priority]
              : null;

            return (
              <div
                key={`${item.meetingId}-${item.id}`}
                className={cn(
                  "group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center px-4 py-3.5 transition-colors hover:bg-zinc-50/80",
                  item.completed && "bg-zinc-50/50"
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
                        "h-4 w-4 rounded-sm border border-zinc-300 data-[state=checked]:bg-zinc-950 data-[state=checked]:border-zinc-950 data-[state=checked]:text-white transition-all cursor-pointer",
                        item.completed && "bg-zinc-950 border-zinc-950 text-white"
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
                          ? "line-through text-zinc-400 decoration-zinc-300"
                          : "text-zinc-950"
                      )}
                    >
                      {item.text}
                    </label>

                    {/* Mobile-only badges row */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 lg:hidden">
                      {priorityConfig && (
                        <span
                          className={cn(
                            "px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase rounded-sm",
                            priorityConfig.bg
                          )}
                        >
                          {priorityConfig.label}
                        </span>
                      )}
                      {item.timestamp !== undefined && (
                        <Link
                          href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                          className="inline-flex items-center gap-1 rounded-sm border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
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
                    className="group/link inline-flex items-center gap-1.5 max-w-full rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
                    title={`Open meeting: ${item.meetingTitle}`}
                  >
                    <Video className="h-3 w-3 text-zinc-400 shrink-0" />
                    <span className="truncate font-sans font-medium">{item.meetingTitle}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-40 shrink-0 group-hover/link:opacity-70" />
                  </Link>

                  {/* Timestamp deep link tag */}
                  {item.timestamp !== undefined && (
                    <Link
                      href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                      className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-xs font-medium text-zinc-600 hover:bg-zinc-100 transition-colors"
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
                          <Avatar className="h-6 w-6 border border-zinc-200 shrink-0 transition-transform group-hover/user:scale-105">
                            {item.assignee.avatarUrl && (
                              <AvatarImage
                                src={item.assignee.avatarUrl}
                                alt={item.assignee.name}
                              />
                            )}
                            <AvatarFallback
                              style={{
                                backgroundColor: item.assignee.color || "#e4e4e7",
                              }}
                              className="font-mono text-[9px] font-semibold text-zinc-950"
                            >
                              {getInitials(item.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate font-sans text-xs font-medium text-zinc-950 group-hover/user:underline">
                              {item.assignee.name}
                            </span>
                            {item.assignee.role && (
                              <span className="truncate font-mono text-[9px] font-medium uppercase text-zinc-400">
                                {item.assignee.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="border border-zinc-200 bg-white p-2.5 text-zinc-950 shadow-lg rounded-xl max-w-xs"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-sans font-semibold text-xs text-zinc-950">
                            {item.assignee.name}
                          </p>
                          {item.assignee.role && (
                            <p className="font-mono text-[10px] font-medium text-zinc-500 uppercase">
                              {item.assignee.role}
                            </p>
                          )}
                          {item.assignee.company && (
                            <p className="font-sans text-[10px] text-zinc-400">
                              {item.assignee.company}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-xs">
                      <div className="flex h-5 w-5 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50">
                        <User className="h-3 w-3 text-zinc-400" />
                      </div>
                      <span className="text-[11px] font-medium uppercase">Unassigned</span>
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="col-span-1 hidden lg:flex items-center">
                  {priorityConfig ? (
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-sm font-mono text-[10px] font-semibold uppercase",
                        priorityConfig.bg
                      )}
                    >
                      {priorityConfig.label}
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-medium text-zinc-300">—</span>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-1 hidden lg:flex items-center justify-end">
                  {item.dueDate ? (
                    <div
                      className="flex items-center gap-1 font-mono text-xs font-medium text-zinc-600"
                      title={`Due Date: ${item.dueDate}`}
                    >
                      <Calendar className="h-3 w-3 text-zinc-400" />
                      <span>{item.dueDate}</span>
                    </div>
                  ) : (
                    <span className="font-mono text-xs font-medium text-zinc-300">—</span>
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
