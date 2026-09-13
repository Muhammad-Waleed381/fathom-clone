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
    <div className="flex flex-col gap-4 rounded-xl border-2 border-black bg-white p-4 shadow-[4px_4px_0px_0px_#000]">
      {/* Top Row: Status Tabs + Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs with Neobrutalist physics */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {statusTabs.map((tab) => {
            const isActive = status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusChange(tab.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md border-2 border-black px-3.5 py-1.5 font-mono text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap",
                  isActive
                    ? "bg-black text-white shadow-neo-sm"
                    : "bg-white text-black hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm"
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    "rounded border border-current px-1 py-0.2 font-mono text-[10px] font-black",
                    isActive
                      ? "bg-white text-black"
                      : "bg-[#FAF8F5] text-black"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black stroke-[2.5] pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search action items, assignees, or meetings..."
            className="h-9 w-full rounded-md border-2 border-black bg-[#FAF8F5] pl-8 pr-8 font-mono text-xs text-black placeholder:text-neutral-500 shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Assignee, Priority, Meeting Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t-2 border-black">
        <div className="flex items-center gap-1.5 text-xs font-mono font-black uppercase text-black mr-1">
          <Filter className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>FILTER:</span>
        </div>

        {/* Filter by Assignee */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-8 flex items-center gap-1.5 rounded-md border-2 border-black px-2.5 font-mono text-xs font-bold uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                assigneeId
                  ? "bg-[#DDD6FE] text-black"
                  : "bg-white text-black hover:bg-[#FAF8F5]"
              )}
            >
              <User className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="max-w-[120px] truncate">
                {selectedAssignee ? selectedAssignee.name : "Assignee"}
              </span>
              <ChevronDown className="h-3 w-3 stroke-[2.5] ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-56 border-2 border-black bg-white p-1 text-black shadow-neo"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-black uppercase tracking-wider text-neutral-500 px-2 py-1">
              Select Assignee
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onAssigneeChange(null)}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <span>All Assignees</span>
              {assigneeId === null && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black h-0.5 my-1" />
            {availableAssignees.map((assignee) => (
              <DropdownMenuItem
                key={assignee.id}
                onClick={() => onAssigneeChange(assignee.id)}
                className="flex items-center justify-between gap-2 font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-5 w-5 border border-black shrink-0">
                    {assignee.avatarUrl && (
                      <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                    )}
                    <AvatarFallback
                      style={{ backgroundColor: assignee.color || "#DDD6FE" }}
                      className="font-mono text-[9px] font-black text-black"
                    >
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-sans font-bold text-black">{assignee.name}</span>
                    {assignee.role && (
                      <span className="truncate font-mono text-[9px] text-neutral-600 uppercase font-semibold">
                        {assignee.role}
                      </span>
                    )}
                  </div>
                </div>
                {assigneeId === assignee.id && (
                  <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />
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
                "h-8 flex items-center gap-1.5 rounded-md border-2 border-black px-2.5 font-mono text-xs font-bold uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                priority !== "all"
                  ? "bg-[#FEF08A] text-black"
                  : "bg-white text-black hover:bg-[#FAF8F5]"
              )}
            >
              <AlertCircle className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>
                {priority === "all"
                  ? "Priority"
                  : `${priority.toUpperCase()}`}
              </span>
              <ChevronDown className="h-3 w-3 stroke-[2.5] ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-44 border-2 border-black bg-white p-1 text-black shadow-neo"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-black uppercase tracking-wider text-neutral-500 px-2 py-1">
              Select Priority
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onPriorityChange("all")}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <span>ALL PRIORITIES</span>
              {priority === "all" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black h-0.5 my-1" />
            <DropdownMenuItem
              onClick={() => onPriorityChange("high")}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-black bg-rose-500" />
                <span className="text-black font-black">HIGH</span>
              </div>
              {priority === "high" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("medium")}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-black bg-amber-400" />
                <span className="text-black font-black">MEDIUM</span>
              </div>
              {priority === "medium" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("low")}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full border border-black bg-sky-400" />
                <span className="text-black font-black">LOW</span>
              </div>
              {priority === "low" && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Meeting Source */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className={cn(
                "h-8 flex items-center gap-1.5 rounded-md border-2 border-black px-2.5 font-mono text-xs font-bold uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                meetingId
                  ? "bg-[#A7F3D0] text-black"
                  : "bg-white text-black hover:bg-[#FAF8F5]"
              )}
            >
              <Video className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="max-w-[130px] truncate">
                {selectedMeeting ? selectedMeeting.title : "Meeting"}
              </span>
              <ChevronDown className="h-3 w-3 stroke-[2.5] ml-0.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-64 border-2 border-black bg-white p-1 text-black shadow-neo"
          >
            <DropdownMenuLabel className="font-mono text-[10px] font-black uppercase tracking-wider text-neutral-500 px-2 py-1">
              Select Meeting Source
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onMeetingChange(null)}
              className="flex items-center justify-between font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
            >
              <span>ALL MEETINGS</span>
              {meetingId === null && <Check className="h-3.5 w-3.5 stroke-[3]" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-black h-0.5 my-1" />
            {availableMeetings.map((m) => (
              <DropdownMenuItem
                key={m.id}
                onClick={() => onMeetingChange(m.id)}
                className="flex items-center justify-between gap-2 font-mono text-xs font-bold cursor-pointer rounded hover:bg-[#FEF08A] focus:bg-[#FEF08A] px-2 py-1.5"
              >
                <span className="truncate">{m.title}</span>
                {meetingId === m.id && (
                  <Check className="h-3.5 w-3.5 stroke-[3] shrink-0" />
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
            className="h-8 ml-auto flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#FECDD3] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <RotateCcw className="h-3 w-3 stroke-[2.5]" />
            <span>RESET</span>
          </button>
        )}
      </div>
    </div>
  );
}
