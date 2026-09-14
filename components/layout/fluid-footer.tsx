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
import { Github, Linkedin, Mail, FileText, MapPin } from "lucide-react";

export function FluidFooter() {
  const [apiModalOpen, setApiModalOpen] = useState(false);

  return (
    <TooltipProvider delayDuration={150}>
      <footer className="w-full py-12 px-4 sm:px-6 lg:px-8 font-mono">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-6">
          {/* Floating Icon Dock matching user reference */}
          <div className="rounded-2xl border border-[#E4E4E7] bg-white/80 backdrop-blur-xl px-7 py-3 shadow-xs hover:border-[#0B0B0B]/40 transition-all flex items-center justify-center gap-7 sm:gap-9">
            {/* 1. GitHub */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://github.com/Muhammad-Waleed381/fathom-clone"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="GitHub Repository"
                >
                  <Github className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                GitHub Repository
              </TooltipContent>
            </Tooltip>

            {/* 2. LinkedIn */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                LinkedIn Network
              </TooltipContent>
            </Tooltip>

            {/* 3. Mail */}
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="mailto:support@fathom-clone.app"
                  className="text-[#737373] hover:text-[#0B0B0B] transition-all hover:scale-115 cursor-pointer focus:outline-none p-1"
                  aria-label="Email Support"
                >
                  <Mail className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="top" className="font-mono text-[10px] uppercase tracking-wider rounded-lg">
                Contact & Support
              </TooltipContent>
            </Tooltip>

            {/* 4. Document / API */}
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
                API & Model Settings
              </TooltipContent>
            </Tooltip>

            {/* 5. Location Pin */}
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
                Region: us-east-1
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
