"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { Speaker } from "@/types/meeting";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Users,
  Code,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ClipShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId: string;
  startTime: number;
  endTime: number;
  title?: string;
  transcriptSnippet?: string;
  speakers?: Speaker[];
}

export function ClipShareModal({
  open,
  onOpenChange,
  meetingId,
  startTime,
  endTime,
  title = "Meeting Clip",
  transcriptSnippet: propSnippet,
  speakers: propSpeakers,
}: ClipShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "embed">("link");

  const meetings = useMeetingStore((s) => s.meetings);
  const meeting = useMemo(() => {
    return meetings.find((m) => m.id === meetingId) || null;
  }, [meetings, meetingId]);

  // Extract snippet and participants if not supplied
  const { snippet, clipSpeakers } = useMemo(() => {
    if (!meeting) {
      return {
        snippet: propSnippet || "Key highlight clip from this meeting session.",
        clipSpeakers: propSpeakers || [],
      };
    }

    if (propSnippet && propSpeakers) {
      return { snippet: propSnippet, clipSpeakers: propSpeakers };
    }

    // Filter segments in interval
    const overlapping = meeting.transcript.filter(
      (seg) => seg.start < endTime && seg.end > startTime
    );

    let derivedSnippet = propSnippet;
    if (!derivedSnippet && overlapping.length > 0) {
      derivedSnippet = overlapping
        .map((s) => s.text)
        .join(" ")
        .slice(0, 240);
      if (derivedSnippet.length >= 240) derivedSnippet += "...";
    }

    const speakerIds = new Set(overlapping.map((s) => s.speakerId));
    const matchedSpeakers =
      propSpeakers ||
      meeting.participants.filter((p) => speakerIds.has(p.id));

    return {
      snippet: derivedSnippet || "Key highlight clip from this meeting session.",
      clipSpeakers:
        matchedSpeakers.length > 0
          ? matchedSpeakers
          : meeting.participants.slice(0, 3),
    };
  }, [meeting, startTime, endTime, propSnippet, propSpeakers]);

  // Compute share URL with origin
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const relativePath = `/share/${meetingId}?start=${Math.floor(
    startTime
  )}&end=${Math.ceil(endTime)}&title=${encodeURIComponent(title)}`;
  const fullShareUrl = `${origin}${relativePath}`;

  const embedSnippet = `<iframe src="${fullShareUrl}" width="640" height="420" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(fullShareUrl);
      } else {
        const input = document.createElement("textarea");
        input.value = fullShareUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand("copy");
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyEmbed = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(embedSnippet);
      }
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2500);
    } catch {
      // Fallback
    }
  };

  const duration = Math.max(1, Math.round(endTime - startTime));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl shadow-black/[0.08] sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm">
              <Share2 className="h-5 w-5 text-zinc-950" />
            </div>
            <div>
              <DialogTitle className="font-mono text-base font-semibold uppercase text-zinc-950">
                SHARE VIDEO CLIP // GUEST ACCESS
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] font-medium uppercase text-zinc-500">
                PUBLIC BOUNDED CLIP • ZERO LOGIN REQUIRED
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Clip Preview Card */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase text-zinc-500">
                  <Sparkles className="h-3 w-3" />
                  PUBLIC CLIP PREVIEW
                </span>
                <h4 className="font-sans text-sm font-semibold text-zinc-950 truncate">
                  {title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-600 shadow-sm">
                  <Clock className="h-3 w-3" />
                  {formatTime(duration)}
                </span>
                <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-500 shadow-sm">
                  {formatTime(startTime)} – {formatTime(endTime)}
                </span>
              </div>
            </div>

            {/* Transcript Quote Snippet */}
            <div className="rounded-md border border-zinc-200 bg-white p-3">
              <p className="font-sans text-xs font-medium italic text-zinc-700 leading-relaxed line-clamp-3">
                &ldquo;{snippet}&rdquo;
              </p>
            </div>

            {/* Attendees / Speakers in clip */}
            {clipSpeakers.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-zinc-200">
                <Users className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
                <span className="font-mono text-[10px] font-semibold uppercase text-zinc-500 shrink-0">
                  SPEAKERS:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                  {clipSpeakers.map((spk) => (
                    <span
                      key={spk.id}
                      className="inline-flex items-center gap-1 rounded-sm border border-zinc-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium text-zinc-700 shadow-sm"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-sm"
                        style={{ backgroundColor: spk.color || "#a1a1aa" }}
                      />
                      {spk.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab Selector: Link vs Embed */}
          <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("link")}
              className={cn(
                "rounded-md border px-3 py-1 font-mono text-xs font-semibold uppercase transition-colors",
                activeTab === "link"
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              )}
            >
              PUBLIC URL LINK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("embed")}
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-3 py-1 font-mono text-xs font-semibold uppercase transition-colors",
                activeTab === "embed"
                  ? "border-zinc-950 bg-zinc-950 text-white"
                  : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
              )}
            >
              <Code className="h-3.5 w-3.5" />
              <span>EMBED CODE</span>
            </button>
          </div>

          {/* URL / Embed Copy Section */}
          {activeTab === "link" ? (
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold uppercase text-zinc-700">
                SHAREABLE GUEST URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={fullShareUrl}
                  onFocus={(e) => e.target.select()}
                  className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs text-zinc-950 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={cn(
                    "h-9 shrink-0 flex items-center gap-1.5 rounded-md border px-3.5 font-mono text-xs font-semibold uppercase transition-colors",
                    copiedLink
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                  )}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-semibold uppercase text-zinc-700">
                EMBED HTML SNIPPET
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={embedSnippet}
                  onFocus={(e) => e.target.select()}
                  className="h-9 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 font-mono text-[11px] text-zinc-950 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={cn(
                    "h-9 shrink-0 flex items-center gap-1.5 rounded-md border px-3.5 font-mono text-xs font-semibold uppercase transition-colors",
                    copiedEmbed
                      ? "border-zinc-950 bg-zinc-950 text-white"
                      : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                  )}
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>COPY HTML</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="font-mono text-[10px] font-medium uppercase text-zinc-400">
            NOTE: Guests do not need an account. Link opens directly to bounded video clip & karaoke transcript.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-3 border-t border-zinc-200">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            CLOSE
          </button>

          <div className="flex items-center gap-2">
            <a
              href={relativePath}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3.5 font-mono text-xs font-semibold uppercase text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>TEST GUEST VIEW</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-950 bg-zinc-950 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>LINK COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>COPY SHARE LINK</span>
                </>
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
