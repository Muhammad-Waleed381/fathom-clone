"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { MeetingHighlight } from "@/types/meeting";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  AlertTriangle,
  Clock,
  Bookmark,
  Share2,
  Plus,
  Minus,
  Film,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HighlightCategory = "key_moment" | "decision" | "action" | "risk";

export interface HighlightModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meetingId?: string;
  initialTitle?: string;
  initialCategory?: HighlightCategory;
  initialStartTime?: number;
  initialEndTime?: number;
  onHighlightCreated?: (highlight: MeetingHighlight) => void;
  onOpenShareModal?: (highlight: MeetingHighlight) => void;
}

interface CategoryOption {
  id: HighlightCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  activeBg: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "key_moment",
    label: "KEY MOMENT",
    icon: Sparkles,
    color: "#FEF08A",
    activeBg: "bg-zinc-950 text-white border-zinc-950",
  },
  {
    id: "decision",
    label: "DECISION",
    icon: CheckCircle2,
    color: "#A7F3D0",
    activeBg: "bg-zinc-950 text-white border-zinc-950",
  },
  {
    id: "action",
    label: "ACTION ITEM",
    icon: Zap,
    color: "#DDD6FE",
    activeBg: "bg-zinc-950 text-white border-zinc-950",
  },
  {
    id: "risk",
    label: "RISK / BLOCKER",
    icon: AlertTriangle,
    color: "#FECDD3",
    activeBg: "bg-zinc-950 text-white border-zinc-950",
  },
];

export function HighlightModal({
  open,
  onOpenChange,
  meetingId: propMeetingId,
  initialTitle = "",
  initialCategory = "key_moment",
  initialStartTime,
  initialEndTime,
  onHighlightCreated,
  onOpenShareModal,
}: HighlightModalProps) {
  const currentMeetingId = useMeetingStore((s) => s.currentMeetingId);
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const storeCurrentTime = useMeetingStore((s) => s.currentTime);
  const addHighlight = useMeetingStore((s) => s.addHighlight);

  const effectiveMeetingId = propMeetingId || currentMeetingId || currentMeeting?.id || "";
  const maxDuration = currentMeeting?.duration || 3600;

  const [title, setTitle] = useState(initialTitle);
  const [category, setCategory] = useState<HighlightCategory>(initialCategory);
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(15);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever modal opens or initial props change
  useEffect(() => {
    if (open) {
      const defaultStart =
        typeof initialStartTime === "number"
          ? Math.max(0, initialStartTime)
          : Math.max(0, Math.floor(storeCurrentTime - 15));
      const defaultEnd =
        typeof initialEndTime === "number"
          ? Math.max(defaultStart + 1, initialEndTime)
          : Math.min(maxDuration, defaultStart + 30);

      setStartTime(Math.round(defaultStart));
      setEndTime(Math.round(defaultEnd));
      setTitle(
        initialTitle ||
          `Highlight at ${formatTime(defaultStart)}`
      );
      setCategory(initialCategory);
      setError(null);
    }
  }, [open, initialStartTime, initialEndTime, initialTitle, initialCategory, storeCurrentTime, maxDuration]);

  const duration = Math.max(0, endTime - startTime);

  const adjustStartTime = (delta: number) => {
    setStartTime((prev) => {
      const next = Math.max(0, Math.min(endTime - 1, prev + delta));
      return Math.round(next);
    });
  };

  const adjustEndTime = (delta: number) => {
    setEndTime((prev) => {
      const next = Math.max(startTime + 1, Math.min(maxDuration, prev + delta));
      return Math.round(next);
    });
  };

  const handleSave = (andShare: boolean = false) => {
    if (!effectiveMeetingId) {
      setError("No active meeting identified.");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Please provide a title for the highlight.");
      return;
    }

    if (startTime >= endTime) {
      setError("End time must be greater than start time.");
      return;
    }

    const catObj = CATEGORIES.find((c) => c.id === category);

    const newHl: MeetingHighlight = {
      id: `hl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      meetingId: effectiveMeetingId,
      title: trimmedTitle,
      start: startTime,
      end: endTime,
      category,
      color: catObj?.color || "#FEF08A",
      createdAt: new Date().toISOString(),
    };

    addHighlight(effectiveMeetingId, newHl);

    if (onHighlightCreated) {
      onHighlightCreated(newHl);
    }

    onOpenChange(false);

    if (andShare && onOpenShareModal) {
      onOpenShareModal(newHl);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl shadow-black/[0.08] sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-zinc-200 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm">
              <Bookmark className="h-5 w-5 text-zinc-950" />
            </div>
            <div>
              <DialogTitle className="font-mono text-base font-semibold uppercase text-zinc-950">
                CREATE HIGHLIGHT & CLIP
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] font-medium uppercase text-zinc-500">
                BOOKMARK & EXTRACT BOUNDED CALL CLIP
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-semibold uppercase text-zinc-700">
              HIGHLIGHT TITLE
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Consensus on microservice split"
              className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs font-medium text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
              maxLength={120}
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <label className="font-semibold uppercase text-zinc-700">CATEGORY</label>
              <span className="font-medium uppercase text-zinc-400 text-[10px]">
                COLOR-CODED TIMELINE
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-md border px-3 py-2 font-mono text-xs font-semibold uppercase transition-colors",
                      isSelected
                        ? "border-zinc-950 bg-zinc-950 text-white"
                        : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time boundaries */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-semibold uppercase text-zinc-700">
                <Clock className="h-4 w-4" />
                <span>CLIP INTERVAL</span>
              </div>
              <span className="rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-xs font-semibold text-zinc-950 shadow-sm">
                DURATION: {formatTime(duration)} ({duration}S)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-medium text-zinc-500 uppercase">
                  <span>START TIME</span>
                  <span className="font-semibold text-zinc-950">{formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-5)}
                    className="h-8 w-8 rounded-sm border border-zinc-200 bg-white font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-zinc-200 bg-white font-mono text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="-1s"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={0}
                    max={endTime - 1}
                    value={startTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setStartTime(Math.max(0, Math.min(endTime - 1, val)));
                      }
                    }}
                    className="h-8 w-full rounded-sm border border-zinc-200 bg-white text-center font-mono text-xs font-semibold text-zinc-950 focus:outline-none focus:border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={() => adjustStartTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-zinc-200 bg-white font-mono text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(5)}
                    className="h-8 w-8 rounded-sm border border-zinc-200 bg-white font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* End Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-medium text-zinc-500 uppercase">
                  <span>END TIME</span>
                  <span className="font-semibold text-zinc-950">{formatTime(endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-5)}
                    className="h-8 w-8 rounded-sm border border-zinc-200 bg-white font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-zinc-200 bg-white font-mono text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="-1s"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="number"
                    min={startTime + 1}
                    max={maxDuration}
                    value={endTime}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setEndTime(Math.max(startTime + 1, Math.min(maxDuration, val)));
                      }
                    }}
                    className="h-8 w-full rounded-sm border border-zinc-200 bg-white text-center font-mono text-xs font-semibold text-zinc-950 focus:outline-none focus:border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={() => adjustEndTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-zinc-200 bg-white font-mono text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(5)}
                    className="h-8 w-8 rounded-sm border border-zinc-200 bg-white font-mono text-xs font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 font-mono text-xs font-medium text-red-700">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-3 border-t border-zinc-200">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-2">
            {onOpenShareModal && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3.5 font-mono text-xs font-semibold uppercase text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>SAVE & SHARE</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-950 bg-zinc-950 px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors"
            >
              <Film className="h-3.5 w-3.5" />
              <span>SAVE HIGHLIGHT</span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
