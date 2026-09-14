"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Meeting } from "@/types/meeting";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ArrowRight, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingCardProps {
  meeting: Meeting;
  className?: string;
  onShare?: (meeting: Meeting) => void;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function MeetingCard({ meeting, className, onShare }: MeetingCardProps) {
  const router = useRouter();

  const minutes = Math.round(meeting.duration / 60);
  const snippet =
    meeting.summaries?.executive?.overview ||
    meeting.transcript?.[0]?.text ||
    "";
  const visible = meeting.participants.slice(0, 4);
  const remaining = Math.max(0, meeting.participants.length - 4);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    onShare?.(meeting);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(`/meetings/${meeting.id}`)}
        onKeyDown={(e) => {
          if (e.key === "Enter") router.push(`/meetings/${meeting.id}`);
        }}
        className={cn("group card-invert cursor-pointer", className)}
      >
        <div>
          <div className="flex items-center justify-between gap-3">
            <span className="card-invert-faint text-xs">
              {formatDate(meeting.date)} · {meeting.participants.length} people
            </span>
            <span className="card-invert-faint text-xs">{minutes} min</span>
          </div>

          <p className="mt-4 flex items-start justify-between gap-3 text-lg font-medium leading-snug">
            <span className="line-clamp-2">{meeting.title}</span>
            <ArrowRight className="card-arrow mt-1 shrink-0" />
          </p>

          {snippet && (
            <p className="card-invert-muted mt-3 line-clamp-2 text-sm leading-relaxed">
              {snippet}
            </p>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <div className="flex items-center -space-x-1.5">
            {visible.map((p) => (
              <Tooltip key={p.id}>
                <TooltipTrigger asChild>
                  <Avatar className="h-6 w-6 rounded-full border border-white/30 bg-black transition-colors duration-500 group-hover:border-black/20">
                    <AvatarImage src={p.avatarUrl} alt={p.name} />
                    <AvatarFallback className="rounded-full bg-white/15 text-[9px] font-medium text-white transition-colors duration-500 group-hover:bg-black/10 group-hover:text-black">
                      {p.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border-white/15 bg-surface-raised text-xs text-white">
                  <p className="font-medium">{p.name}</p>
                  {p.role && <p className="text-[10px] text-white/60">{p.role}</p>}
                </TooltipContent>
              </Tooltip>
            ))}
            {remaining > 0 && (
              <span className="card-invert-faint flex h-6 w-6 items-center justify-center rounded-full border border-white/30 text-[9px] group-hover:border-black/20">
                +{remaining}
              </span>
            )}
          </div>

          {onShare && (
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share recording"
              className="card-invert-muted rounded-full p-1.5 transition-colors hover:text-white group-hover:hover:text-black"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
