"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
import {
  Search,
  Settings,
  ChevronDown,
  Video,
  ListTodo,
  FileText,
  Check,
  Plus,
  Radio,
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
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-3">
          {/* Left: Minimal geometric Fathom icon + title + workspace dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-opacity hover:opacity-85"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white font-mono text-xs font-bold shadow-xs">
                F
              </div>
              <span className="font-semibold text-sm tracking-tight text-zinc-950">
                Fathom
              </span>
            </Link>

            {/* Workspace Selector Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden sm:flex items-center gap-1.5 rounded-md border border-zinc-200/80 bg-zinc-50/80 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors focus:outline-none"
                >
                  <span className="max-w-[120px] truncate">{currentWorkspace}</span>
                  <ChevronDown className="h-3 w-3 text-zinc-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1 text-xs">
                <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-wider text-zinc-400 px-2 py-1">
                  Workspaces
                </DropdownMenuLabel>
                {WORKSPACES.map((ws) => (
                  <DropdownMenuItem
                    key={ws}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-sm"
                  >
                    <span>{ws}</span>
                    {currentWorkspace === ws && (
                      <Check className="h-3.5 w-3.5 text-zinc-950" />
                    )}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm text-zinc-600">
                  <Plus className="h-3.5 w-3.5" />
                  <span>Create Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: shadcn NavigationMenu */}
          <div className="hidden md:flex items-center justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* Meetings */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-3 text-xs font-medium text-zinc-700 hover:text-zinc-950">
                    Meetings
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-2 p-3 lg:w-[460px] lg:grid-cols-2">
                      <li className="col-span-2">
                        <NavigationMenuLink asChild>
                          <Link
                            href="/"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-950">
                              <Video className="h-3.5 w-3.5 text-zinc-900" />
                              <span>All Meetings & Recordings</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Browse synchronized meetings, multi-speaker diarization, and transcripts.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/meetings/meeting-1"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center justify-between text-xs font-medium text-zinc-950">
                              <span>Benchmark Call</span>
                              <span className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                                42m
                              </span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              8-person engineering sync with CockroachDB sharding.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/#engineering"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="text-xs font-medium text-zinc-950">
                              Engineering Syncs
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Architecture discussions, code reviews, and sprints.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Action Items */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-3 text-xs font-medium text-zinc-700 hover:text-zinc-950">
                    Action Items
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[360px] gap-2 p-3">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/actions"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-950">
                              <ListTodo className="h-3.5 w-3.5 text-zinc-900" />
                              <span>Action Items Hub</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Unified matrix of commitments, assignees, and deadlines.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/actions?status=pending"
                            className="flex items-center justify-between rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 text-xs font-medium text-zinc-900"
                          >
                            <span>Pending Commitments</span>
                            <span className="text-[11px] text-zinc-500">View tasks &rarr;</span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Templates */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-8 px-3 text-xs font-medium text-zinc-700 hover:text-zinc-950">
                    Templates
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[420px] gap-2 p-3 lg:grid-cols-2">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/meetings/meeting-1?tab=notes"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-950">
                              <FileText className="h-3 w-3 text-zinc-500" />
                              <span>Executive Brief</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              High-level takeaways and core decisions.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/meetings/meeting-1?tab=notes"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-950">
                              <FileText className="h-3 w-3 text-zinc-500" />
                              <span>Engineering Sync</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Architecture decisions, PRDs, and blockers.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/meetings/meeting-1?tab=notes"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-950">
                              <FileText className="h-3 w-3 text-zinc-500" />
                              <span>Sales MEDDPICC</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Decision criteria, paper process, and metrics.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            href="/meetings/meeting-1?tab=notes"
                            className="flex flex-col gap-1 rounded-md p-2.5 transition-colors hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80"
                          >
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-950">
                              <FileText className="h-3 w-3 text-zinc-500" />
                              <span>1-on-1 Mentorship</span>
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                              Career development, feedback, and action points.
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right: Quick Search, Record Button, Settings, Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Cmd+K Quick Search Trigger */}
            <button
              type="button"
              onClick={handleOpenSearch}
              className="rounded-md border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors flex items-center gap-2"
              aria-label="Open search dialog"
            >
              <Search className="h-3.5 w-3.5 text-zinc-400" />
              <span className="hidden lg:inline">Search meetings, transcripts...</span>
              <span className="hidden sm:inline lg:hidden">Search...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
                <span className="text-[9px]">⌘</span>K
              </kbd>
            </button>

            {/* Record Meeting Button */}
            <button
              type="button"
              onClick={() => setRecorderOpen(true)}
              className="rounded-md bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium px-3.5 py-1.5 flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              <span className="hidden sm:inline">Record Meeting</span>
              <span className="sm:hidden">Record</span>
            </button>

            {/* Settings Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="rounded-md border border-zinc-200 p-1.5 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus:outline-none"
              title="API Keys & Settings"
              aria-label="API Keys & Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* User Profile Avatar */}
            <Avatar className="h-7 w-7 rounded-md border border-zinc-200">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                alt="Workspace User"
              />
              <AvatarFallback className="rounded-md bg-zinc-100 text-[10px] font-mono font-semibold text-zinc-900">
                MW
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Global Modals triggered from Header */}
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
