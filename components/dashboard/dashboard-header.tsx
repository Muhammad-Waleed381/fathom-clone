"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { MeetingRecorderModal } from "@/components/record/meeting-recorder-modal";
import {
  Search,
  Command,
  ListTodo,
  Key,
  Radio,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface DashboardHeaderProps {
  onOpenSearch?: () => void;
  onRecordClick?: () => void;
}

export function DashboardHeader({
  onOpenSearch,
  onRecordClick,
}: DashboardHeaderProps) {
  const meetings = useMeetingStore((s) => s.meetings);
  const [apiKeysModalOpen, setApiKeysModalOpen] = useState(false);
  const [recorderModalOpen, setRecorderModalOpen] = useState(false);

  // Total pending action items
  const totalPendingActionItems = meetings.reduce((acc, m) => {
    return acc + (m.actionItems?.filter((item) => !item.completed).length || 0);
  }, 0);

  const handleRecord = () => {
    if (onRecordClick) {
      onRecordClick();
    } else {
      setRecorderModalOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b-2 border-black bg-[#FAF8F5]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
          {/* Left: Bold Geometric Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-black shadow-neo-sm">
                <span className="font-mono text-base font-black text-white">
                  F
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl tracking-tight text-black">
                  FATHOM
                </span>
                <span className="hidden sm:inline-flex items-center rounded border-2 border-black bg-[#FEF08A] px-1.5 py-0.2 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-neo-sm">
                  WORKSPACE / V2
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Tactile Omnibar Trigger */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <button
              type="button"
              onClick={onOpenSearch}
              className="group flex w-full items-center justify-between rounded-md border-2 border-black bg-white px-3.5 py-2 text-xs font-mono font-medium text-neutral-800 shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-black" />
                <span className="text-neutral-600 group-hover:text-black">
                  Search meetings, transcripts, action items...
                </span>
              </div>
              <div className="flex items-center gap-1 rounded border border-black bg-[#FAF8F5] px-1.5 py-0.5 text-[10px] font-mono font-black text-black">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right: Controls & Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-white text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 md:hidden"
              aria-label="Open Search (Cmd+K)"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Record Meeting Button (Pulsing Red Dot) */}
            <button
              type="button"
              onClick={handleRecord}
              className="relative flex h-9 items-center gap-2 rounded-md border-2 border-black bg-black px-3.5 text-xs font-black uppercase tracking-wider text-white shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo hover:bg-neutral-900 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
              </span>
              <span className="hidden sm:inline">Record Meeting</span>
              <span className="sm:hidden">Record</span>
            </button>

            {/* Action Items Hub Link */}
            <Link href="/actions">
              <button
                type="button"
                className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 text-xs font-bold text-black shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF8F5] hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                <ListTodo className="h-3.5 w-3.5 text-black" />
                <span className="hidden sm:inline">Action Items</span>
                {totalPendingActionItems > 0 && (
                  <span className="ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full border-2 border-black bg-[#FEF08A] px-1.5 font-mono text-[10px] font-black text-black">
                    {totalPendingActionItems}
                  </span>
                )}
              </button>
            </Link>

            {/* API Keys Trigger */}
            <button
              type="button"
              onClick={() => setApiKeysModalOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 text-xs font-bold text-black shadow-neo-sm transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FEF08A] hover:shadow-neo active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              title="API Keys & Settings"
            >
              <Key className="h-3.5 w-3.5 text-black" />
              <span className="hidden lg:inline">API Keys</span>
            </button>

            {/* User Avatar */}
            <div className="flex items-center pl-1">
              <Avatar className="h-8 w-8 rounded-full border-2 border-black shadow-neo-sm">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                  alt="Workspace User"
                />
                <AvatarFallback className="bg-[#FEF08A] font-mono text-xs font-black text-black">
                  MW
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Global AI Settings Modal */}
      <ApiKeysModal
        open={apiKeysModalOpen}
        onOpenChange={setApiKeysModalOpen}
      />

      {/* In-Browser Meeting Recorder Modal */}
      <MeetingRecorderModal
        open={recorderModalOpen}
        onOpenChange={setRecorderModalOpen}
      />
    </>
  );
}
