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
          <span className="border border-black bg-[#FECDD3] text-black font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shadow-neo-sm uppercase">
            High
          </span>
        );
      case "medium":
        return (
          <span className="border border-black bg-[#FED7AA] text-black font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shadow-neo-sm uppercase">
            Med
          </span>
        );
      case "low":
        return (
          <span className="border border-black bg-[#BAE6FD] text-black font-mono text-[10px] font-bold px-1.5 py-0.2 rounded shadow-neo-sm uppercase">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b-2 border-black/10">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                <ListTodo className="h-4 w-4 text-black" />
                Action Items
              </h3>
              <span className="font-mono text-xs font-bold bg-[#FEF08A] text-black border border-black px-1.5 py-0.2 rounded shadow-neo-sm">
                {completedCount}/{totalCount} DONE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="inline-flex rounded-md bg-[#FAF8F5] p-0.5 border-2 border-black text-xs shadow-neo-sm">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "px-2.5 py-0.5 rounded font-mono text-xs font-bold transition-all cursor-pointer",
                  filter === "all"
                    ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                    : "text-zinc-600 hover:text-black"
                )}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={cn(
                  "px-2.5 py-0.5 rounded font-mono text-xs font-bold transition-all cursor-pointer",
                  filter === "pending"
                    ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                    : "text-zinc-600 hover:text-black"
                )}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={cn(
                  "px-2.5 py-0.5 rounded font-mono text-xs font-bold transition-all cursor-pointer",
                  filter === "completed"
                    ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                    : "text-zinc-600 hover:text-black"
                )}
              >
                Done
              </button>
            </div>

            {/* Copy button */}
            <button
              type="button"
              onClick={copyToSlackOrMarkdown}
              className="flex h-8 items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#A7F3D0] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all cursor-pointer"
              title="Copy checklist formatted for Slack or Markdown"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-black" />
                  <span className="text-black font-black">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-black" />
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
          <div className="flex justify-between font-mono text-xs font-bold text-black">
            <span>COMPLETION</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-zinc-100 rounded-full border-2 border-black overflow-hidden p-[1px]">
            <div
              className="h-full bg-[#A7F3D0] border-r-2 border-black rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Items list */}
      <div className="space-y-2.5">
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center font-mono text-xs font-bold text-zinc-500 border-2 border-dashed border-black/30 rounded-lg bg-[#FAF8F5]">
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
                  "p-3 rounded-lg border-2 border-black transition-all group",
                  item.completed
                    ? "bg-[#FAF8F5] opacity-75 shadow-none"
                    : "bg-white shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo",
                  isCurrentMoment && "border-black ring-2 ring-[#FEF08A] bg-[#FEF08A]/10"
                )}
              >
                <div className="flex items-start gap-3">
                  {/* Thick square checkbox */}
                  <div className="pt-0.5">
                    <Checkbox
                      id={`chk-${item.id}`}
                      checked={item.completed}
                      onCheckedChange={() =>
                        handleToggle(item.id, item.completed)
                      }
                      className={cn(
                        "h-5 w-5 rounded-xs border-2 border-black transition-all cursor-pointer shadow-neo-sm",
                        item.completed
                          ? "bg-black text-white"
                          : "bg-white hover:bg-[#FEF08A]"
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
                            ? "line-through decoration-2 decoration-black text-zinc-400 font-medium font-sans"
                            : "text-black font-bold font-sans"
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
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-black bg-white shadow-neo-sm font-mono text-[11px] font-bold text-black"
                          title={`${assignee.name}${
                            assignee.role ? ` — ${assignee.role}` : ""
                          }`}
                        >
                          <Avatar className="h-4 w-4 border border-black shrink-0">
                            {assignee.avatarUrl && (
                              <AvatarImage
                                src={assignee.avatarUrl}
                                alt={assignee.name}
                              />
                            )}
                            <AvatarFallback
                              className="font-mono text-[8px] font-black text-black"
                              style={{
                                backgroundColor: assignee.color || "#FEF08A",
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
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-black/30 font-mono text-[10px] text-zinc-500">
                          <User className="h-3 w-3" />
                          <span>Unassigned</span>
                        </div>
                      )}

                      {/* Due date */}
                      {item.dueDate && (
                        <div className="inline-flex items-center gap-1 border border-black bg-white px-1.5 py-0.5 rounded font-mono text-[10px] font-bold text-black shadow-neo-sm">
                          <Calendar className="h-3 w-3 text-black" />
                          <span>{item.dueDate}</span>
                        </div>
                      )}

                      {/* Clickable timestamp link to seek video */}
                      {item.timestamp !== undefined && (
                        <button
                          type="button"
                          onClick={() => seekTo(item.timestamp!)}
                          className={cn(
                            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono text-xs font-bold border border-black transition-all cursor-pointer shadow-neo-sm",
                            isCurrentMoment
                              ? "bg-black text-white"
                              : "bg-[#FEF08A] hover:bg-[#FDE047] text-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm"
                          )}
                          title={`Seek video directly to ${formatTime(item.timestamp)}`}
                        >
                          <Play
                            className={cn(
                              "h-2.5 w-2.5 fill-current",
                              isCurrentMoment ? "text-white" : "text-black"
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
