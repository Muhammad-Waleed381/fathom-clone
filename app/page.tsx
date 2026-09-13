"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { MeetingCard } from "@/components/dashboard/meeting-card";
import { ClipShareModal } from "@/components/highlights/clip-share-modal";
import { FluidAudioWave } from "@/components/hero/fluid-audio-wave";
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
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "engineering" | "sales" | "design" | "1-on-1s";

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "engineering", label: "Engineering" },
  { id: "sales", label: "Sales" },
  { id: "design", label: "Design" },
  { id: "1-on-1s", label: "1-on-1s" },
];

export default function DashboardPage() {
  const router = useRouter();
  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);

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

  // Concise key takeaways from the benchmark sync
  const benchmarkHighlights = [
    "Standardized on active-active CockroachDB v24 across us-east, us-west, and eu-central to achieve 99.99% availability.",
    "Eliminated Envoy sidecar memory overhead via Istio Ambient Mesh ztunnel architecture.",
    "Integrated sub-100ms API latency SLO synthetic testing directly into CI/CD pipelines.",
  ];

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-200 selection:text-zinc-950 flex flex-col">
        {/* Hero Section with Generative Fluid Audio-Wave Canvas */}
        <section className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-white">
          {/* Audio-Wave HTML5 Canvas Background */}
          <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
            <FluidAudioWave className="h-full w-full opacity-65" />
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          {/* Hero Foreground Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-18">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="max-w-3xl"
            >
              {/* Monospace Metadata Strip */}
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white/80 px-3 py-1 font-mono text-xs text-zinc-700 backdrop-blur-xs shadow-xs">
                <span className="font-semibold text-zinc-900">42M 15S BENCHMARK CALL</span>
                <span className="text-zinc-300">·</span>
                <span>8 PARTICIPANTS</span>
                <span className="text-zinc-300">·</span>
                <span>92 DIARIZED SEGMENTS</span>
              </div>

              {/* Concise Editorial Title */}
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-zinc-950 leading-[1.12]">
                Conversations into structured intelligence.
              </h1>
              <p className="mt-3 text-sm sm:text-base text-zinc-600 max-w-2xl leading-relaxed">
                Synchronized playback, multi-speaker diarization, and dynamic AI notes from engineering syncs to executive briefs.
              </p>
            </motion.div>

            {/* Featured Benchmark Call Card */}
            {benchmarkMeeting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="mt-8 rounded-xl border border-zinc-200 bg-white/95 p-6 shadow-xl shadow-black/[0.04] backdrop-blur-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Left Column: Metadata, Title, Summary */}
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[11px] font-medium text-zinc-900">
                        <Sparkles className="h-3 w-3 text-zinc-700" />
                        Featured Call
                      </span>
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[11px] text-zinc-600">
                        42m 15s · 8 Attendees
                      </span>
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[11px] text-zinc-600">
                        92 Segments
                      </span>
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2.5 py-1 font-mono text-[11px] text-zinc-600">
                        {benchmarkMeeting.actionItems?.length || 7} Actions
                      </span>
                    </div>

                    <div>
                      <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-950">
                        {benchmarkMeeting.title}
                      </h2>
                      <p className="mt-1.5 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                        {benchmarkMeeting.summaries?.executive?.overview ||
                          "Multi-region database sharding, Istio ambient service mesh rollout, and sub-100ms API latency SLOs."}
                      </p>
                    </div>

                    {/* Summary Bullet Points */}
                    <div className="space-y-2 pt-1">
                      {benchmarkHighlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-zinc-900 mt-0.5 shrink-0" />
                          <span>{highlight}</span>
                        </div>
                      ))}
                    </div>

                    {/* Participant Avatar Stack */}
                    <div className="flex items-center gap-3 pt-2">
                      <div className="flex items-center -space-x-2 overflow-hidden py-1">
                        {benchmarkMeeting.participants.map((p) => (
                          <Tooltip key={p.id}>
                            <TooltipTrigger asChild>
                              <Avatar className="h-7 w-7 rounded-md border border-white bg-zinc-100 transition-transform hover:scale-110 hover:z-20 shadow-xs">
                                <AvatarImage src={p.avatarUrl} alt={p.name} />
                                <AvatarFallback className="rounded-md font-mono text-[10px] font-medium text-zinc-800">
                                  {p.name.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="border border-zinc-200 bg-white text-xs font-medium text-zinc-900 shadow-md rounded-md"
                            >
                              <p className="font-semibold">{p.name}</p>
                              {p.role && (
                                <p className="font-mono text-[10px] text-zinc-500">
                                  {p.role} · {p.company}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                      <span className="font-mono text-xs text-zinc-500">
                        8 leaders present
                      </span>
                    </div>
                  </div>

                  {/* Right Column: CTA Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 lg:items-end shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="h-10 flex items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 font-mono text-xs font-medium uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Benchmark Call</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareClick(benchmarkMeeting)}
                        className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 transition-colors shadow-xs"
                      >
                        <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Share Clip</span>
                      </button>

                      <Link href="/actions">
                        <button
                          type="button"
                          className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 transition-colors shadow-xs"
                        >
                          <ListTodo className="h-3.5 w-3.5 text-zinc-500" />
                          <span>Actions ({benchmarkMeeting.actionItems?.length || 7})</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Calendar Strip: Today's Schedule & Auto-Record Bot */}
          <motion.section
            aria-label="Today's Schedule & Bot Status"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <CalendarStrip
              onSimulateCall={() => {
                handleOpenBenchmark();
              }}
            />
          </motion.section>

          {/* Directory Filter Tabs & Inline Search Bar */}
          <motion.section
            aria-label="Meeting Directory"
            className="space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
              {/* Rectangular Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
                        isActive
                          ? "bg-zinc-900 text-white shadow-xs"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                      )}
                    >
                      <span>{tab.label}</span>
                      {tab.id === "all" && (
                        <span
                          className={cn(
                            "rounded-sm px-1 py-0.2 font-mono text-[10px]",
                            isActive ? "bg-zinc-800 text-zinc-200" : "bg-zinc-100 text-zinc-600"
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
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter meetings..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-3 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors shadow-xs"
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
                <Video className="h-8 w-8 text-zinc-400 mb-3" />
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-900">
                  No matching meetings found
                </p>
                <p className="mt-1 text-xs text-zinc-500 font-sans">
                  Try adjusting your search keywords or switching category filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-4 rounded-md border border-zinc-200 bg-white px-3 py-1.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-colors shadow-xs"
                >
                  Reset filters
                </button>
              </div>
            )}
          </motion.section>
        </main>

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
