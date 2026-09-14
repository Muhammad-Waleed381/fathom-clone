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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Play,
  Search,
  ListTodo,
  Share2,
  Video,
  Layers,
  Sparkles,
  ShieldCheck,
  Zap,
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
  const [shareMeeting, setShareMeeting] = useState<Meeting | null>(null);

  // Find Benchmark 8-Person Call
  const benchmarkMeeting = useMemo(() => {
    return (
      meetings.find((m) => m.id === "meeting-1") ||
      meetings.find((m) => m.participants.length >= 8) ||
      meetings[0]
    );
  }, [meetings]);

  // Filter meetings
  const filteredMeetings = useMemo(() => {
    return meetings.filter((m) => {
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
        {/* Hero Section with Gleaming Star Sparkles */}
        <section className="relative w-full overflow-hidden border-b border-zinc-200/80 bg-white">
          <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
            <SparklesCore
              id="hero-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={2.0}
              particleDensity={50}
              className="h-full w-full opacity-75"
              particleColor="#18181b"
              speed={0.5}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.02),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-10 sm:pb-12">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-xl"
            >
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-zinc-950">
                Meeting Intelligence
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-500">
                Word-level diarization, summaries, and action items.
              </p>
            </motion.div>

            {/* Featured Benchmark Call Card */}
            {benchmarkMeeting && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="mt-5 rounded-xl border border-zinc-200/90 bg-white/95 p-4 sm:p-5 shadow-lg shadow-black/[0.03] backdrop-blur-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 font-mono text-[11px] text-zinc-500">
                      <span>BENCHMARK CALL</span>
                      <span>·</span>
                      <span>42M 15S</span>
                      <span>·</span>
                      <span>8 ATTENDEES</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-semibold tracking-tight text-zinc-950">
                      {benchmarkMeeting.title}
                    </h2>

                    {/* Participant Avatars */}
                    <div className="flex items-center -space-x-1.5 pt-0.5">
                      {benchmarkMeeting.participants.map((p) => (
                        <Tooltip key={p.id}>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 rounded-md border border-white bg-zinc-100 shadow-xs">
                              <AvatarImage src={p.avatarUrl} alt={p.name} />
                              <AvatarFallback className="rounded-md font-mono text-[9px] font-medium text-zinc-800">
                                {p.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="border border-zinc-200 bg-white text-xs font-medium text-zinc-900 shadow-md rounded-md"
                          >
                            <p className="font-semibold">{p.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="h-8 flex items-center justify-center gap-1.5 rounded-md bg-zinc-950 px-3 font-mono text-xs font-medium uppercase text-white hover:bg-zinc-800 active:scale-95 transition-all shadow-xs"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Launch</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareClick(benchmarkMeeting)}
                      className="h-8 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 transition-all shadow-xs"
                    >
                      <Share2 className="h-3 w-3 text-zinc-400" />
                      <span>Share</span>
                    </button>

                    <Link href="/actions">
                      <button
                        type="button"
                        className="h-8 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 active:scale-95 transition-all shadow-xs"
                      >
                        <ListTodo className="h-3 w-3 text-zinc-400" />
                        <span>Tasks</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
          {/* Section 1: Calendar Schedule Strip */}
          <motion.section
            aria-label="Schedule"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <CalendarStrip
              onSimulateCall={() => {
                handleOpenBenchmark();
              }}
            />
          </motion.section>

          {/* Section 2: Meeting Directory & Filter Grid */}
          <motion.section
            aria-label="Meeting Directory"
            className="space-y-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
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
                        "rounded-md px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap",
                        isActive
                          ? "bg-zinc-950 text-white shadow-xs"
                          : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                      )}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Inline Search Input */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter calls..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-8 w-full rounded-md border border-zinc-200 bg-white pl-8 pr-2.5 font-mono text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Meetings Cards Grid */}
            {filteredMeetings.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-30px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.06,
                    },
                  },
                }}
              >
                {filteredMeetings.map((meeting) => (
                  <motion.div
                    key={meeting.id}
                    variants={{
                      hidden: { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35 },
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-zinc-50/50 py-12 text-center">
                <Video className="h-6 w-6 text-zinc-400 mb-2" />
                <p className="font-mono text-xs font-medium uppercase text-zinc-700">
                  No matching meetings
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-3 rounded-md border border-zinc-200 bg-white px-2.5 py-1 font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-xs"
                >
                  Reset filters
                </button>
              </div>
            )}
          </motion.section>

          {/* Section 3: Architecture & Workflow Highlights (Extends page naturally without text bloat) */}
          <motion.section
            aria-label="Platform Highlights"
            className="space-y-4 pt-2 border-t border-zinc-200/80"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Core Capabilities
              </span>
              <span className="font-mono text-[11px] text-zinc-400">Zero Configuration</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature Card 1 */}
              <Card className="border border-zinc-200/80 bg-white/95 p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                      <Zap className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-zinc-500">
                      Sub-second
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-zinc-950 mt-3">
                    Word-Level Karaoke Seek
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-zinc-600 leading-relaxed">
                    Click any spoken word across 92 diarized segments to jump audio playback instantly.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 2 */}
              <Card className="border border-zinc-200/80 bg-white/95 p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                      <Layers className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-zinc-500">
                      4 Lenses
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-zinc-950 mt-3">
                    Multi-Template Summaries
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-zinc-600 leading-relaxed">
                    Switch between Executive, Engineering, Sales MEDDPICC, and 1-on-1 briefs dynamically.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 3 */}
              <Card className="border border-zinc-200/80 bg-white/95 p-5 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[10px] text-zinc-500">
                      Zero Login
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-semibold text-zinc-950 mt-3">
                    Public Clip Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-zinc-600 leading-relaxed">
                    Share bounded 30s clips with external stakeholders without requiring account signup.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Section 4: Action Items Matrix Quick Access Strip */}
          <motion.section
            aria-label="Tasks Matrix Strip"
            className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-950 text-white shrink-0">
                <ListTodo className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-950">
                  Centralized Action Items Matrix
                </p>
                <p className="text-[11px] text-zinc-500">
                  Track owners, deadlines, and direct timestamp citations across all calls.
                </p>
              </div>
            </div>

            <Link href="/actions" className="shrink-0">
              <button
                type="button"
                className="h-8 flex items-center gap-1.5 rounded-md bg-zinc-950 px-3 font-mono text-xs font-medium uppercase text-white hover:bg-zinc-800 transition-colors shadow-xs"
              >
                <span>Open Matrix</span>
                <ArrowRight className="h-3 w-3" />
              </button>
            </Link>
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
