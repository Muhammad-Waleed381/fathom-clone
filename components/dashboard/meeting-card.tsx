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

  // Format Date
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

  // Format Duration
  const formattedDuration = (() => {
    const mins = Math.floor(meeting.duration / 60);
    const secs = meeting.duration % 60;
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hours}H ${remMins}M`;
    }
    return secs > 0 ? `${mins}M ${secs}S` : `${mins}M`;
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
          "group relative flex flex-col justify-between overflow-hidden rounded-lg border border-[#E4E4E7] bg-white p-0 transition-all duration-300 hover:border-[#0B0B0B]/60 hover:shadow-md cursor-pointer font-mono",
          className
        )}
      >
        {/* Card Header */}
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {meeting.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded border border-[#E4E4E7] bg-[#F4F4F5] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#737373] font-normal"
                >
                  {tag}
                </span>
              ))}
              {meeting.highlights?.length > 0 && (
                <span className="flex items-center gap-1 rounded border border-[#E4E4E7] bg-white px-2 py-0.5 text-[10px] text-[#0B0B0B] uppercase">
                  <Sparkles className="h-2.5 w-2.5 text-[#737373]" />
                  <span>{meeting.highlights.length} CLIPS</span>
                </span>
              )}
            </div>

            {/* Duration Tag */}
            <div className="flex items-center gap-1 text-[11px] text-[#737373] shrink-0 uppercase">
              <Clock className="h-3 w-3 text-[#737373]" />
              <span>{formattedDuration}</span>
            </div>
          </div>

          <div className="mt-3">
            <CardTitle className="text-base font-medium tracking-tight text-[#0B0B0B] group-hover:text-black flex items-center justify-between gap-2">
              <span className="line-clamp-1">{meeting.title}</span>
              <ArrowUpRight className="h-4 w-4 text-[#737373] group-hover:text-[#0B0B0B] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </CardTitle>

            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#737373] uppercase">
              <CalendarIcon className="h-3 w-3 text-[#737373]" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{meeting.participants.length} ATTENDEES</span>
            </div>
          </div>
        </CardHeader>

        {/* Card Content with Summary & Attendees */}
        <CardContent className="p-5 pt-0 pb-3 space-y-3">
          <CardDescription className="line-clamp-2 text-xs leading-relaxed text-[#737373] font-light">
            {summarySnippet}
          </CardDescription>

          <div className="flex items-center justify-between gap-2 pt-1">
            {/* Avatar Cluster */}
            <div className="flex items-center -space-x-1.5 overflow-hidden py-0.5">
              {visibleParticipants.map((p) => (
                <Tooltip key={p.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="h-6 w-6 rounded border border-[#E4E4E7] bg-white shadow-2xs transition-transform hover:scale-110 hover:z-20">
                      <AvatarImage src={p.avatarUrl} alt={p.name} />
                      <AvatarFallback className="rounded bg-[#F4F4F5] text-[9px] font-medium text-[#0B0B0B]">
                        {p.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="border border-[#E4E4E7] bg-white text-xs font-mono text-[#0B0B0B] shadow-md rounded"
                  >
                    <p className="font-semibold">{p.name}</p>
                    {p.role && <p className="text-[10px] text-[#737373]">{p.role}</p>}
                  </TooltipContent>
                </Tooltip>
              ))}

              {remainingCount > 0 && (
                <div className="flex h-6 w-6 items-center justify-center rounded border border-[#E4E4E7] bg-[#F4F4F5] text-[9px] text-[#737373]">
                  +{remainingCount}
                </div>
              )}
            </div>

            {/* Action Item Indicator */}
            {totalActions > 0 && (
              <span className="flex items-center gap-1.5 rounded border border-[#E4E4E7] bg-[#F4F4F5] px-2 py-0.5 text-[10px] text-[#737373] uppercase">
                <ListTodo className="h-3 w-3 text-[#737373]" />
                <span>
                  {pendingActions}/{totalActions} TASKS
                </span>
              </span>
            )}
          </div>
        </CardContent>

        {/* Card Footer with Stipple Action Buttons */}
        <CardFooter className="flex items-center justify-between border-t border-[#E4E4E7] bg-[#F4F4F5]/40 p-3 px-5">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="relative group text-xs text-[#737373] hover:text-[#0B0B0B] transition-colors py-0.5 uppercase tracking-wide flex items-center gap-1"
              title="Copy Summary"
            >
              {copiedSummary ? (
                <>
                  <Check className="h-3 w-3 text-[#0B0B0B]" />
                  <span className="text-[11px]">COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span className="text-[11px]">SUMMARY</span>
                  <span className="stipple-underline w-0 group-hover:w-full" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="relative group text-xs text-[#737373] hover:text-[#0B0B0B] transition-colors py-0.5 uppercase tracking-wide flex items-center gap-1"
              title="Share Recording"
            >
              {copiedShare ? (
                <>
                  <Check className="h-3 w-3 text-[#0B0B0B]" />
                  <span className="text-[11px]">COPIED</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3 w-3" />
                  <span className="text-[11px]">SHARE</span>
                  <span className="stipple-underline w-0 group-hover:w-full" />
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
            className="flex items-center gap-1.5 rounded bg-[#0B0B0B] px-3 py-1 text-[11px] font-medium tracking-wide uppercase text-white hover:opacity-90 transition-opacity"
          >
            <Play className="h-2.5 w-2.5 fill-current" />
            <span>OPEN</span>
          </button>
        </CardFooter>
      </Card>
    </TooltipProvider>
  );
}
