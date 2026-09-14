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
import { ArchitectureAccordion } from "@/components/landing/architecture-accordion";
import { SpecificationsTable } from "@/components/landing/specifications-table";
import { PipelineConsole } from "@/components/landing/pipeline-console";
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
      <div className="min-h-screen bg-[#0A0A0A] text-white font-mono selection:bg-white selection:text-black flex flex-col relative overflow-x-hidden">
        {/* Fixed Ambient Background Video Loop (From Reference Site) */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="/hero-poster.jpg"
            src="/hero-video.mp4"
            className="h-full w-full object-cover opacity-20 scale-105 filter grayscale contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/90 via-[#0A0A0A]/75 to-[#0A0A0A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,255,255,0.06),rgba(255,255,255,0))]" />
        </div>

        {/* Hero Section */}
        <section className="relative w-full overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-16">
          <div className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden">
            <SparklesCore
              id="hero-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={2.0}
              particleDensity={30}
              className="h-full w-full opacity-35"
              particleColor="#FFFFFF"
              speed={0.3}
            />
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Column: Typography & CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55 }}
                className="lg:col-span-7"
              >
                {/* Reference Slash Tags */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono tracking-[0.18em] text-white/60 uppercase mb-4">
                  <span>/ 01 ACOUSTIC DIARIZATION</span>
                  <span className="text-white/25">•</span>
                  <span>/ 02 SUB-SECOND KARAOKE</span>
                  <span className="text-white/25">•</span>
                  <span>/ 03 MULTI-LENS SYNTHESIS</span>
                </div>

                {/* Section Badge */}
                <div className="section-badge mb-5">
                  FATHOM AI WORKSTATION // SPEECH COMPUTE
                </div>

                {/* Editorial Headline */}
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.04] tracking-tight text-white">
                  Meeting intelligence, verified by speech compute.
                </h1>
                
                <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl leading-relaxed font-sans font-light">
                  Sub-second acoustic diarization, deterministic multi-lens synthesis, and cryptographically verified action provenance.
                </p>

                {/* CTA Row */}
                <div className="mt-7 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={handleOpenBenchmark}
                    className="cta border border-white bg-white text-black hover:scale-[1.02] shadow-[0_0_35px_rgba(255,255,255,0.25)]"
                  >
                    <span className="cta-bg bg-white" />
                    <span className="cta-text text-black font-semibold">LAUNCH BENCHMARK</span>
                    <span className="cta-circle bg-black text-white">
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </button>

                  <Link href="/actions">
                    <button
                      type="button"
                      className="cta border border-white/20 bg-black/40 text-white backdrop-blur-md hover:border-white/50"
                    >
                      <span className="cta-bg bg-white/10" />
                      <span className="cta-text text-white">ACTION MATRIX</span>
                      <span className="cta-circle bg-white/20 text-white">
                        <ArrowRight className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  </Link>
                </div>
              </motion.div>

              {/* Right Column: Prominent Hero Video Player Showcase */}
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-5"
              >
                <div className="relative rounded-3xl border border-white/20 bg-black/60 p-2 sm:p-2.5 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl overflow-hidden group">
                  <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-black">
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      poster="/hero-poster.jpg"
                      src="/hero-video.mp4"
                      className="h-full w-full object-cover grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                    
                    {/* Top Status Header */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/60 px-3 py-1 backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-white" />
                        <span className="font-mono text-[10px] uppercase tracking-wider text-white/80">NOVA-2 NEURAL STREAM</span>
                      </div>
                      <div className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 font-mono text-[10px] text-white/70 backdrop-blur-md">
                        48kHz STEREO
                      </div>
                    </div>

                    {/* Bottom Metadata Footer */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/80 font-mono text-[10px] uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                      <span>ACOUSTIC DIARIZATION</span>
                      <span>0.01s SYNC</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Featured Benchmark Call Glass Card */}
            {benchmarkMeeting && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 }}
                className="mt-10 rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-7 shadow-2xl backdrop-blur-xl hover:border-white/35 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-white/50 uppercase tracking-widest font-mono">
                      <span>BENCHMARK CALL</span>
                      <span>·</span>
                      <span>42M 15S</span>
                      <span>·</span>
                      <span>8 ATTENDEES</span>
                      <span>·</span>
                      <span>92 SEGMENTS</span>
                    </div>

                    <h2 className="font-serif text-2xl sm:text-3xl font-light text-white tracking-tight">
                      {benchmarkMeeting.title}
                    </h2>

                    <p className="text-xs text-white/60 max-w-xl leading-relaxed font-sans font-light">
                      Multi-speaker clustering test bench with word-level karaoke synchronization.
                    </p>

                    {/* Participant Avatars */}
                    <div className="flex items-center -space-x-1.5 pt-1">
                      {benchmarkMeeting.participants.map((p) => (
                        <Tooltip key={p.id}>
                          <TooltipTrigger asChild>
                            <Avatar className="h-7 w-7 rounded-full border border-white/25 bg-black shadow-xs">
                              <AvatarImage src={p.avatarUrl} alt={p.name} />
                              <AvatarFallback className="rounded-full font-mono text-[9px] font-medium text-white bg-white/10">
                                {p.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent
                            side="bottom"
                            className="border border-white/20 bg-[#121212] text-xs font-mono text-white shadow-xl rounded-xl"
                          >
                            <p className="font-semibold">{p.name}</p>
                            {p.role && <p className="text-[10px] text-white/60">{p.role}</p>}
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
                    <button
                      type="button"
                      onClick={handleOpenBenchmark}
                      className="cta border border-white bg-white text-black hover:scale-[1.02]"
                    >
                      <span className="cta-bg bg-white" />
                      <span className="cta-text text-black font-medium">OPEN CALL</span>
                      <span className="cta-circle bg-black text-white">
                        <Play className="h-3 w-3 fill-current" />
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareClick(benchmarkMeeting)}
                      className="h-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10 active:scale-95 transition-all"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                      <span>SHARE</span>
                    </button>

                    <Link href="/actions">
                      <button
                        type="button"
                        className="h-10 flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 text-xs font-mono uppercase tracking-wider text-white/80 hover:text-white hover:border-white/40 hover:bg-white/10 active:scale-95 transition-all"
                      >
                        <ListTodo className="h-3.5 w-3.5" />
                        <span>TASKS</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Micro Divider */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
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

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 2: Meeting Directory & Filter Grid */}
          <motion.section
            aria-label="Meeting Directory"
            className="space-y-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/15 pb-5">
              <div>
                <span className="section-badge mb-2">
                  RECORDINGS DIRECTORY // SPEECH CORPUS
                </span>
                <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl mt-2">
                  Indexed Sessions
                </h2>
              </div>

              {/* Filter Tabs & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {/* Category Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none rounded-full border border-white/15 bg-black/45 p-1 backdrop-blur-xl">
                  {CATEGORY_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          "px-3 py-1 rounded-full text-[11px] font-mono tracking-wider transition-all uppercase whitespace-nowrap",
                          isActive
                            ? "bg-white text-black font-semibold shadow-sm"
                            : "text-white/60 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Inline Search Input */}
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50" />
                  <input
                    type="text"
                    placeholder="FILTER SESSIONS..."
                    value={filterQuery}
                    onChange={(e) => setFilterQuery(e.target.value)}
                    className="h-9 w-full rounded-full border border-white/15 bg-black/45 pl-9 pr-3 font-mono text-[11px] uppercase tracking-wider text-white placeholder:text-white/40 focus:outline-none focus:border-white/60 backdrop-blur-xl transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Meetings Cards Grid */}
            {filteredMeetings.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
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
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/20 bg-black/40 py-16 text-center backdrop-blur-xl">
                <Video className="h-8 w-8 text-white/40 mb-3" />
                <p className="text-xs font-mono font-medium uppercase text-white/70 tracking-widest">
                  NO MATCHING MEETINGS FOUND
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("all");
                    setFilterQuery("");
                  }}
                  className="mt-4 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-white hover:bg-white hover:text-black transition-colors"
                >
                  Reset filters
                </button>
              </div>
            )}
          </motion.section>

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 3: Inverting Core Architecture Cards (Reference Site Signature) */}
          <motion.section
            aria-label="Platform Architecture"
            className="space-y-6"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/15 pb-4">
              <div>
                <span className="section-badge mb-2">
                  CORE PROTOCOL SPECIFICATION
                </span>
                <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl mt-2">
                  Compute Capabilities
                </h2>
              </div>
              <span className="font-mono text-[11px] text-white/50 uppercase tracking-widest">
                ZERO COMPROMISE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Feature Card 1 (Inverting Card) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-pointer text-white">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:bg-black group-hover:text-white transition-colors duration-500">
                      <Zap className="h-4 w-4" />
                    </div>
                    <span className="rounded-full border border-white/20 group-hover:border-black/20 bg-white/10 group-hover:bg-black/5 px-2.5 py-0.5 text-[10px] text-white/80 group-hover:text-black font-mono uppercase tracking-wider transition-colors duration-500">
                      SUB-SECOND
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium tracking-tight text-white group-hover:text-black mt-5 font-mono flex items-center justify-between">
                    <span>Acoustic Word Karaoke</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="h-px w-0 bg-black transition-all duration-500 ease-out group-hover:w-6 hidden sm:inline-block" />
                      <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 text-white/60 group-hover:text-black" />
                    </span>
                  </h3>
                  <p className="text-xs text-white/60 group-hover:text-black/75 leading-relaxed font-sans font-light mt-3 transition-colors duration-500">
                    Every spoken word mapped to sub-second audio timestamps across diarized conversational segments with instant word-click seek.
                  </p>
                </div>
              </div>

              {/* Feature Card 2 (Inverting Card) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-pointer text-white">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:bg-black group-hover:text-white transition-colors duration-500">
                      <Layers className="h-4 w-4" />
                    </div>
                    <span className="rounded-full border border-white/20 group-hover:border-black/20 bg-white/10 group-hover:bg-black/5 px-2.5 py-0.5 text-[10px] text-white/80 group-hover:text-black font-mono uppercase tracking-wider transition-colors duration-500">
                      4 LENSES
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium tracking-tight text-white group-hover:text-black mt-5 font-mono flex items-center justify-between">
                    <span>Multi-Template Compute</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="h-px w-0 bg-black transition-all duration-500 ease-out group-hover:w-6 hidden sm:inline-block" />
                      <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 text-white/60 group-hover:text-black" />
                    </span>
                  </h3>
                  <p className="text-xs text-white/60 group-hover:text-black/75 leading-relaxed font-sans font-light mt-3 transition-colors duration-500">
                    Instant deterministic synthesis for Executive Briefs, Technical Architecture, Sales MEDDPICC, and Action Item Matrices.
                  </p>
                </div>
              </div>

              {/* Feature Card 3 (Inverting Card) */}
              <div className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-8 shadow-sm backdrop-blur-xl transition-all duration-500 hover:border-white/60 hover:bg-white hover:text-black hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] cursor-pointer text-white">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-white/10 text-white group-hover:bg-black group-hover:text-white transition-colors duration-500">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <span className="rounded-full border border-white/20 group-hover:border-black/20 bg-white/10 group-hover:bg-black/5 px-2.5 py-0.5 text-[10px] text-white/80 group-hover:text-black font-mono uppercase tracking-wider transition-colors duration-500">
                      ZERO LOGIN
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-medium tracking-tight text-white group-hover:text-black mt-5 font-mono flex items-center justify-between">
                    <span>Public Clip Sharing</span>
                    <span className="flex items-center gap-1.5 shrink-0">
                      <span className="h-px w-0 bg-black transition-all duration-500 ease-out group-hover:w-6 hidden sm:inline-block" />
                      <ArrowRight className="h-4 w-4 -rotate-45 transition-transform duration-500 group-hover:rotate-0 text-white/60 group-hover:text-black" />
                    </span>
                  </h3>
                  <p className="text-xs text-white/60 group-hover:text-black/75 leading-relaxed font-sans font-light mt-3 transition-colors duration-500">
                    Share bounded highlight clips with external partners with synchronized karaoke transcripts and zero login friction.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 4: Action Items Matrix Access Strip */}
          <motion.section
            aria-label="Tasks Matrix Strip"
            className="rounded-3xl border border-white/15 bg-black/45 backdrop-blur-xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-black shrink-0 shadow-sm">
                <ListTodo className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-mono font-medium uppercase tracking-widest text-white">
                  CENTRALIZED ACTION ITEMS MATRIX
                </p>
                <p className="text-xs text-white/60 font-sans font-light mt-1">
                  Track owners, priorities, and direct timestamp citations across all workspace call transcripts.
                </p>
              </div>
            </div>

            <Link href="/actions" className="shrink-0">
              <button
                type="button"
                className="cta border border-white bg-white text-black hover:scale-[1.02]"
              >
                <span className="cta-bg bg-white" />
                <span className="cta-text text-black font-semibold">OPEN MATRIX</span>
                <span className="cta-circle bg-black text-white">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </Link>
          </motion.section>

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 5: Interactive Pipeline Execution Console (shadcn Tabs) */}
          <motion.section
            aria-label="Pipeline Console"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <PipelineConsole />
          </motion.section>

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 6: Platform Specifications Comparison Table (shadcn Table) */}
          <motion.section
            aria-label="Platform Specifications"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <SpecificationsTable />
          </motion.section>

          {/* Micro Divider */}
          <div className="micro-divider">
            <span className="micro-divider-dot" />
            <span className="micro-divider-line" />
            <span className="micro-divider-dot" />
          </div>

          {/* Section 7: Technical Architecture Deep-Dive (shadcn Accordion) */}
          <motion.section
            aria-label="Technical Architecture"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4 }}
          >
            <ArchitectureAccordion />
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
