"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CommandSearch } from "@/components/dashboard/command-search";
import { MeetingRecorderModal } from "@/components/record/meeting-recorder-modal";
import { ApiKeysModal } from "@/components/settings/api-keys-modal";
import { FathomLogo } from "@/components/ui/fathom-logo";
import {
  Search,
  Settings,
  ChevronDown,
  Video,
  FileText,
  Check,
  Plus,
  ChevronRight,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";

const WORKSPACES = [
  "Acme Engineering",
  "Product & Design",
  "Enterprise Sales",
];

export function FluidHeader() {
  const [currentWorkspace, setCurrentWorkspace] = useState("Acme Engineering");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleOpenSearch = () => {
    setSearchOpen(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "k",
          metaKey: true,
          bubbles: true,
        })
      );
    }
  };

  return (
    <>
      {/* 3-Column Floating Pill Header (5G Network Technologies Design System) */}
      <header className="fixed left-1/2 z-50 -translate-x-1/2 top-4 w-[calc(100%-2rem)] max-w-6xl pointer-events-none font-sans">
        <div className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-3 rounded-full border border-white/20 bg-black/45 px-3 sm:px-4 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.5)] backdrop-blur-xl pointer-events-auto transition-all duration-300">
          
          {/* Left Column: Brand & Workspace Selector */}
          <div className="flex items-center gap-2.5 min-w-0 justify-self-start">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-opacity hover:opacity-90"
            >
              <span className="flex shrink-0 items-center justify-center rounded-full h-8 w-8 border border-white/25 bg-white/10 text-white backdrop-blur-md shadow-inner transition-transform duration-300 group-hover:scale-105">
                <FathomLogo className="h-4 w-4" size={16} />
              </span>
              <span className="truncate text-[13px] sm:text-[14px] font-semibold tracking-tight text-white drop-shadow-md">
                FATHOM
              </span>
            </Link>

            {/* Workspace Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 hover:text-white hover:bg-white/15 backdrop-blur-md transition-colors focus:outline-none"
                >
                  <span className="max-w-[110px] truncate text-[11px] uppercase tracking-wide font-mono">
                    {currentWorkspace}
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-1.5 text-xs font-mono rounded-2xl border border-white/20 bg-[#121212]/95 backdrop-blur-xl text-white shadow-2xl">
                <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-widest text-white/50 px-2.5 py-1">
                  Workspaces
                </DropdownMenuLabel>
                {WORKSPACES.map((ws) => (
                  <DropdownMenuItem
                    key={ws}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="flex items-center justify-between px-2.5 py-2 cursor-pointer rounded-xl hover:bg-white/10 text-white/90 hover:text-white transition-colors"
                  >
                    <span className="text-[11px]">{ws}</span>
                    {currentWorkspace === ws && (
                      <Check className="h-3.5 w-3.5 text-white" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="flex items-center gap-2 px-2.5 py-2 cursor-pointer rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Create Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center Column: Floating Navigation Pill */}
          <nav className="hidden md:flex items-center gap-1 justify-self-center rounded-full border border-white/20 bg-black/50 px-2 py-1 backdrop-blur-xl shadow-inner">
            <Link
              href="/"
              className="rounded-full px-3.5 py-1 text-[12px] font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              Recordings
            </Link>
            <Link
              href="/meetings/meeting-1"
              className="rounded-full px-3.5 py-1 text-[12px] font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              Benchmark
            </Link>
            <Link
              href="/actions"
              className="rounded-full px-3.5 py-1 text-[12px] font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              Actions Hub
            </Link>
            <Link
              href="/#specifications"
              className="rounded-full px-3.5 py-1 text-[12px] font-medium text-white/80 hover:text-white transition-colors duration-200"
            >
              Specs
            </Link>
          </nav>

          {/* Right Column: Search, Record CTA & Settings */}
          <div className="flex shrink-0 items-center gap-2 justify-self-end">
            {/* Quick Search */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 hover:text-white hover:bg-white/15 backdrop-blur-md transition-colors"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5 text-white/70" />
              <span className="hidden lg:inline text-[11px] uppercase tracking-wider font-mono">Search</span>
              <kbd className="hidden lg:inline-flex items-center rounded-full border border-white/20 bg-white/10 px-1.5 py-0.2 text-[9px] font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Signature .cta Record Button from Reference Site */}
            <button
              type="button"
              onClick={() => setRecorderOpen(true)}
              className="cta"
            >
              <span className="cta-bg bg-white"></span>
              <span className="cta-text text-black">Record</span>
              <span className="cta-circle bg-black text-white ring-1 ring-white/60">
                <Mic className="h-3.5 w-3.5" />
              </span>
            </button>

            {/* Settings Trigger */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/80 hover:text-white hover:bg-white/15 backdrop-blur-md transition-colors"
              title="API Keys & Settings"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>

            {/* User Avatar */}
            <Avatar className="h-8 w-8 rounded-full border border-white/25 shadow-sm">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                alt="User"
              />
              <AvatarFallback className="rounded-full bg-white/10 font-mono text-[10px] font-semibold text-white">
                MW
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Modals */}
      <CommandSearch
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <MeetingRecorderModal
        open={recorderOpen}
        onOpenChange={setRecorderOpen}
      />

      <ApiKeysModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
      />
    </>
  );
}
