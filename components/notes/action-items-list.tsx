"use client";

import React, { useState } from "react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { formatTime } from "@/components/player/video-scrubber";
import { ActionItem, Speaker } from "@/types/meeting";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
  Check,
  Copy,
  Clock,
  Calendar,
  User,
  ListTodo,
  Sparkles,
  Play,
  Share2,
  Filter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

export interface ActionItemsListProps {
  className?: string;
  showHeader?: boolean;
}

type FilterState = "all" | "pending" | "completed";

export function ActionItemsList({
  className,
  showHeader = true,
}: ActionItemsListProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const toggleActionItem = useMeetingStore((s) => s.toggleActionItem);
  const seekTo = useMeetingStore((s) => s.seekTo);

  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState<FilterState>("all");

  const actionItems = currentMeeting?.actionItems ?? [];
  const participants = currentMeeting?.participants ?? [];

  const completedCount = actionItems.filter((i) => i.completed).length;
  const totalCount = actionItems.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filteredItems = actionItems.filter((item) => {
    if (filter === "pending") return !item.completed;
    if (filter === "completed") return item.completed;
    return true;
  });

  const handleToggle = (itemId: string, isCompleted: boolean) => {
    if (!currentMeeting) return;
    toggleActionItem(currentMeeting.id, itemId);

    // If marking as completed, trigger celebratory confetti
    if (!isCompleted && typeof window !== "undefined") {
      try {
        confetti({
          particleCount: 45,
          spread: 55,
          origin: { y: 0.8 },
          colors: ["#6366f1", "#10b981", "#3b82f6", "#f59e0b"],
        });
      } catch {
        // Fallback gracefully in test or unsupported environments
      }
    }
  };

  const copyToSlackOrMarkdown = async () => {
    if (!currentMeeting) return;

    const lines: string[] = [
      `*Action Items: ${currentMeeting.title}*`,
      `_Status: ${completedCount} of ${totalCount} completed (${progressPercent}%)_`,
      "",
    ];

    actionItems.forEach((item) => {
      const spk = participants.find((p) => p.id === item.assigneeId);
      const statusBox = item.completed ? "[x]" : "[ ]";
      const assigneeStr = spk ? ` @${spk.name}` : "";
      const dueStr = item.dueDate ? ` (Due: ${item.dueDate})` : "";
      const timeStr =
        item.timestamp !== undefined
          ? ` [${formatTime(item.timestamp)}]`
          : "";
      const priorityStr = item.priority ? ` [${item.priority.toUpperCase()}]` : "";

      lines.push(`${statusBox} ${item.text}${assigneeStr}${priorityStr}${dueStr}${timeStr}`);
    });

    lines.push("");
    lines.push("— Synchronized via Fathom AI");

    const fullText = lines.join("\n");

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(fullText);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = fullText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy action items", err);
    }
  };

  const getPriorityBadge = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return (
          <Badge
            variant="outline"
            className="border-rose-500/30 bg-rose-500/10 text-rose-400 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0"
          >
            High
          </Badge>
        );
      case "medium":
        return (
          <Badge
            variant="outline"
            className="border-amber-500/30 bg-amber-500/10 text-amber-400 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0"
          >
            Medium
          </Badge>
        );
      case "low":
        return (
          <Badge
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-400 text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0"
          >
            Low
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                <ListTodo className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Action Items & Deliverables
              </h3>
              <Badge
                variant="secondary"
                className="text-[11px] font-mono bg-slate-800 text-slate-300 border-slate-700 px-1.5"
              >
                {completedCount}/{totalCount}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Time-bound assignments with synchronized video playback markers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="inline-flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  filter === "all"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  filter === "pending"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={cn(
                  "px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer",
                  filter === "completed"
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                Done
              </button>
            </div>

            {/* Copy button */}
            <Button
              variant="outline"
              size="sm"
              onClick={copyToSlackOrMarkdown}
              className="h-8 gap-1.5 text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
              title="Copy checklist formatted for Slack or Markdown"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy to Slack / Markdown</span>
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Overall Completion</span>
            <span className="font-mono text-slate-300 font-medium">
              {progressPercent}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-900/30">
            {filter === "completed"
              ? "No completed action items yet. Check off items above as they get done!"
              : filter === "pending"
              ? "All action items completed! Great work team! 🎉"
              : "No action items tracked for this meeting."}
          </div>
        ) : (
          filteredItems.map((item) => {
            const assignee: Speaker | undefined = participants.find(
              (p) => p.id === item.assigneeId
            );
            const isCurrentMoment =
              item.timestamp !== undefined &&
              Math.abs(currentTime - item.timestamp) < 8;

            return (
              <Card
                key={item.id}
                className={cn(
                  "p-3.5 rounded-xl border transition-all duration-150 group",
                  item.completed
                    ? "bg-slate-950/40 border-slate-800/60 opacity-75"
                    : "bg-slate-900/70 border-slate-800/90 hover:border-slate-700/90 hover:bg-slate-900",
                  isCurrentMoment &&
                    "ring-1 ring-primary/60 border-primary/50 bg-primary/5"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div className="pt-0.5">
                    <Checkbox
                      id={`chk-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() =>
                        handleToggle(item.id, item.completed)
                      }
                      className={cn(
                        "h-4 w-4 rounded border-slate-600 transition-transform active:scale-90",
                        item.completed &&
                          "bg-primary border-primary text-primary-foreground"
                      )}
                    />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <label
                        htmlFor={`chk-${item.id}`}
                        className={cn(
                          "text-sm font-medium leading-snug cursor-pointer select-none transition-colors",
                          item.completed
                            ? "text-slate-400 line-through decoration-slate-600"
                            : "text-slate-100 hover:text-white"
                        )}
                      >
                        {item.text}
                      </label>

                      {getPriorityBadge(item.priority)}
                    </div>

                    {/* Meta row: Assignee, Due date, Timestamp seek link */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
                      {/* Assignee badge */}
                      {assignee ? (
                        <div
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800/90 border border-slate-700/60 text-slate-300"
                          title={`${assignee.name}${
                            assignee.role ? ` — ${assignee.role}` : ""
                          }`}
                        >
                          <Avatar className="h-4 w-4 shrink-0">
                            {assignee.avatarUrl && (
                              <AvatarImage
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                              />
                            )}
                            <AvatarFallback
                              className="text-[9px] font-bold text-white"
                              style={{
                                backgroundColor: assignee.color || "#6366f1",
                              }}
                            >
                              {assignee.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[120px] font-medium">
                            {assignee.name}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800/50 border border-slate-800 text-slate-400">
                          <User className="h-3 w-3" />
                          <span>Unassigned</span>
                        </div>
                      )}

                      {/* Due date */}
                      {item.dueDate && (
                        <div className="inline-flex items-center gap-1 text-slate-400 px-1.5 py-0.5 rounded bg-slate-800/40 text-[11px]">
                          <Calendar className="h-3 w-3 text-slate-500" />
                          <span>Due {item.dueDate}</span>
                        </div>
                      )}

                      {/* Clickable timestamp link to seek video */}
                      {item.timestamp !== undefined && (
                        <button
                          type="button"
                          onClick={() => seekTo(item.timestamp!)}
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-mono transition-colors cursor-pointer",
                            isCurrentMoment
                              ? "bg-primary text-white font-semibold"
                              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/50"
                          )}
                          title={`Seek video directly to timestamp ${formatTime(
                            item.timestamp
                          )}`}
                        >
                          <Play
                            className={cn(
                              "h-2.5 w-2.5 fill-current",
                              isCurrentMoment ? "text-white" : "text-primary"
                            )}
                          />
                          <span>{formatTime(item.timestamp)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
