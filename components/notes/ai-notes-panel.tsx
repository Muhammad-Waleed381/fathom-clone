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
  MessageSquare,
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

// Renders text with inline clickable timestamp buttons in monospace
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
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded-md font-mono text-xs font-medium text-zinc-700 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors align-middle cursor-pointer"
              title={`Jump video to ${part}`}
            >
              <Play className="h-2 w-2 fill-zinc-600 text-zinc-600" />
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
  const [activeSubTab, setActiveSubTab] = useState<"summary" | "checklist">("summary");

  const activeSummary = currentMeeting?.summaries?.[activeTemplateId];

  const handleCopyMarkdown = async () => {
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
      `— Synchronized via Fathom AI`,
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
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  if (!currentMeeting) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-zinc-200 bg-white p-6 text-center font-mono text-xs font-medium text-zinc-500 shadow-sm">
        No active meeting selected.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4 font-sans", className)}>
      {/* Top Controls: Template Switcher Tabs */}
      <div className="flex flex-col gap-2.5">
        <TemplateSelector />

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b border-zinc-200 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950">
              {activeSummary?.name || "Meeting Summary"}
            </span>

            {/* If on action items template, toggle between AI narrative & checklist */}
            {activeTemplateId === "action_items" && (
              <div className="inline-flex rounded-md bg-zinc-50 p-0.5 border border-zinc-200 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("summary")}
                  className={cn(
                    "px-2 py-0.5 rounded-sm font-mono text-[11px] font-medium transition-all cursor-pointer",
                    activeSubTab === "summary"
                      ? "bg-white text-zinc-950 border border-zinc-200 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  AI Narrative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("checklist")}
                  className={cn(
                    "px-2 py-0.5 rounded-sm font-mono text-[11px] font-medium transition-all cursor-pointer",
                    activeSubTab === "checklist"
                      ? "bg-white text-zinc-950 border border-zinc-200 shadow-sm"
                      : "text-zinc-500 hover:text-zinc-700"
                  )}
                >
                  Checklist ({currentMeeting.actionItems.length})
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Ask AI toggle button */}
            <button
              type="button"
              onClick={() => setShowAskAi(!showAskAi)}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 font-mono text-xs font-medium text-zinc-700 transition-colors cursor-pointer hover:bg-zinc-50 hover:text-zinc-950",
                showAskAi ? "bg-zinc-100 border-zinc-300" : "bg-white"
              )}
              title="Toggle Ask Fathom AI drawer"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{showAskAi ? "Hide AI" : "Ask AI"}</span>
            </button>

            {/* Regenerate with AI button */}
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer",
                isRegenerating && "opacity-75"
              )}
              title="Regenerate notes with Fathom AI"
            >
              <RotateCw
                className={cn(
                  "h-3.5 w-3.5",
                  isRegenerating && "animate-spin"
                )}
              />
              <span className="hidden sm:inline">
                {isRegenerating ? "Synthesizing..." : "Regenerate"}
              </span>
            </button>

            {/* Copy Markdown button with tactile feedback */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
              title="Copy formatted Markdown notes"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Ask Fathom AI Chat Box when toggled */}
      {showAskAi && (
        <div className="animate-in fade-in-50 duration-150">
          <AskFathomChat />
        </div>
      )}

      {/* Main Content Area */}
      {activeTemplateId === "action_items" && activeSubTab === "checklist" ? (
        <ActionItemsList showHeader={false} />
      ) : (
        <div className="relative space-y-4">
          {/* Shimmer Overlay during AI Regeneration */}
          {isRegenerating && (
            <div className="absolute inset-0 z-20 rounded-xl bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 border border-zinc-200 shadow-sm">
              <div className="flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 shadow-sm">
                <Sparkles className="h-4 w-4 text-zinc-600 animate-spin" />
                <p className="font-mono text-xs font-medium text-zinc-700">
                  Synthesizing {activeSummary?.name}...
                </p>
              </div>
            </div>
          )}

          {/* Executive Overview Card */}
          {activeSummary?.overview && (
            <Card className="rounded-xl border border-zinc-200 bg-white shadow-sm">
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950">
                  <Sparkles className="h-3.5 w-3.5 text-zinc-600" />
                  <span>Executive Synthesis</span>
                </div>
              </CardHeader>
              <CardContent className="p-3.5 pt-1 text-xs text-zinc-700 leading-relaxed font-sans">
                <RichTextWithTimestamps
                  text={activeSummary.overview}
                  onSeek={seekTo}
                />
              </CardContent>
            </Card>
          )}

          {/* Dense, Editorial Bulleted Sections */}
          <div className="space-y-4">
            {activeSummary?.sections?.map((section, sIndex) => (
              <Card
                key={`sec-${sIndex}`}
                className="rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="font-mono text-xs font-semibold uppercase text-zinc-950 flex items-center justify-between">
                    <span>{section.title}</span>
                    {section.timestampRefs && section.timestampRefs.length > 0 && (
                      <span className="font-mono text-[10px] font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded-md">
                        {section.timestampRefs.length} citation{section.timestampRefs.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3.5 pt-1 space-y-3">
                  {/* Bullets */}
                  <ul className="space-y-2 text-xs text-zinc-700 font-sans">
                    {section.bullets.map((bullet, bIndex) => (
                      <li
                        key={`b-${bIndex}`}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-zinc-400" />
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
                    <div className="pt-2.5 border-t border-zinc-100 mt-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-zinc-500 mb-2">
                        <Clock className="h-3 w-3" />
                        <span>Key Moments</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {section.timestampRefs.map((ref, rIndex) => {
                          const isCurrent =
                            Math.abs(currentTime - ref.time) < 6;

                          return (
                            <button
                              key={`ref-${rIndex}`}
                              type="button"
                              onClick={() => seekTo(ref.time)}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-xs font-medium border transition-colors cursor-pointer",
                                isCurrent
                                  ? "bg-zinc-950 text-white border-zinc-950"
                                  : "bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200"
                              )}
                              title={`Jump to ${formatTime(ref.time)} in recording`}
                            >
                              <Play
                                className={cn(
                                  "h-2.5 w-2.5 fill-current",
                                  isCurrent ? "text-white" : "text-zinc-500"
                                )}
                              />
                              <span>{formatTime(ref.time)}</span>
                              <span className="max-w-[180px] truncate">
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
