"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TranscriptSegment, TranscriptWord } from "@/types/meeting";
import {
  SAMPLE_SIMULATION_DIALOGUE,
  SimulatedDialogueLine,
} from "./simulation-dialogue";

/**
 * Microphone recorder backed by Deepgram.
 *
 * Live: audio is captured with MediaRecorder (webm/opus) and streamed to
 * Deepgram's websocket for interim + final diarized results, so the transcript
 * grows while the user talks. The raw chunks are kept so the caller can send
 * the whole recording to /api/transcribe afterwards for the higher-quality
 * batch transcript.
 *
 * The return shape matches the old Web Speech hook so the recorder modal is a
 * drop-in swap, plus `getRecordingBlob` and `liveStatus`.
 */

export type LiveStatus = "idle" | "connecting" | "live" | "error";

export interface UseDeepgramRecorderReturn {
  isSupported: boolean;
  isListening: boolean;
  isPaused: boolean;
  isSimulating: boolean;
  liveStatus: LiveStatus;
  elapsedSeconds: number;
  interimTranscript: string;
  segments: TranscriptSegment[];
  transcriptText: string;
  audioLevel: number;
  frequencyData: number[];
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  pauseListening: () => void;
  resumeListening: () => void;
  startSimulation: (customDialogue?: SimulatedDialogueLine[]) => void;
  stopSimulation: () => void;
  resetRecording: () => void;
  setSegments: React.Dispatch<React.SetStateAction<TranscriptSegment[]>>;
  getRecordingBlob: () => Blob | null;
}

const DEEPGRAM_WS = "wss://api.deepgram.com/v1/listen";
const LIVE_PARAMS =
  "model=nova-2&diarize=true&punctuate=true&smart_format=true&interim_results=true&utterance_end_ms=1200&vad_events=true";
const CHUNK_MS = 250;
const KEEPALIVE_MS = 8000;
const BINS = 24;

