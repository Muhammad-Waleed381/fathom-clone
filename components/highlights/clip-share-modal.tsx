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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { Speaker } from "@/types/meeting";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Share2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Play,
  Users,
  Code,
  Sparkles,
} from "lucide-react";

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
    const matchedSpeakers = propSpeakers || meeting.participants.filter((p) => speakerIds.has(p.id));

    return {
      snippet: derivedSnippet || "Key highlight clip from this meeting session.",
      clipSpeakers: matchedSpeakers.length > 0 ? matchedSpeakers : meeting.participants.slice(0, 3),
    };
  }, [meeting, startTime, endTime, propSnippet, propSpeakers]);

  // Compute share URL with origin
  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const relativePath = `/share/${meetingId}?start=${Math.floor(startTime)}&end=${Math.ceil(endTime)}&title=${encodeURIComponent(title)}`;
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
      <DialogContent className="max-w-lg border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-white">
                Share Video Clip
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Anyone with this public link can view this clip with zero login required.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Clip Preview Card */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 transition-all hover:border-slate-700 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <span className="text-[11px] font-medium tracking-wide uppercase text-indigo-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Public Clip Preview
                </span>
                <h4 className="text-sm font-semibold text-slate-100 truncate">
                  {title}
                </h4>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-[11px] px-2 py-0.5 flex items-center gap-1"
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(duration)}
                </Badge>
                <Badge
                  variant="outline"
                  className="border-slate-700 bg-slate-800/80 text-slate-300 font-mono text-[11px] px-2 py-0.5"
                >
                  {formatTime(startTime)} – {formatTime(endTime)}
                </Badge>
              </div>
            </div>

            {/* Transcript Quote Snippet */}
            <div className="relative rounded-lg bg-slate-950/80 p-3 border border-slate-800/80">
              <p className="text-xs text-slate-300 italic leading-relaxed line-clamp-3">
                &ldquo;{snippet}&rdquo;
              </p>
            </div>

            {/* Attendees / Speakers in clip */}
            {clipSpeakers.length > 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <Users className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                <span className="text-[11px] text-slate-400 shrink-0">Speakers:</span>
                <div className="flex flex-wrap items-center gap-1.5 overflow-hidden">
                  {clipSpeakers.map((spk) => (
                    <span
                      key={spk.id}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium border border-slate-800 bg-slate-900/90 text-slate-300"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: spk.color || "#6366F1" }}
                      />
                      {spk.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tab Selector: Link vs Embed */}
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab("link")}
              className={`text-xs font-medium px-2 py-1 rounded transition-colors ${
                activeTab === "link"
                  ? "bg-slate-800 text-indigo-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Public URL Link
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("embed")}
              className={`text-xs font-medium px-2 py-1 rounded flex items-center gap-1 transition-colors ${
                activeTab === "embed"
                  ? "bg-slate-800 text-indigo-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code className="h-3 w-3" />
              Embed Code
            </button>
          </div>

          {/* URL / Embed Copy Section */}
          {activeTab === "link" ? (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Shareable Guest URL
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    readOnly
                    value={fullShareUrl}
                    className="pr-8 font-mono text-xs border-slate-800 bg-slate-900 text-slate-200 selection:bg-indigo-500/30"
                    onFocus={(e) => e.target.select()}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleCopyLink}
                  className={`shrink-0 gap-1.5 transition-all text-xs h-9 ${
                    copiedLink
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy Share Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Embed HTML Snippet
              </label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={embedSnippet}
                  className="font-mono text-[11px] border-slate-800 bg-slate-900 text-slate-300"
                  onFocus={(e) => e.target.select()}
                />
                <Button
                  type="button"
                  onClick={handleCopyEmbed}
                  className={`shrink-0 gap-1.5 text-xs h-9 ${
                    copiedEmbed
                      ? "bg-emerald-600 hover:bg-emerald-500 text-white"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                  }`}
                >
                  {copiedEmbed ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy HTML
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <p className="text-[11px] text-slate-500">
            💡 Guests do not need an account. The page opens directly to your bounded video clip and transcript.
          </p>
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-2 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white gap-1.5"
            >
              <a href={relativePath} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
                Open Guest Page
              </a>
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={handleCopyLink}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Link Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Share Link
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
