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
  ArrowRight,
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
    const secs = Math.floor(meeting.duration % 60);
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  })();

  // Total and pending action items
  const totalActions = meeting.actionItems?.length || 0;
  const pendingActions =
    meeting.actionItems?.filter((a) => !a.completed).length || 0;

  // Overview summary text
  const summarySnippet =
    meeting.summaries?.executive?.overview ||
    meeting.transcript?.[0]?.text ||
    "High-fidelity verified recording with multi-speaker diarization and acoustic word karaoke.";

  const visibleParticipants = meeting.participants.slice(0, 4);
  const remainingCount = Math.max(0, meeting.participants.length - 4);

  const handleCopySummary = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const textToCopy = `**${meeting.title}**\n${summarySnippet}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onShare) {
      onShare(meeting);
    } else {
      copyShareLink();
    }
  };

  const copyShareLink = async () => {
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
      <div
        onClick={handleCardClick}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 bg-black/45 p-6 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-pointer text-white",
          className
        )}
      >
        {/* Card Header */}
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {meeting.tags?.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-white/80 group-hover:border-black/20 group-hover:bg-black/5 group-hover:text-black/80 transition-all duration-500 font-mono"
                >
                  {tag}
                </span>
              ))}
              {meeting.highlights?.length > 0 && (
                <span className="flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] text-white/80 group-hover:border-black/20 group-hover:bg-black/5 group-hover:text-black/80 transition-all duration-500 font-mono uppercase">
                  <Sparkles className="h-2.5 w-2.5" />
                  <span>{meeting.highlights.length} CLIPS</span>
                </span>
              )}
            </div>

            {/* Duration Tag */}
            <div className="flex items-center gap-1 text-[11px] text-white/60 group-hover:text-black/60 transition-colors duration-500 shrink-0 uppercase font-mono">
              <Clock className="h-3 w-3" />
              <span>{formattedDuration}</span>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-base sm:text-lg font-medium tracking-tight text-white group-hover:text-black transition-colors duration-500 flex items-center justify-between gap-2">
              <span className="line-clamp-1">{meeting.title}</span>
              <span className="flex items-center gap-1.5 shrink-0">
                <span className="h-px w-0 bg-black transition-all duration-500 ease-out group-hover:w-6 hidden sm:inline-block" />
                <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 text-white/60 group-hover:text-black" />
              </span>
            </h3>

            <div className="mt-1.5 flex items-center gap-2 text-[11px] text-white/60 group-hover:text-black/60 transition-colors duration-500 uppercase font-mono">
              <CalendarIcon className="h-3 w-3" />
              <span>{formattedDate}</span>
              <span>•</span>
              <span>{meeting.participants.length} ATTENDEES</span>
            </div>
          </div>

          {/* Card Content with Summary */}
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-white/70 group-hover:text-black/75 transition-colors duration-500 font-light">
            {summarySnippet}
          </p>
        </div>

        {/* Card Footer: Attendees and Actions */}
        <div className="mt-5 pt-4 border-t border-white/10 group-hover:border-black/10 transition-colors duration-500 flex items-center justify-between gap-3 font-mono">
          {/* Avatar Cluster */}
          <div className="flex items-center -space-x-1.5 overflow-hidden py-0.5">
            {visibleParticipants.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 rounded-full border border-white/30 bg-black shadow-xs transition-transform hover:scale-110 hover:z-20">
                    <AvatarImage src={p.avatarUrl} alt={p.name} />
                    <AvatarFallback className="rounded-full bg-white/15 text-[9px] font-medium text-white">
                      {p.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="border border-white/20 bg-[#121212] text-xs font-mono text-white shadow-xl rounded-xl"
                >
                  <p className="font-semibold">{p.name}</p>
                  {p.role && <p className="text-[10px] text-white/60">{p.role}</p>}
                </TooltipContent>
              </Tooltip>
            ))}

            {remainingCount > 0 && (
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/30 bg-white/10 text-[9px] text-white/80 group-hover:border-black/20 group-hover:text-black">
                +{remainingCount}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopySummary}
              className="text-[11px] text-white/60 group-hover:text-black/70 hover:text-white transition-colors uppercase p-1"
              title="Copy Summary"
            >
              {copiedSummary ? (
                <span className="font-bold text-black group-hover:text-black">COPIED</span>
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="text-[11px] text-white/60 group-hover:text-black/70 hover:text-white transition-colors uppercase p-1"
              title="Share Recording"
            >
              {copiedShare ? (
                <span className="font-bold text-black group-hover:text-black">COPIED</span>
              ) : (
                <Share2 className="h-3.5 w-3.5" />
              )}
            </button>

            <span className="flex items-center gap-1 rounded-full border border-white/20 group-hover:border-black/20 bg-white/10 group-hover:bg-black group-hover:text-white px-2.5 py-1 text-[10px] uppercase tracking-wider text-white transition-all duration-500">
              <span>OPEN</span>
              <Play className="h-2 w-2 fill-current" />
            </span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
