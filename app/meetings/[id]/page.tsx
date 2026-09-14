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
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  TooltipProvider,
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50/50 px-4 text-center text-zinc-950">
        <div className="p-8 rounded-xl border border-zinc-200 bg-white shadow-sm max-w-md w-full">
          <h2 className="text-lg font-bold text-zinc-950">Meeting Not Found</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            The requested meeting ID could not be found in your workspace.
          </p>
          <div className="mt-5 flex justify-center">
            <Link href="/">
              <Button variant="default" size="sm">
                Return to Dashboard
              </Button>
            </Link>
          </div>
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
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-white selection:text-black flex flex-col font-mono relative overflow-x-hidden">
        {/* Fixed Ambient Background Video Loop */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-poster.jpg"
            src="/hero-video.mp4"
            className="h-full w-full object-cover opacity-15 scale-105 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/95 via-[#0A0A0A]/85 to-[#0A0A0A]" />
        </div>

        {/* Meeting Header Section: clears FluidHeader cleanly */}
        <div className="pt-28 sm:pt-32 pb-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            {/* Left: Back Link & Meeting Title */}
            <div className="flex items-start gap-4 min-w-0">
              <Link href="/">
                <button
                  type="button"
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/5 text-white shadow-sm hover:bg-white hover:text-black transition-all"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/50 mb-1">
                  <span>/ 01 SESSION</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{formatTime(meeting.duration)}</span>
                </div>
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white tracking-tight">
                  {meeting.title}
                </h1>

                {/* Attendee Badges & Metadata */}
                <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-[11px]">
                  {/* Compact Attendee Avatars */}
                  <div className="flex items-center -space-x-1.5 mr-1">
                    {meeting.participants.slice(0, 6).map((p) => (
                      <Avatar
                        key={p.id}
                        className="h-6 w-6 rounded-full border border-white/25 bg-black"
                        title={p.name}
                      >
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                        <AvatarFallback className="text-[9px] font-medium bg-white/10 text-white">
                          {p.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-white/70 uppercase">
                    {meeting.participants.length} ATTENDEES
                  </span>

                  {meeting.tags?.[0] && (
                    <span className="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-white/80 uppercase">
                      {meeting.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {/* Highlight Action */}
              <button
                type="button"
                onClick={handleOpenHighlight}
                className="h-9 flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white text-black px-4 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-white/90 transition-all shadow-sm"
              >
                <Bookmark className="h-3.5 w-3.5 fill-current" />
                <span>Highlight</span>
              </button>

              {/* Share Clip Action */}
              <button
                type="button"
                onClick={() => handleOpenShare()}
                className="h-9 flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-mono uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>

              {/* Copy Notes */}
              <button
                type="button"
                onClick={handleCopySummary}
                className="h-9 flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-mono uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-white" />
                    <span className="font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Notes</span>
                  </>
                )}
              </button>

              {/* API Settings */}
              <button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                className="h-9 w-9 flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white hover:bg-white hover:text-black transition-all"
                title="API Keys & Settings"
              >
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Split Grid: Left Player Column / Right Workspace Tabs Column */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (7 cols on lg): Audio-Synchronized Video Player + Speaker Presence */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <VideoPlayer />
              <SpeakerPresenceBar />
            </div>

            {/* Right Column (5 cols on lg): Workspace Container Card */}
            <div className="lg:col-span-5 flex flex-col min-h-[640px] rounded-3xl border border-white/15 bg-black/50 shadow-2xl backdrop-blur-xl overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="flex flex-col h-full"
              >
                {/* Refined Tabs Navigation Bar */}
                <div className="border-b border-white/10 bg-white/5 p-3">
                  <TabsList className="grid grid-cols-4 h-11 w-full bg-black/40 border border-white/10 p-1 rounded-2xl">
                    <TabsTrigger
                      value="notes"
                      className="gap-1.5 text-xs font-mono uppercase tracking-wider rounded-xl text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Notes</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="transcript"
                      className="gap-1.5 text-xs font-mono uppercase tracking-wider rounded-xl text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Transcript</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="actions"
                      className="relative gap-1.5 text-xs font-mono uppercase tracking-wider rounded-xl text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all"
                    >
                      <ListTodo className="h-3.5 w-3.5" />
                      <span>Actions</span>
                      {pendingActionCount > 0 && (
                        <span className="ml-1 rounded-md bg-black text-white px-1.5 py-0.2 text-[10px] font-bold border border-white/20">
                          {pendingActionCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="ask"
                      className="gap-1.5 text-xs font-mono uppercase tracking-wider rounded-xl text-white/60 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all"
                    >
                      <Bot className="h-3.5 w-3.5" />
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
        <div className="flex min-h-screen items-center justify-center bg-[#0A0A0A] text-white">
          <div className="flex flex-col items-center gap-3 border border-white/15 bg-black/60 p-6 rounded-3xl shadow-xl backdrop-blur-xl">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
            <p className="text-xs font-mono text-white/60 uppercase tracking-wider">Loading workspace...</p>
          </div>
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}
