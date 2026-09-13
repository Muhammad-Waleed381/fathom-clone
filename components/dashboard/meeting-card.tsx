"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Meeting } from "@/types/meeting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Clock,
  Calendar as CalendarIcon,
  Play,
  Copy,
  Check,
  Share2,
  ListTodo,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingCardProps {
  meeting: Meeting;
  className?: string;
  onShare?: (meeting: Meeting) => void;
}

export function MeetingCard({ meeting, className, onShare }: MeetingCardProps) {
  const router = useRouter();
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // Format Date: e.g. "Sep 12, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(meeting.date);
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return meeting.date;
    }
  })();

  // Format Duration: e.g. 2535s -> 42m 15s
  const formattedDuration = (() => {
    const mins = Math.floor(meeting.duration / 60);
    const secs = meeting.duration % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}h ${remMins}m`;
    }
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  })();

  // Summary snippet
  const summarySnippet =
    meeting.summaries?.executive?.overview ||
    meeting.summaries?.engineering?.overview ||
    meeting.summaries?.sales?.overview ||
    "Key highlights, architectural decisions, and next steps recorded.";

  // Action items count
  const totalActions = meeting.actionItems?.length || 0;
  const pendingActions = meeting.actionItems?.filter((a) => !a.completed).length || 0;

  // Max avatars to show
  const maxAvatars = 4;
  const visibleParticipants = meeting.participants.slice(0, maxAvatars);
  const remainingCount = meeting.participants.length - maxAvatars;

  // Copy Summary Handler
  const handleCopySummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const sections = meeting.summaries?.executive?.sections || [];
    const sectionText = sections
      .map((s) => `### ${s.title}\n${s.bullets.map((b) => `- ${b}`).join("\n")}`)
      .join("\n\n");

    const fullSummary = `# ${meeting.title}\n\n**Overview:**\n${summarySnippet}\n\n${sectionText}`;

    try {
      await navigator.clipboard.writeText(fullSummary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Share Handler
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (onShare) {
      onShare(meeting);
      return;
    }

    const shareUrl = typeof window !== "undefined"
      ? `${window.location.origin}/meetings/${meeting.id}`
      : `/meetings/${meeting.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCardClick = () => {
    router.push(`/meetings/${meeting.id}`);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div
        onClick={handleCardClick}
        className={cn(
          "group relative flex flex-col justify-between rounded-lg border-2 border-black bg-white shadow-[4px_4px_0px_0px_#000] transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#000] cursor-pointer overflow-hidden",
          className
        )}
      >
        {/* Top Content Area */}
        <div className="p-4 sm:p-5 pb-3">
          {/* Header Badges */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {meeting.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-black bg-[#FAF8F5] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-neo-sm"
                >
                  {tag}
                </span>
              ))}
              {meeting.highlights?.length > 0 && (
                <span className="flex items-center gap-1 rounded border border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  {meeting.highlights.length} CLIPS
                </span>
              )}
            </div>

            {/* Duration Badge */}
            <div className="flex items-center gap-1 rounded border border-black bg-white px-2 py-0.5 font-mono text-xs font-bold text-black shadow-neo-sm shrink-0">
              <Clock className="h-3 w-3" />
              <span>{formattedDuration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-3 line-clamp-2 text-base font-black tracking-tight text-black group-hover:underline">
            {meeting.title}
          </h3>

          {/* Date & Participant count */}
          <div className="mt-1 flex items-center gap-2 font-mono text-xs text-neutral-600">
            <CalendarIcon className="h-3.5 w-3.5 text-black" />
            <span>{formattedDate}</span>
            <span>•</span>
            <span>{meeting.participants.length} ATTENDEES</span>
          </div>

          {/* Summary Snippet */}
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-neutral-700">
            {summarySnippet}
          </p>

          {/* Metadata Row: Avatars & Actions Badge */}
          <div className="mt-4 flex items-center justify-between gap-2 pt-1">
            {/* Avatar Cluster */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {visibleParticipants.map((p) => (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-7 w-7 rounded-full border-2 border-black bg-white shadow-neo-sm transition-transform hover:scale-115 hover:z-20">
                      <AvatarImage src={p.avatarUrl} alt={p.name} />
                      <AvatarFallback
                        style={{ backgroundColor: p.color || "#FEF08A" }}
                        className="font-mono text-[10px] font-bold text-black"
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="border-2 border-black bg-white text-xs font-bold text-black shadow-neo-sm">
                    <p>{p.name}</p>
                    {p.role && <p className="text-[10px] font-normal text-neutral-600">{p.role}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}

              {remainingCount > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-black bg-black font-mono text-[10px] font-black text-white shadow-neo-sm">
                  +{remainingCount}
                </div>
              )}
            </div>

            {/* Action Item Counter */}
            {totalActions > 0 && (
              <div className="flex items-center gap-1.5 rounded border border-black bg-[#DDD6FE] px-2 py-0.5 font-mono text-[11px] font-bold text-black shadow-neo-sm">
                <ListTodo className="h-3.5 w-3.5 text-black" />
                <span>
                  {pendingActions}/{totalActions} TASKS
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: 1-Click Quick Actions */}
        <div className="flex items-center justify-between border-t-2 border-black bg-[#FAF8F5] p-2.5 sm:px-4">
          <div className="flex items-center gap-1.5">
            {/* Copy Summary Button */}
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded border border-black bg-white px-2.5 py-1 text-xs font-bold text-black shadow-neo-sm transition-all hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              title="Copy Executive Summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>SUMMARY</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded border border-black bg-white px-2.5 py-1 text-xs font-bold text-black shadow-neo-sm transition-all hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5"
              title="Share Recording"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3 w-3 stroke-[3]" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3" />
                  <span>SHARE</span>
                </>
              )}
            </button>
          </div>

          {/* Open Recording */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="flex items-center gap-1.5 rounded border-2 border-black bg-black px-3 py-1 font-mono text-xs font-black uppercase tracking-wider text-white shadow-neo-sm transition-all hover:bg-neutral-900 active:translate-x-0.5 active:translate-y-0.5"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>OPEN</span>
          </button>
        </div>
      </div>
    </TooltipProvider>
  );
}
