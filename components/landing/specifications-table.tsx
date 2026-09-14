"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpecRow {
  capability: string;
  fathom: string;
  legacy: string;
  hasAdvantage: boolean;
}

const SPEC_ROWS: SpecRow[] = [
  {
    capability: "Speaker Diarization",
    fathom: "Multi-speaker acoustic clustering (Deepgram Nova-2)",
    legacy: "Single-channel monolithic audio",
    hasAdvantage: true,
  },
  {
    capability: "Word-Level Timestamp Precision",
    fathom: "Sub-second karaoke (0.01s start/end tracking)",
    legacy: "10s to 30s block estimates",
    hasAdvantage: true,
  },
  {
    capability: "Synthesis Perspectives",
    fathom: "4 Lenses: Executive, Engineering, Sales, Actions",
    legacy: "Generic one-size-fits-all summary",
    hasAdvantage: true,
  },
  {
    capability: "Audio Ingestion Model",
    fathom: "On-demand workstation upload & mic recording",
    legacy: "Uninvited bot attendance required",
    hasAdvantage: true,
  },
  {
    capability: "External Clip Sharing",
    fathom: "Cryptographically bounded clips (Zero login required)",
    legacy: "Full meeting export or raw video download",
    hasAdvantage: true,
  },
  {
    capability: "API Key Ownership",
    fathom: "BYOK (OpenRouter / Deepgram) + Offline Fallbacks",
    legacy: "Proprietary vendor lock-in",
    hasAdvantage: true,
  },
  {
    capability: "Tail Latency Target",
    fathom: "p95 < 1.8s synthesis response",
    legacy: "Multi-minute batch queuing",
    hasAdvantage: true,
  },
];

export function SpecificationsTable() {
  return (
    <section aria-label="Specifications Table" className="w-full">
      <div className="mb-6 flex items-baseline justify-between border-b border-white/15 pb-4">
        <div>
          <span className="section-badge mb-2">
            SYSTEM BENCHMARKS / SPECIFICATION
          </span>
          <h2 className="font-serif text-3xl font-light tracking-tight text-white sm:text-4xl mt-2">
            Platform Specifications
          </h2>
        </div>
        <span className="font-mono text-[11px] text-white/50 hidden sm:inline-block uppercase tracking-widest">
          Architecture Delta
        </span>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/45 backdrop-blur-xl overflow-hidden shadow-2xl">
        <Table className="font-mono text-xs">
          <TableHeader className="bg-white/5 border-b border-white/10">
            <TableRow className="hover:bg-transparent border-white/10">
              <TableHead className="w-[220px] font-medium text-white uppercase tracking-wider py-4 pl-6">
                Capability
              </TableHead>
              <TableHead className="font-medium text-white uppercase tracking-wider py-4">
                Fathom AI Workstation
              </TableHead>
              <TableHead className="w-[240px] font-medium text-white/50 uppercase tracking-wider py-4 pr-6 hidden sm:table-cell">
                Legacy Recorders
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SPEC_ROWS.map((row, idx) => (
              <TableRow
                key={row.capability}
                className={cn(
                  "border-white/10 transition-colors hover:bg-white/5",
                  idx % 2 === 0 ? "bg-black/20" : "bg-white/[0.02]"
                )}
              >
                <TableCell className="font-medium text-white/90 py-4 pl-6">
                  {row.capability}
                </TableCell>
                <TableCell className="py-4 text-white">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-black shrink-0">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span>{row.fathom}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 text-white/50 pr-6 hidden sm:table-cell font-light">
                  <div className="flex items-center gap-2">
                    <Minus className="h-3 w-3 text-white/30 shrink-0" />
                    <span>{row.legacy}</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
