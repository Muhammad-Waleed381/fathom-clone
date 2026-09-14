"use client";

import React from "react";
import { Speaker } from "@/types/meeting";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  X,
  Filter,
  User,
  AlertCircle,
  Video,
  ChevronDown,
  Check,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionStatusFilter = "all" | "pending" | "completed";
export type ActionPriorityFilter = "all" | "high" | "medium" | "low";

export interface ActionFiltersProps {
  status: ActionStatusFilter;
  onStatusChange: (status: ActionStatusFilter) => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  assigneeId: string | null;
  onAssigneeChange: (assigneeId: string | null) => void;
  priority: ActionPriorityFilter;
  onPriorityChange: (priority: ActionPriorityFilter) => void;
  meetingId: string | null;
  onMeetingChange: (meetingId: string | null) => void;
  availableAssignees: Speaker[];
  availableMeetings: { id: string; title: string }[];
  counts: {
    all: number;
    pending: number;
    completed: number;
  };
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

export function ActionFilters({
  status,
  onStatusChange,
  searchQuery,
  onSearchChange,
  assigneeId,
  onAssigneeChange,
  priority,
  onPriorityChange,
  meetingId,
  onMeetingChange,
  availableAssignees,
  availableMeetings,
  counts,
  onResetFilters,
  hasActiveFilters,
}: ActionFiltersProps) {
  const selectedAssignee = availableAssignees.find((a) => a.id === assigneeId);
  const selectedMeeting = availableMeetings.find((m) => m.id === meetingId);

  const statusTabs: { id: ActionStatusFilter; label: string; count: number }[] = [
    { id: "all", label: "ALL", count: counts.all },
    { id: "pending", label: "PENDING", count: counts.pending },
    { id: "completed", label: "COMPLETED", count: counts.completed },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      {/* Top Row: Status Tabs + Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
                  isActive
                    ? "bg-zinc-950 text-white"
                    : "bg-zinc-50 text-zinc-600 border border-zinc-200 hover:bg-zinc-100 hover:text-zinc-950"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded-sm px-1 font-mono text-[10px] font-semibold",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-zinc-200 text-zinc-600"
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search action items, assignees, or meetings..."
            className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 pl-8 pr-8 font-mono text-xs text-zinc-950 placeholder:text-zinc-400 shadow-sm focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Assignee, Priority, Meeting Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-zinc-200">
        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase text-zinc-500 mr-1">
          <Filter className="h-3.5 w-3.5" />
          <span>FILTER:</span>
        </div>

        {/* Filter by Assignee */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-8 flex items-center gap-1.5 rounded-md border px-2.5 font-mono text-xs font-medium uppercase transition-colors",
                assigneeId
                  ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              )}
            >
              <User className="h-3.5 w-3.5" />
              <span className="max-w-[120px] truncate">
                {selectedAssignee ? selectedAssignee.name : "Assignee"}
              </span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg rounded-xl"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1">
              Select Assignee
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onAssigneeChange(null)}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <span>All Assignees</span>
              {assigneeId === null && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 my-1" />
            {availableAssignees.map((assignee) => (
              <DropdownMenuItem
                key={assignee.id}
                onClick={() => onAssigneeChange(assignee.id)}
                className="flex items-center justify-between gap-2 font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-5 w-5 border border-zinc-200 shrink-0">
                    {assignee.avatarUrl && (
                      <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                    )}
                    <AvatarFallback
                      style={{ backgroundColor: assignee.color || "#e4e4e7" }}
                      className="font-mono text-[9px] font-semibold text-zinc-950"
                    >
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-sans font-semibold text-zinc-950">{assignee.name}</span>
                    {assignee.role && (
                      <span className="truncate font-mono text-[9px] text-zinc-500 uppercase">
                        {assignee.role}
                      </span>
                    )}
                  </div>
                </div>
                {assigneeId === assignee.id && (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-8 flex items-center gap-1.5 rounded-md border px-2.5 font-mono text-xs font-medium uppercase transition-colors",
                priority !== "all"
                  ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              )}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              <span>
                {priority === "all"
                  ? "Priority"
                  : `${priority.toUpperCase()}`}
              </span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-44 border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg rounded-xl"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1">
              Select Priority
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onPriorityChange("all")}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <span>ALL PRIORITIES</span>
              {priority === "all" && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 my-1" />
            <DropdownMenuItem
              onClick={() => onPriorityChange("high")}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-rose-500" />
                <span className="text-zinc-950 font-semibold">HIGH</span>
              </div>
              {priority === "high" && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("medium")}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-amber-400" />
                <span className="text-zinc-950 font-semibold">MEDIUM</span>
              </div>
              {priority === "medium" && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("low")}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-sm bg-sky-400" />
                <span className="text-zinc-950 font-semibold">LOW</span>
              </div>
              {priority === "low" && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Meeting Source */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-8 flex items-center gap-1.5 rounded-md border px-2.5 font-mono text-xs font-medium uppercase transition-colors",
                meetingId
                  ? "border-zinc-300 bg-zinc-100 text-zinc-950"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              )}
            >
              <Video className="h-3.5 w-3.5" />
              <span className="max-w-[130px] truncate">
                {selectedMeeting ? selectedMeeting.title : "Meeting"}
              </span>
              <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 border border-zinc-200 bg-white p-1 text-zinc-950 shadow-lg rounded-xl"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-semibold uppercase tracking-wider text-zinc-500 px-2 py-1">
              Select Meeting Source
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onMeetingChange(null)}
              className="flex items-center justify-between font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
            >
              <span>ALL MEETINGS</span>
              {meetingId === null && <Check className="h-3.5 w-3.5" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-200 my-1" />
            {availableMeetings.map((m) => (
              <DropdownMenuItem
                key={m.id}
                onClick={() => onMeetingChange(m.id)}
                className="flex items-center justify-between gap-2 font-mono text-xs font-medium cursor-pointer rounded-md hover:bg-zinc-100 focus:bg-zinc-100 px-2 py-1.5"
              >
                <span className="truncate">{m.title}</span>
                {meetingId === m.id && (
                  <Check className="h-3.5 w-3.5 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Reset Button */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-8 ml-auto flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>RESET</span>
          </button>
        )}
      </div>
    </div>
  );
}
