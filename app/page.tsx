"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { MeetingCard } from "@/components/dashboard/meeting-card";
import { ClipShareModal } from "@/components/highlights/clip-share-modal";
import { SparklesCore } from "@/components/ui/sparkles";
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

  return (
    <TooltipProvider delayDuration={150}>
      <div className="min-h-screen bg-white text-zinc-950 font-sans selection:bg-zinc-200 selection:text-zinc-950 flex flex-col">
        {/* Hero Section with Gleaming Star Sparkles Background */}
        <section className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-white">
          {/* Gleaming Star Sparkles Canvas Background */}
          <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
            <SparklesCore
              id="hero-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={2.2}
              particleDensity={55}
              className="h-full w-full opacity-80"
              particleColor="#18181b"
              speed={0.6}
            />
            {/* Soft subtle radial ambient glow & bottom gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.02),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none" />
          </div>

          {/* Hero Foreground Content - Streamlined & Concise */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 sm:pt-14 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
              className="max-w-2xl"
            >
              {/* Monospace Metadata Tag */}
              <div className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white/90 px-2.5 py-1 font-mono text-[11px] text-zinc-600 backdrop-blur-xs shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-zinc-950">WORKSPACE BENCHMARK</span>
                <span className="text-zinc-300">·</span>
                <span>42M 15S</span>
                <span className="text-zinc-300">·</span>
                <span>8 LEADERS</span>
              </div>

              {/* Minimal Headline */}
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-zinc-950 leading-[1.15]">
                Meeting intelligence without the noise.
              </h1>
              <p className="mt-2 text-sm sm:text-base text-zinc-600 max-w-xl leading-relaxed">
                Synchronized word-level diarization, automated summaries, and verified action items.
              </p>
            </motion.div>

            {/* Featured Benchmark Call Card */}
            {benchmarkMeeting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="mt-6 rounded-xl border border-zinc-200 bg-white/95 p-5 sm:p-6 shadow-xl shadow-black/[0.03] backdrop-blur-sm"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  {/* Left Column: Essential Title, Details & Attendees */}
                  <div className="space-y-2.5 max-w-3xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] font-medium text-zinc-950">
                        <Sparkles className="h-3 w-3 text-zinc-600" />
                        Benchmark Call
                      </span>
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
                        42m · 8 Attendees
                      </span>
                      <span className="rounded-md border border-zinc-200 bg-zinc-50 px-2 py-0.5 font-mono text-[11px] text-zinc-600">
                        92 Diarized Segments
                      </span>
                    </div>

                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-950">
                        {benchmarkMeeting.title}
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                        CockroachDB multi-region deployment, Istio ambient mesh migration, and CI/CD latency benchmarks.
                      </p>
                    </div>

                    {/* Participant Avatar Stack */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="flex items-center -space-x-2 overflow-hidden">
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
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-1 lg:pt-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="h-9 flex items-center justify-center gap-2 rounded-md bg-zinc-950 px-4 font-mono text-xs font-medium uppercase tracking-wider text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>Launch Benchmark</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareClick(benchmarkMeeting)}
                      className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 active:scale-95 transition-all shadow-xs"
                    >
                      <Share2 className="h-3.5 w-3.5 text-zinc-500" />
                      <span>Share Clip</span>
                    </button>

                    <Link href="/actions">
                      <button
                        type="button"
                        className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 active:scale-95 transition-all shadow-xs"
                      >
                        <ListTodo className="h-3.5 w-3.5 text-zinc-500" />
                        <span>Actions ({benchmarkMeeting.actionItems?.length || 7})</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Scroll-triggered Section: Calendar Strip */}
          <motion.section
            aria-label="Today's Schedule & Bot Status"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <CalendarStrip
              onSimulateCall={() => {
                handleOpenBenchmark();
              }}
            />
          </motion.section>

          {/* Scroll-triggered Section: Directory Filter Tabs & Search */}
          <motion.section
            aria-label="Meeting Directory"
            className="space-y-6"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-all whitespace-nowrap",
                        isActive
                          ? "bg-zinc-950 text-white shadow-xs"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
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

              {/* Inline Search Input */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter calls..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-9 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-3 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Meetings Cards Grid with Staggered Scroll-reveal Animation */}
            {filteredMeetings.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
              >
                {filteredMeetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    variants={{
                      hidden: { opacity: 0, y: 18 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] },
                      },
                    }}
                  >
                    <MeetingCard
                      meeting={meeting}
                      onShare={handleShareClick}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-16 text-center">
                <Video className="h-8 w-8 text-zinc-400 mb-3" />
                <p className="font-mono text-xs font-medium uppercase tracking-wider text-zinc-900">
                  No matching meetings found
                </p>
                <p className="mt-1 text-xs text-zinc-500 font-sans">
                  Try adjusting search keywords or selecting another category.
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
