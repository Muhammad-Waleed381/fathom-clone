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

// Renders text with inline clickable timestamp buttons in bold monospace with black border
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
              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded font-mono text-xs font-bold text-black bg-[#FEF08A] hover:bg-[#FDE047] border border-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all align-middle cursor-pointer"
              title={`Jump video to ${part}`}
            >
              <Play className="h-2 w-2 fill-black text-black" />
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
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-black bg-white p-6 text-center font-mono text-xs font-bold text-zinc-500 shadow-neo-sm">
        No active meeting selected.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col space-y-4 font-sans", className)}>
      {/* Top Controls: Template Switcher Tabs */}
      <div className="flex flex-col gap-2.5">
        <TemplateSelector />

        {/* Action Toolbar: Category label, Subtabs, Regenerate, Ask AI, Copy Markdown */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-b-2 border-black/10 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
              {activeSummary?.name || "Meeting Summary"}
            </span>

            {/* If on action items template, toggle between AI narrative & checklist */}
            {activeTemplateId === "action_items" && (
              <div className="inline-flex rounded-md bg-[#FAF8F5] p-0.5 border-2 border-black text-xs shadow-neo-sm">
                <button
                  type="button"
                  onClick={() => setActiveSubTab("summary")}
                  className={cn(
                    "px-2 py-0.5 rounded font-mono text-[11px] font-bold transition-all cursor-pointer",
                    activeSubTab === "summary"
                      ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                      : "text-zinc-600 hover:text-black"
                  )}
                >
                  AI Narrative
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubTab("checklist")}
                  className={cn(
                    "px-2 py-0.5 rounded font-mono text-[11px] font-bold transition-all cursor-pointer",
                    activeSubTab === "checklist"
                      ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                      : "text-zinc-600 hover:text-black"
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
                "flex h-8 items-center gap-1.5 rounded-md border-2 border-black px-2.5 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#DDD6FE] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all cursor-pointer",
                showAskAi ? "bg-[#DDD6FE]" : "bg-white"
              )}
              title="Toggle Ask Fathom AI drawer"
            >
              <MessageSquare className="h-3.5 w-3.5 text-black" />
              <span>{showAskAi ? "Hide AI" : "Ask AI"}</span>
            </button>

            {/* Regenerate with AI button */}
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all cursor-pointer",
                isRegenerating && "bg-[#FEF08A] opacity-75"
              )}
              title="Regenerate notes with Fathom AI"
            >
              <RotateCw
                className={cn(
                  "h-3.5 w-3.5 text-black",
                  isRegenerating && "animate-spin"
                )}
              />
              <span className="hidden sm:inline">
                {isRegenerating ? "Synthesizing..." : "Regenerate"}
              </span>
            </button>

            {/* Copy Markdown button with tactile press feedback */}
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="flex h-8 items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#A7F3D0] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all cursor-pointer"
              title="Copy formatted Markdown notes"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-black" />
                  <span className="text-black font-black">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-black" />
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
            <div className="absolute inset-0 z-20 rounded-xl bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center p-6 border-2 border-black shadow-neo">
              <div className="flex items-center gap-2.5 bg-[#FEF08A] border-2 border-black rounded-lg px-4 py-2 shadow-neo">
                <Sparkles className="h-4 w-4 text-black animate-spin" />
                <p className="font-mono text-xs font-bold text-black">
                  Synthesizing {activeSummary?.name}...
                </p>
              </div>
            </div>
          )}

          {/* Executive Overview Card */}
          {activeSummary?.overview && (
            <Card className="rounded-xl border-2 border-black bg-white shadow-neo">
              <CardHeader className="p-3.5 pb-2">
                <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase tracking-wider text-black">
                  <Sparkles className="h-3.5 w-3.5 text-black" />
                  <span>Executive Synthesis</span>
                </div>
              </CardHeader>
              <CardContent className="p-3.5 pt-1 text-xs text-zinc-800 leading-relaxed font-sans">
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
                className="rounded-xl border-2 border-black bg-white shadow-neo"
              >
                <CardHeader className="p-3.5 pb-2">
                  <CardTitle className="font-mono text-xs font-black uppercase text-black flex items-center justify-between">
                    <span>{section.title}</span>
                    {section.timestampRefs && section.timestampRefs.length > 0 && (
                      <span className="font-mono text-[10px] font-bold text-black bg-[#FAF8F5] border border-black px-1.5 py-0.2 rounded shadow-neo-sm">
                        {section.timestampRefs.length} CITATION{section.timestampRefs.length > 1 ? "S" : ""}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-3.5 pt-1 space-y-3">
                  {/* Bullets */}
                  <ul className="space-y-2 text-xs text-zinc-800 font-sans">
                    {section.bullets.map((bullet, bIndex) => (
                      <li
                        key={`b-${bIndex}`}
                        className="flex items-start gap-2 leading-relaxed"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-xs bg-black" />
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
                    <div className="pt-2.5 border-t-2 border-black/10 mt-2.5">
                      <div className="flex items-center gap-1.5 font-mono text-[10px] font-black uppercase tracking-wider text-zinc-600 mb-2">
                        <Clock className="h-3 w-3 text-black" />
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
                                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-xs font-bold border transition-all cursor-pointer shadow-neo-sm",
                                isCurrent
                                  ? "bg-black text-white border-black"
                                  : "bg-[#FEF08A] hover:bg-[#FDE047] text-black border-black hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm"
                              )}
                              title={`Jump to ${formatTime(ref.time)} in recording`}
                            >
                              <Play
                                className={cn(
                                  "h-2.5 w-2.5 fill-current",
                                  isCurrent ? "text-white" : "text-black"
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
