"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { TranscriptSegment } from "./transcript-segment";
import { formatTime } from "@/components/player/video-scrubber";
import { TranscriptWord, MeetingHighlight } from "@/types/meeting";
import {
  ArrowDown,
  Sparkles,
  Scissors,
  Filter,
  X,
  Search,
  Check,
  Bookmark,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface TranscriptViewerProps {
  className?: string;
  onClipCreated?: (highlight: MeetingHighlight) => void;
}

interface SelectionState {
  text: string;
  start: number;
  end: number;
  x: number;
  y: number;
}

const CATEGORIES: { id: MeetingHighlight["category"]; label: string; color: string }[] = [
  { id: "key_moment", label: "Key Moment", color: "bg-amber-500/20 text-amber-300 border-amber-500/40" },
  { id: "decision", label: "Decision", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" },
  { id: "action", label: "Action Item", color: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40" },
  { id: "risk", label: "Risk / Blocker", color: "bg-rose-500/20 text-rose-300 border-rose-500/40" },
];

export function TranscriptViewer({ className }: TranscriptViewerProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const isPlaying = useMeetingStore((s) => s.isPlaying);
  const activeSpeakerFilter = useMeetingStore((s) => s.activeSpeakerFilter);
  const autoScrollLocked = useMeetingStore((s) => s.autoScrollLocked);

  const setAutoScrollLocked = useMeetingStore((s) => s.setAutoScrollLocked);
  const setActiveSpeakerFilter = useMeetingStore((s) => s.setActiveSpeakerFilter);
  const seekTo = useMeetingStore((s) => s.seekTo);
  const addHighlight = useMeetingStore((s) => s.addHighlight);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectionData, setSelectionData] = useState<SelectionState | null>(null);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<MeetingHighlight["category"]>("key_moment");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const segmentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const isProgrammaticScroll = useRef<boolean>(false);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const allSegments = useMemo(() => {
    return currentMeeting?.transcript || [];
  }, [currentMeeting]);

  const participants = useMemo(() => {
    return currentMeeting?.participants || [];
  }, [currentMeeting]);

  // Filtered segments (by speaker & search query)
  const filteredSegments = useMemo(() => {
    let result = allSegments;

    if (activeSpeakerFilter) {
      result = result.filter((s) => s.speakerId === activeSpeakerFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.text.toLowerCase().includes(q) ||
          participants.find((p) => p.id === s.speakerId)?.name.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allSegments, activeSpeakerFilter, searchQuery, participants]);

  // Find active segment
  const activeSegmentId = useMemo(() => {
    const active = allSegments.find(
      (s) => s.start <= currentTime && currentTime <= s.end
    );
    return active?.id || null;
  }, [allSegments, currentTime]);

  // Show Toast
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  }, []);

  // Smooth scroll to active segment
  const scrollToActiveSegment = useCallback(() => {
    if (!activeSegmentId) return;
    const el = segmentRefs.current.get(activeSegmentId);
    if (!el) return;

    isProgrammaticScroll.current = true;
    el.scrollIntoView({ behavior: "smooth", block: "center" });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 600);
  }, [activeSegmentId]);

  // Auto-scroll when active segment changes if locked
  useEffect(() => {
    if (autoScrollLocked && activeSegmentId) {
      scrollToActiveSegment();
    }
  }, [autoScrollLocked, activeSegmentId, scrollToActiveSegment]);

  // Attach listener to detect user scrolling away from active word
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const viewport = container.querySelector<HTMLElement>(
      "[data-radix-scroll-area-viewport]"
    );
    if (!viewport) return;

    const handleUserScroll = () => {
      if (isProgrammaticScroll.current) return;
      if (autoScrollLocked) {
        setAutoScrollLocked(false);
      }
    };

    viewport.addEventListener("scroll", handleUserScroll, { passive: true });
    viewport.addEventListener("wheel", handleUserScroll, { passive: true });
    viewport.addEventListener("touchmove", handleUserScroll, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", handleUserScroll);
      viewport.removeEventListener("wheel", handleUserScroll);
      viewport.removeEventListener("touchmove", handleUserScroll);
    };
  }, [autoScrollLocked, setAutoScrollLocked]);

  // Word Click handler: Seek player to word.start
  const handleWordClick = useCallback(
    (word: TranscriptWord) => {
      seekTo(word.start);
    },
    [seekTo]
  );

  // Timestamp Click handler: Seek player to segment.start
  const handleTimestampClick = useCallback(
    (time: number) => {
      seekTo(time);
    },
    [seekTo]
  );

  // Text selection handler for instant highlight / clip creation
  const handleMouseUp = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount) {
      return;
    }

    const text = sel.toString().trim();
    if (text.length < 3) {
      return;
    }

    const range = sel.getRangeAt(0);
    const container = containerRef.current;
    if (!container || !container.contains(range.commonAncestorContainer)) {
      return;
    }

    const rect = range.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    // Scan for selected word timestamps
    const fragment = range.cloneContents();
    const wordElements = fragment.querySelectorAll("[data-word-start]");

    let start = currentTime;
    let end = currentTime + 5;

    if (wordElements.length > 0) {
      const starts: number[] = [];
      const ends: number[] = [];
      wordElements.forEach((el) => {
        const s = parseFloat(el.getAttribute("data-word-start") || "0");
        const e = parseFloat(el.getAttribute("data-word-end") || "0");
        if (!isNaN(s)) starts.push(s);
        if (!isNaN(e)) ends.push(e);
      });
      if (starts.length > 0) start = Math.min(...starts);
      if (ends.length > 0) end = Math.max(...ends);
    } else {
      // Find parent segment if range inside single word
      const parentSeg = range.startContainer.parentElement?.closest("[data-segment-id]");
      if (parentSeg) {
        const segId = parentSeg.getAttribute("data-segment-id");
        const found = allSegments.find((s) => s.id === segId);
        if (found) {
          start = found.start;
          end = found.end;
        }
      }
    }

    setSelectionData({
      text,
      start,
      end: Math.max(end, start + 1),
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
    setPopoverOpen(true);
  }, [allSegments, currentTime]);

  // Create Highlight from selection
  const handleCreateClipFromSelection = () => {
    if (!currentMeeting || !selectionData) return;

    const title =
      selectionData.text.length > 60
        ? selectionData.text.slice(0, 57) + "..."
        : selectionData.text;

    addHighlight(currentMeeting.id, {
      title,
      start: selectionData.start,
      end: selectionData.end,
      category: selectedCategory,
    });

    showToast(`✨ Highlight clip saved (${formatTime(selectionData.start)} – ${formatTime(selectionData.end)})`);
    setPopoverOpen(false);
    setSelectionData(null);

    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  const activeFilteredSpeakerObj = useMemo(() => {
    if (!activeSpeakerFilter) return null;
    return participants.find((p) => p.id === activeSpeakerFilter) || null;
  }, [activeSpeakerFilter, participants]);

  return (
    <TooltipProvider delayDuration={150}>
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        className={cn(
          "relative flex flex-col h-full rounded-2xl border border-slate-800 bg-slate-950 shadow-xl overflow-hidden select-text",
          className
        )}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 rounded-full bg-slate-900 border border-indigo-500/50 px-4 py-1.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Header Toolbar: Search, Speaker Filter status, and stats */}
        <div className="flex flex-col gap-2 p-3 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-sm z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white tracking-wide">
                Interactive Transcript
              </span>
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-slate-800 text-slate-300">
                {filteredSegments.length} segments
              </Badge>
            </div>

            {/* Quick Auto-Scroll Status Indicator */}
            <button
              type="button"
              onClick={() => {
                const nextState = !autoScrollLocked;
                setAutoScrollLocked(nextState);
                if (nextState) scrollToActiveSegment();
              }}
              className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono transition-colors border",
                autoScrollLocked
                  ? "bg-indigo-950/80 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200"
              )}
              title="Click to toggle auto-scroll locking"
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  autoScrollLocked ? "bg-indigo-400 animate-pulse" : "bg-slate-500"
                )}
              />
              <span>{autoScrollLocked ? "Auto-scroll ON" : "Auto-scroll OFF"}</span>
            </button>
          </div>

          {/* Search bar & Speaker filter tag */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search spoken words or speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-8 text-xs bg-slate-900/90 border-slate-800 text-slate-200 placeholder:text-slate-500 focus-visible:ring-1 focus-visible:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {activeFilteredSpeakerObj && (
              <Badge
                variant="outline"
                className="h-8 gap-1.5 px-2.5 bg-indigo-950/60 border-indigo-500/50 text-indigo-200 text-xs shrink-0"
              >
                <Filter className="w-3 h-3 text-indigo-400" />
                <span className="truncate max-w-[100px]">{activeFilteredSpeakerObj.name}</span>
                <button
                  type="button"
                  onClick={() => setActiveSpeakerFilter(null)}
                  className="ml-1 text-slate-400 hover:text-white"
                  title="Clear speaker filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>

        {/* Text Selection Floating Popover for Instant Highlight / Clip */}
        {selectionData && (
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                style={{
                  position: "absolute",
                  left: `${Math.max(20, Math.min(containerRef.current ? containerRef.current.clientWidth - 40 : 200, selectionData.x))}px`,
                  top: `${Math.max(50, selectionData.y)}px`,
                }}
                className="z-40 -translate-x-1/2 -translate-y-full flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-2xl transition-transform hover:scale-105"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Create Highlight / Clip</span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="center"
              className="w-80 bg-slate-900 border border-slate-700 p-3.5 shadow-2xl text-slate-100 rounded-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
                    <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
                    Create Highlight / Clip
                  </span>
                  <span className="font-mono text-[11px] text-indigo-300">
                    {formatTime(selectionData.start)} – {formatTime(selectionData.end)}
                  </span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 italic line-clamp-3">
                  &ldquo;{selectionData.text}&rdquo;
                </p>

                {/* Category Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono text-slate-400">
                    Category
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex items-center justify-between px-2 py-1 rounded text-[11px] border transition-all text-left",
                          selectedCategory === cat.id
                            ? `${cat.color} ring-1 ring-white/50 font-medium`
                            : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800"
                        )}
                      >
                        <span>{cat.label}</span>
                        {selectedCategory === cat.id && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPopoverOpen(false);
                      setSelectionData(null);
                    }}
                    className="h-7 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateClipFromSelection}
                    className="h-7 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold gap-1.5"
                  >
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Save Clip
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}

        {/* ScrollArea with Segment List */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 w-full p-3.5">
          <div className="space-y-3 pb-16">
            {filteredSegments.length > 0 ? (
              filteredSegments.map((segment) => {
                const speaker = participants.find((p) => p.id === segment.speakerId);
                const isActive = segment.id === activeSegmentId;

                return (
                  <TranscriptSegment
                    key={segment.id}
                    ref={(el) => {
                      if (el) {
                        segmentRefs.current.set(segment.id, el);
                      } else {
                        segmentRefs.current.delete(segment.id);
                      }
                    }}
                    segment={segment}
                    speaker={speaker}
                    currentTime={currentTime}
                    isPlaying={isPlaying}
                    isActiveSegment={isActive}
                    onWordClick={handleWordClick}
                    onTimestampClick={handleTimestampClick}
                  />
                );
              })
            ) : (
              <div className="py-16 text-center text-slate-400 space-y-2">
                <Search className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-sm font-medium text-slate-300">
                  No matching transcript segments
                </p>
                <p className="text-xs text-slate-500">
                  Try clearing your search query or speaker filter.
                </p>
                {(searchQuery || activeSpeakerFilter) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveSpeakerFilter(null);
                    }}
                    className="mt-2 text-xs border-slate-700"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating "Resume auto-scroll" Pill Button */}
        {!autoScrollLocked && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setAutoScrollLocked(true);
                scrollToActiveSegment();
              }}
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 text-xs font-semibold shadow-2xl border border-indigo-400/40"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Resume auto-scroll</span>
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
