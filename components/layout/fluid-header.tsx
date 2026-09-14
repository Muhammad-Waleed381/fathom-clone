"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
import { FathomLogo } from "@/components/ui/fathom-logo";
import { Search, ChevronDown, Check, Plus, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

const WORKSPACES = ["Acme Engineering", "Product & Design", "Enterprise Sales"];

const NAV = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/meetings/meeting-1", label: "Benchmark" },
  { href: "/actions", label: "Actions" },
] as const;

export function FluidHeader() {
  const pathname = usePathname();
  const [currentWorkspace, setCurrentWorkspace] = useState("Acme Engineering");
  const [searchOpen, setSearchOpen] = useState(false);
  const [recorderOpen, setRecorderOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Reference behavior: transparent over the hero, becomes a pill once scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleOpenSearch = () => {
    setSearchOpen(true);
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Public guest clips carry their own minimal header.
  if (pathname.startsWith("/share")) return null;

  return (
    <>
      <header className="pointer-events-none fixed left-1/2 top-5 z-50 w-[calc(100%-2.5rem)] max-w-[1440px] -translate-x-1/2 transition-all duration-500 sm:top-7">
        <div
          className={cn(
            "pointer-events-auto grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full border transition-all duration-500",
            scrolled
              ? "border-white/15 bg-black/70 px-3 py-2 shadow-[0_10px_34px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:px-4"
              : "border-transparent bg-transparent p-0 shadow-none"
          )}
        >
          {/* Left: brand + workspace */}
          <div className="flex min-w-0 items-center gap-2.5 justify-self-start">
            <Link href="/" className="group flex items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                <FathomLogo className="h-4 w-4" size={16} />
              </span>
              <span className="hidden text-[14px] font-semibold tracking-tight text-white drop-shadow-md sm:inline">
                Fathom
              </span>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="hidden items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white focus:outline-none sm:flex"
                >
                  <span className="max-w-[120px] truncate text-[12px]">{currentWorkspace}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-2xl border-white/15 bg-surface-raised p-1.5 text-sm text-white shadow-2xl"
              >
                <DropdownMenuLabel className="eyebrow px-2.5 py-1">Workspaces</DropdownMenuLabel>
                {WORKSPACES.map((ws) => (
                  <DropdownMenuItem
                    key={ws}
                    onClick={() => setCurrentWorkspace(ws)}
                    className="flex cursor-pointer items-center justify-between rounded-xl px-2.5 py-2 text-white/90 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-[13px]">{ws}</span>
                    {currentWorkspace === ws && <Check className="h-3.5 w-3.5" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem className="flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-[13px]">Create workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Center: nav pill */}
          <nav
            className={cn(
              "hidden items-center gap-1 justify-self-center rounded-full border px-1.5 py-1 transition-all duration-500 md:flex",
              scrolled
                ? "border-transparent bg-transparent"
                : "border-white/15 bg-black/40 backdrop-blur-xl"
            )}
          >
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors duration-200",
                  isActive(item.href)
                    ? "bg-white text-black"
                    : "text-white/75 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right: search, record, settings, avatar */}
          <div className="flex shrink-0 items-center gap-2 justify-self-end">
            <button
              type="button"
              onClick={handleOpenSearch}
              aria-label="Search"
              className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs text-white/80 backdrop-blur-md transition-colors hover:bg-white/15 hover:text-white"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden rounded-full border border-white/20 px-1.5 text-[10px] lg:inline-flex">⌘K</kbd>
            </button>

            <button
              type="button"
              onClick={() => setRecorderOpen(true)}
              className="cta hidden border border-white bg-white text-black sm:inline-flex"
            >
              <span className="cta-bg bg-white" />
              <span className="cta-text text-black">Record</span>
              <span className="cta-circle bg-black text-white">
                <Mic className="h-3.5 w-3.5" />
              </span>
            </button>

            <Avatar className="h-8 w-8 rounded-full border border-white/25">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
                alt="User"
              />
              <AvatarFallback className="rounded-full bg-white/10 text-[10px] font-semibold text-white">
                MW
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <MeetingRecorderModal open={recorderOpen} onOpenChange={setRecorderOpen} />
    </>
  );
}
