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
    label: "Key moment",
    icon: Sparkles,
    color: "#FEF08A",
    activeBg: "bg-white text-black border-white",
  },
  {
    id: "decision",
    label: "Decision",
    icon: CheckCircle2,
    color: "#A7F3D0",
    activeBg: "bg-white text-black border-white",
  },
  {
    id: "action",
    label: "Action item",
    icon: Zap,
    color: "#DDD6FE",
    activeBg: "bg-white text-black border-white",
  },
  {
    id: "risk",
    label: "Risk / blocker",
    icon: AlertTriangle,
    color: "#FECDD3",
    activeBg: "bg-white text-black border-white",
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
      <DialogContent className="max-w-md border border-white/15 bg-surface-raised p-6 text-white shadow-black/[0.08] sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left border-b border-white/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-surface-raised shadow-sm">
              <Bookmark className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-white">
                Create highlight & clip
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60">
                Bookmark & extract bounded call clip
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-white/80">
              Highlight title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Consensus on microservice split"
              className="h-10 w-full rounded-xl border border-white/15 bg-surface-raised px-3 text-xs font-medium text-white placeholder:text-white/45 focus:bg-white/5 focus:border-white/25 focus:outline-none transition-colors"
              maxLength={120}
              autoFocus
            />
          </div>

          {/* Category Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-white/80">Category</label>
              <span className="font-medium text-white/45 text-[10px]">
                Color-coded timeline
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
                      "flex items-center gap-2 rounded-xl border px-3 py-2 text-[13px] font-medium transition-colors",
                      isSelected
                        ? "border-white bg-white text-black"
                        : "border-white/15 bg-surface-raised text-white/80 hover:bg-white/5 hover:text-white"
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
          <div className="rounded-xl border border-white/15 bg-surface-raised p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <div className="flex items-center gap-1.5 text-[13px] font-medium text-white/80">
                <Clock className="h-4 w-4" />
                <span>Clip interval</span>
              </div>
              <span className="rounded-xl border border-white/15 bg-surface-raised px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
                Duration: {formatTime(duration)} ({duration}s)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-white/60 uppercase">
                  <span>Start time</span>
                  <span className="font-semibold text-white">{formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-5)}
                    className="h-8 w-8 rounded-sm border border-white/15 bg-surface-raised text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-white/15 bg-surface-raised text-white/80 hover:bg-white/5 transition-colors"
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
                    className="h-8 w-full rounded-sm border border-white/15 bg-surface-raised text-center text-xs font-semibold text-white focus:outline-none focus:border-white/25"
                  />
                  <button
                    type="button"
                    onClick={() => adjustStartTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-white/15 bg-surface-raised text-white/80 hover:bg-white/5 transition-colors"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(5)}
                    className="h-8 w-8 rounded-sm border border-white/15 bg-surface-raised text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* End Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-medium text-white/60 uppercase">
                  <span>End time</span>
                  <span className="font-semibold text-white">{formatTime(endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-5)}
                    className="h-8 w-8 rounded-sm border border-white/15 bg-surface-raised text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-white/15 bg-surface-raised text-white/80 hover:bg-white/5 transition-colors"
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
                    className="h-8 w-full rounded-sm border border-white/15 bg-surface-raised text-center text-xs font-semibold text-white focus:outline-none focus:border-white/25"
                  />
                  <button
                    type="button"
                    onClick={() => adjustEndTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded-sm border border-white/15 bg-surface-raised text-white/80 hover:bg-white/5 transition-colors"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(5)}
                    className="h-8 w-8 rounded-sm border border-white/15 bg-surface-raised text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/100/10 px-3 py-2 text-xs font-medium text-red-300">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-3 border-t border-white/15">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-xl border border-white/15 bg-surface-raised px-3 text-[13px] font-medium text-white/70 hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            {onOpenShareModal && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="h-9 flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface-raised px-3.5 text-[13px] font-medium text-white/80 hover:bg-white/5 hover:text-white transition-colors"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Save & share</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="h-9 flex items-center gap-1.5 rounded-xl border border-white bg-white px-4 text-[13px] font-medium text-black hover:bg-white/90 transition-colors"
            >
              <Film className="h-3.5 w-3.5" />
              <span>Save highlight</span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
