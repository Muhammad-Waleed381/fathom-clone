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
      <div className="mb-6 flex items-baseline justify-between border-b border-[#E4E4E7] pb-3">
        <div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-[#737373]">
            SYSTEM BENCHMARKS / COMPARISON
          </span>
          <h2 className="font-serif text-2xl font-light tracking-tight text-[#0B0B0B] sm:text-3xl mt-1">
            Platform Specifications
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#737373] hidden sm:inline-block uppercase tracking-wider">
          Architecture Delta
        </span>
      </div>

      <div className="rounded-2xl border border-[#E4E4E7] bg-white overflow-hidden shadow-xs">
        <Table className="font-mono text-xs">
          <TableHeader className="bg-[#F4F4F5]/60 border-b border-[#E4E4E7]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[220px] font-medium text-[#0B0B0B] uppercase tracking-wider py-3.5 pl-6">
                Capability
              </TableHead>
              <TableHead className="font-medium text-[#0B0B0B] uppercase tracking-wider py-3.5">
                Fathom AI Workstation
              </TableHead>
              <TableHead className="w-[240px] font-medium text-[#737373] uppercase tracking-wider py-3.5 pr-6 hidden sm:table-cell">
                Legacy Recorders
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {SPEC_ROWS.map((row, idx) => (
              <TableRow
                key={row.capability}
                className={idx % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]/70"}
              >
                <TableCell className="font-medium text-[#0B0B0B] py-3.5 pl-6">
                  {row.capability}
                </TableCell>
                <TableCell className="py-3.5 text-[#0B0B0B]">
                  <div className="flex items-center gap-2">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0B0B0B] text-white shrink-0">
                      <Check className="h-2.5 w-2.5" />
                    </div>
                    <span>{row.fathom}</span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 text-[#737373] pr-6 hidden sm:table-cell font-light">
                  <div className="flex items-center gap-2">
                    <Minus className="h-3 w-3 text-[#A1A1AA] shrink-0" />
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