function pickMimeType(): string {
  if (typeof MediaRecorder === "undefined") return "";
  for (const t of ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"]) {
    if (MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export function useDeepgramRecorder(): UseDeepgramRecorderReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [liveStatus, setLiveStatus] = useState<LiveStatus>("idle");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [audioLevel, setAudioLevel] = useState(0);
  const [frequencyData, setFrequencyData] = useState<number[]>(() => new Array(BINS).fill(0.08));
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef("");
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const elapsedSecondsRef = useRef(0);
  elapsedSecondsRef.current = elapsedSeconds;

  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const simulationStateRef = useRef({
    dialogue: SAMPLE_SIMULATION_DIALOGUE as SimulatedDialogueLine[],
    lineIndex: 0,
    charIndex: 0,
    currentLineStartTime: 0,
  });

  useEffect(() => {
    setIsSupported(
      typeof window !== "undefined" &&
        typeof MediaRecorder !== "undefined" &&
        Boolean(navigator.mediaDevices?.getUserMedia) &&
        Boolean(pickMimeType())
    );
  }, []);

  useEffect(() => {
    if (isListening && !isPaused) {
      timerIntervalRef.current = setInterval(() => setElapsedSeconds((p) => p + 1), 1000);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isListening, isPaused]);

  // ---------------------------------------------------------------- analyser
  const cleanupAudio = useCallback(() => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
    mediaStreamRef.current?.getTracks().forEach((t) => t.stop());
    mediaStreamRef.current = null;
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
    }
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyData(new Array(BINS).fill(0.05));
  }, []);

  const attachAnalyser = useCallback((stream: MediaStream) => {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx: AudioContext = new Ctx();
    audioContextRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.75;
    analyserRef.current = analyser;
    ctx.createMediaStreamSource(stream).connect(analyser);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      if (!analyserRef.current) return;
      analyserRef.current.getByteFrequencyData(data);
      let sum = 0;
      for (let i = 0; i < data.length; i++) sum += data[i];
      setAudioLevel(Math.min(1, sum / data.length / 128));
      const step = Math.max(1, Math.floor(data.length / BINS));
      setFrequencyData(Array.from({ length: BINS }, (_, i) => Math.min(1, (data[Math.min(i * step, data.length - 1)] / 255) * 1.35 + 0.05)));
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);
  }, []);

  // ---------------------------------------------------------- deepgram live
  const closeSocket = useCallback(() => {
    if (keepAliveRef.current) clearInterval(keepAliveRef.current);
    keepAliveRef.current = null;
    const ws = wsRef.current;
    wsRef.current = null;
    if (ws && ws.readyState === WebSocket.OPEN) {
      try {
        ws.send(JSON.stringify({ type: "CloseStream" }));
      } catch {
        /* closing anyway */
      }
    }
    ws?.close();
  }, []);

  const handleResults = useCallback((msg: any) => {
    const alt = msg?.channel?.alternatives?.[0];
    if (!alt) return;
    const transcript: string = (alt.transcript || "").trim();
    if (!msg.is_final) {
      setInterimTranscript(transcript);
      return;
    }
    setInterimTranscript("");
    if (!transcript) return;

    const words: any[] = Array.isArray(alt.words) ? alt.words : [];
    // Group consecutive words by diarized speaker into segments.
    const groups: { speaker: number; words: TranscriptWord[] }[] = [];
    for (const w of words) {
      const speaker = typeof w.speaker === "number" ? w.speaker : 0;
      const word: TranscriptWord = {
        text: w.punctuated_word || w.word || "",
        start: Number((w.start ?? 0).toFixed(2)),
        end: Number((w.end ?? 0).toFixed(2)),
      };
      const last = groups[groups.length - 1];
      if (last && last.speaker === speaker) last.words.push(word);
      else groups.push({ speaker, words: [word] });
    }
    if (groups.length === 0) {
      const start = Number((msg.start ?? elapsedSecondsRef.current).toFixed(2));
      groups.push({ speaker: 0, words: [{ text: transcript, start, end: start + Number(msg.duration || 1) }] });
    }
    const fresh: TranscriptSegment[] = groups.map((g) => ({
      id: `seg-live-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      speakerId: `spk-${g.speaker + 1}`,
      start: g.words[0].start,
      end: g.words[g.words.length - 1].end,
      text: g.words.map((w) => w.text).join(" "),
      words: g.words,
    }));
    setSegments((prev) => [...prev, ...fresh]);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setIsSimulating(false);
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    simulationTimerRef.current = null;

    if (!isSupported) {
      setError("This browser can't capture audio. Use 'Upload audio' or the simulator instead.");
      return;
    }

    setLiveStatus("connecting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        video: false,
      });
      mediaStreamRef.current = stream;
      attachAnalyser(stream);

      const tokenRes = await fetch("/api/deepgram/token", { method: "POST" });
      const token = await tokenRes.json();
      if (!tokenRes.ok || !token.key) throw new Error(token.error || "Could not get a Deepgram session key.");

      const mimeType = pickMimeType();
      mimeTypeRef.current = mimeType;
      chunksRef.current = [];

      await new Promise<void>((resolve, reject) => {
        const ws = new WebSocket(`${DEEPGRAM_WS}?${LIVE_PARAMS}`, ["token", token.key]);
        wsRef.current = ws;
        const failTimer = setTimeout(() => reject(new Error("Deepgram live connection timed out.")), 10000);

        ws.onopen = () => {
          clearTimeout(failTimer);
          const recorder = new MediaRecorder(stream, { mimeType });
          recorderRef.current = recorder;
          recorder.ondataavailable = (e) => {
            if (e.data.size === 0) return;
            chunksRef.current.push(e.data);
            if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(e.data);
          };
          recorder.start(CHUNK_MS);
          keepAliveRef.current = setInterval(() => {
            if (wsRef.current?.readyState === WebSocket.OPEN) wsRef.current.send(JSON.stringify({ type: "KeepAlive" }));
          }, KEEPALIVE_MS);
          setLiveStatus("live");
          resolve();
        };
        ws.onmessage = (evt) => {
          try {
            const msg = JSON.parse(evt.data);
            if (msg.type === "Results") handleResults(msg);
            else if (msg.type === "Error") setError(`Deepgram: ${msg.description || msg.message || "stream error"}`);
          } catch {
            /* non-JSON frame */
          }
        };
        ws.onerror = () => {
          clearTimeout(failTimer);
          reject(new Error("Deepgram live connection failed."));
        };
        ws.onclose = (evt) => {
          if (wsRef.current === ws) {
            wsRef.current = null;
            if (evt.code !== 1000) setLiveStatus("error");
          }
        };
      });

      setIsListening(true);
      setIsPaused(false);
    } catch (err: any) {
      cleanupAudio();
      closeSocket();
      setLiveStatus("error");
      setIsListening(false);
      const denied = err?.name === "NotAllowedError" || err?.name === "PermissionDeniedError";
      setError(denied ? "Microphone permission denied. Use 'Upload audio' to transcribe a file instead." : err?.message || "Could not start live transcription.");
    }
  }, [isSupported, attachAnalyser, handleResults, cleanupAudio, closeSocket]);

  const stopListening = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      try {
        recorder.stop();
      } catch {
        /* already stopped */
      }
    }
    recorderRef.current = null;
    closeSocket();
    cleanupAudio();
    setIsListening(false);
    setIsPaused(false);
    setIsSimulating(false);
    setInterimTranscript("");
    setLiveStatus("idle");
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    simulationTimerRef.current = null;
  }, [closeSocket, cleanupAudio]);

  const pauseListening = useCallback(() => {
    if (recorderRef.current?.state === "recording") recorderRef.current.pause();
    setIsPaused(true);
  }, []);

  const resumeListening = useCallback(() => {
    if (recorderRef.current?.state === "paused") recorderRef.current.resume();
    setIsPaused(false);
  }, []);

  const getRecordingBlob = useCallback(() => {
    if (chunksRef.current.length === 0) return null;
    return new Blob(chunksRef.current, { type: mimeTypeRef.current || "audio/webm" });
  }, []);

  // ------------------------------------------------------------- simulation
  const startSimulation = useCallback(
    (customDialogue?: SimulatedDialogueLine[]) => {
      cleanupAudio();
      closeSocket();
      const dialogue = customDialogue?.length ? customDialogue : SAMPLE_SIMULATION_DIALOGUE;
      simulationStateRef.current = { dialogue, lineIndex: 0, charIndex: 0, currentLineStartTime: elapsedSecondsRef.current };
      setIsListening(true);
      setIsPaused(false);
      setIsSimulating(true);
      setLiveStatus("idle");
      setError(null);
      setInterimTranscript("");
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);

      simulationTimerRef.current = setInterval(() => {
        const state = simulationStateRef.current;
        const line = state.dialogue[state.lineIndex];
        if (!line) {
          setInterimTranscript("");
          setAudioLevel(0.05);
          setFrequencyData(Array.from({ length: BINS }, () => 0.05 + Math.random() * 0.04));
          return;
        }
        state.charIndex += Math.floor(Math.random() * 5) + 4;
        if (state.charIndex < line.text.length) {
          setInterimTranscript(`[${line.speakerName}]: "${line.text.slice(0, state.charIndex)}..."`);
          const vol = 0.45 + Math.random() * 0.4;
          setAudioLevel(vol);
          setFrequencyData(Array.from({ length: BINS }, (_, i) => Math.min(1, Math.max(0.1, (Math.sin((i / BINS) * Math.PI) * 0.6 + Math.random() * 0.4) * vol + 0.1))));
          return;
        }
        const end = Math.max(elapsedSecondsRef.current, state.currentLineStartTime + 2);
        const dur = Math.max(1.5, end - state.currentLineStartTime);
        const list = line.text.split(/\s+/);
        const wd = dur / Math.max(1, list.length);
        const words: TranscriptWord[] = list.map((w, i) => ({
          text: w,
          start: Number((state.currentLineStartTime + i * wd).toFixed(2)),
          end: Number((state.currentLineStartTime + (i + 1) * wd).toFixed(2)),
        }));
        setSegments((prev) => [
          ...prev,
          { id: `seg-sim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, speakerId: line.speakerId, start: state.currentLineStartTime, end, text: line.text, words },
        ]);
        setInterimTranscript("");
        setAudioLevel(0.08);
        setFrequencyData(Array.from({ length: BINS }, () => 0.05 + Math.random() * 0.05));
        state.lineIndex = (state.lineIndex + 1) % state.dialogue.length;
        state.charIndex = 0;
        state.currentLineStartTime = elapsedSecondsRef.current + 1;
      }, 180);
    },
    [cleanupAudio, closeSocket]
  );

  const stopSimulation = useCallback(() => {
    if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
    simulationTimerRef.current = null;
    setIsSimulating(false);
    setIsListening(false);
    setInterimTranscript("");
    setAudioLevel(0);
    setFrequencyData(new Array(BINS).fill(0.05));
  }, []);

  const resetRecording = useCallback(() => {
    stopListening();
    stopSimulation();
    chunksRef.current = [];
    setSegments([]);
    setInterimTranscript("");
    setElapsedSeconds(0);
    setError(null);
  }, [stopListening, stopSimulation]);

  useEffect(
    () => () => {
      cleanupAudio();
      closeSocket();
      if (simulationTimerRef.current) clearInterval(simulationTimerRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    },
    [cleanupAudio, closeSocket]
  );

  return {
    isSupported,
    isListening,
    isPaused,
    isSimulating,
    liveStatus,
    elapsedSeconds,
    interimTranscript,
    segments,
    transcriptText: segments.map((s) => `[${s.speakerId}]: ${s.text}`).join("\n"),
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
    setSegments,
    getRecordingBlob,
  };
}
