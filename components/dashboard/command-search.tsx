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
  CommandInput,
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
  User,
  ListTodo,
  FileText,
  Clock,
  Sparkles,
  Play,
  ArrowRight,
  Settings,
  CheckCircle2,
  Calendar,
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

    // 2. Match Speakers across all meetings
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
          // Avoid duplicate speakers for same meeting
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

    // 4. Match Transcript Quotes (with timestamp jump!)
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

    // Limit searching transcript across meetings to first 8 matches to keep response instantaneous
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
          // Extract snippet around matched phrase
          const snippetStart = Math.max(0, index - 30);
          const snippetEnd = Math.min(seg.text.length, index + cleanQuery.length + 40);
          const snippet =
            (snippetStart > 0 ? "…" : "") +
            seg.text.slice(snippetStart, snippetEnd) +
            (snippetEnd < seg.text.length ? "…" : "");

          matchedTranscript.push({
            id: seg.id,
            meetingId: m.id,
            meetingTitle: m.title,
            speakerName: speaker?.name || "Speaker",
            speakerColor: speaker?.color || "#6366f1",
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
      <DialogContent className="max-w-2xl overflow-hidden p-0 border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
        <Command shouldFilter={false} className="bg-transparent border-none">
          <div className="flex items-center border-b border-slate-800 px-3 bg-slate-950">
            <Search className="mr-2.5 h-4 w-4 shrink-0 text-slate-400" />
            <input
              type="text"
              placeholder="Search meetings, speakers, transcripts, action items..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 border border-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          <CommandList className="max-h-[420px] overflow-y-auto p-2 scrollbar-thin">
            {cleanQuery && !hasResults && (
              <CommandEmpty className="py-12 text-center text-sm text-slate-400">
                No matching results found for &ldquo;{query}&rdquo;
              </CommandEmpty>
            )}

            {/* Default Quick Options when query is empty */}
            {!cleanQuery && (
              <>
                <CommandGroup heading="Quick Navigation">
                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      router.push("/meetings/meeting-1");
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-slate-200 cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary border border-primary/20">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          8-Person Benchmark Call (Q3 Scalability Sync)
                        </p>
                        <p className="text-[11px] text-slate-400">
                          Full 42m recording with multi-speaker diarization
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-indigo-500/30 text-indigo-400 text-[10px]">
                      Benchmark
                    </Badge>
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      router.push("/actions");
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-slate-200 cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <ListTodo className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Action Items Hub</p>
                        <p className="text-[11px] text-slate-400">
                          View all action items across recorded meetings
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </CommandItem>

                  <CommandItem
                    onSelect={() => {
                      setIsOpen(false);
                      if (onOpenSettings) onOpenSettings();
                    }}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs text-slate-200 cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">AI & API Key Settings</p>
                        <p className="text-[11px] text-slate-400">
                          Configure OpenRouter or Deepgram Nova-2 keys
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </CommandItem>
                </CommandGroup>

                <CommandSeparator className="my-1 bg-slate-800" />

                <CommandGroup heading="Recent Meetings">
                  {meetings.map((m) => (
                    <CommandItem
                      key={m.id}
                      onSelect={() => handleSelectMeeting(m.id)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-xs text-slate-200 cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                    >
                      <div className="flex items-center gap-2.5">
                        <Video className="h-4 w-4 text-slate-400" />
                        <span className="font-medium text-slate-200 line-clamp-1">{m.title}</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-500">
                        {formatTime(m.duration)}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {/* Results Group: Meetings */}
            {searchResults.meetings.length > 0 && (
              <CommandGroup heading={`Meetings (${searchResults.meetings.length})`}>
                {searchResults.meetings.map((m) => (
                  <CommandItem
                    key={`m-${m.id}`}
                    onSelect={() => handleSelectMeeting(m.id)}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        <Video className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white line-clamp-1">{m.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span>{m.participants.length} speakers</span>
                          <span>•</span>
                          <span>{formatTime(m.duration)}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Results Group: Transcript Moments with Timestamp Jump */}
            {searchResults.transcriptMatches.length > 0 && (
              <CommandGroup heading={`Transcript Moments (${searchResults.transcriptMatches.length})`}>
                {searchResults.transcriptMatches.map((t) => (
                  <CommandItem
                    key={`trans-${t.id}`}
                    onSelect={() => handleSelectTranscriptMatch(t.meetingId, t.start)}
                    className="flex items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-xs cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Quote className="h-3 w-3" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            style={{ color: t.speakerColor }}
                            className="font-semibold text-[11px]"
                          >
                            {t.speakerName}
                          </span>
                          <span className="text-[10px] text-slate-500">in {t.meetingTitle}</span>
                        </div>
                        <p className="mt-1 text-slate-300 italic leading-relaxed text-[11px]">
                          &ldquo;{t.matchedSnippet}&rdquo;
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="shrink-0 border-amber-500/40 bg-amber-500/10 text-amber-300 font-mono text-[10px] gap-1"
                    >
                      <Play className="h-2.5 w-2.5 fill-current" />
                      {formatTime(t.start)}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Results Group: Action Items */}
            {searchResults.actionItems.length > 0 && (
              <CommandGroup heading={`Action Items (${searchResults.actionItems.length})`}>
                {searchResults.actionItems.map((item) => (
                  <CommandItem
                    key={`act-${item.id}`}
                    onSelect={() => handleSelectActionItem(item.meetingId, item.timestamp)}
                    className="flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <ListTodo className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                      <div>
                        <p className="font-medium text-slate-200 line-clamp-1">{item.text}</p>
                        <p className="text-[10px] text-slate-500">
                          {item.assigneeName ? `Assigned to ${item.assigneeName} • ` : ""}
                          {item.meetingTitle}
                        </p>
                      </div>
                    </div>
                    {item.timestamp !== undefined && (
                      <Badge variant="outline" className="text-[10px] font-mono border-slate-700 text-slate-400">
                        {formatTime(item.timestamp)}
                      </Badge>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}

            {/* Results Group: Speakers */}
            {searchResults.speakers.length > 0 && (
              <CommandGroup heading={`Speakers (${searchResults.speakers.length})`}>
                {searchResults.speakers.map((s, idx) => (
                  <CommandItem
                    key={`spk-${s.speakerId}-${s.meetingId}-${idx}`}
                    onSelect={() => handleSelectSpeaker(s.meetingId, s.speakerId)}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-slate-900 aria-selected:bg-slate-900"
                  >
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-6 w-6 border border-slate-700">
                        <AvatarImage src={s.avatarUrl} />
                        <AvatarFallback
                          style={{ backgroundColor: s.color }}
                          className="text-[9px] font-bold text-white"
                        >
                          {s.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-white">{s.name}</p>
                        <p className="text-[10px] text-slate-400">
                          {s.role ? `${s.role} • ` : ""}
                          {s.meetingTitle}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>

          <div className="flex items-center justify-between border-t border-slate-800 bg-slate-950 px-3.5 py-2 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span>Navigation:</span>
              <kbd className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-800">
                ↑↓
              </kbd>
              <span>to select</span>
              <kbd className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-800">
                ↵
              </kbd>
              <span>to open</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Exit:</span>
              <kbd className="rounded bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-300 border border-slate-800">
                ESC
              </kbd>
            </div>
          </div>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
