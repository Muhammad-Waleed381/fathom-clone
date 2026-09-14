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
  Play,
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

    // If marking as completed, trigger celebratory confetti burst
    if (!isCompleted && typeof window !== "undefined") {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ["#FEF08A", "#000000", "#A7F3D0", "#DDD6FE"],
        });
      } catch {
        // Graceful fallback
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
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy action items", err);
    }
  };

  const getPriorityBadge = (priority?: "low" | "medium" | "high") => {
    switch (priority) {
      case "high":
        return (
          <span className="rounded-full border border-red-500/30 bg-red-500/100/10 px-2 py-0.5 text-[11px] font-medium text-red-300">
            High
          </span>
        );
      case "medium":
        return (
          <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            Med
          </span>
        );
      case "low":
        return (
          <span className="rounded-full border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[11px] font-medium text-sky-300">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex flex-col space-y-4 font-sans", className)}>
      {showHeader && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/15">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[13px] font-medium text-white flex items-center gap-1.5">
                <ListTodo className="h-4 w-4 text-white/70" />
                Action Items
              </h3>
              <span className="text-xs font-medium bg-surface-raised text-white/70 border border-white/15 px-1.5 py-0.5 rounded-sm">
                {completedCount}/{totalCount} done
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            <div className="inline-flex rounded-xl bg-surface-raised p-0.5 border border-white/15 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
 "px-2.5 py-0.5 rounded-sm text-xs font-medium transition-all cursor-pointer",
                  filter === "all"
                    ? "bg-white text-white border border-white/15 shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={cn(
 "px-2.5 py-0.5 rounded-sm text-xs font-medium transition-all cursor-pointer",
                  filter === "pending"
                    ? "bg-white text-white border border-white/15 shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={cn(
 "px-2.5 py-0.5 rounded-sm text-xs font-medium transition-all cursor-pointer",
                  filter === "completed"
                    ? "bg-white text-white border border-white/15 shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                Done
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={copyToSlackOrMarkdown}
              className="flex h-8 items-center gap-1.5 rounded-xl border border-white/15 bg-surface-raised px-2.5 text-xs font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
              title="Copy checklist formatted for Slack or Markdown"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-300">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {totalCount > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-medium text-white/60">
            <span>Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-sm overflow-hidden">
            <div
              className="h-full bg-white rounded-sm transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs font-medium text-white/60 border border-dashed border-white/15 rounded-full bg-surface-raised">
            {filter === "completed"
              ? "No completed action items yet."
              : filter === "pending"
              ? "All action items completed! 🎉"
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
 "p-3 rounded-full border border-white/15 transition-all group",
                  item.completed
                    ? "bg-surface-raised opacity-75 shadow-none"
                    : "bg-white shadow-sm hover:shadow-md hover:shadow-black/[0.04]",
                  isCurrentMoment && "border-amber-500/30 bg-amber-500/10/40"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Rectangular checkbox */}
                  <div className="pt-0.5">
                    <Checkbox
                      id={`chk-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() =>
                        handleToggle(item.id, item.completed)
                      }
                      className={cn(
 "h-4 w-4 rounded-sm border border-white/25 transition-all cursor-pointer",
                        item.completed
                          ? "bg-white border-white text-black"
                          : "bg-white hover:border-white/40"
                      )}
                    />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <label
                        htmlFor={`chk-${item.id}`}
                        className={cn(
 "text-xs leading-snug cursor-pointer select-none transition-colors",
                          item.completed
                            ? "line-through decoration-zinc-400 text-white/45 font-normal font-sans"
                            : "text-white font-medium font-sans"
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
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xl border border-white/15 bg-surface-raised text-[11px] font-medium text-white/80"
                          title={`${assignee.name}${
                            assignee.role ? ` — ${assignee.role}` : ""
                          }`}
                        >
                          <Avatar className="h-4 w-4 border border-white/15 shrink-0 rounded-sm">
                            {assignee.avatarUrl && (
                              <AvatarImage
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                              />
                            )}
                            <AvatarFallback
                              className="text-[8px] font-medium text-white/80 rounded-sm"
                              style={{
                                backgroundColor: assignee.color || "#E4E4E7",
                              }}
                            >
                              {assignee.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate max-w-[120px]">
                            {assignee.name}
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xl border border-white/15 text-[10px] text-white/60">
                          <User className="h-3 w-3" />
                          <span>Unassigned</span>
                        </div>
                      )}

                      {/* Due date */}
                      {item.dueDate && (
                        <div className="inline-flex items-center gap-1 border border-white/15 bg-surface-raised px-1.5 py-0.5 rounded-xl text-[10px] font-medium text-white/70">
                          <Calendar className="h-3 w-3" />
                          <span>{item.dueDate}</span>
                        </div>
                      )}

                      {/* Clickable timestamp link to seek video */}
                      {item.timestamp !== undefined && (
                        <button
                          type="button"
                          onClick={() => seekTo(item.timestamp!)}
                          className={cn(
 "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer",
                            isCurrentMoment
                              ? "bg-white text-black border-white"
                              : "bg-surface-raised hover:bg-white/10 text-white/70 border-white/15"
                          )}
                          title={`Seek video directly to ${formatTime(item.timestamp)}`}
                        >
                          <Play
                            className={cn("tabular-nums",
 "h-2.5 w-2.5 fill-current",
                              isCurrentMoment ? "text-white" : "text-white/60"
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
