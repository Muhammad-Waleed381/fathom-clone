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
          <span className="border border-red-200 bg-red-50 text-red-700 font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-sm uppercase">
            High
          </span>
        );
      case "medium":
        return (
          <span className="border border-amber-200 bg-amber-50 text-amber-700 font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-sm uppercase">
            Med
          </span>
        );
      case "low":
        return (
          <span className="border border-blue-200 bg-blue-50 text-blue-700 font-mono text-[10px] font-medium px-1.5 py-0.5 rounded-sm uppercase">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950 flex items-center gap-1.5">
                <ListTodo className="h-4 w-4 text-zinc-600" />
                Action Items
              </h3>
              <span className="font-mono text-xs font-medium bg-zinc-50 text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                {completedCount}/{totalCount} done
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter tabs */}
            <div className="inline-flex rounded-md bg-zinc-50 p-0.5 border border-zinc-200 text-xs">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2.5 py-0.5 rounded-sm font-mono text-xs font-medium transition-all cursor-pointer",
                  filter === "all"
                    ? "bg-white text-zinc-950 border border-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={cn(
                  "px-2.5 py-0.5 rounded-sm font-mono text-xs font-medium transition-all cursor-pointer",
                  filter === "pending"
                    ? "bg-white text-zinc-950 border border-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={cn(
                  "px-2.5 py-0.5 rounded-sm font-mono text-xs font-medium transition-all cursor-pointer",
                  filter === "completed"
                    ? "bg-white text-zinc-950 border border-zinc-200 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-700"
                )}
              >
                Done
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={copyToSlackOrMarkdown}
              className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
              title="Copy checklist formatted for Slack or Markdown"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
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
          <div className="flex justify-between font-mono text-xs font-medium text-zinc-500">
            <span>Completion</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-zinc-100 rounded-sm overflow-hidden">
            <div
              className="h-full bg-zinc-950 rounded-sm transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs font-medium text-zinc-500 border border-dashed border-zinc-200 rounded-xl bg-zinc-50">
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
                  "p-3 rounded-xl border border-zinc-200 transition-all group",
                  item.completed
                    ? "bg-zinc-50 opacity-75 shadow-none"
                    : "bg-white shadow-sm hover:shadow-md hover:shadow-black/[0.04]",
                  isCurrentMoment && "border-amber-200 bg-amber-50/40"
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
                        "h-4 w-4 rounded-sm border border-zinc-300 transition-all cursor-pointer",
                        item.completed
                          ? "bg-zinc-950 border-zinc-950 text-white"
                          : "bg-white hover:border-zinc-500"
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
                            ? "line-through decoration-zinc-400 text-zinc-400 font-normal font-sans"
                            : "text-zinc-950 font-medium font-sans"
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
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-zinc-200 bg-white font-mono text-[11px] font-medium text-zinc-700"
                          title={`${assignee.name}${
                            assignee.role ? ` — ${assignee.role}` : ""
                          }`}
                        >
                          <Avatar className="h-4 w-4 border border-zinc-200 shrink-0 rounded-sm">
                            {assignee.avatarUrl && (
                              <AvatarImage
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                              />
                            )}
                            <AvatarFallback
                              className="font-mono text-[8px] font-medium text-zinc-700 rounded-sm"
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
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-zinc-200 font-mono text-[10px] text-zinc-500">
                          <User className="h-3 w-3" />
                          <span>Unassigned</span>
                        </div>
                      )}

                      {/* Due date */}
                      {item.dueDate && (
                        <div className="inline-flex items-center gap-1 border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 rounded-md font-mono text-[10px] font-medium text-zinc-600">
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
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md font-mono text-xs font-medium border transition-colors cursor-pointer",
                            isCurrentMoment
                              ? "bg-zinc-950 text-white border-zinc-950"
                              : "bg-zinc-50 hover:bg-zinc-100 text-zinc-600 border-zinc-200"
                          )}
                          title={`Seek video directly to ${formatTime(item.timestamp)}`}
                        >
                          <Play
                            className={cn(
                              "h-2.5 w-2.5 fill-current",
                              isCurrentMoment ? "text-white" : "text-zinc-500"
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
