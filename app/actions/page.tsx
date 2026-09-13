"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CommandSearch } from "@/components/dashboard/command-search";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  TrendingUp,
} from "lucide-react";

export default function ActionsHubPage() {
  const meetings = useMeetingStore((s) => s.meetings);
  const toggleActionItem = useMeetingStore((s) => s.toggleActionItem);

  // Search and settings modals
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-primary/30 selection:text-white">
      {/* Top Application Header */}
      <DashboardHeader
        onOpenSearch={() => setSearchOpen(true)}
        onRecordClick={() => alert("Launching meeting recorder...")}
      />

      {/* Main Page Content */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Workspace Breadcrumbs & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-400">
              <Link
                href="/"
                className="flex items-center gap-1.5 transition-colors hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                <span>Workspace</span>
              </Link>
              <ChevronRight className="h-3 w-3 text-slate-600" />
              <span className="font-medium text-slate-200">Action Items Hub</span>
            </nav>

            {/* Page Title */}
            <div className="flex items-center gap-2.5 mt-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-sm">
                <ListTodo className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Action Items Hub
                </h1>
                <p className="text-xs text-slate-400">
                  Centralized task execution, cross-meeting tracking, and team accountability.
                </p>
              </div>
            </div>
          </div>

          {/* Export Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="h-9 gap-1.5 border-slate-800 bg-slate-900/80 px-3 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export CSV</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySlack}
              className="h-9 gap-1.5 border-slate-800 bg-slate-900/80 px-3 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
            >
              {copiedSlack ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Copy for Slack/Markdown</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Summary Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Items */}
          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-400">
                  Total Actions
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400">
                  <ListTodo className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-white">
                  {totalCount}
                </span>
                <span className="text-[11px] text-slate-500">across {meetings.length} meetings</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Completed */}
          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-emerald-400">
                  Completed
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-emerald-400">
                  {completedCount}
                </span>
                <span className="text-[11px] text-slate-500">resolved items</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Pending */}
          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-amber-400">
                  Pending Execution
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Clock className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-amber-400">
                  {pendingCount}
                </span>
                <span className="text-[11px] text-slate-500">open tasks</span>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: % Complete */}
          <Card className="border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-400">
                  Team Progress
                </span>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-indigo-400">
                  {percentComplete}%
                </span>
                <span className="text-[11px] text-slate-500">completion rate</span>
              </div>
              {/* Progress bar */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${percentComplete}%` }}
                />
              </div>
            </CardContent>
          </Card>
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
    </div>
  );
}
