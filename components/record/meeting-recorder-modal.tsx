"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { useDeepgramRecorder } from "@/lib/audio/use-deepgram-recorder";
import { SAMPLE_SIMULATION_DIALOGUE } from "@/lib/audio/simulation-dialogue";
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
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Radio,
  Clock,
  AlertCircle,
  Loader2,
  Upload,
  FileAudio,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface MeetingRecorderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle?: string;
  autoStartSimulation?: boolean;
}

type RecordMode = "mic" | "upload" | "simulate";

const TEMPLATES: SummaryTemplateId[] = ["executive", "action_items", "sales", "engineering"];
const SPEAKER_COLORS = ["#FEF08A", "#A7F3D0", "#BAE6FD", "#FBCFE8", "#DDD6FE", "#FED7AA", "#99F6E4", "#FECACA"];
const TRANSCRIBE_TIMEOUT_MS = 300000;

interface TranscribeResult {
  segments: TranscriptSegment[];
  duration: number;
  detectedSpeakers: number;
  isFallback: boolean;
}

/** POST audio to /api/transcribe. Throws with the server's message on failure. */
async function transcribeAudio(blob: Blob, fileName: string): Promise<TranscribeResult> {
  const fd = new FormData();
  fd.append("file", blob, fileName);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TRANSCRIBE_TIMEOUT_MS);
  try {
    const res = await fetch("/api/transcribe", { method: "POST", body: fd, signal: controller.signal });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) {
      throw new Error(data.error || `Transcription failed (HTTP ${res.status})`);
    }
    return data as TranscribeResult;
  } catch (err: any) {
    if (err?.name === "AbortError") throw new Error("Transcription timed out. Check your connection and try again.");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

/** Build participant records for whichever speaker ids appear in the transcript. */
function participantsFor(segments: TranscriptSegment[], mode: RecordMode): Speaker[] {
  if (mode === "simulate") {
    const byId = new Map<string, Speaker>();
    for (const line of SAMPLE_SIMULATION_DIALOGUE) {
      if (!byId.has(line.speakerId)) {
        byId.set(line.speakerId, {
          id: line.speakerId,
          name: line.speakerName,
          role: line.speakerRole,
          company: "Fathom Engineering",
          color: line.speakerColor,
        });
      }
    }
    return Array.from(byId.values());
  }
  const ids = Array.from(new Set(segments.map((s) => s.speakerId))).sort();
  return ids.map((id, i) => ({
    id,
    name: `Speaker ${i + 1}`,
    role: i === 0 ? "Host" : "Participant",
    company: "Fathom Workspace",
    color: SPEAKER_COLORS[i % SPEAKER_COLORS.length],
  }));
}

export function MeetingRecorderModal({
  open,
  onOpenChange,
  initialTitle,
  autoStartSimulation = false,
}: MeetingRecorderModalProps) {
  const router = useRouter();
  const transcriptScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [meetingTitle, setMeetingTitle] = useState<string>(() => {
    if (initialTitle) return initialTitle;
    const now = new Date();
    return `Studio Recording - ${now.toLocaleDateString(undefined, { month: "short", day: "numeric" })} ${now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
  });
  const [recordMode, setRecordMode] = useState<RecordMode>("mic");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState("");
  const [generationError, setGenerationError] = useState<string | null>(null);

  const {
    isSupported,
    isListening,
    isPaused,
    isSimulating,
    liveStatus,
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
    getRecordingBlob,
  } = useDeepgramRecorder();

  useEffect(() => {
    if (initialTitle) setMeetingTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    if (open) {
      if (autoStartSimulation) {
        setRecordMode("simulate");
        startSimulation();
      } else if (!isSupported) {
        setRecordMode("upload");
      }
    } else {
      if (isListening || isSimulating) {
        stopListening();
        stopSimulation();
      }
      setIsGenerating(false);
      setGenerationError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, autoStartSimulation, isSupported]);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [segments, interimTranscript]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleToggleRecord = async () => {
    if (!isListening) {
      if (recordMode === "simulate") startSimulation();
      else await startListening();
    } else if (isPaused) {
      resumeListening();
    } else {
      pauseListening();
    }
  };

  const handleSwitchMode = (mode: RecordMode) => {
    setRecordMode(mode);
    setGenerationError(null);
    if (mode === "upload") {
      if (isListening) {
        stopListening();
        stopSimulation();
      }
      return;
    }
    if (isListening) {
      if (mode === "simulate") startSimulation();
      else startListening();
    }
  };

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setUploadFile(f);
    setGenerationError(null);
    if (f && !initialTitle) {
      setMeetingTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
    }
  };

  /**
   * Turn a finished transcript into a meeting: four summaries in parallel
   * (each falling back locally if the API fails), action items, participants.
   */
  const buildAndOpenMeeting = async (
    finalSegments: TranscriptSegment[],
    durationSeconds: number,
    mode: RecordMode,
    tags: string[]
  ) => {
    const aggregatedText = finalSegments.map((s) => `[${s.speakerId}]: ${s.text}`).join("\n");

    setGenerationStep("Writing summaries…");
    const results = await Promise.all(
      TEMPLATES.map(async (template) => {
        try {
          const res = await fetch("/api/ai/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transcriptText: aggregatedText, template, meetingTitle }),
          });
          if (res.ok) {
            const data = await res.json();
            if (data?.summary) return [template, data.summary as SummaryTemplateContent] as const;
          }
        } catch {
          /* handled by fallback below */
        }
        return [template, generateFallbackSummary(template, aggregatedText, meetingTitle)] as const;
      })
    );
    const summaries = Object.fromEntries(results) as Record<SummaryTemplateId, SummaryTemplateContent>;

    setGenerationStep("Extracting action items…");
    const newMeetingId = `rec-${Date.now()}`;
    const actionBullets = summaries.action_items?.sections?.flatMap((s) => s.bullets) || [];
    const actionItems: ActionItem[] = actionBullets.length
      ? actionBullets.map((bullet, index) => {
          const match = bullet.match(/^(?:([^:]+):\s*)?(.*?)(?:\s*\[(\d{1,2}:\d{2})\])?$/);
          return {
            id: `act-${newMeetingId}-${index + 1}`,
            meetingId: newMeetingId,
            meetingTitle,
            text: (match?.[2] || bullet).replace(/\s*\(Due:.*?\)/, "").trim(),
            assigneeId: match?.[1] || finalSegments[0]?.speakerId || "spk-1",
            completed: false,
            timestamp: Math.min(durationSeconds, (index + 1) * 15),
            priority: index === 0 ? "high" : "medium",
            dueDate: "Next Week",
          };
        })
      : [
          {
            id: `act-${newMeetingId}-1`,
            meetingId: newMeetingId,
            meetingTitle,
            text: "Review the generated summary and confirm the decisions",
            assigneeId: finalSegments[0]?.speakerId || "spk-1",
            completed: false,
            timestamp: 5,
            priority: "high",
            dueDate: "Tomorrow",
          },
        ];

    const highlights: MeetingHighlight[] = [
      {
        id: `hl-${newMeetingId}-1`,
        meetingId: newMeetingId,
        title: "Opening",
        start: 0,
        end: Math.min(25, Math.max(15, durationSeconds)),
        category: "key_moment",
        createdAt: new Date().toISOString(),
      },
    ];

    const newMeeting: Meeting = {
      id: newMeetingId,
      title: meetingTitle.trim() || "Recorded Meeting Session",
      date: new Date().toISOString(),
      duration: durationSeconds,
      videoUrl: "",
      participants: participantsFor(finalSegments, mode),
      transcript: finalSegments,
      highlights,
      actionItems,
      summaries,
      tags,
    };

    useMeetingStore.getState().addMeeting(newMeeting);
    useMeetingStore.getState().setCurrentMeeting(newMeeting.id);
    onOpenChange(false);
    resetRecording();
    setUploadFile(null);
    router.push(`/meetings/${newMeeting.id}`);
  };

  /** Upload mode: transcribe the chosen file with Deepgram, then build the meeting. */
  const handleTranscribeUpload = async () => {
    if (!uploadFile) return;
    setIsGenerating(true);
    setGenerationError(null);
    try {
      setGenerationStep(`Transcribing ${uploadFile.name}…`);
      const result = await transcribeAudio(uploadFile, uploadFile.name);
      await buildAndOpenMeeting(result.segments, result.duration, "upload", ["Uploaded audio", "Deepgram"]);
    } catch (err: any) {
      setGenerationError(err?.message || "Transcription failed.");
      setIsGenerating(false);
    }
  };

  /**
   * Mic / simulator: stop capture. For real audio, send the full recording to
   * Deepgram batch for the definitive diarized transcript; keep the live
   * segments if that fails so nothing the user said is lost.
   */
  const handleStopAndGenerate = async () => {
    const mode = recordMode;
    const blob = mode === "mic" ? getRecordingBlob() : null;
    const liveSegments = [...segments];
    const recordedSeconds = elapsedSeconds;

    stopListening();
    stopSimulation();
    setIsGenerating(true);
    setGenerationError(null);

    try {
      let finalSegments = liveSegments;
      let duration = Math.max(recordedSeconds, liveSegments[liveSegments.length - 1]?.end || 0);
      let tags = mode === "simulate" ? ["Simulated", "Sample dialogue"] : ["Live recording", "Deepgram"];

      if (mode === "mic" && blob && blob.size > 0) {
        setGenerationStep("Finalizing transcript with Deepgram…");
        try {
          const batch = await transcribeAudio(blob, `recording-${Date.now()}.webm`);
          if (batch.segments.length > 0 && !batch.isFallback) {
            finalSegments = batch.segments;
            duration = Math.max(duration, batch.duration);
          }
        } catch (err: any) {
          console.warn("Batch transcription failed; keeping the live transcript.", err);
          tags = [...tags, "Live transcript"];
        }
      }

      if (finalSegments.length === 0) {
        throw new Error(
          mode === "mic"
            ? "No speech was transcribed. Check the microphone and try again, or upload an audio file."
            : "No transcript was produced."
        );
      }

      await buildAndOpenMeeting(finalSegments, Math.max(duration, 1), mode, tags);
    } catch (err: any) {
      console.error("Failed to generate meeting notes:", err);
      setGenerationError(err?.message || "Could not generate meeting notes.");
      setIsGenerating(false);
    }
  };

  const speakerLabel = (id: string) => {
    if (id === "spk-user") return "You";
    const sim = SAMPLE_SIMULATION_DIALOGUE.find((l) => l.speakerId === id);
    if (sim) return sim.speakerName;
    return id.replace(/^spk-/, "Speaker ");
  };

  const statusLabel =
    isListening && !isPaused
      ? isSimulating
        ? "Simulating"
        : liveStatus === "live"
        ? "Live · Deepgram"
        : "Connecting"
      : isPaused
      ? "Paused"
      : "Standby";

  const modeButton = (mode: RecordMode, icon: React.ReactNode, label: string) => (
    <button
      type="button"
      onClick={() => handleSwitchMode(mode)}
      disabled={isGenerating}
      className={cn(
        "flex h-9 items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition-colors disabled:opacity-50",
        recordMode === mode
          ? "border-white bg-white text-black"
          : "border-white/15 text-white/70 hover:bg-white/5 hover:text-white"
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const alert = error || generationError;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-surface-raised p-0 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/15 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15">
              <Radio className="h-5 w-5 text-white" />
              {isListening && !isPaused && (
                <span className="absolute -right-1 -top-1 flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
                </span>
              )}
            </div>
            <div>
              <DialogTitle className="text-base font-semibold tracking-tight text-white">
                Record a meeting
              </DialogTitle>
              <DialogDescription className="text-xs text-white/60">
                Live transcription and diarization by Deepgram
              </DialogDescription>
            </div>
          </div>
          <span
            className={cn(
              "rounded-full border px-2.5 py-1 text-[12px] font-medium",
              isListening && !isPaused
                ? "border-white bg-white text-black"
                : "border-white/15 text-white/60"
            )}
          >
            {statusLabel}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-4 p-6">
          <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={meetingTitle}
              onChange={(e) => setMeetingTitle(e.target.value)}
              placeholder="Enter meeting title..."
              className="h-10 flex-1 rounded-full border border-white/15 bg-transparent px-4 text-sm text-white placeholder:text-white/45 transition-colors focus:border-white/40 focus:outline-none"
            />
            <div className="flex shrink-0 items-center gap-1.5">
              {modeButton("mic", <Mic className="h-3.5 w-3.5" />, "Mic")}
              {modeButton("upload", <Upload className="h-3.5 w-3.5" />, "Upload audio")}
              {modeButton("simulate", <Sparkles className="h-3.5 w-3.5" />, "Simulator")}
            </div>
          </div>

          {alert && (
            <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{alert}</span>
              </div>
              {recordMode !== "upload" && (
                <button
                  type="button"
                  onClick={() => handleSwitchMode("upload")}
                  className="shrink-0 rounded-full border border-red-500/30 px-2.5 py-1 text-[11px] font-medium text-red-200 transition-colors hover:bg-red-500/10"
                >
                  Upload audio instead
                </button>
              )}
            </div>
          )}

          {recordMode === "upload" ? (
            /* Upload mode: file picker */
            <div
              className={cn(
                "flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
                uploadFile ? "border-white/40" : "border-white/20 hover:border-white/40"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) {
                  setUploadFile(f);
                  setGenerationError(null);
                  if (!initialTitle) setMeetingTitle(f.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " "));
                }
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/webm,video/mp4"
                onChange={handleFilePicked}
                className="hidden"
                data-testid="audio-upload-input"
              />
              {uploadFile ? (
                <>
                  <FileAudio className="h-8 w-8 text-white" />
                  <div>
                    <p className="text-sm font-medium text-white">{uploadFile.name}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {(uploadFile.size / (1024 * 1024)).toFixed(1)} MB · {uploadFile.type || "audio"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white disabled:opacity-50"
                  >
                    <X className="h-3 w-3" /> Choose a different file
                  </button>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-white/50" />
                  <div>
                    <p className="text-sm font-medium text-white">Drop an audio file here</p>
                    <p className="mt-1 text-xs text-white/50">MP3, WAV, M4A, WebM · transcribed and diarized by Deepgram</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-full border border-white/20 px-4 py-1.5 text-[13px] font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Browse files
                  </button>
                </>
              )}
            </div>
          ) : (
            <>
              {/* Timer + waveform */}
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="flex shrink-0 items-center justify-center gap-1 rounded-xl border border-white/15 px-5 py-3 sm:flex-col">
                  <div className="flex items-center gap-1 text-[10px] font-semibold text-white/45">
                    <Clock className="h-3 w-3" />
                    <span>Rec time</span>
                  </div>
                  <span className="text-3xl font-bold tabular-nums text-white">{formatTimer(elapsedSeconds)}</span>
                </div>
                <div className="w-full flex-1">
                  <WaveformVisualizer
                    frequencyData={frequencyData}
                    audioLevel={audioLevel}
                    isListening={isListening}
                    isPaused={isPaused}
                    height={52}
                  />
                </div>
              </div>

              {/* Live transcript */}
              <div className="rounded-xl border border-white/15 p-4">
                <div className="mb-2.5 flex items-center justify-between border-b border-white/15 pb-2 text-xs text-white">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Live transcript</span>
                    {isListening && !isPaused && (
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                      </span>
                    )}
                  </div>
                  <span className="font-medium text-white/60">{segments.length} segments captured</span>
                </div>

                <div ref={transcriptScrollRef} className="h-44 space-y-2.5 overflow-y-auto pr-2 text-xs">
                  {segments.length === 0 && !interimTranscript && (
                    <div className="flex h-full flex-col items-center justify-center py-6 text-center text-white/45">
                      <Mic className="mb-2 h-8 w-8 text-white/35" />
                      <p className="text-[11px] font-medium">
                        {isListening
                          ? liveStatus === "live"
                            ? "Listening — start talking."
                            : "Connecting to Deepgram…"
                          : "Press Start recording, or upload an audio file."}
                      </p>
                    </div>
                  )}

                  {segments.map((seg, idx) => (
                    <div key={seg.id || idx} className="flex flex-col gap-1 rounded-xl border border-white/15 p-2.5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full border border-white/15 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/80">
                          {speakerLabel(seg.speakerId)}
                        </span>
                        <span className="text-[10px] tabular-nums text-white/45">
                          {formatTimer(seg.start)} – {formatTimer(seg.end)}
                        </span>
                      </div>
                      <p className="mt-0.5 pl-1 text-xs text-white">{seg.text}</p>
                    </div>
                  ))}

                  {interimTranscript && (
                    <div className="rounded-xl border border-dashed border-white/25 p-2.5">
                      <p className="animate-pulse text-xs italic text-white/70">{interimTranscript}</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/15 px-6 py-4 sm:flex-row">
          {recordMode === "upload" ? (
            <div className="w-full">
              <button
                type="button"
                onClick={handleTranscribeUpload}
                disabled={isGenerating || !uploadFile}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white bg-white px-5 text-[13px] font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{generationStep || "Working…"}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Transcribe & generate notes</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <button
                  type="button"
                  onClick={handleToggleRecord}
                  disabled={isGenerating}
                  className={cn(
                    "flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition-colors disabled:opacity-50",
                    !isListening
                      ? "border-white/20 text-white hover:bg-white hover:text-black"
                      : isPaused
                      ? "border-white/15 bg-white/10 text-white/80"
                      : "border-white bg-white text-black"
                  )}
                >
                  {!isListening ? (
                    <>
                      <Mic className="h-4 w-4" />
                      <span>Start recording</span>
                    </>
                  ) : isPaused ? (
                    <>
                      <Play className="h-4 w-4 fill-current" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => { resetRecording(); setGenerationError(null); }}
                  disabled={isGenerating || (!isListening && segments.length === 0)}
                  className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 px-3 text-[13px] font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-50"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleStopAndGenerate}
                disabled={isGenerating || (!isListening && segments.length === 0)}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white bg-white px-5 text-[13px] font-medium text-black transition-colors hover:bg-white/90 disabled:opacity-50 sm:w-auto"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>{generationStep || "Generating…"}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Stop & generate AI notes</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
