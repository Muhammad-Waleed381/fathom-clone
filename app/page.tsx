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
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "engineering" | "sales" | "design" | "1-on-1s";

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "engineering", label: "ENGINEERING" },
  { id: "sales", label: "SALES" },
  { id: "design", label: "DESIGN" },
  { id: "1-on-1s", label: "1-ON-1S" },
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
      <div className="min-h-screen bg-[#FFFFFF] text-[#0B0B0B] font-mono selection:bg-[#0B0B0B] selection:text-white flex flex-col">
        {/* Hero Section with Gleaming Star Sparkles */}
        <section className="relative w-full overflow-hidden border-b border-[#E4E4E7] bg-white">
          <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
            <SparklesCore
              id="hero-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={2.0}
              particleDensity={50}
              className="h-full w-full opacity-70"
              particleColor="#0B0B0B"
              speed={0.45}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(11,11,11,0.02),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-10 sm:pt-12 sm:pb-14">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-2xl"
            >
              {/* Nockchain-style Category Tag */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="text-[11px] uppercase tracking-widest text-[#737373]">
                  PROTOCOL // INTELLIGENCE SYSTEM
                </span>
              </div>

              {/* Nockchain Editorial Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#0B0B0B] font-serif">
                Meeting intelligence, verified by speech compute.
              </h1>
              <p className="mt-2.5 text-xs sm:text-sm text-[#737373] max-w-lg leading-relaxed font-light">
                Synchronized diarization, autonomous summaries, and cryptographic action item provenance.
              </p>
            </motion.div>

            {/* Featured Benchmark Call Card */}
            {benchmarkMeeting && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="mt-6 rounded-lg border border-[#E4E4E7] bg-white p-5 sm:p-6 shadow-sm hover:border-[#0B0B0B]/40 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-[11px] text-[#737373] uppercase tracking-wider">
                      <span>BENCHMARK CALL</span>
                      <span>·</span>
                      <span>42M 15S</span>
                      <span>·</span>
                      <span>8 ATTENDEES</span>
                    </div>

                    <h2 className="text-base sm:text-lg font-medium tracking-tight text-[#0B0B0B]">
                      {benchmarkMeeting.title}
                    </h2>

                    {/* Participant Avatars */}
                    <div className="flex items-center -space-x-1.5 pt-1">
                      {benchmarkMeeting.participants.map((p) => (
                        <Tooltip key={p.id}>
                          <TooltipTrigger asChild>
                            <Avatar className="h-6 w-6 rounded border border-[#E4E4E7] bg-[#F4F4F5] shadow-2xs">
                              <AvatarImage src={p.avatarUrl} alt={p.name} />
                              <AvatarFallback className="rounded font-mono text-[9px] font-medium text-[#0B0B0B]">
                                {p.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="border border-[#E4E4E7] bg-white text-xs font-mono text-[#0B0B0B] shadow-md rounded"
                          >
                            <p className="font-semibold">{p.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="h-8 flex items-center justify-center gap-1.5 rounded bg-[#0B0B0B] px-3.5 text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      <span>LAUNCH</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareClick(benchmarkMeeting)}
                      className="h-8 flex items-center gap-1.5 rounded border border-[#E4E4E7] bg-white px-3 text-[11px] font-normal uppercase tracking-wider text-[#737373] hover:text-[#0B0B0B] hover:border-[#0B0B0B]/40 active:scale-95 transition-all relative group"
                    >
                      <Share2 className="h-3 w-3" />
                      <span>SHARE</span>
                      <span className="stipple-underline w-0 group-hover:w-full" />
                    </button>

                    <Link href="/actions">
                      <button
                        type="button"
                        className="h-8 flex items-center gap-1.5 rounded border border-[#E4E4E7] bg-white px-3 text-[11px] font-normal uppercase tracking-wider text-[#737373] hover:text-[#0B0B0B] hover:border-[#0B0B0B]/40 active:scale-95 transition-all relative group"
                      >
                        <ListTodo className="h-3 w-3" />
                        <span>TASKS</span>
                        <span className="stipple-underline w-0 group-hover:w-full" />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4E4E7] pb-3">
              {/* Category Filter Tabs with Stipple Underline */}
              <div className="flex items-center gap-4 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {CATEGORY_TABS.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "relative py-1 text-xs tracking-wider transition-opacity uppercase group whitespace-nowrap",
                        isActive
                          ? "text-[#0B0B0B] font-medium opacity-100"
                          : "text-[#737373] hover:text-[#0B0B0B] opacity-70 hover:opacity-100"
                      )}
                    >
                      <span>{tab.label}</span>
                      <span
                        className={cn(
                          "stipple-underline",
                          isActive ? "w-full" : "w-0 group-hover:w-full"
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Inline Search Input */}
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#737373]" />
                <input
                  type="text"
                  placeholder="FILTER CALLS..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="h-8 w-full rounded border border-[#E4E4E7] bg-white pl-8 pr-2.5 font-mono text-[11px] uppercase tracking-wider text-[#0B0B0B] placeholder:text-[#737373] focus:outline-none focus:border-[#0B0B0B] transition-colors"
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
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-[#E4E4E7] bg-[#F4F4F5]/50 py-12 text-center">
                <Video className="h-6 w-6 text-[#737373] mb-2" />
                <p className="text-xs font-medium uppercase text-[#737373] tracking-wide">
                  NO MATCHING MEETINGS FOUND
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-3 rounded border border-[#E4E4E7] bg-white px-2.5 py-1 text-[11px] uppercase tracking-wide text-[#0B0B0B] hover:bg-[#F4F4F5] transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </motion.section>

          {/* Section 3: Protocol Architecture Capabilities (Nockchain Grid) */}
          <motion.section
            aria-label="Platform Architecture"
            className="space-y-4 pt-4 border-t border-[#E4E4E7]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium uppercase tracking-widest text-[#737373]">
                CORE PROTOCOL SPECIFICATION
              </span>
              <span className="text-[11px] text-[#737373] uppercase tracking-wide">
                ZERO COMPROMISE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Feature Card 1 */}
              <Card className="rounded-lg border border-[#E4E4E7] bg-white p-5 shadow-2xs hover:border-[#0B0B0B]/50 transition-colors">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F4F4F5] text-[#0B0B0B]">
                      <Zap className="h-3.5 w-3.5" />
                    </div>
                    <span className="rounded border border-[#E4E4E7] px-1.5 py-0.2 text-[10px] text-[#737373] uppercase">
                      SUB-SECOND
                    </span>
                  </div>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide text-[#0B0B0B] mt-3 font-mono">
                    Acoustic Word Karaoke
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-[#737373] leading-relaxed font-light">
                    Every word mapped to sub-second audio timestamps across 92 diarized conversational segments.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 2 */}
              <Card className="rounded-lg border border-[#E4E4E7] bg-white p-5 shadow-2xs hover:border-[#0B0B0B]/50 transition-colors">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F4F4F5] text-[#0B0B0B]">
                      <Layers className="h-3.5 w-3.5" />
                    </div>
                    <span className="rounded border border-[#E4E4E7] px-1.5 py-0.2 text-[10px] text-[#737373] uppercase">
                      4 LENSES
                    </span>
                  </div>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide text-[#0B0B0B] mt-3 font-mono">
                    Multi-Template Compute
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-[#737373] leading-relaxed font-light">
                    Instant zero-latency synthesis for Executive Briefs, Technical Architecture, and Sales MEDDPICC.
                  </CardDescription>
                </CardContent>
              </Card>

              {/* Feature Card 3 */}
              <Card className="rounded-lg border border-[#E4E4E7] bg-white p-5 shadow-2xs hover:border-[#0B0B0B]/50 transition-colors">
                <CardHeader className="p-0 pb-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-[#F4F4F5] text-[#0B0B0B]">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <span className="rounded border border-[#E4E4E7] px-1.5 py-0.2 text-[10px] text-[#737373] uppercase">
                      ZERO LOGIN
                    </span>
                  </div>
                  <CardTitle className="text-sm font-medium uppercase tracking-wide text-[#0B0B0B] mt-3 font-mono">
                    Public Clip Sharing
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-xs text-[#737373] leading-relaxed font-light">
                    Share bounded highlight clips with external parties with cryptographic verification and zero login.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </motion.section>

          {/* Section 4: Action Items Matrix Access Strip */}
          <motion.section
            aria-label="Tasks Matrix Strip"
            className="rounded-lg border border-[#E4E4E7] bg-[#F4F4F5]/60 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-[#0B0B0B] text-white shrink-0">
                <ListTodo className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#0B0B0B]">
                  CENTRALIZED ACTION ITEMS MATRIX
                </p>
                <p className="text-[11px] text-[#737373] font-light">
                  Track owners, deadlines, and direct timestamp citations across all workspace calls.
                </p>
              </div>
            </div>

            <Link href="/actions" className="shrink-0">
              <button
                type="button"
                className="h-8 flex items-center gap-1.5 rounded bg-[#0B0B0B] px-3.5 text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
              >
                <span>OPEN MATRIX</span>
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
