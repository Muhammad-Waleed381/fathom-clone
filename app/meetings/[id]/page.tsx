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
      <div className="min-h-screen bg-zinc-50/40 text-zinc-950 selection:bg-zinc-200 selection:text-zinc-950 flex flex-col font-sans">
        {/* Clean Editorial Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/95 backdrop-blur-md">
          <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
            {/* Left: Back Link & Meeting Title */}
            <div className="flex items-center gap-3.5 min-w-0">
              <Link href="/">
                <button
                  type="button"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 shadow-xs hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </Link>

              <div className="min-w-0">
                <h1 className="truncate font-bold text-xl text-zinc-950 tracking-tight">
                  {meeting.title}
                </h1>

                {/* Attendee Badges & Metadata */}
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    <Calendar className="h-3 w-3 text-zinc-500" />
                    <span>{formattedDate}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    <Clock className="h-3 w-3 text-zinc-500" />
                    <span>{formatTime(meeting.duration)}</span>
                  </span>

                  {/* Compact Attendee Avatars */}
                  <div className="hidden sm:flex items-center -space-x-1 ml-0.5">
                    {meeting.participants.slice(0, 5).map((p) => (
                      <Avatar
                        key={p.id}
                        className="h-5 w-5 rounded-md border border-zinc-200"
                        title={p.name}
                      >
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} alt={p.name} />}
                        <AvatarFallback className="text-[9px] font-medium bg-zinc-100 text-zinc-800">
                          {p.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>

                  <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-xs font-medium text-zinc-700">
                    {meeting.participants.length} attendees
                  </span>

                  {meeting.tags?.[0] && (
                    <span className="hidden md:inline-flex rounded-md border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600">
                      {meeting.tags[0]}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Highlight Action */}
              <Button
                type="button"
                onClick={handleOpenHighlight}
                variant="default"
                size="sm"
                className="gap-1.5"
              >
                <Bookmark className="h-3.5 w-3.5 fill-current" />
                <span className="hidden sm:inline">Highlight</span>
              </Button>

              {/* Share Clip Action */}
              <Button
                type="button"
                onClick={() => handleOpenShare()}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                <Share2 className="h-3.5 w-3.5 text-zinc-600" />
                <span className="hidden sm:inline">Share Clip</span>
              </Button>

              {/* Copy Notes */}
              <Button
                type="button"
                onClick={handleCopySummary}
                variant="outline"
                size="sm"
                className="gap-1.5"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="hidden sm:inline text-emerald-600 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-zinc-600" />
                    <span className="hidden sm:inline">Copy Notes</span>
                  </>
                )}
              </Button>

              {/* API Settings */}
              <Button
                type="button"
                onClick={() => setSettingsModalOpen(true)}
                variant="outline"
                size="icon"
                className="h-8 w-8 text-zinc-700"
                title="API Keys & Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Split Grid: Left Player Column / Right Workspace Tabs Column */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (7 cols on lg): Audio-Synchronized Video Player + Speaker Presence */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <VideoPlayer />
              <SpeakerPresenceBar />
            </div>

            {/* Right Column (5 cols on lg): Workspace Container Card */}
            <div className="lg:col-span-5 flex flex-col min-h-[640px] rounded-xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="flex flex-col h-full"
              >
                {/* Refined Tabs Navigation Bar */}
                <div className="border-b border-zinc-200 bg-zinc-50/50 p-2">
                  <TabsList className="grid grid-cols-4 h-9 w-full bg-zinc-100 p-0.5 rounded-lg">
                    <TabsTrigger
                      value="notes"
                      className="gap-1.5 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Notes</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="transcript"
                      className="gap-1.5 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs"
                    >
                      <FileText className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Transcript</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="actions"
                      className="relative gap-1.5 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs"
                    >
                      <ListTodo className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Actions</span>
                      {pendingActionCount > 0 && (
                        <span className="ml-1 rounded-sm bg-zinc-950 px-1 py-0.2 text-[10px] font-semibold text-white">
                          {pendingActionCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="ask"
                      className="gap-1.5 text-xs font-medium rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-950 data-[state=active]:shadow-xs"
                    >
                      <Bot className="h-3.5 w-3.5 text-zinc-500" />
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50/50 text-zinc-950">
          <div className="flex flex-col items-center gap-3 border border-zinc-200 bg-white p-6 rounded-xl shadow-sm">
            <div className="h-6 w-6 animate-spin rounded-md border-2 border-zinc-950 border-t-transparent" />
            <p className="text-xs font-medium text-zinc-500">Loading workspace...</p>
          </div>
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}
