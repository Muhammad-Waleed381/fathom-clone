"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { Terminal, Layers, Mail, FileText, MapPin } from "lucide-react";

export function FluidFooter() {
  const [apiModalOpen, setApiModalOpen] = useState(false);
  const [copiedFeedback, setCopiedFeedback] = useState(false);

  const handleCopyFeedbackEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("support@fathom.internal");
      setCopiedFeedback(true);
      setTimeout(() => setCopiedFeedback(false), 2000);
    }
  };

  return (
    <TooltipProvider delayDuration={150}>
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        {/* Floating Product Dock matching user reference image uploaded_media_1789361326782.png */}
        <div className="rounded-2xl border border-white/20 bg-[#0C0C0C]/85 backdrop-blur-2xl px-6 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.8)] flex items-center justify-center gap-6 sm:gap-8 text-white transition-all hover:border-white/40">
          {/* 1. Core Engine Placeholder */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="text-white/70 hover:text-white transition-all hover:scale-110 cursor-default p-1"
                aria-label="Engine Core"
              >
                <Terminal className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-xl border border-white/20 bg-[#121212] text-white shadow-xl">
              Engine: Nova-2 · v2.4.0
            </TooltipContent>
          </Tooltip>

          {/* 2. Workspace Matrix / Action Hub */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/actions"
                className="text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer focus:outline-none p-1"
                aria-label="Workspace Actions Matrix"
              >
                <Layers className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-xl border border-white/20 bg-[#121212] text-white shadow-xl">
              Action Items Matrix
            </TooltipContent>
          </Tooltip>

          {/* 3. Internal Feedback Placeholder */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={handleCopyFeedbackEmail}
                className="text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer focus:outline-none p-1"
                aria-label="Workspace Inquiries"
              >
                <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-xl border border-white/20 bg-[#121212] text-white shadow-xl">
              {copiedFeedback ? "Email Copied!" : "Inquiries: support@fathom.internal"}
            </TooltipContent>
          </Tooltip>

          {/* 4. Document / API Keys Modal */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => setApiModalOpen(true)}
                className="text-white/70 hover:text-white transition-all hover:scale-110 cursor-pointer focus:outline-none p-1"
                aria-label="API Keys & Documentation"
              >
                <FileText className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-xl border border-white/20 bg-[#121212] text-white shadow-xl">
              API Keys & Documentation
            </TooltipContent>
          </Tooltip>

          {/* 5. Location / Platform Region Placeholder */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="text-white/70 hover:text-white transition-all hover:scale-110 cursor-default p-1"
                aria-label="Platform Region"
              >
                <MapPin className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-xl border border-white/20 bg-[#121212] text-white shadow-xl">
              Cluster Region: us-east-1
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Api Keys Modal */}
        <ApiKeysModal
          open={apiModalOpen}
          onOpenChange={setApiModalOpen}
        />
      </footer>
    </TooltipProvider>
  );
}
