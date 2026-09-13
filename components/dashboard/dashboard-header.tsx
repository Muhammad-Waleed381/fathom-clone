"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import {
  Search,
  Video,
  ListTodo,
  Settings,
  Sparkles,
  Command,
  Radio,
  ChevronRight,
} from "lucide-react";

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

  // Compute total pending action items across all meetings
  const totalPendingActionItems = meetings.reduce((acc, m) => {
    return acc + (m.actionItems?.filter((item) => !item.completed).length || 0);
  }, 0);

  const handleRecord = () => {
    if (onRecordClick) {
      onRecordClick();
    } else {
      // Default notification when clicked
      alert(
        "Fathom Meeting Recorder: Launching live capture studio with audio diarization & AI notetaker."
      );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl supports-[backdrop-filter]:bg-slate-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo & Workspace Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
            >
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-primary to-purple-600 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
                <span className="text-base font-black tracking-tighter text-white">
                  F
                </span>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-white">
                    Fathom
                  </span>
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 px-1.5 py-0 text-[10px] font-semibold text-primary"
                  >
                    PRO
                  </Badge>
                </div>
                <span className="text-[11px] font-medium text-slate-400">
                  AI Intelligence Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Global Search Trigger Button */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <button
              type="button"
              onClick={onOpenSearch}
              className="group flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-400 shadow-inner transition-all hover:border-slate-700 hover:bg-slate-900 hover:text-slate-200"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                <span className="text-xs">Search meetings, transcripts, action items...</span>
              </div>
              <div className="flex items-center gap-1 rounded border border-slate-700/80 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 group-hover:text-slate-200">
                <Command className="h-3 w-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* Right Action Items & Nav */}
          <div className="flex items-center gap-2.5">
            {/* Mobile search button */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onOpenSearch}
              className="h-9 w-9 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
              aria-label="Open Search (Cmd+K)"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Record Meeting Button (Pulsing Red indicator) */}
            <Button
              type="button"
              onClick={handleRecord}
              className="relative h-9 gap-2 rounded-lg bg-rose-600 px-3.5 text-xs font-semibold text-white shadow-lg shadow-rose-600/20 transition-all hover:bg-rose-500 hover:shadow-rose-600/30 active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-200 opacity-80" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <span className="hidden sm:inline">Record Meeting</span>
              <span className="sm:hidden">Record</span>
            </Button>

            {/* Action Items Hub Link with pending counter badge */}
            <Link href="/actions">
              <Button
                variant="outline"
                size="sm"
                className="relative h-9 gap-1.5 border-slate-800 bg-slate-900/60 px-3 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
              >
                <ListTodo className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Action Items</span>
                {totalPendingActionItems > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-[20px] rounded-full bg-indigo-500/20 px-1.5 py-0 text-[10px] font-bold text-indigo-300 border border-indigo-500/30"
                  >
                    {totalPendingActionItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* AI Settings Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setApiKeysModalOpen(true)}
              className="h-9 gap-1.5 border-slate-800 bg-slate-900/60 px-2.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            >
              <Settings className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden md:inline">AI Settings</span>
            </Button>

            {/* User profile avatar */}
            <div className="flex items-center pl-1 border-l border-slate-800">
              <Avatar className="h-8 w-8 ring-1 ring-slate-700 hover:ring-primary transition-all cursor-pointer">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                  alt="Workspace User"
                />
                <AvatarFallback className="bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-semibold text-white">
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
    </>
  );
}
