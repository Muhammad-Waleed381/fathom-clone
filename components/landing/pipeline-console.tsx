"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Cpu, CheckSquare, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";

export function PipelineConsole() {
  return (
    <section aria-label="Interactive Pipeline Console" className="w-full font-sans">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="section-badge mb-3">
            Workflow // Execution Stages
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal tracking-tight text-white drop-shadow-md">
            The Neural Pipeline
          </h2>
        </div>
        <span className="font-mono text-[11px] text-white/60 tracking-[0.15em] uppercase">
          End-To-End Ingestion & Compute
        </span>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-8 backdrop-blur-xl shadow-[0_10px_34px_rgba(0,0,0,0.5)]">
        <Tabs defaultValue="stage-1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-full border border-white/20 bg-white/5 p-1 font-mono text-xs">
            <TabsTrigger
              value="stage-1"
              className="rounded-full py-2 uppercase tracking-wider text-[11px] text-white/70 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all duration-300"
            >
              01. Ingestion
            </TabsTrigger>
            <TabsTrigger
              value="stage-2"
              className="rounded-full py-2 uppercase tracking-wider text-[11px] text-white/70 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all duration-300"
            >
              02. Synthesis
            </TabsTrigger>
            <TabsTrigger
              value="stage-3"
              className="rounded-full py-2 uppercase tracking-wider text-[11px] text-white/70 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold transition-all duration-300"
            >
              03. Workspace
            </TabsTrigger>
          </TabsList>

          {/* Stage 1: Ingestion */}
          <TabsContent value="stage-1" className="mt-6 focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm font-mono">
                  <Mic className="h-4 w-4 text-white" />
                  <span>On-Demand Audio Ingestion & Diarization</span>
                </div>
                <p className="text-white/75 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                  Upload any WAV, MP3, or MP4 recording, or capture live audio directly via the in-browser recording workstation. 
                  Deepgram Nova-2 diarizes speakers in real-time without requiring invasive bots to join your calls.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/15 bg-black/60 px-5 py-3.5 text-xs font-mono space-y-1">
                <div className="text-white/50 uppercase tracking-widest text-[10px]">Format Support</div>
                <div className="text-white font-medium text-[11px]">WAV · MP3 · AAC · M4A</div>
                <div className="text-white/40 text-[10px] mt-1">Chunk streaming: 100ms</div>
              </div>
            </div>
          </TabsContent>

          {/* Stage 2: Synthesis */}
          <TabsContent value="stage-2" className="mt-6 focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm font-mono">
                  <Cpu className="h-4 w-4 text-white" />
                  <span>Multi-Perspective Structured Extraction</span>
                </div>
                <p className="text-white/75 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                  Transcripts are dispatched to OpenRouter for deterministic structured JSON generation. 
                  Switch between Executive Briefs, Technical Architecture Syncs, and MEDDPICC Sales discoveries with sub-second citations.
                </p>
              </div>
              <div className="shrink-0 rounded-2xl border border-white/15 bg-black/60 px-5 py-3.5 text-xs font-mono space-y-1">
                <div className="text-white/50 uppercase tracking-widest text-[10px]">Model Engine</div>
                <div className="text-white font-medium text-[11px]">Nex Pro · Llama · Qwen</div>
                <div className="text-white/40 text-[10px] mt-1">JSON Schema enforcement</div>
              </div>
            </div>
          </TabsContent>

          {/* Stage 3: Workspace */}
          <TabsContent value="stage-3" className="mt-6 focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white font-medium uppercase tracking-wider text-sm font-mono">
                  <CheckSquare className="h-4 w-4 text-white" />
                  <span>Action Items Matrix & Deep-Link Playback</span>
                </div>
                <p className="text-white/75 leading-relaxed font-light text-xs sm:text-sm max-w-xl">
                  Deliverables, owners, and deadlines are centralized in an interactive Action Items Hub. 
                  Every task features clickable timestamp badges that jump straight to the source audio.
                </p>
              </div>
              <Link href="/actions" className="shrink-0 cta">
                <span className="cta-bg bg-white"></span>
                <span className="cta-text text-black">Open Hub</span>
                <span className="cta-circle bg-black text-white ring-1 ring-white/60">
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
