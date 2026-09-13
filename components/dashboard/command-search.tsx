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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Search,
  Video,
  ListTodo,
  Settings,
  Sparkles,
  Play,
  ArrowRight,
  Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CommandSearchProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onOpenSettings?: () => void;
}

export function CommandSearch({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  onOpenSettings,
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
            speakerColor: speaker?.color || "#FEF08A",
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
      <DialogContent className="max-w-2xl overflow-hidden p-0 border-2 border-black bg-white text-black shadow-[6px_6px_0px_0px_#000] rounded-lg">
        <Command shouldFilter={false} className="border-none shadow-none bg-white">
          {/* Top Search Input */}
          <div className="flex items-center border-b-2 border-black px-4 bg-white">
            <Search className="mr-3 h-4 w-4 shrink-0 text-black stroke-[2.5]" />
            <input
              type="text"
              placeholder="Search meetings, speakers, transcripts, action items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-12 w-full bg-transparent py-3 font-mono text-sm text-black placeholder:text-neutral-400 outline-none"
              autoFocus
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="rounded border border-black bg-[#FAF8F5] px-2 py-0.5 font-mono text-[10px] font-bold uppercase text-black hover:bg-[#FEF08A]"
              >
                CLEAR
              </button>
            )}
          </div>

          <CommandList className="max-h-[420px] overflow-y-auto p-2 scrollbar-none">
            {cleanQuery && !hasResults && (
              <CommandEmpty className="py-12 text-center font-mono text-xs font-bold uppercase text-neutral-500">
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
                    className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-black bg-[#FEF08A] text-black">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-black">
                          Q3 Platform Architecture & Scalability Sync
                        </p>
                        <p className="font-mono text-[10px] text-neutral-600">
                          42m 15s • 8 Attendees • Multi-speaker diarization
                        </p>
                      </div>
                    </div>
                    <span className="rounded border border-black bg-black px-1.5 py-0.5 font-mono text-[10px] font-black uppercase text-white shadow-neo-sm">
                      BENCHMARK
                    </span>
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      router.push("/actions");
                    }}
                    className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-black bg-[#DDD6FE] text-black">
                        <ListTodo className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-black">Action Items Hub</p>
                        <p className="font-mono text-[10px] text-neutral-600">
                          Cross-meeting task tracker and sync status
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-black" />
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-xs font-medium text-black cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-black bg-[#A7F3D0] text-black">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-black">AI & API Settings</p>
                        <p className="font-mono text-[10px] text-neutral-600">
                          OpenRouter & Deepgram Nova-2 keys
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-black" />
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-2 bg-black h-[2px]" />

                <CommandGroup heading="Recent Meetings">
                  {meetings.map((m) => (
                    <CommandItem
                      key={m.id}
                      onSelect={() => handleSelectMeeting(m.id)}
                      className="flex items-center justify-between rounded border border-black/10 px-3 py-1.5 text-xs text-black cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1 transition-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="h-3.5 w-3.5 text-black" />
                        <span className="font-bold text-black truncate max-w-sm">{m.title}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-neutral-600">
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
                    className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-xs cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded border border-black bg-black text-white">
                        <Video className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-bold text-black line-clamp-1">{m.title}</p>
                        <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-600">
                          <span>{m.participants.length} ATTENDEES</span>
                          <span>•</span>
                          <span>{formatTime(m.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-black" />
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
                    className="flex items-start justify-between gap-3 rounded border border-black/10 px-3 py-2 text-xs cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded border border-black bg-[#FEF08A] text-black shrink-0">
                        <Quote className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[11px] text-black">
                            {t.speakerName}
                          </span>
                          <span className="font-mono text-[10px] text-neutral-500">in {t.meetingTitle}</span>
                        </div>
                        <p className="mt-0.5 font-sans text-[11px] text-neutral-800 italic leading-snug">
                          &ldquo;{t.matchedSnippet}&rdquo;
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-black text-black shadow-neo-sm flex items-center gap-1">
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
                    className="flex items-center justify-between gap-3 rounded border border-black/10 px-3 py-2 text-xs cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <ListTodo className="h-4 w-4 text-black shrink-0" />
                      <div>
                        <p className="font-bold text-black line-clamp-1">{item.text}</p>
                        <p className="font-mono text-[10px] text-neutral-500">
                          {item.assigneeName ? `Assigned to ${item.assigneeName} • ` : ""}
                          {item.meetingTitle}
                        </p>
                      </div>
                    </div>
                    {item.timestamp !== undefined && (
                      <span className="rounded border border-black bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-black shadow-neo-sm">
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
                    className="flex items-center justify-between rounded border border-black/10 px-3 py-2 text-xs cursor-pointer hover:bg-[#FEF08A] hover:border-black data-[selected=true]:bg-[#FEF08A] data-[selected=true]:border-black mb-1.5 transition-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6 rounded-full border border-black">
                        <AvatarImage src={s.avatarUrl} />
                        <AvatarFallback
                          style={{ backgroundColor: s.color }}
                          className="font-mono text-[9px] font-bold text-black"
                        >
                          {s.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-black">{s.name}</p>
                        <p className="font-mono text-[10px] text-neutral-500">
                          {s.role ? `${s.role} • ` : ""}
                          {s.meetingTitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-black" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          {/* Dialog Footer */}
          <div className="flex items-center justify-between border-t-2 border-black bg-[#FAF8F5] px-4 py-2 font-mono text-[11px] text-neutral-700">
            <div className="flex items-center gap-2">
              <span>NAVIGATE:</span>
              <kbd className="rounded border border-black bg-white px-1.5 py-0.5 font-bold text-black shadow-neo-sm">
                ↑↓
              </kbd>
              <span>SELECT:</span>
              <kbd className="rounded border border-black bg-white px-1.5 py-0.5 font-bold text-black shadow-neo-sm">
                ↵
              </kbd>
            </div>
            <div className="flex items-center gap-1.5">
              <span>CLOSE:</span>
              <kbd className="rounded border border-black bg-white px-1.5 py-0.5 font-bold text-black shadow-neo-sm">
                ESC
              </kbd>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
