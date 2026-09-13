"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatTime } from "@/components/player/video-scrubber";
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Sparkles,
  Copy,
  Check,
  Settings,
  Clock,
  Calendar,
  FileText,
  ListTodo,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

function MeetingDetailContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = (params?.id as string) || "";
  const queryTime = searchParams?.get("t");

  const meetings = useMeetingStore((s) => s.meetings);
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);
  const seekTo = useMeetingStore((s) => s.seekTo);

  // Active right-panel tab
  const [activeTab, setActiveTab] = useState<"notes" | "transcript" | "actions" | "ask">("notes");

  // Modals state
  const [highlightModalOpen, setHighlightModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Active clip bounds for sharing
  const [shareStart, setShareStart] = useState<number>(0);
  const [shareEnd, setShareEnd] = useState<number>(60);
  const [shareTitle, setShareTitle] = useState<string>("");

  const [copiedSummary, setCopiedSummary] = useState(false);

  // Match meeting from store or fallback to SEED_MEETINGS
  const meeting: Meeting | null = useMemo(() => {
    const fromStore = meetings.find((m) => m.id === id);
    if (fromStore) return fromStore;
    const fromSeed = SEED_MEETINGS.find((m) => m.id === id);
    if (fromSeed) return fromSeed;
    return meetings[0] || SEED_MEETINGS[0] || null;
  }, [id, meetings]);

  // Synchronize current meeting in store
  useEffect(() => {
    if (meeting && (!currentMeeting || currentMeeting.id !== meeting.id)) {
      setCurrentMeeting(meeting.id);
    }
  }, [meeting, currentMeeting, setCurrentMeeting]);

  // Handle URL timestamp jump (?t=)
  useEffect(() => {
    if (queryTime !== null && queryTime !== undefined) {
      const parsedTime = parseFloat(queryTime);
      if (!isNaN(parsedTime) && parsedTime >= 0) {
        seekTo(parsedTime);
      }
    }
  }, [queryTime, seekTo]);

  // Copy Executive Summary
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
    const fullText = `# ${meeting.title}\n\n${summary}\n\n${sectionText}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Open Highlight Creation modal at current time
  const handleOpenHighlight = () => {
    setHighlightModalOpen(true);
  };

  // Open Share modal
  const handleOpenShare = (start?: number, end?: number, title?: string) => {
    if (!meeting) return;
    const actualStart = start !== undefined ? start : Math.max(0, currentTime - 15);
    const actualEnd = end !== undefined ? end : Math.min(meeting.duration, actualStart + 30);
    setShareStart(actualStart);
    setShareEnd(actualEnd);
    setShareTitle(title || `Clip: ${meeting.title}`);
    setShareModalOpen(true);
  };

  // Handle clip created from transcript or highlight modal
  const handleHighlightCreated = (highlight: MeetingHighlight) => {
    handleOpenShare(highlight.start, highlight.end, highlight.title);
  };

  if (!meeting) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] px-4 text-center text-black">
        <div className="p-8 rounded-xl border-2 border-black bg-white shadow-neo max-w-md">
          <h2 className="text-xl font-black text-black uppercase">Meeting Not Found</h2>
          <p className="mt-2 text-xs font-mono text-neutral-600">
            The requested meeting ID does not exist in your workspace.
          </p>
          <Link href="/" className="mt-4 inline-block">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border-2 border-black bg-[#FEF08A] px-4 py-2 font-mono text-xs font-black text-black shadow-neo-sm hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5"
            >
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const formattedDate = (() => {
    try {
      return new Date(meeting.date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return meeting.date;
    }
  })();

  const pendingActionCount =
    meeting.actionItems?.filter((a) => !a.completed).length || 0;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-[#FAF8F5] text-black selection:bg-[#FEF08A] selection:text-black flex flex-col font-sans">
        {/* Editorial Header Navigation */}
        <header className="sticky top-0 z-40 border-b-2 border-black bg-[#FAF8F5]/95 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
            {/* Left: Back Button & Meeting Title Info */}
            <div className="flex items-center gap-3.5 min-w-0">
              <Link href="/">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-black bg-white text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4 text-black" />
                </button>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate font-black text-2xl tracking-tight text-black">
                    {meeting.title}
                  </h1>
                </div>

                {/* Badges & Attendee Pills */}
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-bold text-black mt-1">
                  <span className="inline-flex items-center gap-1 rounded border border-black bg-white px-2 py-0.5 shadow-neo-sm">
                    <Calendar className="h-3 w-3 text-black" />
                    <span>{formattedDate}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 rounded border border-black bg-white px-2 py-0.5 shadow-neo-sm">
                    <Clock className="h-3 w-3 text-black" />
                    <span>{formatTime(meeting.duration)}</span>
                  </span>

                  {/* Compact Attendee Avatars */}
                  <div className="hidden sm:flex items-center -space-x-1.5 ml-1">
                    {meeting.participants.slice(0, 5).map((p) => (
                      <Avatar
                        key={p.id}
                        className="h-6 w-6 border-2 border-black shadow-neo-sm"
                        title={p.name}
                      >
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                        <AvatarFallback
                          style={{ backgroundColor: p.color || "#FEF08A" }}
                          className="font-mono text-[9px] font-black text-black"
                        >
                          {p.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <span className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[11px] font-bold text-black shadow-neo-sm">
                    {meeting.participants.length} ATTENDEES
                  </span>

                  {meeting.tags?.[0] && (
                    <span className="hidden md:inline-flex rounded border border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                      {meeting.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Highlight Action */}
              <button
                type="button"
                onClick={handleOpenHighlight}
                className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-3 font-mono text-xs font-bold text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
              >
                <Bookmark className="h-3.5 w-3.5 fill-black text-black" />
                <span className="hidden sm:inline">Highlight</span>
              </button>

              {/* Share Clip Action */}
              <button
                type="button"
                onClick={() => handleOpenShare()}
                className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#DDD6FE] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
              >
                <Share2 className="h-3.5 w-3.5 text-black" />
                <span className="hidden sm:inline">Share Clip</span>
              </button>

              {/* Copy Notes */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-bold text-black shadow-neo-sm hover:bg-[#A7F3D0] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-black" />
                    <span className="hidden sm:inline text-black font-black">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-black" />
                    <span className="hidden sm:inline">Copy Notes</span>
                  </>
                )}
              </button>

              {/* API Settings */}
              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-white text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
                title="API Keys & Settings"
              >
                <Settings className="h-4 w-4 text-black" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Split Grid: Left Player/Scrubber/Presence / Right Workspace Tabs */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols on lg): 3D Spatial Video Player + Scrubber + Speaker Presence */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* 3D Spatial Video Player */}
              <VideoPlayer />

              {/* Speaker Presence Bar */}
              <SpeakerPresenceBar />
            </div>

            {/* Right Column (5 cols on lg): Intelligence Workspace Tabs */}
            <div className="lg:col-span-5 flex flex-col min-h-[640px] rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="flex flex-col h-full"
              >
                {/* Neobrutalist Tabs Navigation Bar */}
                <div className="border-b-2 border-black bg-[#FAF8F5] p-2 sm:p-2.5">
                  <TabsList className="grid grid-cols-4 h-10 w-full bg-white p-1 border-2 border-black rounded-lg gap-1">
                    <TabsTrigger
                      value="notes"
                      className="gap-1.5 font-mono text-xs font-bold transition-all data-[state=active]:bg-[#FEF08A] data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-neo-sm"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-black" />
                      <span>Notes</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="transcript"
                      className="gap-1.5 font-mono text-xs font-bold transition-all data-[state=active]:bg-[#FEF08A] data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-neo-sm"
                    >
                      <FileText className="h-3.5 w-3.5 text-black" />
                      <span>Transcript</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="actions"
                      className="relative gap-1.5 font-mono text-xs font-bold transition-all data-[state=active]:bg-[#FEF08A] data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-neo-sm"
                    >
                      <ListTodo className="h-3.5 w-3.5 text-black" />
                      <span>Actions</span>
                      {pendingActionCount > 0 && (
                        <span className="ml-1 rounded-full border border-black bg-black px-1.5 py-0.2 font-mono text-[9px] font-black text-white">
                          {pendingActionCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="ask"
                      className="gap-1.5 font-mono text-xs font-bold transition-all data-[state=active]:bg-[#FEF08A] data-[state=active]:text-black data-[state=active]:border-2 data-[state=active]:border-black data-[state=active]:shadow-neo-sm"
                    >
                      <Bot className="h-3.5 w-3.5 text-black" />
                      <span>Ask AI</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content 1: AI Notes Panel */}
                <TabsContent value="notes" className="flex-1 m-0 p-4 overflow-y-auto">
                  <AiNotesPanel className="border-none shadow-none bg-transparent p-0" />
                </TabsContent>

                {/* Tab Content 2: Diarized Transcript Viewer */}
                <TabsContent value="transcript" className="flex-1 m-0 p-4 overflow-hidden">
                  <TranscriptViewer
                    className="border-none shadow-none bg-transparent h-[620px]"
                    onClipCreated={handleHighlightCreated}
                  />
                </TabsContent>

                {/* Tab Content 3: Action Items List */}
                <TabsContent value="actions" className="flex-1 m-0 p-4 overflow-y-auto">
                  <ActionItemsList className="border-none shadow-none bg-transparent p-0" />
                </TabsContent>

                {/* Tab Content 4: Ask Fathom AI Chat */}
                <TabsContent value="ask" className="flex-1 m-0 p-4 overflow-hidden">
                  <AskFathomChat className="border-none shadow-none bg-transparent h-[620px]" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>

        {/* Highlight Creation Modal */}
        <HighlightModal
          open={highlightModalOpen}
          onOpenChange={setHighlightModalOpen}
          meetingId={meeting.id}
          initialStartTime={Math.max(0, currentTime - 15)}
          initialEndTime={Math.min(meeting.duration, currentTime + 15)}
          onHighlightCreated={handleHighlightCreated}
          onOpenShareModal={handleHighlightCreated}
        />

        {/* Clip Share Modal */}
        <ClipShareModal
          open={shareModalOpen}
          onOpenChange={setShareModalOpen}
          meetingId={meeting.id}
          startTime={shareStart}
          endTime={shareEnd}
          title={shareTitle}
          speakers={meeting.participants}
          transcriptSnippet={
            meeting.transcript?.find(
              (s) => s.start <= shareStart && shareStart <= s.end
            )?.text || meeting.summaries?.executive?.overview
          }
        />

        {/* API Settings Modal */}
        <ApiKeysModal
          open={settingsModalOpen}
          onOpenChange={setSettingsModalOpen}
        />
      </div>
    </TooltipProvider>
  );
}

export default function MeetingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#FAF8F5] text-black">
          <div className="flex flex-col items-center gap-3 border-2 border-black bg-white p-6 rounded-xl shadow-neo">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-[#FEF08A]" />
            <p className="font-mono text-xs font-black uppercase">Loading meeting workspace...</p>
          </div>
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}
