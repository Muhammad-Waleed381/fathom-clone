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
      <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 font-mono">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-6">
          {/* Floating Product Dock matching user reference (No social links, pure product placeholders) */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-white/80 backdrop-blur-xl px-7 py-3 shadow-xs hover:border-[#0B0B0B]/40 transition-all flex items-center justify-center gap-7 sm:gap-9">
            {/* 1. Core Engine Placeholder */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-default p-1"
                  aria-label="Engine Core"
                >
                  <Terminal className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                Engine: Nova-2 · v2.4.0
              </TooltipContent>
            </Tooltip>

            {/* 2. Workspace Matrix / Action Hub */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/actions"
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="Workspace Actions Matrix"
                >
                  <Layers className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                Action Items Matrix
              </TooltipContent>
            </Tooltip>

            {/* 3. Internal Feedback Placeholder */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={handleCopyFeedbackEmail}
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="Workspace Inquiries"
                >
                  <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                {copiedFeedback ? "Email Copied!" : "Inquiries: support@fathom.internal"}
              </TooltipContent>
            </Tooltip>

            {/* 4. Document / API Keys Modal */}
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setApiModalOpen(true)}
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="API Keys & Documentation"
                >
                  <FileText className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                API Keys & Documentation
              </TooltipContent>
            </Tooltip>

            {/* 5. Location / Platform Region Placeholder */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-default p-1"
                  aria-label="Platform Region"
                >
                  <MapPin className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                Cluster Region: us-east-1
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Minimalist Subtitle */}
          <div className="text-center text-[10px] uppercase tracking-widest text-[#737373]">
            © 2026 FATHOM · AUTONOMOUS MEETING INTELLIGENCE
          </div>
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
