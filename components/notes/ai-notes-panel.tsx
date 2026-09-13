"use client";

import React, { useState } from "react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { formatTime } from "@/components/player/video-scrubber";
import { TemplateSelector } from "./template-selector";
import { ActionItemsList } from "./action-items-list";
import { AskFathomChat } from "./ask-fathom-chat";
import { SummarySection, SummaryTemplateId } from "@/types/meeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  Check,
  Sparkles,
  Play,
  RotateCw,
  Clock,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AiNotesPanelProps {
  className?: string;
}

// Convert "04:15" or "14:22" or "1:05:30" string to seconds
function parseTimeToSeconds(timeStr: string): number {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Renders text with inline clickable timestamp buttons (e.g. 04:15, 14:22)
function RichTextWithTimestamps({
  text,
  onSeek,
}: {
  text: string;
  onSeek: (time: number) => void;
}) {
  const timestampRegex = /(\b\d{1,2}:\d{2}(?::\d{2})?\b)/g;
  const parts = text.split(timestampRegex);

  return (
    <span>
      {parts.map((part, index) => {
        if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(part)) {
          const seconds = parseTimeToSeconds(part);
          return (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSeek(seconds);
              }}
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md text-xs font-mono font-medium text-primary bg-primary/10 hover:bg-primary/20 hover:text-white border border-primary/20 transition-colors align-middle cursor-pointer"
              title={`Jump video to ${part}`}
            >
              <Play className="h-2.5 w-2.5 fill-current" />
              <span>{part}</span>
            </button>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}

export function AiNotesPanel({ className }: AiNotesPanelProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const activeTemplateId = useMeetingStore((s) => s.activeTemplateId);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const seekTo = useMeetingStore((s) => s.seekTo);

  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showAskAi, setShowAskAi] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"summary" | "checklist">(
    "summary"
  );

  const activeSummary = currentMeeting?.summaries?.[activeTemplateId];

  const handleCopySummary = async () => {
    if (!currentMeeting || !activeSummary) return;

    const sectionsText = activeSummary.sections
      .map((sec) => {
        const bullets = sec.bullets.map((b) => `- ${b}`).join("\n");
        const refs = sec.timestampRefs?.length
          ? `\nKey Moments:\n` +
            sec.timestampRefs
              .map((r) => `  * ${r.text} [${formatTime(r.time)}]`)
              .join("\n")
          : "";
        return `### ${sec.title}\n${bullets}${refs}`;
      })
      .join("\n\n");

    const fullMarkdown = [
      `# ${activeSummary.name}`,
      `**Meeting:** ${currentMeeting.title}`,
      `**Date:** ${new Date(currentMeeting.date).toLocaleDateString()} | **Duration:** ${formatTime(currentMeeting.duration)}`,
      "",
      `## Executive Overview`,
      activeSummary.overview,
      "",
      sectionsText,
      "",
      `— Generated with Fathom AI Notes Assistant`,
    ].join("\n");

    try {
      if (navigator?.clipboard) {
        await navigator.clipboard.writeText(fullMarkdown);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = fullMarkdown;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy summary to clipboard", err);
    }
  };

  const handleRegenerate = () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    // Simulate streaming AI regeneration effect
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1800);
  };

  if (!currentMeeting) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 p-6 text-center text-sm text-slate-400">
        No active meeting selected.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-5", className)}>
      {/* Top Controls: Template Switcher Tabs */}
      <div className="flex flex-col gap-3">
        <TemplateSelector />

        {/* Action toolbar: Copy & Regenerate */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {activeSummary?.name || "Meeting Summary"}
            </span>

            {/* If on action items template, allow toggle between AI summary narrative & interactive checklist */}
            {activeTemplateId === "action_items" && (
              <div className="inline-flex rounded-lg bg-slate-900/90 p-0.5 border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("summary")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer",
                    activeSubTab === "summary"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  AI Narrative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("checklist")}
                  className={cn(
                    "px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer",
                    activeSubTab === "checklist"
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:text-slate-200"
                  )}
                >
                  Interactive Checklist ({currentMeeting.actionItems.length})
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Ask AI toggle button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAskAi(!showAskAi)}
              className={cn(
                "h-8 gap-1.5 text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer",
                showAskAi && "border-primary/60 bg-primary/15 text-primary font-medium"
              )}
              title="Toggle interactive Ask Fathom AI conversation"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{showAskAi ? "Hide Ask AI" : "Ask AI"}</span>
            </Button>

            {/* Regenerate with AI button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={cn(
                "h-8 gap-1.5 text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-all",
                isRegenerating && "border-primary/50 text-primary animate-pulse"
              )}
              title="Regenerate this template using Fathom AI"
            >
              <RotateCw
                className={cn(
                  "h-3.5 w-3.5",
                  isRegenerating ? "animate-spin text-primary" : "text-slate-400"
                )}
              />
              <span>{isRegenerating ? "Generating..." : "Regenerate with AI"}</span>
            </Button>

            {/* Copy Summary button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySummary}
              className="h-8 gap-1.5 text-xs border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200"
              title="Copy formatted markdown summary"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span>Copy Summary</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Embedded Ask Fathom AI Chat Box when toggled */}
      {showAskAi && (
        <div className="animate-in fade-in-50 duration-200">
          <AskFathomChat />
        </div>
      )}

      {/* Main Content Area */}
      {activeTemplateId === "action_items" && activeSubTab === "checklist" ? (
        <ActionItemsList showHeader={false} />
      ) : (
        <div className="relative space-y-4">
          {/* Shimmer Streaming Overlay during AI Regeneration */}
          {isRegenerating && (
            <div className="absolute inset-0 z-20 rounded-2xl bg-slate-950/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 transition-all duration-300 border border-primary/30">
              <div className="flex items-center gap-3 bg-slate-900/90 border border-primary/40 rounded-xl px-5 py-3 shadow-xl">
                <Sparkles className="h-5 w-5 text-primary animate-spin" />
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white tracking-wide">
                    Regenerating {activeSummary?.name}...
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Extracting key takeaways & timestamp references
                  </p>
                </div>
              </div>
              {/* Shimmer skeleton lines */}
              <div className="w-full max-w-lg mt-6 space-y-3 px-4">
                <div className="h-4 w-3/4 rounded-md bg-slate-800 animate-pulse" />
                <div className="h-4 w-full rounded-md bg-slate-800/70 animate-pulse" />
                <div className="h-4 w-5/6 rounded-md bg-slate-800/50 animate-pulse" />
              </div>
            </div>
          )}

          {/* Executive Overview Card */}
          {activeSummary?.overview && (
            <Card className="rounded-xl border-slate-800/90 bg-slate-900/60 shadow-xs backdrop-blur-xs">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Overview & Executive Synthesis</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-sm text-slate-200 leading-relaxed">
                <RichTextWithTimestamps
                  text={activeSummary.overview}
                  onSeek={seekTo}
                />
              </CardContent>
            </Card>
          )}

          {/* Bulleted Sections */}
          <div className="space-y-4">
            {activeSummary?.sections?.map((section, sIndex) => (
              <Card
                key={`sec-${sIndex}`}
                className="rounded-xl border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/70 transition-colors shadow-xs"
              >
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-100 flex items-center justify-between">
                    <span>{section.title}</span>
                    {section.timestampRefs && section.timestampRefs.length > 0 && (
                      <span className="text-[11px] font-normal text-slate-400 font-mono">
                        {section.timestampRefs.length} citation
                        {section.timestampRefs.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2 space-y-3">
                  {/* Bullets */}
                  <ul className="space-y-2 text-sm text-slate-300">
                    {section.bullets.map((bullet, bIndex) => (
                      <li
                        key={`b-${bIndex}`}
                        className="flex items-start gap-2.5 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                        <span className="flex-1">
                          <RichTextWithTimestamps
                            text={bullet}
                            onSeek={seekTo}
                          />
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Timestamp References Citations */}
                  {section.timestampRefs && section.timestampRefs.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 mt-3">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <Clock className="h-3 w-3" />
                        <span>Key Moments & Playback Markers</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.timestampRefs.map((ref, rIndex) => {
                          const isCurrent =
                            Math.abs(currentTime - ref.time) < 6;

                          return (
                            <button
                              key={`ref-${rIndex}`}
                              type="button"
                              onClick={() => seekTo(ref.time)}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs transition-all cursor-pointer border group",
                                isCurrent
                                  ? "bg-primary text-white border-primary shadow-sm font-semibold ring-1 ring-primary/50"
                                  : "bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700/90 border-slate-700/70"
                              )}
                              title={`Jump to ${formatTime(ref.time)} in recording`}
                            >
                              <Play
                                className={cn(
                                  "h-3 w-3 fill-current transition-transform group-hover:scale-110",
                                  isCurrent ? "text-white" : "text-primary"
                                )}
                              />
                              <span className="font-mono text-[11px]">
                                {formatTime(ref.time)}
                              </span>
                              <span
                                className={cn(
                                  "max-w-[200px] truncate",
                                  isCurrent ? "text-white" : "text-slate-400 group-hover:text-slate-200"
                                )}
                              >
                                {ref.text}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
