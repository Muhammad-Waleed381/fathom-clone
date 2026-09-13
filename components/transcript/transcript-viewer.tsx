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

const CATEGORIES: { id: MeetingHighlight["category"]; label: string; activeClass: string }[] = [
  { id: "key_moment", label: "Key Moment", activeClass: "bg-amber-100 border border-amber-300 text-zinc-950 font-semibold" },
  { id: "decision", label: "Decision", activeClass: "bg-emerald-50 border border-emerald-200 text-zinc-950 font-semibold" },
  { id: "action", label: "Action Item", activeClass: "bg-violet-50 border border-violet-200 text-zinc-950 font-semibold" },
  { id: "risk", label: "Risk / Blocker", activeClass: "bg-orange-50 border border-orange-200 text-zinc-950 font-semibold" },
];

export function TranscriptViewer({ className, onClipCreated }: TranscriptViewerProps) {
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

    const newHighlight: MeetingHighlight = {
      id: `hl-${Date.now()}`,
      meetingId: currentMeeting.id,
      title,
      start: selectionData.start,
      end: selectionData.end,
      category: selectedCategory,
      createdAt: new Date().toISOString(),
    };

    addHighlight(currentMeeting.id, newHighlight);
    if (onClipCreated) {
      onClipCreated(newHighlight);
    }

    showToast(`Highlight saved (${formatTime(selectionData.start)} – ${formatTime(selectionData.end)})`);
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
          "relative flex flex-col h-full bg-white select-text font-sans",
          className
        )}
      >
        {/* Toast Notification */}
        {toastMessage && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 rounded-md bg-white border border-zinc-200 px-4 py-1.5 text-xs font-medium text-zinc-950 shadow-md">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Editorial Header Toolbar: Search & Auto-Scroll status */}
        <div className="flex flex-col gap-2 p-3 border-b border-zinc-200 bg-zinc-50 z-10">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-950">
                Transcript
              </span>
              <span className="font-mono text-[10px] font-medium bg-white text-zinc-600 border border-zinc-200 px-1.5 py-0.5 rounded-sm">
                {filteredSegments.length} segments
              </span>
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
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-mono text-[11px] font-medium transition-all cursor-pointer",
                autoScrollLocked
                  ? "bg-zinc-950 text-white border-zinc-950"
                  : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-100 hover:text-zinc-700"
              )}
              title="Click to toggle auto-scroll locking"
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-sm",
                  autoScrollLocked ? "bg-white" : "bg-zinc-400"
                )}
              />
              <span>{autoScrollLocked ? "Auto-scroll on" : "Auto-scroll off"}</span>
            </button>
          </div>

          {/* Search bar & Speaker filter tag */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search words or speakers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-8 text-xs font-mono bg-white border-zinc-200 text-zinc-950 placeholder:text-zinc-400 rounded-md focus-visible:ring-1 focus-visible:ring-zinc-300 focus-visible:border-zinc-300"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {activeFilteredSpeakerObj && (
              <Badge
                variant="outline"
                className="h-8 gap-1.5 px-2 bg-zinc-50 border-zinc-200 text-zinc-700 font-mono text-xs font-medium rounded-md shrink-0"
              >
                <Filter className="w-3 h-3 text-zinc-500" />
                <span className="truncate max-w-[100px]">{activeFilteredSpeakerObj.name}</span>
                <button
                  type="button"
                  onClick={() => setActiveSpeakerFilter(null)}
                  className="ml-1 text-zinc-500 hover:text-zinc-900 cursor-pointer"
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
                className="z-40 -translate-x-1/2 -translate-y-full flex items-center gap-1.5 px-3 py-1 rounded-md bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium border border-zinc-800 shadow-md transition-colors cursor-pointer"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Create Highlight</span>
              </button>
            </PopoverTrigger>

            <PopoverContent
              side="top"
              align="center"
              className="w-80 bg-white border border-zinc-200 p-3.5 shadow-xl shadow-black/[0.08] text-zinc-950 rounded-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-zinc-950">
                    <Bookmark className="w-3.5 h-3.5 fill-zinc-950 text-zinc-950" />
                    New Highlight
                  </span>
                  <span className="font-mono text-xs font-medium bg-zinc-50 text-zinc-700 border border-zinc-200 px-1.5 py-0.5 rounded-md">
                    {formatTime(selectionData.start)} – {formatTime(selectionData.end)}
                  </span>
                </div>

                <p className="text-xs text-zinc-700 bg-zinc-50 p-2 rounded-md border border-zinc-200 font-sans italic line-clamp-3">
                  &ldquo;{selectionData.text}&rdquo;
                </p>

                {/* Category Selector */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono font-medium text-zinc-500">
                    Category
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "flex items-center justify-between px-2 py-1 rounded-md text-xs font-medium border transition-all text-left cursor-pointer",
                          selectedCategory === cat.id
                            ? cat.activeClass
                            : "bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50"
                        )}
                      >
                        <span>{cat.label}</span>
                        {selectedCategory === cat.id && (
                          <Check className="w-3 h-3 text-zinc-700" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPopoverOpen(false);
                      setSelectionData(null);
                    }}
                    className="h-7 text-xs font-medium border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateClipFromSelection}
                    className="h-7 text-xs font-medium bg-zinc-950 hover:bg-zinc-800 text-white border-0 rounded-md gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
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
              <div className="py-16 text-center text-zinc-500 space-y-2">
                <Search className="w-8 h-8 mx-auto text-zinc-300" />
                <p className="font-mono text-sm font-medium text-zinc-700">
                  No matching segments
                </p>
                <p className="text-xs text-zinc-400 font-sans">
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
                    className="mt-2 text-xs font-medium border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded-md"
                  >
                    Clear all filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Floating "Resume auto-scroll" Banner */}
        {!autoScrollLocked && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <button
              type="button"
              onClick={() => {
                setAutoScrollLocked(true);
                scrollToActiveSegment();
              }}
              className="flex items-center gap-1.5 rounded-md bg-white text-zinc-700 border border-zinc-200 shadow-md font-medium text-xs px-4 py-2 hover:bg-zinc-50 hover:text-zinc-950 transition-colors cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Resume Auto-scroll</span>
            </button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
