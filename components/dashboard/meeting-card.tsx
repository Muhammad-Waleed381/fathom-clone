"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Meeting } from "@/types/meeting";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  ArrowUpRight,
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

    const shareUrl =
      typeof window !== "undefined"
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
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-zinc-200/90 bg-white/95 p-0 transition-all duration-200 hover:border-zinc-400/80 hover:shadow-lg hover:shadow-black/[0.04] cursor-pointer",
          className
        )}
      >
        {/* Card Header with Category Badges & Meta */}
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {meeting.tags?.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="rounded-md border-zinc-200/80 bg-zinc-50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-600 font-medium"
                >
                  {tag}
                </Badge>
              ))}
              {meeting.highlights?.length > 0 && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 rounded-md border-zinc-200 bg-zinc-100/70 px-2 py-0.5 font-mono text-[10px] text-zinc-800 font-medium"
                >
                  <Sparkles className="h-2.5 w-2.5 text-zinc-500" />
                  <span>{meeting.highlights.length} clips</span>
                </Badge>
              )}
            </div>

            {/* Duration Tag */}
            <div className="flex items-center gap-1 font-mono text-xs text-zinc-500 shrink-0">
              <Clock className="h-3 w-3 text-zinc-400" />
              <span>{formattedDuration}</span>
            </div>
          </div>

          <div className="mt-2.5">
            <CardTitle className="text-base font-semibold tracking-tight text-zinc-950 group-hover:text-black flex items-center justify-between gap-2">
              <span className="line-clamp-1">{meeting.title}</span>
              <ArrowUpRight className="h-4 w-4 text-zinc-400 group-hover:text-zinc-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </CardTitle>

            <div className="mt-1 flex items-center gap-2 font-mono text-[11px] text-zinc-500">
              <CalendarIcon className="h-3 w-3 text-zinc-400" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{meeting.participants.length} attendees</span>
            </div>
          </div>
        </CardHeader>

        {/* Card Content with Summary & Attendees */}
        <CardContent className="p-5 pt-0 pb-3 space-y-3">
          <CardDescription className="line-clamp-2 text-xs leading-relaxed text-zinc-600">
            {summarySnippet}
          </CardDescription>

          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Avatar Cluster */}
            <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
              {visibleParticipants.map((p) => (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6.5 w-6.5 rounded-md border-2 border-white bg-zinc-100 shadow-xs transition-transform hover:scale-110 hover:z-20">
                      <AvatarImage src={p.avatarUrl} alt={p.name} />
                      <AvatarFallback className="rounded-md bg-zinc-100 font-mono text-[9px] font-medium text-zinc-800">
                        {p.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="border border-zinc-200 bg-white text-xs font-medium text-zinc-900 shadow-md rounded-md"
                  >
                    <p className="font-semibold">{p.name}</p>
                    {p.role && <p className="text-[10px] text-zinc-500 font-normal">{p.role}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}

              {remainingCount > 0 && (
                <div className="flex h-6.5 w-6.5 items-center justify-center rounded-md border border-zinc-200 bg-zinc-100 font-mono text-[9px] font-medium text-zinc-600">
                  +{remainingCount}
                </div>
              )}
            </div>

            {/* Action Item Indicator */}
            {totalActions > 0 && (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 rounded-md border-zinc-200/80 bg-zinc-50/80 px-2 py-0.5 font-mono text-[11px] text-zinc-700"
              >
                <ListTodo className="h-3 w-3 text-zinc-400" />
                <span>
                  {pendingActions}/{totalActions} tasks
                </span>
              </Badge>
            )}
          </div>
        </CardContent>

        {/* Card Footer with 1-Click Tactile Actions */}
        <CardFooter className="flex items-center justify-between border-t border-zinc-100 bg-zinc-50/50 p-3 px-5">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs"
              title="Copy Summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="h-3 w-3 stroke-[2.5] text-emerald-600" />
                  <span className="text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 text-zinc-400" />
                  <span className="text-[11px]">Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-white px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors shadow-2xs"
              title="Share Recording"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3 w-3 stroke-[2.5] text-emerald-600" />
                  <span className="text-[11px]">Copied</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3 text-zinc-400" />
                  <span className="text-[11px]">Share</span>
                </>
              )}
            </button>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="flex items-center gap-1.5 rounded-md bg-zinc-950 px-3 py-1 font-mono text-xs font-medium uppercase tracking-wider text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-2xs"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Open</span>
          </button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
