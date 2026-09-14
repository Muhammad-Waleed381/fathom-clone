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
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 font-sans">
      {/* Top Application Header */}
      <DashboardHeader
        onOpenSearch={() => setSearchOpen(true)}
        onRecordClick={() => setRecorderOpen(true)}
      />

      {/* Main Page Content */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Breadcrumbs & Editorial Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
          <div className="space-y-1.5">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
              <Link
                href="/"
                className="flex items-center gap-1 hover:text-zinc-950 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span>WORKSPACE</span>
              </Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-950">ACTION ITEMS</span>
            </div>

            {/* Page Title & Subtitle */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
                <ListTodo className="h-5 w-5 text-zinc-950" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
                  ACTION ITEMS HUB
                </h1>
                <p className="font-mono text-xs font-medium uppercase text-zinc-500">
                  TOTAL TASKS: {totalCount} • CROSS-MEETING EXECUTION MATRIX
                </p>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleExportCsv}
              className="h-9 flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-3.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-700 shadow-sm hover:bg-zinc-50 hover:border-zinc-300 transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>EXPORT CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopySlack}
              className={`h-9 flex items-center gap-2 rounded-md border px-3.5 font-mono text-xs font-semibold uppercase tracking-wider shadow-sm transition-colors ${
                copiedSlack
                  ? "border-zinc-200 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300"
              }`}
            >
              {copiedSlack ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>COPY MARKDOWN</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4 Monochrome KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                TOTAL ACTIONS
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50">
                <ListTodo className="h-3.5 w-3.5 text-zinc-950" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-bold text-zinc-950">
                {totalCount}
              </div>
              <p className="font-mono text-[11px] font-medium uppercase text-zinc-400 mt-0.5">
                across {meetings.length} meetings
              </p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                COMPLETED
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50">
                <CheckCircle2 className="h-3.5 w-3.5 text-zinc-950" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-bold text-zinc-950">
                {completedCount}
              </div>
              <p className="font-mono text-[11px] font-medium uppercase text-zinc-400 mt-0.5">
                resolved items
              </p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                PENDING
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50">
                <Clock className="h-3.5 w-3.5 text-zinc-950" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-bold text-zinc-950">
                {pendingCount}
              </div>
              <p className="font-mono text-[11px] font-medium uppercase text-zinc-400 mt-0.5">
                open execution
              </p>
            </div>
          </div>

          {/* Card 4: Completion Rate */}
          <div className="flex flex-col justify-between rounded-xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500">
                COMPLETION RATE
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-md border border-zinc-100 bg-zinc-50">
                <Sparkles className="h-3.5 w-3.5 text-zinc-950" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-mono text-3xl font-bold text-zinc-950">
                {percentComplete}%
              </div>
              {/* Progress Bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-zinc-100">
                <div
                  className="h-full bg-zinc-950 transition-all duration-500"
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
