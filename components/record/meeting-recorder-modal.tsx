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
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Bot,
  Radio,
  Clock,
  AlertCircle,
  Loader2,
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
    return `Studio Recording - ${now.toLocaleDateString(undefined, {
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

  // Trigger simulated sample audio explicitly
  const handleSimulateSampleAudio = () => {
    setRecordMode("simulate");
    if (!isListening || !isSimulating) {
      startSimulation();
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

      // If transcript was empty, create realistic initial segments
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
        actionItemsList.push(
          {
            id: `act-${newMeetingId}-1`,
            meetingId: newMeetingId,
            meetingTitle,
            text: "Review generated executive summary and verify milestones",
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
            text: "Distribute transcript and action items to team leads",
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
          role: "Host & Lead",
          company: "Fathom Workspace",
          color: "#BAE6FD",
          avatarUrl:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "spk-sim-1",
          name: "Sarah Chen",
          role: "Staff Backend Engineer",
          company: "Fathom Engineering",
          color: "#FEF08A",
          avatarUrl:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
        },
        {
          id: "spk-sim-2",
          name: "Alex Rivera",
          role: "Principal Infrastructure Architect",
          company: "Fathom Engineering",
          color: "#A7F3D0",
          avatarUrl:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        },
      ];

      // Highlights
      const highlights: MeetingHighlight[] = [
        {
          id: `hl-${newMeetingId}-1`,
          meetingId: newMeetingId,
          title: "Discussion Kickoff & Architecture Decision",
          start: 0,
          end: Math.min(25, Math.max(15, elapsedSeconds)),
          category: "key_moment",
          createdAt: new Date().toISOString(),
        },
      ];

      const totalDuration = Math.max(
        elapsedSeconds,
        finalSegments[finalSegments.length - 1]?.end || 60
      );

      const newMeeting: Meeting = {
        id: newMeetingId,
        title: meetingTitle.trim() || "Recorded Meeting Session",
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
      <DialogContent className="max-w-2xl border border-zinc-200 bg-white p-0 text-zinc-950 shadow-2xl shadow-black/[0.08] overflow-hidden rounded-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 bg-zinc-50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white shadow-sm">
              <Radio className="h-5 w-5 text-zinc-950" />
              {isListening && !isPaused && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-red-500 opacity-75" />
                  <span className="relative inline-flex rounded-sm h-3 w-3 bg-red-600" />
                </span>
              )}
            </div>

            <div>
              <DialogTitle className="font-mono text-base font-semibold uppercase text-zinc-950 tracking-tight flex items-center gap-2">
                <span>LIVE RECORDING STUDIO</span>
              </DialogTitle>
              <DialogDescription className="font-mono text-[11px] font-medium uppercase text-zinc-500">
                REAL-TIME DIARIZATION & AI SYNTHESIS
              </DialogDescription>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-xs font-semibold uppercase transition-all",
                isListening && !isPaused
                  ? isSimulating
                    ? "border-zinc-200 bg-zinc-100 text-zinc-950 animate-pulse"
                    : "border-zinc-200 bg-zinc-950 text-white"
                  : isPaused
                  ? "border-zinc-200 bg-zinc-100 text-zinc-600"
                  : "border-zinc-200 bg-white text-zinc-500"
              )}
            >
              {isListening && !isPaused
                ? isSimulating
                  ? "SIMULATING CALL"
                  : "RECORDING"
                : isPaused
                ? "PAUSED"
                : "STANDBY"}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Title Input & Mode Switchers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                placeholder="Enter meeting title..."
                className="h-10 w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 font-mono text-xs font-medium text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
              />
            </div>

            {/* Microphone vs Simulate Call Toggle */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleSwitchMode("mic")}
                className={cn(
                  "h-9 flex items-center gap-1.5 rounded-md border px-3 font-mono text-xs font-semibold uppercase transition-colors",
                  recordMode === "mic"
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                )}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>MIC</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchMode("simulate")}
                className={cn(
                  "h-9 flex items-center gap-1.5 rounded-md border px-3 font-mono text-xs font-semibold uppercase transition-colors",
                  recordMode === "simulate"
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                )}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>SIMULATOR</span>
              </button>

              {/* Explicit simulate sample audio button */}
              <button
                type="button"
                onClick={handleSimulateSampleAudio}
                className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                title="Inject sample audio dialogue for quick testing"
              >
                <span>SAMPLE AUDIO</span>
              </button>
            </div>
          </div>

          {/* Browser Mic Notice if unsupported or errored */}
          {error && (
            <div className="flex items-center justify-between gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-2.5 font-mono text-xs text-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => handleSwitchMode("simulate")}
                className="rounded-md border border-red-200 bg-white px-2 py-1 font-mono text-[10px] font-semibold uppercase hover:bg-red-50 transition-colors"
              >
                USE SIMULATOR
              </button>
            </div>
          )}

          {/* Digital Timer & Audio Waveform Banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Live Digital Timer Display */}
            <div className="flex sm:flex-col items-center justify-center gap-1 rounded-xl border border-zinc-200 bg-zinc-950 px-5 py-3 shrink-0 shadow-sm">
              <div className="flex items-center gap-1 font-mono text-[10px] font-semibold uppercase text-zinc-400">
                <Clock className="h-3 w-3" />
                <span>REC TIME</span>
              </div>
              <span className="font-mono text-3xl font-bold tracking-widest text-white">
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
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-zinc-200 font-mono text-xs text-zinc-950">
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase">
                  STREAMING DIARIZATION LOG
                </span>
                {isListening && !isPaused && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-sm bg-zinc-950 opacity-75" />
                    <span className="relative inline-flex rounded-sm h-2 w-2 bg-zinc-950" />
                  </span>
                )}
              </div>
              <span className="font-medium text-zinc-500">
                {segments.length} SEGMENTS CAPTURED
              </span>
            </div>

            <div
              ref={transcriptScrollRef}
              className="h-44 overflow-y-auto space-y-2.5 pr-2 font-mono text-xs"
            >
              {segments.length === 0 && !interimTranscript && (
                <div className="flex flex-col items-center justify-center h-full text-center py-6 text-zinc-400">
                  <Mic className="h-8 w-8 mb-2 text-zinc-300" />
                  <p className="font-medium uppercase text-[11px]">
                    {isListening
                      ? "Listening for audio speech... Speak into mic or click 'SAMPLE AUDIO'."
                      : "Workstation Standby. Click 'Start Recording' or 'Sample Audio' to initiate."}
                  </p>
                </div>
              )}

              {/* Finalized Segments */}
              {segments.map((seg, idx) => (
                <div
                  key={seg.id || idx}
                  className="flex flex-col gap-1 rounded-md border border-zinc-200 bg-white p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="rounded-sm border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase text-zinc-600">
                        {seg.speakerId === "spk-user"
                          ? "YOU"
                          : seg.speakerId.replace("spk-sim-", "SPEAKER ")}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] font-medium text-zinc-400">
                      {formatTimer(seg.start)} - {formatTimer(seg.end)}
                    </span>
                  </div>
                  <p className="font-sans text-xs font-medium text-zinc-950 pl-1 mt-0.5">
                    {seg.text}
                  </p>
                </div>
              ))}

              {/* Streaming Interim Transcript */}
              {interimTranscript && (
                <div className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 p-2.5">
                  <span className="font-mono text-[9px] font-semibold uppercase text-zinc-400 block mb-0.5">
                    LIVE STREAMING...
                  </span>
                  <p className="font-sans text-xs font-medium text-zinc-700 italic animate-pulse">
                    {interimTranscript}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200 bg-zinc-50 px-6 py-4">
          {/* Left: Recording Controls */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleToggleRecord}
              disabled={isGenerating}
              className={cn(
                "h-10 flex items-center gap-2 rounded-md border px-4 font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50",
                !isListening
                  ? "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950"
                  : isPaused
                  ? "border-zinc-200 bg-zinc-100 text-zinc-700"
                  : "border-zinc-950 bg-zinc-950 text-white"
              )}
            >
              {!isListening ? (
                <>
                  <Mic className="h-4 w-4" />
                  <span>START RECORDING</span>
                </>
              ) : isPaused ? (
                <>
                  <Play className="h-4 w-4 fill-current stroke-[2]" />
                  <span>RESUME</span>
                </>
              ) : (
                <>
                  <Pause className="h-4 w-4" />
                  <span>PAUSE</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={resetRecording}
              disabled={isGenerating || (!isListening && segments.length === 0)}
              className="h-10 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 disabled:opacity-50 transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>RESET</span>
            </button>
          </div>

          {/* Right: Primary AI Generation Button */}
          <div className="w-full sm:w-auto flex justify-end">
            <button
              type="button"
              onClick={handleStopAndGenerate}
              disabled={isGenerating}
              className="h-10 w-full sm:w-auto flex items-center justify-center gap-2 rounded-md border border-zinc-950 bg-zinc-950 px-5 font-mono text-xs font-semibold uppercase tracking-wider text-white hover:bg-zinc-800 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{generationStep || "GENERATING AI NOTES..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>STOP & GENERATE AI NOTES</span>
                </>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
