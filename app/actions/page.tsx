"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
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
  ArrowLeft,
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
          (p) => p.id === item.assigneeId,
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
      `fathom-action-items-${new Date().toISOString().slice(0, 10)}.csv`,
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
        item.timestamp !== undefined ? ` • ${formatTime(item.timestamp)}` : "";
      const meetingStr = ` (${item.meetingTitle})`;

      lines.push(
        `${statusBox} *${item.text}*${assigneeStr}${priorityStr}${dueStr}${timeStr}${meetingStr}`,
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
    <div className="section flex min-h-screen flex-col pt-28 text-white sm:pt-32 md:pt-36">
      <main className="w-full flex-1 space-y-6">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <p className="eyebrow mt-6">
              {totalCount} tasks across every meeting
            </p>
            <h1 className="display-h2 mt-3 text-white">Action items</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>

            <button
              type="button"
              onClick={handleCopySlack}
              className={`inline-flex h-9 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors ${
                copiedSlack
                  ? "border-white bg-white text-black"
                  : "border-white/20 text-white hover:bg-white hover:text-black"
              }`}
            >
              {copiedSlack ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              {copiedSlack ? "Copied" : "Copy Markdown"}
            </button>
          </div>
        </div>

        {/* 4 Monochrome KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total */}
          <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-surface-raised p-5 ">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/60">
                Total actions
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface-raised">
                <ListTodo className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-4xl font-medium tracking-tight text-white">
                {totalCount}
              </div>
              <p className="text-xs text-white/45 mt-0.5">
                across {meetings.length} meetings
              </p>
            </div>
          </div>

          {/* Card 2: Completed */}
          <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-surface-raised p-5 ">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/60">
                Completed
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface-raised">
                <CheckCircle2 className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-4xl font-medium tracking-tight text-white">
                {completedCount}
              </div>
              <p className="text-xs text-white/45 mt-0.5">resolved items</p>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-surface-raised p-5 ">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/60">
                Pending
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface-raised">
                <Clock className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-4xl font-medium tracking-tight text-white">
                {pendingCount}
              </div>
              <p className="text-xs text-white/45 mt-0.5">open execution</p>
            </div>
          </div>

          {/* Card 4: Completion Rate */}
          <div className="flex flex-col justify-between rounded-xl border border-white/15 bg-surface-raised p-5 ">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-white/60">
                Completion rate
              </span>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-surface-raised">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
            <div className="mt-3">
              <div className="font-display text-4xl font-medium tracking-tight text-white">
                {percentComplete}%
              </div>
              {/* Progress Bar */}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-sm bg-white/10">
                <div
                  className="h-full bg-white transition-all duration-500"
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
    </div>
  );
}
