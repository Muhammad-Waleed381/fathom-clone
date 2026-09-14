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
      {/* Floating Island Header */}
      <header className="sticky top-3 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none mb-2">
        <div className="mx-auto max-w-6xl pointer-events-auto rounded-xl border border-zinc-200/80 bg-white/90 backdrop-blur-md shadow-lg shadow-black/[0.04] transition-all">
          <div className="flex h-13 items-center justify-between px-3 sm:px-4 gap-2 sm:gap-3">
            {/* Left: Minimal geometric Fathom icon + workspace dropdown */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 transition-opacity hover:opacity-85"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950 text-white font-mono text-xs font-bold shadow-xs">
                  F
                </div>
                <span className="font-semibold text-sm tracking-tight text-zinc-950 hidden xs:inline">
                  Fathom
                </span>
              </Link>

              {/* Workspace Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-50/80 px-2 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 transition-colors focus:outline-none"
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
                    <NavigationMenuTrigger className="h-8 px-2.5 text-xs font-medium text-zinc-700 hover:text-zinc-950">
                      Meetings
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[380px] gap-1.5 p-3">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/"
                              className="flex items-center justify-between rounded-md p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 text-xs font-medium text-zinc-900"
                            >
                              <div className="flex items-center gap-2">
                                <Video className="h-3.5 w-3.5 text-zinc-700" />
                                <span>All Recordings</span>
                              </div>
                              <span className="text-[10px] font-mono text-zinc-400">View &rarr;</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1"
                              className="flex items-center justify-between rounded-md p-2 hover:bg-zinc-50 border border-transparent hover:border-zinc-200/80 text-xs font-medium text-zinc-900"
                            >
                              <span>Benchmark 42m Sync</span>
                              <span className="rounded-sm bg-zinc-100 px-1.5 py-0.5 text-[10px] font-mono text-zinc-600">
                                8 Leaders
                              </span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>

                  {/* Action Items */}
                  <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/actions"
                        className="h-8 px-2.5 inline-flex items-center text-xs font-medium text-zinc-700 hover:text-zinc-950 transition-colors"
                      >
                        Actions
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Templates */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-8 px-2.5 text-xs font-medium text-zinc-700 hover:text-zinc-950">
                      Templates
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[320px] gap-1 p-2 text-xs">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1?tab=notes"
                              className="flex items-center gap-2 rounded-md p-2 hover:bg-zinc-50 text-zinc-900"
                            >
                              <FileText className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Executive Brief</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1?tab=notes"
                              className="flex items-center gap-2 rounded-md p-2 hover:bg-zinc-50 text-zinc-900"
                            >
                              <FileText className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Engineering Sync</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1?tab=notes"
                              className="flex items-center gap-2 rounded-md p-2 hover:bg-zinc-50 text-zinc-900"
                            >
                              <FileText className="h-3.5 w-3.5 text-zinc-400" />
                              <span>Sales MEDDPICC</span>
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
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Cmd+K Quick Search Trigger */}
              <button
                type="button"
                onClick={handleOpenSearch}
                className="rounded-md border border-zinc-200 bg-zinc-50/80 px-2.5 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors flex items-center gap-1.5"
                aria-label="Open search dialog"
              >
                <Search className="h-3.5 w-3.5 text-zinc-400" />
                <span className="hidden sm:inline text-xs">Search...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-white px-1 py-0.2 font-mono text-[9px] text-zinc-400">
                  ⌘K
                </kbd>
              </button>

              {/* Record Meeting Button */}
              <button
                type="button"
                onClick={() => setRecorderOpen(true)}
                className="rounded-md bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-medium px-3 py-1 flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <span>Record</span>
              </button>

              {/* Settings Button */}
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="rounded-md border border-zinc-200 p-1 text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors focus:outline-none"
                title="API Keys & Settings"
                aria-label="API Keys & Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>

              {/* User Profile Avatar */}
              <Avatar className="h-6 w-6 rounded-md border border-zinc-200">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                  alt="Workspace User"
                />
                <AvatarFallback className="rounded-md bg-zinc-100 text-[9px] font-mono font-semibold text-zinc-900">
                  MW
                </AvatarFallback>
              </Avatar>
            </div>
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
