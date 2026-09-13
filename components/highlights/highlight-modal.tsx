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
    activeBg: "bg-[#FEF08A]",
  },
  {
    id: "decision",
    label: "DECISION",
    icon: CheckCircle2,
    color: "#A7F3D0",
    activeBg: "bg-[#A7F3D0]",
  },
  {
    id: "action",
    label: "ACTION ITEM",
    icon: Zap,
    color: "#DDD6FE",
    activeBg: "bg-[#DDD6FE]",
  },
  {
    id: "risk",
    label: "RISK / BLOCKER",
    icon: AlertTriangle,
    color: "#FECDD3",
    activeBg: "bg-[#FECDD3]",
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
      <DialogContent className="max-w-md border-2 border-black bg-[#FAF8F5] p-6 text-black shadow-[6px_6px_0px_0px_#000] sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left border-b-2 border-black pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-[#FEF08A] shadow-neo-sm">
              <Bookmark className="h-5 w-5 stroke-[2.5] text-black" />
            </div>
            <div>
              <DialogTitle className="font-mono text-base font-black uppercase text-black">
                CREATE HIGHLIGHT & CLIP
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] font-bold uppercase text-neutral-600">
                BOOKMARK & EXTRACT BOUNDED CALL CLIP
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="font-mono text-xs font-black uppercase text-black">
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
              className="h-10 w-full rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-bold text-black shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
              maxLength={120}
              autoFocus
            />
          </div>

          {/* Category Pill Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <label className="font-black uppercase text-black">CATEGORY</label>
              <span className="font-bold uppercase text-neutral-500 text-[10px]">
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
                      "flex items-center gap-2 rounded-md border-2 border-black px-3 py-2 font-mono text-xs font-black uppercase transition-all shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                      isSelected
                        ? `${cat.activeBg} text-black ring-2 ring-black`
                        : "bg-white text-black hover:bg-[#FAF8F5]"
                    )}
                  >
                    <Icon className="h-4 w-4 stroke-[2.5] shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time boundaries */}
          <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo-sm space-y-3">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-1.5 font-mono text-xs font-black uppercase text-black">
                <Clock className="h-4 w-4 stroke-[2.5]" />
                <span>CLIP INTERVAL</span>
              </div>
              <span className="rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-xs font-black text-black shadow-neo-sm">
                DURATION: {formatTime(duration)} ({duration}S)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Start Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-neutral-600 uppercase">
                  <span>START TIME</span>
                  <span className="font-black text-black">{formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-5)}
                    className="h-8 w-8 rounded border-2 border-black bg-[#FAF8F5] font-mono text-xs font-black text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-[#FAF8F5] font-mono text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="-1s"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[3]" />
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
                    className="h-8 w-full rounded border-2 border-black bg-white text-center font-mono text-xs font-black text-black shadow-neo-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => adjustStartTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-[#FAF8F5] font-mono text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustStartTime(5)}
                    className="h-8 w-8 rounded border-2 border-black bg-[#FAF8F5] font-mono text-xs font-black text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>

              {/* End Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] font-bold text-neutral-600 uppercase">
                  <span>END TIME</span>
                  <span className="font-black text-black">{formatTime(endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-5)}
                    className="h-8 w-8 rounded border-2 border-black bg-[#FAF8F5] font-mono text-xs font-black text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="-5s"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(-1)}
                    className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-[#FAF8F5] font-mono text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="-1s"
                  >
                    <Minus className="h-3.5 w-3.5 stroke-[3]" />
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
                    className="h-8 w-full rounded border-2 border-black bg-white text-center font-mono text-xs font-black text-black shadow-neo-sm focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => adjustEndTime(1)}
                    className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-[#FAF8F5] font-mono text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="+1s"
                  >
                    <Plus className="h-3.5 w-3.5 stroke-[3]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustEndTime(5)}
                    className="h-8 w-8 rounded border-2 border-black bg-[#FAF8F5] font-mono text-xs font-black text-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                    title="+5s"
                  >
                    +5
                  </button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border-2 border-black bg-[#FECDD3] px-3 py-2 font-mono text-xs font-bold text-black shadow-neo-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-3 border-t-2 border-black">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-9 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            CANCEL
          </button>

          <div className="flex items-center gap-2">
            {onOpenShareModal && (
              <button
                type="button"
                onClick={() => handleSave(true)}
                className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3.5 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#DDD6FE] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
              >
                <Share2 className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>SAVE & SHARE</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-4 font-mono text-xs font-black uppercase tracking-wider text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Film className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>SAVE HIGHLIGHT</span>
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
