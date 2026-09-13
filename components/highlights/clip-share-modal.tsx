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
      <DialogContent className="max-w-lg border-2 border-black bg-[#FAF8F5] p-6 text-black shadow-[6px_6px_0px_0px_#000] sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left border-b-2 border-black pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-[#A7F3D0] shadow-neo-sm">
              <Share2 className="h-5 w-5 stroke-[2.5] text-black" />
            </div>
            <div>
              <DialogTitle className="font-mono text-base font-black uppercase text-black">
                SHARE VIDEO CLIP // GUEST ACCESS
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] font-bold uppercase text-neutral-600">
                PUBLIC BOUNDED CLIP • ZERO LOGIN REQUIRED
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Clip Preview Card */}
          <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo-sm space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="flex items-center gap-1 font-mono text-[10px] font-black uppercase text-neutral-600">
                  <Sparkles className="h-3 w-3 stroke-[2.5]" />
                  PUBLIC CLIP PREVIEW
                </span>
                <h4 className="font-sans text-sm font-black text-black truncate">
                  {title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <span className="flex items-center gap-1 rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[11px] font-black text-black shadow-neo-sm">
                  <Clock className="h-3 w-3 stroke-[2.5]" />
                  {formatTime(duration)}
                </span>
                <span className="rounded border-2 border-black bg-[#FAF8F5] px-2 py-0.5 font-mono text-[11px] font-bold text-black shadow-neo-sm">
                  {formatTime(startTime)} – {formatTime(endTime)}
                </span>
              </div>
            </div>

            {/* Transcript Quote Snippet */}
            <div className="rounded-lg border-2 border-black bg-[#FAF8F5] p-3 shadow-neo-sm">
              <p className="font-sans text-xs font-medium italic text-black leading-relaxed line-clamp-3">
                &ldquo;{snippet}&rdquo;
              </p>
            </div>

            {/* Attendees / Speakers in clip */}
            {clipSpeakers.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t-2 border-black">
                <Users className="h-3.5 w-3.5 stroke-[2.5] text-black shrink-0" />
                <span className="font-mono text-[10px] font-black uppercase text-neutral-600 shrink-0">
                  SPEAKERS:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                  {clipSpeakers.map((spk) => (
                    <span
                      key={spk.id}
                      className="inline-flex items-center gap-1 rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black shadow-neo-sm"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full border border-black"
                        style={{ backgroundColor: spk.color || "#FEF08A" }}
                      />
                      {spk.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab Selector: Link vs Embed */}
          <div className="flex items-center gap-2 border-b-2 border-black pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("link")}
              className={cn(
                "rounded-md border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase transition-all",
                activeTab === "link"
                  ? "bg-black text-white shadow-neo-sm"
                  : "bg-white text-black hover:bg-[#FEF08A]"
              )}
            >
              PUBLIC URL LINK
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("embed")}
              className={cn(
                "flex items-center gap-1.5 rounded-md border-2 border-black px-3 py-1 font-mono text-xs font-black uppercase transition-all",
                activeTab === "embed"
                  ? "bg-black text-white shadow-neo-sm"
                  : "bg-white text-black hover:bg-[#FEF08A]"
              )}
            >
              <Code className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>EMBED CODE</span>
            </button>
          </div>

          {/* URL / Embed Copy Section */}
          {activeTab === "link" ? (
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-black uppercase text-black">
                SHAREABLE GUEST URL
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={fullShareUrl}
                  onFocus={(e) => e.target.select()}
                  className="h-9 w-full rounded-md border-2 border-black bg-white px-3 font-mono text-xs text-black shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={cn(
                    "h-9 shrink-0 flex items-center gap-1.5 rounded-md border-2 border-black px-3.5 font-mono text-xs font-black uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                    copiedLink
                      ? "bg-[#A7F3D0] text-black"
                      : "bg-[#FEF08A] text-black"
                  )}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>COPY LINK</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="font-mono text-xs font-black uppercase text-black">
                EMBED HTML SNIPPET
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={embedSnippet}
                  onFocus={(e) => e.target.select()}
                  className="h-9 w-full rounded-md border-2 border-black bg-white px-3 font-mono text-[11px] text-black shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={cn(
                    "h-9 shrink-0 flex items-center gap-1.5 rounded-md border-2 border-black px-3.5 font-mono text-xs font-black uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                    copiedEmbed
                      ? "bg-[#A7F3D0] text-black"
                      : "bg-[#DDD6FE] text-black"
                  )}
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
                      <span>COPY HTML</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          <p className="font-mono text-[10px] font-bold uppercase text-neutral-600">
            NOTE: Guests do not need an account. Link opens directly to bounded video clip & karaoke transcript.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-3 border-t-2 border-black">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            CLOSE
          </button>

          <div className="flex items-center gap-2">
            <a
              href={relativePath}
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#BAE6FD] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>TEST GUEST VIEW</span>
            </a>

            <button
              type="button"
              onClick={handleCopyLink}
              className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-4 font-mono text-xs font-black uppercase tracking-wider text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>LINK COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
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
