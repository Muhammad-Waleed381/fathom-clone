"use client";

import React from "react";
import Link from "next/link";
import { ActionItem, Speaker } from "@/types/meeting";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
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
  Clock,
  CheckCircle2,
  ExternalLink,
  RotateCcw,
  Sparkles,
  AlertTriangle,
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

const PRIORITY_STYLES = {
  high: {
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-300 font-semibold",
    dot: "bg-rose-500",
    label: "High",
  },
  medium: {
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold",
    dot: "bg-amber-500",
    label: "Med",
  },
  low: {
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-300 font-semibold",
    dot: "bg-sky-500",
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
          particleCount: 50,
          spread: 65,
          origin: { y: 0.7 },
          colors: ["#6366f1", "#10b981", "#3b82f6", "#f59e0b", "#ec4899"],
        });
      } catch {
        // Graceful fallback in environments without canvas
      }
    }
  };

  if (items.length === 0) {
    return (
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80 ring-1 ring-slate-700/80 mb-4 shadow-inner">
            {hasActiveFilters ? (
              <Inbox className="h-7 w-7 text-slate-400" />
            ) : (
              <CheckCircle2 className="h-7 w-7 text-emerald-400" />
            )}
          </div>
          <h3 className="text-base font-semibold text-white">
            {hasActiveFilters
              ? "No matching action items"
              : "All action items completed!"}
          </h3>
          <p className="mt-1.5 max-w-sm text-xs text-slate-400">
            {hasActiveFilters
              ? "No tasks match your current filter criteria. Try adjusting or clearing filters to see more items."
              : "Great job! All team action items across your meetings have been marked as completed."}
          </p>
          {hasActiveFilters && onResetFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="mt-5 h-8 gap-1.5 border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider delayDuration={150}>
      <Card className="border-slate-800 bg-slate-900/40 backdrop-blur-sm shadow-xl overflow-hidden">
        {/* Table / List Header */}
        <div className="hidden lg:grid grid-cols-12 gap-4 items-center px-4 py-3 border-b border-slate-800/80 bg-slate-950/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <div className="col-span-5 flex items-center gap-3">
            <span>Action Item</span>
          </div>
          <div className="col-span-3">Meeting Source</div>
          <div className="col-span-2">Assignee</div>
          <div className="col-span-1">Priority</div>
          <div className="col-span-1 text-right">Due Date</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-800/60">
          {items.map((item) => {
            const priorityConfig = item.priority
              ? PRIORITY_STYLES[item.priority]
              : null;

            return (
              <div
                key={`${item.meetingId}-${item.id}`}
                className={cn(
                  "group flex flex-col lg:grid lg:grid-cols-12 gap-3 lg:gap-4 lg:items-center px-4 py-3.5 transition-all hover:bg-slate-850/50",
                  item.completed && "bg-slate-950/20"
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
                        "h-4 w-4 rounded border-slate-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 transition-all",
                        item.completed
                          ? "ring-2 ring-emerald-500/20"
                          : "hover:border-slate-500"
                      )}
                      aria-label={`Mark task as ${item.completed ? "pending" : "completed"}`}
                    />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <label
                      htmlFor={`check-${item.id}`}
                      className={cn(
                        "text-xs sm:text-sm font-medium leading-snug cursor-pointer select-none transition-colors",
                        item.completed
                          ? "line-through text-slate-500"
                          : "text-slate-100 group-hover:text-white"
                      )}
                    >
                      {item.text}
                    </label>

                    {/* Mobile-only tags row */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 lg:hidden">
                      {priorityConfig && (
                        <Badge
                          variant="outline"
                          className={cn("px-1.5 py-0 text-[10px]", priorityConfig.badge)}
                        >
                          <span
                            className={cn(
                              "mr-1 h-1.5 w-1.5 rounded-full inline-block",
                              priorityConfig.dot
                            )}
                          />
                          {priorityConfig.label}
                        </Badge>
                      )}
                      {item.timestamp !== undefined && (
                        <Link
                          href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                          className="inline-flex items-center gap-1 rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-300 hover:bg-indigo-500/20 hover:text-indigo-300 border border-slate-700/60 transition-colors"
                        >
                          <Play className="h-2 w-2 fill-current" />
                          <span>{formatTime(item.timestamp)}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Meeting Source Badge & Clickable Timestamp */}
                <div className="col-span-3 flex flex-wrap items-center gap-2 min-w-0">
                  <Link
                    href={`/meetings/${item.meetingId}${
                      item.timestamp !== undefined ? `?t=${item.timestamp}` : ""
                    }`}
                    className="group/link inline-flex items-center gap-1.5 max-w-full rounded-md border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-indigo-300"
                    title={`Open meeting: ${item.meetingTitle}`}
                  >
                    <Video className="h-3 w-3 text-indigo-400 shrink-0" />
                    <span className="truncate font-medium">{item.meetingTitle}</span>
                    <ExternalLink className="h-2.5 w-2.5 opacity-40 shrink-0 group-hover/link:opacity-90" />
                  </Link>

                  {/* Timestamp tag */}
                  {item.timestamp !== undefined && (
                    <Link
                      href={`/meetings/${item.meetingId}?t=${item.timestamp}`}
                      className="hidden sm:inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-950/80 px-1.5 py-0.5 text-[11px] font-mono text-slate-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-300 transition-colors"
                      title={`Jump directly to ${formatTime(item.timestamp)} in call`}
                    >
                      <Play className="h-2.5 w-2.5 fill-current text-indigo-400" />
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
                          <Avatar className="h-6 w-6 ring-1 ring-slate-700 shrink-0 group-hover/user:ring-indigo-400 transition-all">
                            {item.assignee.avatarUrl && (
                              <AvatarImage
                                src={item.assignee.avatarUrl}
                                alt={item.assignee.name}
                              />
                            )}
                            <AvatarFallback
                              style={{
                                backgroundColor: item.assignee.color || "#6366f1",
                              }}
                              className="text-[9px] font-bold text-white"
                            >
                              {getInitials(item.assignee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate text-xs font-medium text-slate-200 group-hover/user:text-indigo-300 transition-colors">
                              {item.assignee.name}
                            </span>
                            {item.assignee.role && (
                              <span className="truncate text-[10px] text-slate-500">
                                {item.assignee.role}
                              </span>
                            )}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="bg-slate-900 border-slate-800 text-slate-200 p-2.5 shadow-xl max-w-xs"
                      >
                        <div className="flex flex-col gap-1 text-xs">
                          <p className="font-semibold text-white">
                            {item.assignee.name}
                          </p>
                          {item.assignee.role && (
                            <p className="text-indigo-300 text-[11px]">
                              {item.assignee.role}
                            </p>
                          )}
                          {item.assignee.company && (
                            <p className="text-slate-400 text-[10px]">
                              {item.assignee.company}
                            </p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 ring-1 ring-slate-700">
                        <User className="h-3 w-3 text-slate-500" />
                      </div>
                      <span className="text-[11px]">Unassigned</span>
                    </div>
                  )}
                </div>

                {/* Priority Badge */}
                <div className="col-span-1 hidden lg:flex items-center">
                  {priorityConfig ? (
                    <Badge
                      variant="outline"
                      className={cn("px-2 py-0.5 text-[10px]", priorityConfig.badge)}
                    >
                      <span
                        className={cn(
                          "mr-1.5 h-1.5 w-1.5 rounded-full inline-block",
                          priorityConfig.dot
                        )}
                      />
                      {priorityConfig.label}
                    </Badge>
                  ) : (
                    <span className="text-xs text-slate-600">—</span>
                  )}
                </div>

                {/* Due Date */}
                <div className="col-span-1 hidden lg:flex items-center justify-end">
                  {item.dueDate ? (
                    <div
                      className="flex items-center gap-1 text-[11px] text-slate-400"
                      title={`Due Date: ${item.dueDate}`}
                    >
                      <Calendar className="h-3 w-3 text-slate-500" />
                      <span>{item.dueDate}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-600">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </TooltipProvider>
  );
}
