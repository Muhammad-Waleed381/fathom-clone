"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { MeetingCard } from "@/components/dashboard/meeting-card";
import { CommandSearch } from "@/components/dashboard/command-search";
import { ClipShareModal } from "@/components/highlights/clip-share-modal";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { Meeting } from "@/types/meeting";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Sparkles,
  Clock,
  Calendar,
  Users,
  Search,
  ListTodo,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Video,
} from "lucide-react";
import { formatTime } from "@/components/player/video-scrubber";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "engineering" | "sales" | "design" | "1-on-1s";

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All Meetings" },
  { id: "engineering", label: "Engineering" },
  { id: "sales", label: "Sales & Deals" },
  { id: "design", label: "Product & Design" },
  { id: "1-on-1s", label: "1-on-1s" },
];

export default function DashboardPage() {
  const router = useRouter();
  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);

  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [filterQuery, setFilterQuery] = useState("");

  // Share Modal State
  const [shareMeeting, setShareMeeting] = useState<Meeting | null>(null);

  // Find Benchmark 8-Person Call (meeting-1)
  const benchmarkMeeting = useMemo(() => {
    return (
      meetings.find((m) => m.id === "meeting-1") ||
      meetings.find((m) => m.participants.length >= 8) ||
      meetings[0]
    );
  }, [meetings]);

  // Filter meetings by category and inline search query
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
      // Category filter
      if (activeTab === "engineering") {
        const matches = m.tags?.some((t) =>
          ["engineering", "architecture", "scalability", "kubernetes"].includes(
            t.toLowerCase()
          )
        );
        if (!matches) return false;
      } else if (activeTab === "sales") {
        const matches = m.tags?.some((t) =>
          ["sales", "enterprise", "discovery", "meddpicc"].includes(t.toLowerCase())
        );
        if (!matches) return false;
      } else if (activeTab === "design") {
        const matches = m.tags?.some((t) =>
          ["design", "product", "ux", "critique", "scrubber"].includes(
            t.toLowerCase()
          )
        );
        if (!matches) return false;
      } else if (activeTab === "1-on-1s") {
        const matches = m.tags?.some((t) =>
          ["1-on-1", "mentorship", "career", "feedback"].includes(t.toLowerCase())
        );
        if (!matches) return false;
      }

      // Inline query filter
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase();
        const matchesTitle = m.title.toLowerCase().includes(q);
        const matchesSpeaker = m.participants.some((p) =>
          p.name.toLowerCase().includes(q)
        );
        const matchesTags = m.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSpeaker && !matchesTags) return false;
      }

      return true;
    });
  }, [meetings, activeTab, filterQuery]);

  const handleOpenBenchmark = () => {
    if (benchmarkMeeting) {
      setCurrentMeeting(benchmarkMeeting.id);
      router.push(`/meetings/${benchmarkMeeting.id}`);
    }
  };

  const handleShareClick = (meeting: Meeting) => {
    setShareMeeting(meeting);
  };

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-primary/30 selection:text-white">
        {/* Global Dashboard Navigation Header */}
        <DashboardHeader
          onOpenSearch={() => setSearchOpen(true)}
          onRecordClick={() => {
            alert(
              "Fathom Recorder: Live recording and meeting simulation will open the In-Browser Studio."
            );
          }}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Calendar Strip: Auto-record bot status & Today's interactive schedule */}
          <section aria-label="Today's Schedule & Bot Status">
            <CalendarStrip
              onSimulateCall={() => {
                // Simulate quick launch into benchmark call
                handleOpenBenchmark();
              }}
            />
          </section>

          {/* Hero Banner: 8-Person Benchmark Call */}
          {benchmarkMeeting && (
            <section aria-label="Featured Benchmark Call">
              <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 p-6 sm:p-8 shadow-2xl shadow-indigo-950/40">
                {/* Background Glow effects */}
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
                <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Column: Title, Metadata, Overview */}
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="border-indigo-400/40 bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-300 gap-1.5 shadow-sm"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                        8-Person Benchmark Call
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-700 bg-slate-900/80 px-2 py-0.5 text-xs text-slate-300"
                      >
                        42m 15s Duration
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400"
                      >
                        85+ Diarized Segments
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs text-amber-300"
                      >
                        7 Action Items
                      </Badge>
                    </div>

                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-snug">
                        {benchmarkMeeting.title}
                      </h2>
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed max-w-2xl">
                        {benchmarkMeeting.summaries?.executive?.overview ||
                          "Full-scale technical leadership sync aligning on CockroachDB multi-region sharding, Istio ambient mesh canary deployment, and sub-100ms API latency SLOs."}
                      </p>
                    </div>

                    {/* Participant Avatar Stack with Names */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center -space-x-2.5 overflow-hidden py-1">
                        {benchmarkMeeting.participants.map((p) => (
                          <Tooltip key={p.id}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 border-2 border-slate-900 ring-1 ring-indigo-500/40 transition-transform hover:scale-115 hover:z-20">
                                <AvatarImage src={p.avatarUrl} alt={p.name} />
                                <AvatarFallback
                                  style={{ backgroundColor: p.color || "#6366f1" }}
                                  className="text-[11px] font-bold text-white"
                                >
                                  {p.name.slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="text-xs">
                              <p className="font-semibold">{p.name}</p>
                              {p.role && (
                                <p className="text-[10px] text-slate-400">
                                  {p.role} • {p.company}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-300">
                        8 Technical Leaders Present
                      </span>
                    </div>
                  </div>

                  {/* Right Column: CTA Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end shrink-0">
                    <Button
                      type="button"
                      size="lg"
                      onClick={handleOpenBenchmark}
                      className="h-12 gap-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-primary to-purple-600 px-6 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-102 hover:shadow-indigo-600/40 active:scale-98"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>Open Benchmark Call & Notes</span>
                    </Button>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareClick(benchmarkMeeting)}
                        className="h-9 gap-1.5 rounded-lg border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        <span>Share Clip</span>
                      </Button>
                      <Link href="/actions">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 gap-1.5 rounded-lg border-slate-700 bg-slate-900/80 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                        >
                          <ListTodo className="h-3.5 w-3.5 text-indigo-400" />
                          <span>View Action Items ({benchmarkMeeting.actionItems?.length || 7})</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Directory Filter Tabs & Inline Search Bar */}
          <section aria-label="Meeting Directory" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap",
                        isActive
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                          : "bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800/80"
                      )}
                    >
                      <span>{tab.label}</span>
                      {tab.id === "all" && (
                        <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-300">
                          {meetings.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Search Input within Page */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter meetings..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-9 w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-8 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Meetings Cards Grid */}
            {filteredMeetings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onShare={handleShareClick}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 py-16 text-center">
                <Video className="h-10 w-10 text-slate-600 mb-3" />
                <p className="text-sm font-semibold text-slate-300">
                  No meetings found matching your filter
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Try clearing your search query or switching category tabs.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-4 border-slate-800 text-xs"
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </section>
        </main>

        {/* Global Command Search Omnibar (Cmd+K) */}
        <CommandSearch
          open={searchOpen}
          onOpenChange={setSearchOpen}
          onOpenSettings={() => setSettingsOpen(true)}
        />

        {/* AI Settings Modal */}
        <ApiKeysModal
          open={settingsOpen}
          onOpenChange={setSettingsOpen}
        />

        {/* Clip Share Modal */}
        {shareMeeting && (
          <ClipShareModal
            open={Boolean(shareMeeting)}
            onOpenChange={(open) => {
              if (!open) setShareMeeting(null);
            }}
            meetingId={shareMeeting.id}
            startTime={0}
            endTime={Math.min(shareMeeting.duration, 60)}
            title={shareMeeting.title}
            speakers={shareMeeting.participants}
            transcriptSnippet={
              shareMeeting.transcript?.[0]?.text ||
              shareMeeting.summaries?.executive?.overview
            }
          />
        )}
      </div>
    </TooltipProvider>
  );
}
