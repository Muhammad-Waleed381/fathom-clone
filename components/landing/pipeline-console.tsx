"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Cpu, CheckSquare, ArrowRight } from "lucide-react";
import Link from "next/link";

export function PipelineConsole() {
  return (
    <section aria-label="Interactive Pipeline Console" className="w-full">
      <div className="mb-6 flex items-baseline justify-between border-b border-[#E4E4E7] pb-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#737373]">
            WORKFLOW / PIPELINE
          </span>
          <h2 className="font-serif text-2xl font-light tracking-tight text-[#0B0B0B] sm:text-3xl mt-1">
            Execution Stages
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#737373] hidden sm:inline-block uppercase tracking-wider">
          End-To-End Flow
        </span>
      </div>

      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-xs">
        <Tabs defaultValue="stage-1" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-xl bg-[#F4F4F5] p-1 font-mono text-xs">
            <TabsTrigger
              value="stage-1"
              className="rounded-lg py-2 uppercase tracking-wide text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#0B0B0B] data-[state=active]:shadow-xs transition-all"
            >
              01. Ingestion
            </TabsTrigger>
            <TabsTrigger
              value="stage-2"
              className="rounded-lg py-2 uppercase tracking-wide text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#0B0B0B] data-[state=active]:shadow-xs transition-all"
            >
              02. Synthesis
            </TabsTrigger>
            <TabsTrigger
              value="stage-3"
              className="rounded-lg py-2 uppercase tracking-wide text-[11px] data-[state=active]:bg-white data-[state=active]:text-[#0B0B0B] data-[state=active]:shadow-xs transition-all"
            >
              03. Workspace
            </TabsTrigger>
          </TabsList>

          {/* Stage 1: Ingestion */}
          <TabsContent value="stage-1" className="mt-6 font-mono text-xs focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-[#E4E4E7]/80 bg-[#FAFAFA] p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#0B0B0B] font-medium uppercase tracking-wider">
                  <Mic className="h-4 w-4" />
                  <span>On-Demand Audio Ingestion & Diarization</span>
                </div>
                <p className="text-[#737373] leading-relaxed font-light max-w-xl">
                  Upload any WAV, MP3, or MP4 recording, or capture live audio directly via the browser recording workstation. 
                  Deepgram Nova-2 diarizes speakers in real-time without requiring invasive bots to join your calls.
                </p>
              </div>
              <div className="shrink-0 rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-[11px] space-y-1">
                <div className="text-[#737373] uppercase tracking-wide">Format Support</div>
                <div className="text-[#0B0B0B] font-medium">WAV · MP3 · AAC · M4A</div>
                <div className="text-[#737373] text-[10px] mt-1">Chunk streaming: 100ms</div>
              </div>
            </div>
          </TabsContent>

          {/* Stage 2: Synthesis */}
          <TabsContent value="stage-2" className="mt-6 font-mono text-xs focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-[#E4E4E7]/80 bg-[#FAFAFA] p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#0B0B0B] font-medium uppercase tracking-wider">
                  <Cpu className="h-4 w-4" />
                  <span>Multi-Perspective Structured Extraction</span>
                </div>
                <p className="text-[#737373] leading-relaxed font-light max-w-xl">
                  Transcripts are dispatched to OpenRouter for deterministic structured JSON generation. 
                  Switch between Executive Briefs, Technical Architecture Syncs, and MEDDPICC Sales discoveries with sub-second citations.
                </p>
              </div>
              <div className="shrink-0 rounded-lg border border-[#E4E4E7] bg-white px-4 py-3 text-[11px] space-y-1">
                <div className="text-[#737373] uppercase tracking-wide">Open Model Engine</div>
                <div className="text-[#0B0B0B] font-medium">Llama 3.3 · Nex Pro · Qwen</div>
                <div className="text-[#737373] text-[10px] mt-1">JSON Schema enforcement</div>
              </div>
            </div>
          </TabsContent>

          {/* Stage 3: Workspace */}
          <TabsContent value="stage-3" className="mt-6 font-mono text-xs focus:outline-none">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-xl border border-[#E4E4E7]/80 bg-[#FAFAFA] p-5">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#0B0B0B] font-medium uppercase tracking-wider">
                  <CheckSquare className="h-4 w-4" />
                  <span>Action Items Matrix & Deep-Link Playback</span>
                </div>
                <p className="text-[#737373] leading-relaxed font-light max-w-xl">
                  Deliverables, owners, and deadlines are centralized in an interactive Action Items Hub. 
                  Every task features clickable timestamp badges that jump straight to the source audio.
                </p>
              </div>
              <Link href="/actions" className="shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-xl bg-[#0B0B0B] px-4 py-2.5 text-[11px] font-medium uppercase tracking-wider text-white hover:opacity-90 transition-opacity"
                >
                  <span>Open Hub</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </Link>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
