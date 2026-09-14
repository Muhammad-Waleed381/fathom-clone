"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { SEED_MEETINGS } from "@/data/seed-meetings";
import { Meeting, MeetingHighlight } from "@/types/meeting";
import { VideoPlayer } from "@/components/player/video-player";
import { SpeakerPresenceBar } from "@/components/player/speaker-presence-bar";
import { AiNotesPanel } from "@/components/notes/ai-notes-panel";
import { TranscriptViewer } from "@/components/transcript/transcript-viewer";
import { ActionItemsList } from "@/components/notes/action-items-list";
import { AskFathomChat } from "@/components/notes/ask-fathom-chat";
import { HighlightModal } from "@/components/highlights/highlight-modal";
import { ClipShareModal } from "@/components/highlights/clip-share-modal";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { formatTime } from "@/components/player/video-scrubber";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Copy,
  Check,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

type PanelTab = "notes" | "transcript" | "actions" | "ask";

const PANEL_TABS: { id: PanelTab; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "transcript", label: "Transcript" },
  { id: "actions", label: "Actions" },
  { id: "ask", label: "Ask" },
];

const actionButton =
  "inline-flex h-9 items-center gap-1.5 rounded-full border border-white/20 px-4 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black";

function MeetingDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = (params?.id as string) || "";
  const queryTime = searchParams?.get("t");

  const meetings = useMeetingStore((s) => s.meetings);
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);
  const seekTo = useMeetingStore((s) => s.seekTo);

  const [activeTab, setActiveTab] = useState<PanelTab>("notes");

  const [highlightModalOpen, setHighlightModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const [shareStart, setShareStart] = useState(0);
  const [shareEnd, setShareEnd] = useState(60);
  const [shareTitle, setShareTitle] = useState("");

  const [copiedSummary, setCopiedSummary] = useState(false);

  const meeting: Meeting | null = useMemo(() => {
    const fromStore = meetings.find((m) => m.id === id);
    if (fromStore) return fromStore;
    const fromSeed = SEED_MEETINGS.find((m) => m.id === id);
    if (fromSeed) return fromSeed;
    return meetings[0] || SEED_MEETINGS[0] || null;
  }, [id, meetings]);

  useEffect(() => {
    if (meeting && (!currentMeeting || currentMeeting.id !== meeting.id)) {
      setCurrentMeeting(meeting.id);
    }
  }, [meeting, currentMeeting, setCurrentMeeting]);

  useEffect(() => {
    if (queryTime !== null && queryTime !== undefined) {
      const parsed = parseFloat(queryTime);
      if (!isNaN(parsed) && parsed >= 0) seekTo(parsed);
    }
  }, [queryTime, seekTo]);

  const handleCopySummary = async () => {
    if (!meeting) return;
    const summary =
      meeting.summaries?.executive?.overview ||
      meeting.summaries?.engineering?.overview ||
      "";
    const sections = meeting.summaries?.executive?.sections || [];
    const sectionText = sections
      .map((s) => `### ${s.title}\n${s.bullets.map((b) => `- ${b}`).join("\n")}`)
      .join("\n\n");
    try {
      await navigator.clipboard.writeText(`# ${meeting.title}\n\n${summary}\n\n${sectionText}`);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const handleOpenShare = (start?: number, end?: number, title?: string) => {
    if (!meeting) return;
    const actualStart = start !== undefined ? start : Math.max(0, currentTime - 15);
    const actualEnd = end !== undefined ? end : Math.min(meeting.duration, actualStart + 30);
    setShareStart(actualStart);
    setShareEnd(actualEnd);
    setShareTitle(title || `Clip: ${meeting.title}`);
    setShareModalOpen(true);
  };

  const handleHighlightCreated = (highlight: MeetingHighlight) => {
    handleOpenShare(highlight.start, highlight.end, highlight.title);
  };

  if (!meeting) {
    return (
      <div className="section flex min-h-screen flex-col items-center justify-center text-center">
        <h2 className="display-h2 text-white">Meeting not found</h2>
        <p className="lede mt-4 text-white/60">That recording isn&apos;t in this workspace.</p>
        <Link href="/dashboard" className={cn(actionButton, "mt-8")}>
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return new Date(meeting.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    } catch {
      return meeting.date;
    }
  })();

  const pendingActionCount = meeting.actionItems?.filter((a) => !a.completed).length || 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="section pt-28 sm:pt-32 md:pt-36">
        {/* Header */}
        <div className="flex flex-col gap-6 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[13px] text-white/60 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Dashboard
            </Link>
            <p className="eyebrow mt-6">
              {formattedDate} · {formatTime(meeting.duration)} · {meeting.participants.length} people
              {meeting.tags?.[0] && ` · ${meeting.tags[0]}`}
            </p>
            <h1 className="display-h2 mt-3 max-w-4xl text-white">{meeting.title}</h1>

            <div className="mt-5 flex items-center -space-x-1.5">
              {meeting.participants.slice(0, 8).map((p) => (
                <Avatar key={p.id} className="h-7 w-7 rounded-full border border-white/25 bg-black" title={p.name}>
                  {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                  <AvatarFallback className="bg-white/10 text-[9px] font-medium text-white">
                    {p.name[0]}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setHighlightModalOpen(true)} className={cn(actionButton, "border-white bg-white text-black hover:bg-white/90")}>
              <Bookmark className="h-3.5 w-3.5 fill-current" />
              Highlight
            </button>
            <button type="button" onClick={() => handleOpenShare()} className={actionButton}>
              <Share2 className="h-3.5 w-3.5" />
              Share
            </button>
            <button type="button" onClick={handleCopySummary} className={actionButton}>
              {copiedSummary ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedSummary ? "Copied" : "Copy notes"}
            </button>
            <button type="button" onClick={() => setSettingsModalOpen(true)} aria-label="Settings" className={cn(actionButton, "w-9 justify-center px-0")}>
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Player + workspace */}
        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-7">
            <VideoPlayer />
            <SpeakerPresenceBar />
          </div>

          <div className="flex min-h-[640px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-surface-raised lg:col-span-5">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as PanelTab)}
              className="flex h-full flex-col"
            >
              <TabsList className="h-auto justify-start gap-1 rounded-none border-b border-white/10 bg-transparent p-2">
                {PANEL_TABS.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="rounded-full px-3.5 py-1.5 text-[13px] font-medium text-white/60 transition-colors data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-none"
                  >
                    {tab.label}
                    {tab.id === "actions" && pendingActionCount > 0 && (
                      <span className="ml-1.5 text-[11px] opacity-70">{pendingActionCount}</span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="notes" className="m-0 flex-1 overflow-y-auto p-4">
                <AiNotesPanel className="border-none bg-transparent p-0 shadow-none" />
              </TabsContent>
              <TabsContent value="transcript" className="m-0 flex-1 overflow-hidden p-4">
                <TranscriptViewer className="h-[620px] border-none bg-transparent shadow-none" onClipCreated={handleHighlightCreated} />
              </TabsContent>
              <TabsContent value="actions" className="m-0 flex-1 overflow-y-auto p-4">
                <ActionItemsList className="border-none bg-transparent p-0 shadow-none" />
              </TabsContent>
              <TabsContent value="ask" className="m-0 flex-1 overflow-hidden p-4">
                <AskFathomChat className="h-[620px] border-none bg-transparent shadow-none" />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <HighlightModal
          open={highlightModalOpen}
          onOpenChange={setHighlightModalOpen}
          meetingId={meeting.id}
          initialStartTime={Math.max(0, currentTime - 15)}
          initialEndTime={Math.min(meeting.duration, currentTime + 15)}
          onHighlightCreated={handleHighlightCreated}
          onOpenShareModal={handleHighlightCreated}
        />
        <ClipShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          meetingId={meeting.id}
          startTime={shareStart}
          endTime={shareEnd}
          title={shareTitle}
          speakers={meeting.participants}
          transcriptSnippet={
            meeting.transcript?.find((s) => s.start <= shareStart && shareStart <= s.end)?.text ||
            meeting.summaries?.executive?.overview
          }
        />
        <ApiKeysModal open={settingsModalOpen} onOpenChange={setSettingsModalOpen} />
      </div>
    </TooltipProvider>
  );
}

export default function MeetingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}
