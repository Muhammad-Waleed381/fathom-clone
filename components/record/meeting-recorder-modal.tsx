"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import {
  useSpeechRecognition,
  SAMPLE_SIMULATION_DIALOGUE,
} from "@/lib/audio/use-speech-recognition";
import { WaveformVisualizer } from "./waveform-visualizer";
import {
  Meeting,
  Speaker,
  ActionItem,
  MeetingHighlight,
  SummaryTemplateId,
  SummaryTemplateContent,
  TranscriptSegment,
} from "@/types/meeting";
import { generateFallbackSummary } from "@/lib/openrouter";
import {
  Mic,
  MicOff,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Radio,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Wand2,
  Layers,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingRecorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle?: string;
  autoStartSimulation?: boolean;
}

export function MeetingRecorderModal({
  open,
  onOpenChange,
  initialTitle,
  autoStartSimulation = false,
}: MeetingRecorderModalProps) {
  const router = useRouter();
  const transcriptScrollRef = useRef<HTMLDivElement>(null);

  // Editable Meeting Title
  const [meetingTitle, setMeetingTitle] = useState<string>(() => {
    if (initialTitle) return initialTitle;
    const now = new Date();
    return `Live Recording - ${now.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })} ${now.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  });

  // Mode: "mic" or "simulate"
  const [recordMode, setRecordMode] = useState<"mic" | "simulate">("mic");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>("");

  // Speech Recognition Hook
  const {
    isSupported,
    isListening,
    isPaused,
    isSimulating,
    elapsedSeconds,
    interimTranscript,
    segments,
    transcriptText,
    audioLevel,
    frequencyData,
    error,
    startListening,
    stopListening,
    pauseListening,
    resumeListening,
    startSimulation,
    stopSimulation,
    resetRecording,
  } = useSpeechRecognition({
    defaultSpeakerId: "spk-user",
    defaultSpeakerName: "You",
  });

  // Keep title updated if initialTitle changes
  useEffect(() => {
    if (initialTitle) {
      setMeetingTitle(initialTitle);
    }
  }, [initialTitle]);

  // Handle auto-start or initial mode when modal opens
  useEffect(() => {
    if (open) {
      if (autoStartSimulation) {
        setRecordMode("simulate");
        startSimulation();
      } else {
        // Default to mic if supported, else simulate
        if (!isSupported) {
          setRecordMode("simulate");
        }
      }
    } else {
      // Clean up when modal closes
      if (isListening || isSimulating) {
        stopListening();
        stopSimulation();
      }
      setIsGenerating(false);
    }
  }, [open, autoStartSimulation, isSupported]);

  // Auto-scroll transcript container to bottom on new text
  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop =
        transcriptScrollRef.current.scrollHeight;
    }
  }, [segments, interimTranscript]);

  // Format MM:SS timer
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Toggle start / pause / resume
  const handleToggleRecord = async () => {
    if (!isListening) {
      if (recordMode === "simulate") {
        startSimulation();
      } else {
        await startListening();
      }
    } else {
      if (isPaused) {
        resumeListening();
      } else {
        pauseListening();
      }
    }
  };

  // Switch modes
  const handleSwitchMode = (mode: "mic" | "simulate") => {
    setRecordMode(mode);
    if (isListening) {
      if (mode === "simulate") {
        startSimulation();
      } else {
        startListening();
      }
    }
  };

  // AI Meeting Generation & Store Integration
  const handleStopAndGenerate = async () => {
    // 1. Stop audio/simulation capture
    stopListening();
    stopSimulation();
    setIsGenerating(true);

    try {
      setGenerationStep("Synthesizing Executive Summary & Key Themes...");

      // Prepare final transcript segments
      let finalSegments: TranscriptSegment[] = [...segments];

      // If user had an interim piece hanging, commit it
      if (interimTranscript.trim()) {
        const cleanInterim = interimTranscript
          .replace(/^\[.*?\]:\s*"?/, "")
          .replace(/"?\.\.\.$/, "")
          .trim();
        if (cleanInterim) {
          finalSegments.push({
            id: `seg-final-${Date.now()}`,
            speakerId: recordMode === "simulate" ? "spk-sim-1" : "spk-user",
            start: Math.max(0, elapsedSeconds - 3),
            end: elapsedSeconds,
            text: cleanInterim,
            words: cleanInterim.split(/\s+/).map((w, idx) => ({
              text: w,
              start: Math.max(0, elapsedSeconds - 3 + idx * 0.3),
              end: Math.max(0, elapsedSeconds - 3 + (idx + 1) * 0.3),
            })),
          });
        }
      }

      // If transcript was empty (user tested without speaking), create realistic initial segments
      if (finalSegments.length === 0) {
        finalSegments = SAMPLE_SIMULATION_DIALOGUE.slice(0, 4).map((line, i) => ({
          id: `seg-init-${i}`,
          speakerId: line.speakerId,
          start: i * 8,
          end: (i + 1) * 8,
          text: line.text,
          words: line.text.split(/\s+/).map((w, wi) => ({
            text: w,
            start: i * 8 + wi * 0.4,
            end: i * 8 + (wi + 1) * 0.4,
          })),
        }));
      }

      const aggregatedText = finalSegments
        .map((s) => `[${s.speakerId}]: ${s.text}`)
        .join("\n");

      // Generate all 4 Summary Templates (Executive, Action Items, Sales, Engineering)
      const templateIds: SummaryTemplateId[] = [
        "executive",
        "action_items",
        "sales",
        "engineering",
      ];
      const summaries: Record<SummaryTemplateId, SummaryTemplateContent> = {} as any;

      for (const tId of templateIds) {
        setGenerationStep(`Synthesizing ${tId.replace("_", " ")} intelligence...`);
        try {
          // Attempt API call to /api/ai/summarize
          const res = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transcriptText: aggregatedText,
              template: tId,
              meetingTitle,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.summary) {
              summaries[tId] = data.summary;
              continue;
            }
          }
        } catch {
          // Fall through to local fallback
        }

        // Reliable local intelligence fallback
        summaries[tId] = generateFallbackSummary(
          tId,
          aggregatedText,
          meetingTitle
        );
      }

      setGenerationStep("Extracting Action Items & Assignees...");

      // Synthesize Action Items from summaries or transcript
      const newMeetingId = `rec-${Date.now()}`;
      const actionItemsList: ActionItem[] = [];

      // Extract from action_items summary bullets
      const actionBullets =
        summaries.action_items?.sections?.flatMap((s) => s.bullets) || [];

      if (actionBullets.length > 0) {
        actionBullets.forEach((bullet, index) => {
          const match = bullet.match(
            /^(?:([^:]+):\s*)?(.*?)(?:\s*\[(\d{1,2}:\d{2})\])?$/
          );
          const rawAssignee = match?.[1] || "You";
          const rawTask = match?.[2] || bullet;

          actionItemsList.push({
            id: `act-${newMeetingId}-${index + 1}`,
            meetingId: newMeetingId,
            meetingTitle,
            text: rawTask.replace(/\s*\(Due:.*?\)/, "").trim(),
            assigneeId: rawAssignee,
            completed: false,
            timestamp: (index + 1) * 15,
            priority: index === 0 ? "high" : "medium",
            dueDate: "Next Week",
          });
        });
      } else {
        // Sensible default action items
        actionItemsList.push(
          {
            id: `act-${newMeetingId}-1`,
            meetingId: newMeetingId,
            meetingTitle,
            text: "Review generated executive summary and share notes with attendees",
            assigneeId: "You",
            completed: false,
            timestamp: 5,
            priority: "high",
            dueDate: "Tomorrow",
          },
          {
            id: `act-${newMeetingId}-2`,
            meetingId: newMeetingId,
            meetingTitle,
            text: "Schedule follow-up sync to evaluate technical milestones",
            assigneeId: "You",
            completed: false,
            timestamp: 20,
            priority: "medium",
            dueDate: "Friday",
          }
        );
      }

      setGenerationStep("Finalizing Diarized Meeting...");

      // Participants
      const participants: Speaker[] = [
        {
          id: "spk-user",
          name: "You",
          role: "Host & Notetaker",
          company: "Fathom Workspace",
          color: "#6366F1",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "spk-sim-1",
          name: "Sarah Chen",
          role: "Staff Backend Engineer",
          company: "Fathom Engineering",
          color: "#3B82F6",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "spk-sim-2",
          name: "Alex Rivera",
          role: "Principal Infrastructure Architect",
          company: "Fathom Engineering",
          color: "#10B981",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      ];

      // Highlights
      const highlights: MeetingHighlight[] = [
        {
          id: `hl-${newMeetingId}-1`,
          meetingId: newMeetingId,
          title: "Discussion Kickoff & Key Outcomes",
          start: 0,
          end: Math.min(25, Math.max(15, elapsedSeconds)),
          category: "key_moment",
          createdAt: new Date().toISOString(),
        },
      ];

      // Total Duration
      const totalDuration = Math.max(
        elapsedSeconds,
        finalSegments[finalSegments.length - 1]?.end || 60
      );

      // Construct Complete Meeting Object
      const newMeeting: Meeting = {
        id: newMeetingId,
        title: meetingTitle.trim() || "Recorded Meeting Studio Session",
        date: new Date().toISOString(),
        duration: totalDuration,
        videoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        participants,
        transcript: finalSegments,
        highlights,
        actionItems: actionItemsList,
        summaries,
        tags: ["Live Recording", "AI Generated", "Studio"],
      };

      // Add to store & navigate directly
      useMeetingStore.getState().addMeeting(newMeeting);
      useMeetingStore.getState().setCurrentMeeting(newMeeting.id);

      onOpenChange(false);
      resetRecording();
      router.push(`/meetings/${newMeeting.id}`);
    } catch (err) {
      console.error("Failed to generate AI meeting notes:", err);
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-slate-950 border-slate-800 text-slate-100 p-0 overflow-hidden shadow-2xl">
        {/* Header Bar with Bot Badge */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 shadow-md shadow-rose-500/20">
              <Radio className="h-5 w-5 text-white" />
              {isListening && !isPaused && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
                </span>
              )}
            </div>

            <div>
              <DialogTitle className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>In-Browser Live Recording Studio</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-400 mt-0.5">
                Real-time speech-to-text diarization & AI meeting synthesis
              </DialogDescription>
            </div>
          </div>

          {/* Fathom Bot Status Badge */}
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "gap-1.5 px-2.5 py-1 text-xs font-semibold transition-all border",
                isListening && !isPaused
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  : isPaused
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                  : "border-slate-800 bg-slate-900 text-slate-400"
              )}
            >
              <Bot className="h-3.5 w-3.5" />
              <span>
                {isListening && !isPaused
                  ? isSimulating
                    ? "Bot Simulating Call"
                    : "Bot Listening & Diarizing"
                  : isPaused
                  ? "Bot Paused"
                  : "Bot Ready"}
              </span>
            </Badge>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Meeting Title Input & Mode Toggles */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <Input
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="h-10 border-slate-800 bg-slate-900/80 text-sm font-semibold text-white focus:border-indigo-500"
              />
            </div>

            {/* Microphone vs Simulation Selector */}
            <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/60 p-1">
              <button
                type="button"
                onClick={() => handleSwitchMode("mic")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  recordMode === "mic"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>Microphone</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode("simulate")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all",
                  recordMode === "simulate"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-200" />
                <span>Simulate Call</span>
              </button>
            </div>
          </div>

          {/* Browser Mic Notice if unsupported or errored */}
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-300">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{error}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleSwitchMode("simulate")}
                className="h-7 text-xs bg-amber-500/20 hover:bg-amber-500/30 text-amber-200"
              >
                Switch to Simulator
              </Button>
            </div>
          )}

          {/* Timer & Audio Waveform Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Elapsed Timer */}
            <div className="flex sm:flex-col items-center justify-center gap-2 rounded-2xl border border-slate-800/80 bg-slate-900/80 px-5 py-3 shrink-0 shadow-inner">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                <Clock className="h-3.5 w-3.5 text-indigo-400" />
                <span>Duration</span>
              </div>
              <span className="font-mono text-2xl font-black tracking-wider text-white">
                {formatTimer(elapsedSeconds)}
              </span>
            </div>

            {/* Reactive Waveform Visualizer */}
            <div className="flex-1 w-full">
              <WaveformVisualizer
                frequencyData={frequencyData}
                audioLevel={audioLevel}
                isListening={isListening}
                isPaused={isPaused}
                height={52}
              />
            </div>
          </div>

          {/* Streaming Live Transcript Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/60 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">
                  Live Stream Transcript
                </span>
                {isListening && !isPaused && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">
                {segments.length} segments captured
              </span>
            </div>

            <div
              ref={transcriptScrollRef}
              className="h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin"
            >
              {segments.length === 0 && !interimTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-center py-6 text-slate-500 text-xs">
                  <Mic className="h-8 w-8 text-slate-700 mb-2" />
                  <p>
                    {isListening
                      ? "Listening for speech... Speak into your mic or start simulated dialogue."
                      : "Ready to record. Click 'Start Recording' or 'Simulate Call' below."}
                  </p>
                </div>
              )}

              {/* Finalized Segments */}
              {segments.map((seg, idx) => (
                <div
                  key={seg.id || idx}
                  className="flex flex-col gap-1 rounded-xl bg-slate-950/60 p-2.5 border border-slate-800/60 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-400" />
                      <span className="font-semibold text-slate-200">
                        {seg.speakerId === "spk-user"
                          ? "You"
                          : seg.speakerId.replace("spk-sim-", "Speaker ")}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      {formatTimer(seg.start)} - {formatTimer(seg.end)}
                    </span>
                  </div>
                  <p className="text-slate-300 pl-4">{seg.text}</p>
                </div>
              ))}

              {/* Streaming Interim Transcript */}
              {interimTranscript && (
                <div className="rounded-xl bg-indigo-950/30 p-2.5 border border-indigo-500/30 text-xs">
                  <span className="font-mono text-[10px] text-indigo-400 block mb-1">
                    Live Diarizing...
                  </span>
                  <p className="italic text-indigo-200 animate-pulse">
                    {interimTranscript}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800/80 bg-slate-900/60 px-6 py-4">
          {/* Left: Recording Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant={isListening ? "outline" : "default"}
              size="sm"
              onClick={handleToggleRecord}
              disabled={isGenerating}
              className={cn(
                "h-9 gap-2 text-xs font-semibold rounded-xl",
                !isListening
                  ? "bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/20"
                  : isPaused
                  ? "border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                  : "border-amber-500 text-amber-400 hover:bg-amber-500/10"
              )}
            >
              {!isListening ? (
                <>
                  <Mic className="h-3.5 w-3.5" />
                  <span>Start Recording</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>Resume</span>
                </>
              ) : (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>Pause</span>
                </>
              )}
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetRecording}
              disabled={isGenerating || (!isListening && segments.length === 0)}
              className="h-9 gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </Button>
          </div>

          {/* Right: Primary AI Generation Button */}
          <div className="w-full sm:w-auto flex justify-end">
            <Button
              type="button"
              size="sm"
              onClick={handleStopAndGenerate}
              disabled={isGenerating}
              className="h-9 w-full sm:w-auto gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-primary to-purple-600 px-4 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition-all hover:scale-102 hover:shadow-indigo-600/35 active:scale-98"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>{generationStep || "Generating AI Notes..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Stop & Generate AI Notes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
