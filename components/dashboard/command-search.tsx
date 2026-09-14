"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Command,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Search,
  Video,
  ListTodo,
  Sparkles,
  Play,
  ArrowRight,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CommandSearch({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: CommandSearchProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setIsOpen = controlledOnOpenChange || setInternalOpen;

  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);
  const setActiveSpeakerFilter = useMeetingStore((s) => s.setActiveSpeakerFilter);
  const seekTo = useMeetingStore((s) => s.seekTo);

  // Keyboard shortcut listener: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(!isOpen);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Reset query on close
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
    }
  }, [isOpen]);

  // Clean normalized query
  const cleanQuery = query.trim().toLowerCase();

  // Search results calculation
  const searchResults = useMemo(() => {
    if (!cleanQuery) {
      return {
        meetings: [],
        speakers: [],
        actionItems: [],
        transcriptMatches: [],
      };
    }

    // 1. Match Meetings
    const matchedMeetings = meetings.filter((m) => {
      const matchTitle = m.title.toLowerCase().includes(cleanQuery);
      const matchTags = m.tags?.some((t) => t.toLowerCase().includes(cleanQuery));
      const matchOverview = m.summaries?.executive?.overview?.toLowerCase().includes(cleanQuery);
      return matchTitle || matchTags || matchOverview;
    });

    // 2. Match Speakers
    const matchedSpeakers: {
      speakerId: string;
      name: string;
      role?: string;
      avatarUrl?: string;
      color: string;
      meetingId: string;
      meetingTitle: string;
    }[] = [];

    meetings.forEach((m) => {
      m.participants.forEach((p) => {
        if (
          p.name.toLowerCase().includes(cleanQuery) ||
          (p.role && p.role.toLowerCase().includes(cleanQuery)) ||
          (p.company && p.company.toLowerCase().includes(cleanQuery))
        ) {
          if (!matchedSpeakers.some((s) => s.speakerId === p.id && s.meetingId === m.id)) {
            matchedSpeakers.push({
              speakerId: p.id,
              name: p.name,
              role: p.role,
              avatarUrl: p.avatarUrl,
              color: p.color,
              meetingId: m.id,
              meetingTitle: m.title,
            });
          }
        }
      });
    });

    // 3. Match Action Items
    const matchedActionItems: {
      id: string;
      text: string;
      completed: boolean;
      timestamp?: number;
      meetingId: string;
      meetingTitle: string;
      assigneeName?: string;
    }[] = [];

    meetings.forEach((m) => {
      m.actionItems?.forEach((item) => {
        const assignee = m.participants.find((p) => p.id === item.assigneeId);
        const matchText = item.text.toLowerCase().includes(cleanQuery);
        const matchAssignee = assignee && assignee.name.toLowerCase().includes(cleanQuery);
        if (matchText || matchAssignee) {
          matchedActionItems.push({
            id: item.id,
            text: item.text,
            completed: item.completed,
            timestamp: item.timestamp,
            meetingId: m.id,
            meetingTitle: m.title,
            assigneeName: assignee?.name,
          });
        }
      });
    });

    // 4. Match Transcript Quotes (with timestamp jump)
    const matchedTranscript: {
      id: string;
      meetingId: string;
      meetingTitle: string;
      speakerName: string;
      speakerColor: string;
      text: string;
      start: number;
      matchedSnippet: string;
    }[] = [];

    let matchCount = 0;
    for (const m of meetings) {
      if (matchCount >= 8) break;
      for (const seg of m.transcript || []) {
        if (matchCount >= 8) break;
        const lowerText = seg.text.toLowerCase();
        const index = lowerText.indexOf(cleanQuery);
        if (index !== -1) {
          matchCount++;
          const speaker = m.participants.find((p) => p.id === seg.speakerId);
          const snippetStart = Math.max(0, index - 25);
          const snippetEnd = Math.min(seg.text.length, index + cleanQuery.length + 35);
          const snippet =
            (snippetStart > 0 ? "…" : "") +
            seg.text.slice(snippetStart, snippetEnd) +
            (snippetEnd < seg.text.length ? "…" : "");

          matchedTranscript.push({
            id: seg.id,
            meetingId: m.id,
            meetingTitle: m.title,
            speakerName: speaker?.name || "Speaker",
            speakerColor: speaker?.color || "#F4F4F5",
            text: seg.text,
            start: seg.start,
            matchedSnippet: snippet,
          });
        }
      }
    }

    return {
      meetings: matchedMeetings.slice(0, 5),
      speakers: matchedSpeakers.slice(0, 5),
      actionItems: matchedActionItems.slice(0, 6),
      transcriptMatches: matchedTranscript,
    };
  }, [cleanQuery, meetings]);

  // Navigation handlers
  const handleSelectMeeting = (meetingId: string) => {
    setIsOpen(false);
    setCurrentMeeting(meetingId);
    router.push(`/meetings/${meetingId}`);
  };

  const handleSelectSpeaker = (meetingId: string, speakerId: string) => {
    setIsOpen(false);
    setCurrentMeeting(meetingId);
    setActiveSpeakerFilter(speakerId);
    router.push(`/meetings/${meetingId}`);
  };

  const handleSelectActionItem = (meetingId: string, timestamp?: number) => {
    setIsOpen(false);
    setCurrentMeeting(meetingId);
    if (timestamp !== undefined) {
      seekTo(timestamp);
      router.push(`/meetings/${meetingId}?t=${Math.floor(timestamp)}`);
    } else {
      router.push(`/meetings/${meetingId}`);
    }
  };

  const handleSelectTranscriptMatch = (meetingId: string, start: number) => {
    setIsOpen(false);
    setCurrentMeeting(meetingId);
    seekTo(start);
    router.push(`/meetings/${meetingId}?t=${Math.floor(start)}`);
  };

  const hasResults =
    searchResults.meetings.length > 0 ||
    searchResults.speakers.length > 0 ||
    searchResults.actionItems.length > 0 ||
    searchResults.transcriptMatches.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 border border-white/15 bg-surface-raised text-white rounded-xl">
        <Command shouldFilter={false} className="border-none shadow-none bg-surface-raised">
          {/* Top Search Input */}
          <div className="flex items-center border-b border-white/15 px-4 bg-surface-raised">
            <Search className="mr-3 h-4 w-4 shrink-0 text-white/45" />
            <input
              type="text"
              placeholder="Search meetings, speakers, transcripts, action items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-12 w-full bg-transparent py-3 text-sm text-white placeholder:text-white/45 outline-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded-xl border border-white/15 bg-surface-raised px-2 py-0.5 text-xs text-white/70 hover:bg-white/10 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          <CommandList className="max-h-[420px] overflow-y-auto p-2 scrollbar-none">
            {cleanQuery && !hasResults && (
              <CommandEmpty className="py-12 text-center text-xs font-medium text-white/60">
                No matching results for &ldquo;{query}&rdquo;
              </CommandEmpty>
            )}

            {/* Quick Navigation when query is empty */}
            {!cleanQuery && (
              <>
                <CommandGroup heading="Quick Navigation">
                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      router.push("/meetings/meeting-1");
                    }}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-white cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-surface-raised text-white">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          Q3 Platform Architecture & Scalability Sync
                        </p>
                        <p className="text-[10px] text-white/60">
                          42m 15s • 8 Attendees • Multi-speaker diarization
                        </p>
                      </div>
                    </div>
                    <span className="rounded-xl border border-white/15 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-white/80">
                      Benchmark
                    </span>
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      router.push("/actions");
                    }}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs font-medium text-white cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-surface-raised text-white">
                        <ListTodo className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Action Items Hub</p>
                        <p className="text-[10px] text-white/60">
                          Cross-meeting task tracker and sync status
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-white/45" />
                  </CommandItem>

                </CommandGroup>

                <CommandSeparator className="my-2 bg-white/15 h-px" />

                <CommandGroup heading="Recent Meetings">
                  {meetings.map((m) => (
                    <CommandItem
                      key={m.id}
                      onSelect={() => handleSelectMeeting(m.id)}
                      className="flex items-center justify-between rounded-xl border border-transparent px-3 py-1.5 text-xs text-white cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="h-3.5 w-3.5 text-white/45" />
                        <span className="font-medium text-white truncate max-w-sm">{m.title}</span>
                      </div>
                      <span className="text-[11px] text-white/60">
                        {formatTime(m.duration)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Meetings Results */}
            {searchResults.meetings.length > 0 && (
              <CommandGroup heading={`Meetings (${searchResults.meetings.length})`}>
                {searchResults.meetings.map((m) => (
                  <CommandItem
                    key={`m-${m.id}`}
                    onSelect={() => handleSelectMeeting(m.id)}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-xl border border-white/15 bg-white text-black">
                        <Video className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{m.title}</p>
                        <div className="flex items-center gap-2 text-[10px] text-white/60">
                          <span>{m.participants.length} ATTENDEES</span>
                          <span>•</span>
                          <span>{formatTime(m.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-white/45" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Transcript Moments */}
            {searchResults.transcriptMatches.length > 0 && (
              <CommandGroup heading={`Transcript Moments (${searchResults.transcriptMatches.length})`}>
                {searchResults.transcriptMatches.map((t) => (
                  <CommandItem
                    key={`trans-${t.id}`}
                    onSelect={() => handleSelectTranscriptMatch(t.meetingId, t.start)}
                    className="flex items-start justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-xs cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 shrink-0">
                        <Quote className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[11px] text-white">
                            {t.speakerName}
                          </span>
                          <span className="text-[10px] text-white/60">in {t.meetingTitle}</span>
                        </div>
                        <p className="mt-0.5 font-sans text-[11px] text-white/70 italic leading-snug">
                          &ldquo;{t.matchedSnippet}&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded-xl border border-white/15 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-white/80 flex items-center gap-1">
                      <Play className="h-2.5 w-2.5 fill-current" />
                      {formatTime(t.start)}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Action Items */}
            {searchResults.actionItems.length > 0 && (
              <CommandGroup heading={`Action Items (${searchResults.actionItems.length})`}>
                {searchResults.actionItems.map((item) => (
                  <CommandItem
                    key={`act-${item.id}`}
                    onSelect={() => handleSelectActionItem(item.meetingId, item.timestamp)}
                    className="flex items-center justify-between gap-3 rounded-xl border border-transparent px-3 py-2 text-xs cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <ListTodo className="h-4 w-4 text-white/60 shrink-0" />
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{item.text}</p>
                        <p className="text-[10px] text-white/60">
                          {item.assigneeName ? `Assigned to ${item.assigneeName} • ` : ""}
                          {item.meetingTitle}
                        </p>
                      </div>
                    </div>
                    {item.timestamp !== undefined && (
                      <span className="rounded-xl border border-white/15 bg-surface-raised px-1.5 py-0.5 text-[10px] font-medium text-white/80">
                        {formatTime(item.timestamp)}
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Speakers */}
            {searchResults.speakers.length > 0 && (
              <CommandGroup heading={`Speakers (${searchResults.speakers.length})`}>
                {searchResults.speakers.map((s, idx) => (
                  <CommandItem
                    key={`spk-${s.speakerId}-${s.meetingId}-${idx}`}
                    onSelect={() => handleSelectSpeaker(s.meetingId, s.speakerId)}
                    className="flex items-center justify-between rounded-xl border border-transparent px-3 py-2 text-xs cursor-pointer hover:bg-white/5 hover:border-white/15/70 data-[selected=true]:bg-white/10 data-[selected=true]:border-white/15 mb-1 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6 rounded-xl border border-white/15">
                        <AvatarImage src={s.avatarUrl} />
                        <AvatarFallback className="rounded-xl bg-white/10 text-[9px] font-medium text-white/90">
                          {s.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-white/60">
                          {s.role ? `${s.role} • ` : ""}
                          {s.meetingTitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-white/45" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Dialog Footer */}
          <div className="flex items-center justify-between border-t border-white/15 bg-surface-raised px-4 py-2.5 text-[11px] text-white/60">
            <div className="flex items-center gap-2">
              <span>Navigate:</span>
              <kbd className="rounded border border-white/15 bg-surface-raised px-1.5 py-0.5 text-white/80 shadow-2xs">
                ↑↓
              </kbd>
              <span>Select:</span>
              <kbd className="rounded border border-white/15 bg-surface-raised px-1.5 py-0.5 text-white/80 shadow-2xs">
                ↵
              </kbd>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Close:</span>
              <kbd className="rounded border border-white/15 bg-surface-raised px-1.5 py-0.5 text-white/80 shadow-2xs">
                Esc
              </kbd>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
