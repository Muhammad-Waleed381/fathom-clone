"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Speaker } from "@/types/meeting";
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

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3.5 backdrop-blur-md">
      {/* Top Row: Status Tabs + Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Tabs */}
        <Tabs
          value={status}
          onValueChange={(val) => onStatusChange(val as ActionStatusFilter)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex bg-slate-950/80 border border-slate-800/80 p-1 h-9">
            <TabsTrigger
              value="all"
              className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-white font-medium"
            >
              All
              <Badge
                variant="secondary"
                className="ml-1.5 h-4 px-1 text-[10px] font-bold bg-slate-800 text-slate-300 border-0"
              >
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-amber-300 font-medium"
            >
              Pending
              <Badge
                variant="secondary"
                className="ml-1.5 h-4 px-1 text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20"
              >
                {counts.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="text-xs data-[state=active]:bg-slate-800 data-[state=active]:text-emerald-300 font-medium"
            >
              Completed
              <Badge
                variant="secondary"
                className="ml-1.5 h-4 px-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
              >
                {counts.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Search Input */}
        <div className="relative flex-1 sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search action items, assignees, or meetings..."
            className="h-9 pl-9 pr-8 text-xs bg-slate-950/80 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-indigo-500/30 focus-visible:border-indigo-500/50"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Row: Assignee, Priority, Meeting Dropdowns & Reset */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mr-1">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium">Filter by:</span>
        </div>

        {/* Filter by Assignee */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 border-slate-800 bg-slate-950/80 px-2.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white",
                assigneeId && "border-indigo-500/50 bg-indigo-500/10 text-indigo-300"
              )}
            >
              <User className="h-3.5 w-3.5 text-indigo-400" />
              <span className="max-w-[120px] truncate">
                {selectedAssignee ? selectedAssignee.name : "Assignee"}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 bg-slate-900 border-slate-800 text-slate-200">
            <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Filter by Assignee
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onAssigneeChange(null)}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <span>All Assignees</span>
              {assigneeId === null && <Check className="h-3.5 w-3.5 text-indigo-400" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            {availableAssignees.map((assignee) => (
              <DropdownMenuItem
                key={assignee.id}
                onClick={() => onAssigneeChange(assignee.id)}
                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:bg-slate-800"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar className="h-5 w-5 ring-1 ring-slate-700 shrink-0">
                    {assignee.avatarUrl && (
                      <AvatarImage src={assignee.avatarUrl} alt={assignee.name} />
                    )}
                    <AvatarFallback
                      style={{ backgroundColor: assignee.color || "#6366f1" }}
                      className="text-[9px] font-bold text-white"
                    >
                      {getInitials(assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="truncate font-medium text-slate-200">{assignee.name}</span>
                    {assignee.role && (
                      <span className="truncate text-[10px] text-slate-400">{assignee.role}</span>
                    )}
                  </div>
                </div>
                {assigneeId === assignee.id && (
                  <Check className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 border-slate-800 bg-slate-950/80 px-2.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white",
                priority !== "all" && "border-amber-500/50 bg-amber-500/10 text-amber-300"
              )}
            >
              <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {priority === "all"
                  ? "Priority"
                  : `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority`}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 bg-slate-900 border-slate-800 text-slate-200">
            <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Filter by Priority
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onPriorityChange("all")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <span>All Priorities</span>
              {priority === "all" && <Check className="h-3.5 w-3.5 text-indigo-400" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            <DropdownMenuItem
              onClick={() => onPriorityChange("high")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <span className="text-rose-300 font-medium">High</span>
              </div>
              {priority === "high" && <Check className="h-3.5 w-3.5 text-rose-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("medium")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="text-amber-300 font-medium">Medium</span>
              </div>
              {priority === "medium" && <Check className="h-3.5 w-3.5 text-amber-400" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onPriorityChange("low")}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-sky-500" />
                <span className="text-sky-300 font-medium">Low</span>
              </div>
              {priority === "low" && <Check className="h-3.5 w-3.5 text-sky-400" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter by Meeting Source */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 gap-1.5 border-slate-800 bg-slate-950/80 px-2.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-850 hover:text-white",
                meetingId && "border-purple-500/50 bg-purple-500/10 text-purple-300"
              )}
            >
              <Video className="h-3.5 w-3.5 text-purple-400" />
              <span className="max-w-[130px] truncate">
                {selectedMeeting ? selectedMeeting.title : "Meeting Source"}
              </span>
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64 bg-slate-900 border-slate-800 text-slate-200">
            <DropdownMenuLabel className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Filter by Meeting
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => onMeetingChange(null)}
              className="flex items-center justify-between text-xs cursor-pointer hover:bg-slate-800"
            >
              <span>All Meetings</span>
              {meetingId === null && <Check className="h-3.5 w-3.5 text-indigo-400" />}
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800" />
            {availableMeetings.map((meeting) => (
              <DropdownMenuItem
                key={meeting.id}
                onClick={() => onMeetingChange(meeting.id)}
                className="flex items-center justify-between gap-2 text-xs cursor-pointer hover:bg-slate-800"
              >
                <span className="truncate">{meeting.title}</span>
                {meetingId === meeting.id && (
                  <Check className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Active Filters Badges & Reset Button */}
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 gap-1 px-2 text-xs text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filters</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
