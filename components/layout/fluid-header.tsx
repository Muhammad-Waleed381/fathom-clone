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
import { FathomLogo } from "@/components/ui/fathom-logo";
import {
  Search,
  Settings,
  ChevronDown,
  Video,
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
      {/* Floating Island Header - Nockchain architectural minimalism */}
      <header className="sticky top-3 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none mb-2 font-mono">
        <div className="mx-auto max-w-6xl pointer-events-auto rounded-lg border border-[#E4E4E7]/70 bg-white/75 backdrop-blur-xl shadow-xs transition-all hover:bg-white/90">
          <div className="flex h-12 items-center justify-between px-3 sm:px-4 gap-2 sm:gap-3">
            {/* Left: Nockchain typography brand + workspace dropdown */}
            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/"
                className="flex items-center gap-2 transition-opacity hover:opacity-80 group"
              >
                <FathomLogo className="h-6 w-6 rounded-md" size={24} />
                <span className="text-sm font-semibold tracking-wider text-[#0B0B0B] uppercase">
                  FATHOM
                </span>
              </Link>

              {/* Workspace Selector Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="hidden sm:flex items-center gap-1.5 rounded border border-[#E4E4E7] bg-white/60 px-2 py-0.5 text-xs text-[#737373] hover:text-[#0B0B0B] hover:bg-white transition-colors focus:outline-none"
                  >
                    <span className="max-w-[120px] truncate text-[11px] uppercase tracking-wide">
                      {currentWorkspace}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 p-1 text-xs font-mono">
                  <DropdownMenuLabel className="text-[10px] font-medium uppercase tracking-wider text-[#737373] px-2 py-1">
                    Workspaces
                  </DropdownMenuLabel>
                  {WORKSPACES.map((ws) => (
                    <DropdownMenuItem
                      key={ws}
                      onClick={() => setCurrentWorkspace(ws)}
                      className="flex items-center justify-between px-2 py-1.5 cursor-pointer rounded-sm"
                    >
                      <span className="text-[11px]">{ws}</span>
                      {currentWorkspace === ws && (
                        <Check className="h-3.5 w-3.5 text-[#0B0B0B]" />
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm text-[#737373]">
                    <Plus className="h-3.5 w-3.5" />
                    <span className="text-[11px]">Create Workspace</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Center: Nockchain Style Nav with Stipple Underline on Hover */}
            <div className="hidden md:flex items-center justify-center">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {/* Meetings */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-7 px-2 text-xs font-normal tracking-wide uppercase text-[#0B0B0B] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent relative group">
                      <span>Meetings</span>
                      <span className="stipple-underline w-0 group-hover:w-full" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[340px] gap-1 p-2 font-mono text-xs">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/"
                              className="flex items-center justify-between rounded p-2 hover:bg-[#F4F4F5] transition-colors"
                            >
                              <div className="flex items-center gap-2 text-[#0B0B0B]">
                                <Video className="h-3.5 w-3.5" />
                                <span className="uppercase text-[11px]">All Recordings</span>
                              </div>
                              <span className="text-[10px] text-[#737373]">&rarr;</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1"
                              className="flex items-center justify-between rounded p-2 hover:bg-[#F4F4F5] transition-colors"
                            >
                              <span className="text-[11px] uppercase">Benchmark Call</span>
                              <span className="rounded bg-[#E4E4E7]/80 px-1.5 py-0.2 text-[10px]">
                                42M
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
                        className="h-7 px-2 inline-flex items-center text-xs font-normal tracking-wide uppercase text-[#0B0B0B] relative group transition-opacity hover:opacity-80"
                      >
                        <span>Actions</span>
                        <span className="stipple-underline w-0 group-hover:w-full" />
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>

                  {/* Templates */}
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="h-7 px-2 text-xs font-normal tracking-wide uppercase text-[#0B0B0B] bg-transparent hover:bg-transparent data-[state=open]:bg-transparent relative group">
                      <span>Templates</span>
                      <span className="stipple-underline w-0 group-hover:w-full" />
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[300px] gap-1 p-2 font-mono text-xs">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1?tab=notes"
                              className="flex items-center gap-2 rounded p-2 hover:bg-[#F4F4F5] text-[#0B0B0B] text-[11px] uppercase"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#737373]" />
                              <span>Executive Brief</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              href="/meetings/meeting-1?tab=notes"
                              className="flex items-center gap-2 rounded p-2 hover:bg-[#F4F4F5] text-[#0B0B0B] text-[11px] uppercase"
                            >
                              <FileText className="h-3.5 w-3.5 text-[#737373]" />
                              <span>Engineering Sync</span>
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            {/* Right: Search, Record, Settings */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Cmd+K Quick Search Trigger */}
              <button
                type="button"
                onClick={handleOpenSearch}
                className="rounded border border-[#E4E4E7] bg-white/70 px-2 py-0.5 text-xs text-[#737373] hover:text-[#0B0B0B] hover:bg-white transition-colors flex items-center gap-1.5"
                aria-label="Open search dialog"
              >
                <Search className="h-3 w-3 text-[#737373]" />
                <span className="hidden sm:inline text-[11px] uppercase">Search</span>
                <kbd className="hidden sm:inline-flex items-center rounded border border-[#E4E4E7] bg-[#F4F4F5] px-1 py-0.2 text-[9px]">
                  ⌘K
                </kbd>
              </button>

              {/* Record Button */}
              <button
                type="button"
                onClick={() => setRecorderOpen(true)}
                className="rounded bg-[#0B0B0B] text-white hover:opacity-90 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 flex items-center gap-1.5 transition-opacity"
              >
                <span>Record</span>
              </button>

              {/* Settings Button */}
              <button
                type="button"
                onClick={() => setSettingsOpen(true)}
                className="rounded border border-[#E4E4E7] bg-white/60 p-1 text-[#737373] hover:text-[#0B0B0B] hover:bg-white transition-colors"
                title="API Keys & Settings"
              >
                <Settings className="h-3.5 w-3.5" />
              </button>

              {/* User Avatar */}
              <Avatar className="h-6 w-6 rounded border border-[#E4E4E7]">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                  alt="User"
                />
                <AvatarFallback className="rounded bg-[#F4F4F5] text-[9px] font-medium text-[#0B0B0B]">
                  MW
                </AvatarFallback>
              </Avatar>
            </div>
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
