"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Cpu, Headphones, Shield, Sparkles, Terminal } from "lucide-react";

export function ArchitectureAccordion() {
  return (
    <section aria-label="System Architecture" className="w-full">
      <div className="mb-6 flex items-baseline justify-between border-b border-white/15 pb-4">
        <div>
          <span className="section-badge mb-2">
            SPECIFICATION // SYSTEM ENGINE
          </span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl mt-2">
            Autonomous Meeting Architecture
          </h2>
        </div>
        <span className="font-mono text-[11px] text-white/50 hidden sm:inline-block uppercase tracking-widest">
          v2.4 Core
        </span>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/45 p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          {/* 1. Acoustic Diarization */}
          <AccordionItem value="item-1" className="border-b border-white/10 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-white hover:no-underline py-4 hover:text-white/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                  <Headphones className="h-3.5 w-3.5" />
                </div>
                <span>01 / Sub-Second Acoustic Diarization</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-white/60 leading-relaxed pl-10 pb-5">
              Raw audio buffers are streamed to the Deepgram Nova-2 neural acoustic model. 
              The engine clusters vocal frequencies across multiple concurrent speakers, emitting 
              precise word-level start and end boundaries down to 0.01-second resolution without 
              relying on cloud meeting bots.
            </AccordionContent>
          </AccordionItem>

          {/* 2. Structured JSON Synthesis */}
          <AccordionItem value="item-2" className="border-b border-white/10 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-white hover:no-underline py-4 hover:text-white/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <span>02 / Deterministic Multi-Lens Synthesis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-white/60 leading-relaxed pl-10 pb-5">
              LLM inference prompts run via OpenRouter to compile transcripts into strictly typed JSON 
              payloads. Four distinct perspectives (Executive Brief, Engineering Architecture, Sales MEDDPICC, 
              and Action Items Matrix) are generated deterministically with embedded timestamp citations.
            </AccordionContent>
          </AccordionItem>

          {/* 3. Word Karaoke */}
          <AccordionItem value="item-3" className="border-b border-white/10 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-white hover:no-underline py-4 hover:text-white/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>03 / Bi-Directional Karaoke Time Sync</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-white/60 leading-relaxed pl-10 pb-5">
              High-frequency requestAnimationFrame time synchronizers bridge HTML5 video playback with 
              the transcript DOM. Sub-second word spotlighting tracks continuous speech seamlessly, while clicking 
              any individual word instantly repositions the playback scrubber.
            </AccordionContent>
          </AccordionItem>

          {/* 4. Security & BYOK */}
          <AccordionItem value="item-4" className="border-b-0 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-white hover:no-underline py-4 hover:text-white/80 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 text-white border border-white/10">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <span>04 / Zero-Trust Privacy & BYOK Keys</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-white/60 leading-relaxed pl-10 pb-5">
              Audio recordings and API keys reside securely within your workspace session. 
              Bring-Your-Own-Key (BYOK) architecture supports direct provider credentials with zero external retention, 
              backed by intelligent client-side fallbacks for uninterrupted offline workflows.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
}
