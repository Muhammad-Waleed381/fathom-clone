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
      <div className="mb-6 flex items-baseline justify-between border-b border-[#E4E4E7] pb-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#737373]">
            SPECIFICATION / ENGINE
          </span>
          <h2 className="font-serif text-2xl font-light tracking-tight text-[#0B0B0B] sm:text-3xl mt-1">
            Autonomous Meeting Architecture
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#737373] hidden sm:inline-block uppercase tracking-wider">
          v2.4 Core
        </span>
      </div>

      <div className="rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:p-8 shadow-xs">
        <Accordion type="single" collapsible defaultValue="item-1" className="w-full">
          {/* 1. Acoustic Diarization */}
          <AccordionItem value="item-1" className="border-b border-[#E4E4E7]/80 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-[#0B0B0B] hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F4F4F5] text-[#0B0B0B]">
                  <Headphones className="h-3.5 w-3.5" />
                </div>
                <span>01 / Sub-Second Acoustic Diarization</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-[#737373] leading-relaxed pl-10 pb-5">
              Raw audio buffers are streamed to the Deepgram Nova-2 neural acoustic model. 
              The engine clusters vocal frequencies across multiple concurrent speakers, emitting 
              precise word-level start and end boundaries down to 0.01-second resolution without 
              relying on cloud meeting bots.
            </AccordionContent>
          </AccordionItem>

          {/* 2. Structured JSON Synthesis */}
          <AccordionItem value="item-2" className="border-b border-[#E4E4E7]/80 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-[#0B0B0B] hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F4F4F5] text-[#0B0B0B]">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <span>02 / Deterministic Multi-Lens Synthesis</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-[#737373] leading-relaxed pl-10 pb-5">
              LLM inference prompts run via OpenRouter to compile transcripts into strictly typed JSON 
              payloads. Four distinct perspectives (Executive Brief, Engineering Architecture, Sales MEDDPICC, 
              and Action Items Matrix) are generated deterministically with embedded timestamp citations.
            </AccordionContent>
          </AccordionItem>

          {/* 3. Word Karaoke */}
          <AccordionItem value="item-3" className="border-b border-[#E4E4E7]/80 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-[#0B0B0B] hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F4F4F5] text-[#0B0B0B]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>03 / Bi-Directional Karaoke Time Sync</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-[#737373] leading-relaxed pl-10 pb-5">
              High-frequency requestAnimationFrame time synchronizers bridge HTML5 video playback with 
              the transcript DOM. Sub-second word spotlighting tracks continuous speech seamlessly, while clicking 
              any individual word instantly repositions the playback scrubber.
            </AccordionContent>
          </AccordionItem>

          {/* 4. Security & BYOK */}
          <AccordionItem value="item-4" className="border-b-0 py-1">
            <AccordionTrigger className="text-left font-mono text-xs uppercase tracking-wider text-[#0B0B0B] hover:no-underline py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-[#F4F4F5] text-[#0B0B0B]">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <span>04 / Zero-Trust Privacy & BYOK Keys</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="font-mono text-xs text-[#737373] leading-relaxed pl-10 pb-5">
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
