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
import { TiltCard, TiltLayer } from "@/components/motion/tilt-card";
import { Meeting } from "@/types/meeting";
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
  Search,
  ListTodo,
  Share2,
  Video,
} from "lucide-react";
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
      <div className="min-h-screen bg-[#FAF8F5] text-black flex flex-col font-sans selection:bg-[#FEF08A] selection:text-black">
        {/* Global Dashboard Navigation Header */}
        <DashboardHeader
          onOpenSearch={() => setSearchOpen(true)}
          onRecordClick={() => {
            handleOpenBenchmark();
          }}
        />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Calendar Strip: Auto-record bot status & Desk schedule */}
          <section aria-label="Today's Schedule & Bot Status">
            <CalendarStrip
              onSimulateCall={() => {
                handleOpenBenchmark();
              }}
            />
          </section>

          {/* 3D Cursor-Reactive Benchmark Hero Card */}
          {benchmarkMeeting && (
            <section aria-label="Featured Benchmark Call">
              <TiltCard
                maxTilt={6}
                glare={true}
                glareMaxOpacity={0.25}
                className="w-full rounded-xl border-2 border-black bg-[#FEF08A] shadow-[6px_6px_0px_0px_#000] p-6 sm:p-8 relative overflow-hidden"
              >
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* Left Column: Parallax Depth Layers */}
                  <div className="space-y-4 max-w-3xl">
                    {/* Floating Badges */}
                    <TiltLayer z={25} className="flex flex-wrap items-center gap-2">
                      <span className="flex items-center gap-1.5 rounded-md border-2 border-black bg-black px-2.5 py-1 font-mono text-xs font-black uppercase tracking-wider text-white shadow-neo-sm">
                        <Sparkles className="h-3.5 w-3.5 text-[#FEF08A]" />
                        BENCHMARK CALL
                      </span>
                      <span className="rounded-md border-2 border-black bg-white px-2.5 py-1 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
                        42:15 • 8 ATTENDEES
                      </span>
                      <span className="rounded-md border-2 border-black bg-[#A7F3D0] px-2.5 py-1 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
                        85+ SEGMENTS
                      </span>
                      <span className="rounded-md border-2 border-black bg-[#DDD6FE] px-2.5 py-1 font-mono text-xs font-black uppercase text-black shadow-neo-sm">
                        7 ACTIONS
                      </span>
                    </TiltLayer>

                    {/* Title & Concise Summary */}
                    <TiltLayer z={20}>
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black leading-tight">
                        {benchmarkMeeting.title}
                      </h2>
                      <p className="mt-2 text-sm font-medium text-neutral-900 leading-relaxed max-w-2xl">
                        {benchmarkMeeting.summaries?.executive?.overview ||
                          "CockroachDB multi-region sharding, Istio ambient mesh rollout, and sub-100ms API latency SLOs."}
                      </p>
                    </TiltLayer>

                    {/* Participant Avatar Stack */}
                    <TiltLayer z={25} className="flex flex-wrap items-center gap-3 pt-1">
                      <div className="flex items-center -space-x-2.5 overflow-hidden py-1">
                        {benchmarkMeeting.participants.map((p) => (
                          <Tooltip key={p.id}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-8 w-8 rounded-full border-2 border-black bg-white shadow-neo-sm transition-transform hover:scale-115 hover:z-20">
                                <AvatarImage src={p.avatarUrl} alt={p.name} />
                                <AvatarFallback
                                  style={{ backgroundColor: p.color || "#A7F3D0" }}
                                  className="font-mono text-[11px] font-black text-black"
                                >
                                  {p.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="border-2 border-black bg-white text-xs font-bold text-black shadow-neo-sm">
                              <p>{p.name}</p>
                              {p.role && (
                                <p className="font-mono text-[10px] text-neutral-600">
                                  {p.role} • {p.company}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
                        8 LEADERS PRESENT
                      </span>
                    </TiltLayer>
                  </div>

                  {/* Right Column: CTA Buttons with Tactile Physics */}
                  <TiltLayer z={30} className="flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="h-12 flex items-center justify-center gap-2.5 rounded-md border-2 border-black bg-black px-6 font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    >
                      <Play className="h-4 w-4 fill-current" />
                      <span>OPEN BENCHMARK SYNC</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareClick(benchmarkMeeting)}
                        className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3.5 font-mono text-xs font-bold uppercase text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF8F5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                      >
                        <Share2 className="h-3.5 w-3.5 text-black" />
                        <span>SHARE CLIP</span>
                      </button>

                      <Link href="/actions">
                        <button
                          type="button"
                          className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3.5 font-mono text-xs font-bold uppercase text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF8F5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        >
                          <ListTodo className="h-3.5 w-3.5 text-black" />
                          <span>ACTIONS ({benchmarkMeeting.actionItems?.length || 7})</span>
                        </button>
                      </Link>
                    </div>
                  </TiltLayer>
                </div>
              </TiltCard>
            </section>
          )}

          {/* Directory Filter Tabs & Inline Search Bar */}
          <section aria-label="Meeting Directory" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-black pb-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md border-2 border-black px-3.5 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                        isActive
                          ? "bg-black text-white shadow-neo-sm"
                          : "bg-white text-black hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo-sm"
                      )}
                    >
                      <span>{tab.label}</span>
                      {tab.id === "all" && (
                        <span
                          className={cn(
                            "rounded border border-current px-1 py-0.2 font-mono text-[10px] font-black",
                            isActive ? "bg-white text-black" : "bg-[#FAF8F5] text-black"
                          )}
                        >
                          {meetings.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Inline Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-black stroke-[2.5]" />
                <input
                  type="text"
                  placeholder="Filter meetings..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-9 w-full rounded-md border-2 border-black bg-white pl-8 pr-3 font-mono text-xs text-black placeholder:text-neutral-500 shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
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
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-black bg-white py-16 text-center shadow-neo-sm">
                <Video className="h-10 w-10 text-neutral-400 mb-3 stroke-[1.5]" />
                <p className="font-mono text-sm font-bold uppercase text-black">
                  No matching meetings found
                </p>
                <p className="mt-1 text-xs text-neutral-600 font-sans">
                  Try adjusting the filter query or switching category tabs.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-4 rounded-md border-2 border-black bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  RESET FILTERS
                </button>
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
