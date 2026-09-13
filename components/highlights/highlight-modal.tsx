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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  badgeClass: string;
  selectedClass: string;
}

const CATEGORIES: CategoryOption[] = [
  {
    id: "key_moment",
    label: "Key Moment",
    icon: Sparkles,
    color: "#F59E0B",
    badgeClass: "border-amber-500/30 text-amber-300 bg-amber-500/10 hover:bg-amber-500/20",
    selectedClass: "border-amber-400 bg-amber-500/25 text-amber-200 ring-2 ring-amber-400/50 shadow-sm",
  },
  {
    id: "decision",
    label: "Decision",
    icon: CheckCircle2,
    color: "#10B981",
    badgeClass: "border-emerald-500/30 text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20",
    selectedClass: "border-emerald-400 bg-emerald-500/25 text-emerald-200 ring-2 ring-emerald-400/50 shadow-sm",
  },
  {
    id: "action",
    label: "Action Item",
    icon: Zap,
    color: "#818CF8",
    badgeClass: "border-indigo-500/30 text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20",
    selectedClass: "border-indigo-400 bg-indigo-500/25 text-indigo-200 ring-2 ring-indigo-400/50 shadow-sm",
  },
  {
    id: "risk",
    label: "Risk / Blocker",
    icon: AlertTriangle,
    color: "#F43F5E",
    badgeClass: "border-rose-500/30 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20",
    selectedClass: "border-rose-400 bg-rose-500/25 text-rose-200 ring-2 ring-rose-400/50 shadow-sm",
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
      color: catObj?.color || "#F59E0B",
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
      <DialogContent className="max-w-md border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl sm:rounded-xl">
        <DialogHeader className="space-y-1.5 text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold text-white">
                Create Highlight & Clip
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400">
                Capture an important moment to bookmark or share publicly.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Title input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Highlight Title</label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Consensus on microservice split"
              className="border-slate-800 bg-slate-900/80 text-sm text-slate-100 placeholder:text-slate-500 focus-visible:ring-indigo-500"
              maxLength={120}
              autoFocus
            />
          </div>

          {/* Category Pill Selector */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <span className="text-[11px] text-slate-500">Color coded on timeline</span>
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
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 text-left transition-all ${
                      isSelected
                        ? cat.selectedClass
                        : "border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="text-xs font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time boundaries */}
          <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                <span className="font-medium">Clip Interval</span>
              </div>
              <Badge
                variant="outline"
                className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[11px] font-mono px-2 py-0.5"
              >
                Duration: {formatTime(duration)} ({duration}s)
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Start Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Start Time</span>
                  <span className="font-mono text-slate-200 font-semibold">{formatTime(startTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStartTime(-5)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="-5 seconds"
                  >
                    -5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStartTime(-1)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="-1 second"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
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
                    className="h-7 text-center font-mono text-xs border-slate-800 bg-slate-950 px-1 text-slate-100"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStartTime(1)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="+1 second"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustStartTime(5)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="+5 seconds"
                  >
                    +5
                  </Button>
                </div>
              </div>

              {/* End Time Adjuster */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>End Time</span>
                  <span className="font-mono text-slate-200 font-semibold">{formatTime(endTime)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustEndTime(-5)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="-5 seconds"
                  >
                    -5
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustEndTime(-1)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="-1 second"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
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
                    className="h-7 text-center font-mono text-xs border-slate-800 bg-slate-950 px-1 text-slate-100"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustEndTime(1)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="+1 second"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => adjustEndTime(5)}
                    className="h-7 w-7 p-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
                    title="+5 seconds"
                  >
                    +5
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="rounded-md border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-[11px] text-rose-300">
              {error}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2 gap-2 pt-2 border-t border-slate-800/80">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-slate-400 hover:bg-slate-800 hover:text-slate-200"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-2">
            {onOpenShareModal && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSave(true)}
                className="gap-1.5 border-slate-700 bg-slate-800/60 text-slate-200 hover:bg-slate-800 hover:text-white"
              >
                <Share2 className="h-3.5 w-3.5 text-indigo-400" />
                Save & Share
              </Button>
            )}
            <Button
              type="button"
              size="sm"
              onClick={() => handleSave(false)}
              className="gap-1.5 bg-indigo-600 font-medium text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30"
            >
              <Film className="h-3.5 w-3.5" />
              Save Highlight
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
