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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Layers,
  Search,
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
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-slate-300">
        <h2 className="text-xl font-bold text-white">Meeting Not Found</h2>
        <p className="mt-2 text-sm text-slate-400">
          The requested meeting ID does not exist in your workspace.
        </p>
        <Link href="/" className="mt-4">
          <Button variant="default" className="bg-primary text-xs">
            Return to Dashboard
          </Button>
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
      <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100 selection:bg-primary/30 selection:text-white">
        {/* Top Meeting Header Navigation */}
        <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6">
            {/* Left: Back Button & Title Info */}
            <div className="flex items-center gap-3 min-w-0">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-slate-400 hover:bg-slate-850 hover:text-white"
                  title="Back to Dashboard"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-sm sm:text-base font-bold text-white">
                    {meeting.title}
                  </h1>
                  {meeting.tags?.[0] && (
                    <Badge
                      variant="outline"
                      className="hidden sm:inline-flex border-slate-800 bg-slate-900 px-1.5 py-0 text-[10px] text-slate-300"
                    >
                      {meeting.tags[0]}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span>{formattedDate}</span>
                  <span>•</span>
                  <span>{formatTime(meeting.duration)}</span>
                  <span className="hidden md:inline">•</span>
                  <span className="hidden md:inline">
                    {meeting.participants.length} participants
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Highlight Action */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleOpenHighlight}
                className="h-8 gap-1.5 border-slate-800 bg-slate-900/80 px-2.5 text-xs font-medium text-amber-300 hover:bg-slate-800 hover:text-amber-200"
              >
                <Bookmark className="h-3.5 w-3.5 fill-amber-400/20 text-amber-400" />
                <span className="hidden sm:inline">Highlight</span>
              </Button>

              {/* Share Action */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenShare()}
                className="h-8 gap-1.5 border-slate-800 bg-slate-900/80 px-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Share Clip</span>
              </Button>

              {/* Copy Summary */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopySummary}
                className="h-8 gap-1.5 border-slate-800 bg-slate-900/80 px-2.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                {copiedSummary ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="hidden sm:inline text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Copy Notes</span>
                  </>
                )}
              </Button>

              {/* AI Settings */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setSettingsModalOpen(true)}
                className="h-8 w-8 text-slate-400 hover:bg-slate-850 hover:text-white"
                title="AI & API Settings"
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Split View: Left Player / Right Workspace */}
        <main className="flex-1 w-full p-3 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-full">
            {/* Left Column (7 cols on lg): Video Player + Speaker Presence */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Video Player */}
              <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/40 shadow-xl">
                <VideoPlayer />
              </div>

              {/* Speaker Presence Bar */}
              <SpeakerPresenceBar className="shadow-md" />
            </div>

            {/* Right Column (5 cols on lg): Intelligence Workspace Tabs */}
            <div className="lg:col-span-5 flex flex-col min-h-[600px] rounded-2xl border border-slate-800/80 bg-slate-900/30 shadow-xl overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="flex flex-col h-full"
              >
                {/* Tabs Navigation Bar */}
                <div className="border-b border-slate-800/80 bg-slate-950/60 p-2 px-3">
                  <TabsList className="grid grid-cols-4 h-9 w-full bg-slate-900/80 p-1 border border-slate-800">
                    <TabsTrigger
                      value="notes"
                      className="gap-1.5 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Notes</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="transcript"
                      className="gap-1.5 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Transcript</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="actions"
                      className="relative gap-1.5 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <ListTodo className="h-3.5 w-3.5" />
                      <span>Actions</span>
                      {pendingActionCount > 0 && (
                        <span className="ml-1 rounded-full bg-indigo-400/20 px-1.5 py-0 text-[10px] text-indigo-300">
                          {pendingActionCount}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="ask"
                      className="gap-1.5 text-xs font-semibold data-[state=active]:bg-indigo-600 data-[state=active]:text-white"
                    >
                      <Bot className="h-3.5 w-3.5" />
                      <span>Ask AI</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Tab Content 1: AI Notes Panel */}
                <TabsContent value="notes" className="flex-1 m-0 p-3 overflow-y-auto">
                  <AiNotesPanel className="border-none shadow-none bg-transparent p-0" />
                </TabsContent>

                {/* Tab Content 2: Diarized Transcript Viewer */}
                <TabsContent value="transcript" className="flex-1 m-0 p-3 overflow-hidden">
                  <TranscriptViewer
                    className="border-none shadow-none bg-transparent h-[620px]"
                    onClipCreated={handleHighlightCreated}
                  />
                </TabsContent>

                {/* Tab Content 3: Action Items List */}
                <TabsContent value="actions" className="flex-1 m-0 p-3 overflow-y-auto">
                  <ActionItemsList className="border-none shadow-none bg-transparent p-0" />
                </TabsContent>

                {/* Tab Content 4: Ask Fathom AI Chat */}
                <TabsContent value="ask" className="flex-1 m-0 p-3 overflow-hidden">
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
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-400">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            <p className="text-xs font-mono">Loading meeting workspace...</p>
          </div>
        </div>
      }
    >
      <MeetingDetailContent />
    </Suspense>
  );
}
