"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CommandSearch } from "@/components/dashboard/command-search";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { MeetingRecorderModal } from "@/components/record/meeting-recorder-modal";
import {
  ActionFilters,
  ActionStatusFilter,
  ActionPriorityFilter,
} from "@/components/actions/action-filters";
import {
  ActionsTable,
  EnrichedActionItem,
} from "@/components/actions/actions-table";
import { Speaker } from "@/types/meeting";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Home,
  ChevronRight,
  ListTodo,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  Copy,
  Check,
  Percent,
} from "lucide-react";

export default function ActionsHubPage() {
  const meetings = useMeetingStore((s) => s.meetings);
  const toggleActionItem = useMeetingStore((s) => s.toggleActionItem);

  // Search, settings, and recorder modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [recorderOpen, setRecorderOpen] = useState(false);

  // Filters state
  const [statusFilter, setStatusFilter] = useState<ActionStatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] =
    useState<ActionPriorityFilter>("all");
  const [meetingFilter, setMeetingFilter] = useState<string | null>(null);

  // Export copy feedback
  const [copiedSlack, setCopiedSlack] = useState(false);

  // Aggregate all action items across all meetings
  const allActionItems: EnrichedActionItem[] = useMemo(() => {
    const items: EnrichedActionItem[] = [];
    meetings.forEach((meeting) => {
      (meeting.actionItems || []).forEach((item) => {
        const assignee = meeting.participants?.find(
          (p) => p.id === item.assigneeId
        );
        items.push({
          ...item,
          meetingId: meeting.id,
          meetingTitle: item.meetingTitle || meeting.title,
          meetingDate: meeting.date,
          assignee,
        });
      });
    });
    return items;
  }, [meetings]);

  // Aggregate all available assignees
  const availableAssignees = useMemo(() => {
    const map = new Map<string, Speaker>();
    meetings.forEach((m) => {
      (m.participants || []).forEach((p) => {
        if (!map.has(p.id)) {
          map.set(p.id, p);
        }
      });
    });
    return Array.from(map.values());
  }, [meetings]);

  // Aggregate available meetings for filtering
  const availableMeetings = useMemo(() => {
    return meetings.map((m) => ({ id: m.id, title: m.title }));
  }, [meetings]);

  // Filtered action items
  const filteredItems = useMemo(() => {
    return allActionItems.filter((item) => {
      // Status filter
      if (statusFilter === "pending" && item.completed) return false;
      if (statusFilter === "completed" && !item.completed) return false;

      // Assignee filter
      if (assigneeFilter && item.assigneeId !== assigneeFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && item.priority !== priorityFilter)
        return false;

      // Meeting filter
      if (meetingFilter && item.meetingId !== meetingFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchText = item.text.toLowerCase().includes(q);
        const matchMeeting = item.meetingTitle.toLowerCase().includes(q);
        const matchAssignee = item.assignee?.name?.toLowerCase().includes(q);
        if (!matchText && !matchMeeting && !matchAssignee) return false;
      }

      return true;
    });
  }, [
    allActionItems,
    statusFilter,
    assigneeFilter,
    priorityFilter,
    meetingFilter,
    searchQuery,
  ]);

  // Metrics
  const totalCount = allActionItems.length;
  const completedCount = allActionItems.filter((i) => i.completed).length;
  const pendingCount = totalCount - completedCount;
  const percentComplete =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const counts = {
    all: totalCount,
    pending: pendingCount,
    completed: completedCount,
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    searchQuery.trim() !== "" ||
    assigneeFilter !== null ||
    priorityFilter !== "all" ||
    meetingFilter !== null;

  const handleResetFilters = () => {
    setStatusFilter("all");
    setSearchQuery("");
    setAssigneeFilter(null);
    setPriorityFilter("all");
    setMeetingFilter(null);
  };

  // Export CSV
  const handleExportCsv = () => {
    const itemsToExport =
      filteredItems.length > 0 ? filteredItems : allActionItems;
    const headers = [
      "Task ID",
      "Status",
      "Action Item",
      "Meeting Title",
      "Assignee Name",
      "Assignee Role",
      "Priority",
      "Due Date",
      "Timestamp",
    ];

    const escapeCsv = (str: string) => {
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const rows = itemsToExport.map((item) => [
      item.id,
      item.completed ? "Completed" : "Pending",
      escapeCsv(item.text),
      escapeCsv(item.meetingTitle),
      escapeCsv(item.assignee?.name || "Unassigned"),
      escapeCsv(item.assignee?.role || ""),
      item.priority || "none",
      item.dueDate || "",
      item.timestamp !== undefined ? formatTime(item.timestamp) : "",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `fathom-action-items-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Copy for Slack / Markdown
  const handleCopySlack = async () => {
    const itemsToCopy =
      filteredItems.length > 0 ? filteredItems : allActionItems;
    const lines: string[] = [
      `*📋 Action Items Hub Export*`,
      `_Status: ${completedCount} of ${totalCount} completed (${percentComplete}%)_`,
      "",
    ];

    itemsToCopy.forEach((item) => {
      const statusBox = item.completed ? "✅ [x]" : "⬜ [ ]";
      const assigneeStr = item.assignee ? ` • @${item.assignee.name}` : "";
      const priorityStr = item.priority
        ? ` • [${item.priority.toUpperCase()}]`
        : "";
      const dueStr = item.dueDate ? ` • Due: ${item.dueDate}` : "";
      const timeStr =
        item.timestamp !== undefined
          ? ` • ${formatTime(item.timestamp)}`
          : "";
      const meetingStr = ` (${item.meetingTitle})`;

      lines.push(
        `${statusBox} *${item.text}*${assigneeStr}${priorityStr}${dueStr}${timeStr}${meetingStr}`
      );
    });

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopiedSlack(true);
      setTimeout(() => setCopiedSlack(false), 2500);
    } catch (err) {
      console.error("Failed to copy markdown to clipboard:", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-black font-sans selection:bg-[#FEF08A] selection:text-black">
      {/* Top Application Header */}
      <DashboardHeader
        onOpenSearch={() => setSearchOpen(true)}
        onRecordClick={() => setRecorderOpen(true)}
      />

      {/* Main Page Content */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Breadcrumbs & Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-5">
          <div className="space-y-1.5">
            {/* Editorial Breadcrumbs */}
            <div className="flex items-center gap-2 font-mono text-xs font-black uppercase tracking-wider text-neutral-600">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-black transition-colors"
              >
                <Home className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>WORKSPACE</span>
              </Link>
              <ChevronRight className="h-3 w-3 stroke-[3]" />
              <span className="text-black">ACTION ITEMS</span>
            </div>

            {/* Page Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-[#FEF08A] shadow-neo-sm">
                <ListTodo className="h-5 w-5 stroke-[2.5] text-black" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                  ACTION ITEMS HUB
                </h1>
                <p className="font-mono text-xs font-bold uppercase text-neutral-600">
                  TOTAL TASKS: {totalCount} • CROSS-MEETING EXECUTION MATRIX
                </p>
              </div>
            </div>
          </div>

          {/* Export Actions with Tactile Physics */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="h-10 flex items-center gap-2 rounded-md border-2 border-black bg-white px-3.5 font-mono text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF8F5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Download className="h-4 w-4 stroke-[2.5]" />
              <span>EXPORT CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopySlack}
              className={`h-10 flex items-center gap-2 rounded-md border-2 border-black px-3.5 font-mono text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${
                copiedSlack
                  ? "bg-[#A7F3D0]"
                  : "bg-[#FEF08A] hover:bg-[#FEF08A]/90"
              }`}
            >
              {copiedSlack ? (
                <>
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 stroke-[2.5]" />
                  <span>COPY SLACK / MARKDOWN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 High-Contrast KPI Cards with hard shadows */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase text-neutral-600">
                TOTAL ACTIONS
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-[#FAF8F5]">
                <ListTodo className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-black text-black">
                {totalCount}
              </div>
              <p className="font-mono text-[11px] font-bold uppercase text-neutral-500 mt-0.5">
                across {meetings.length} meetings
              </p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-black bg-[#A7F3D0] p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase text-black">
                COMPLETED
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-white">
                <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5] text-black" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-black text-black">
                {completedCount}
              </div>
              <p className="font-mono text-[11px] font-black uppercase text-neutral-800 mt-0.5">
                resolved items
              </p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-black bg-[#FEF08A] p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase text-black">
                PENDING
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-white">
                <Clock className="h-3.5 w-3.5 stroke-[2.5] text-black" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-black text-black">
                {pendingCount}
              </div>
              <p className="font-mono text-[11px] font-black uppercase text-neutral-800 mt-0.5">
                open execution
              </p>
            </div>
          </div>

          {/* Card 4: Completion Rate */}
          <div className="flex flex-col justify-between rounded-xl border-2 border-black bg-[#DDD6FE] p-5 shadow-[4px_4px_0px_0px_#000]">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black uppercase text-black">
                COMPLETION RATE
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded border-2 border-black bg-white">
                <Sparkles className="h-3.5 w-3.5 stroke-[2.5] text-black" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-black text-black">
                {percentComplete}%
              </div>
              {/* Neobrutalist Progress Bar */}
              <div className="mt-2 h-3 w-full overflow-hidden rounded-full border-2 border-black bg-white">
                <div
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <ActionFilters
          status={statusFilter}
          onStatusChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          assigneeId={assigneeFilter}
          onAssigneeChange={setAssigneeFilter}
          priority={priorityFilter}
          onPriorityChange={setPriorityFilter}
          meetingId={meetingFilter}
          onMeetingChange={setMeetingFilter}
          availableAssignees={availableAssignees}
          availableMeetings={availableMeetings}
          counts={counts}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Action Items Table */}
        <ActionsTable
          items={filteredItems}
          onToggle={toggleActionItem}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </main>

      {/* Global Cmd+K Search Modal */}
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Global AI Settings Modal */}
      <ApiKeysModal open={settingsOpen} onOpenChange={setSettingsOpen} />

      {/* Meeting Recorder Modal */}
      <MeetingRecorderModal
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
      />
    </div>
  );
}
