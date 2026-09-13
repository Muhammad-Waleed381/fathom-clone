"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Meeting } from "@/types/meeting";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Clock,
  Calendar as CalendarIcon,
  Play,
  Copy,
  Check,
  Share2,
  ListTodo,
  ExternalLink,
  Sparkles,
  FileText,
  Users,
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

  // Format Date: e.g. "Sep 12, 2026 · 2:00 PM"
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
    "AI summary generated with key highlights, decisions, and action items.";

  // Action items count
  const totalActions = meeting.actionItems?.length || 0;
  const pendingActions = meeting.actionItems?.filter((a) => !a.completed).length || 0;

  // Max avatars to show in stack
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
    <TooltipProvider delayDuration={200}>
      <Card
        onClick={handleCardClick}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/5 cursor-pointer",
          className
        )}
      >
        {/* Top Header */}
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {meeting.tags?.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-slate-800 bg-slate-950/80 px-2 py-0.5 text-[11px] font-medium text-slate-300"
                >
                  {tag}
                </Badge>
              ))}
              {meeting.highlights?.length > 0 && (
                <Badge
                  variant="outline"
                  className="border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-300 gap-1"
                >
                  <Sparkles className="h-2.5 w-2.5" />
                  {meeting.highlights.length} clips
                </Badge>
              )}
            </div>

            {/* Duration Badge */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-950/70 px-2.5 py-1 text-xs font-mono font-medium text-slate-300">
              <Clock className="h-3 w-3 text-indigo-400" />
              <span>{formattedDuration}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 line-clamp-2 text-base font-bold tracking-tight text-white group-hover:text-primary transition-colors">
            {meeting.title}
          </h3>

          {/* Date & Participants info */}
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <CalendarIcon className="h-3.5 w-3.5 text-slate-500" />
            <span>{formattedDate}</span>
            <span className="text-slate-600">•</span>
            <span>{meeting.participants.length} participants</span>
          </div>
        </CardHeader>

        {/* Card Body: Summary Snippet & Participant Avatar Stack */}
        <CardContent className="px-5 py-2">
          {/* Summary Snippet */}
          <p className="line-clamp-2 text-xs leading-relaxed text-slate-400">
            {summarySnippet}
          </p>

          <div className="mt-4 flex items-center justify-between">
            {/* Participant Avatar Stack */}
            <div className="flex items-center -space-x-2 overflow-hidden py-1">
              {visibleParticipants.map((p) => (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-7 w-7 border-2 border-slate-900 ring-1 ring-slate-800 transition-transform hover:scale-110 hover:z-10">
                      <AvatarImage src={p.avatarUrl} alt={p.name} />
                      <AvatarFallback
                        style={{ backgroundColor: p.color || "#6366f1" }}
                        className="text-[10px] font-bold text-white"
                      >
                        {p.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                    <p className="font-semibold">{p.name}</p>
                    {p.role && <p className="text-[10px] text-slate-400">{p.role}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}

              {remainingCount > 0 && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-[10px] font-semibold text-slate-300 ring-1 ring-slate-700">
                  +{remainingCount}
                </div>
              )}
            </div>

            {/* Action Item Counter */}
            {totalActions > 0 && (
              <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-950/60 px-2 py-1 text-[11px] font-medium text-slate-300">
                <ListTodo className="h-3.5 w-3.5 text-indigo-400" />
                <span>
                  {pendingActions} / {totalActions} tasks
                </span>
              </div>
            )}
          </div>
        </CardContent>

        {/* Card Footer: 1-Click Actions */}
        <CardFooter className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/40 p-3 px-5">
          <div className="flex items-center gap-1.5">
            {/* Copy Summary Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCopySummary}
                  className="h-8 gap-1.5 px-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  {copiedSummary ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Summary</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Copy AI Executive Summary
              </TooltipContent>
            </Tooltip>

            {/* Share Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 gap-1.5 px-2.5 text-xs text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  {copiedShare ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Link Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="h-3.5 w-3.5" />
                      <span>Share</span>
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="text-xs">
                Copy Shareable Link
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Open Recording Primary Action */}
          <Button
            type="button"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className="h-8 gap-1.5 bg-primary/90 px-3 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Open Recording</span>
          </Button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
