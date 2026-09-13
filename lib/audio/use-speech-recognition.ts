"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TranscriptSegment, TranscriptWord } from "@/types/meeting";

export interface SimulatedDialogueLine {
  speakerId: string;
  speakerName: string;
  speakerColor: string;
  speakerRole: string;
  text: string;
}

export const SAMPLE_SIMULATION_DIALOGUE: SimulatedDialogueLine[] = [
  {
    speakerId: "spk-sim-1",
    speakerName: "Sarah Chen",
    speakerColor: "#3B82F6",
    speakerRole: "Staff Backend Engineer",
    text: "Welcome everyone to our Q3 architecture sync. We have three main items: p99 database latency, multi-region failover, and ambient mesh testing.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "Thanks Sarah. On the database side, during the last enterprise traffic spike, p99 latency degraded to 820 milliseconds due to socket exhaustion on the primary Aurora instance.",
  },
  {
    speakerId: "spk-sim-3",
    speakerName: "Priya Patel",
    speakerColor: "#8B5CF6",
    speakerRole: "VP of Product",
    text: "From our enterprise customer perspective, that caused 504 gateway errors for several key accounts. How quickly can we deploy connection pooling?",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "We can deploy AWS RDS Proxy with transaction-level connection pooling by Friday. That will stabilize sockets and offload ephemeral presence heartbeats to Redis.",
  },
  {
    speakerId: "spk-sim-1",
    speakerName: "Sarah Chen",
    speakerColor: "#3B82F6",
    speakerRole: "Staff Backend Engineer",
    text: "I will run the synthetic k6 load testing benchmark on the Redis cluster with a 50,000 RPS target by September 20th to guarantee p99 stays under 20ms.",
  },
  {
    speakerId: "spk-sim-4",
    speakerName: "Marcus Brody",
    speakerColor: "#F59E0B",
    speakerRole: "DevOps & SRE Lead",
    text: "On the networking side, we are migrating Envoy sidecars to Istio Ambient Mesh with eBPF ztunnel proxies. It trims 4ms of network hop latency.",
  },
  {
    speakerId: "spk-sim-2",
    speakerName: "Alex Rivera",
    speakerColor: "#10B981",
    speakerRole: "Principal Infrastructure Architect",
    text: "Excellent. I will also finish drafting the CockroachDB multi-region active-active RFC by September 22nd so we can review partition leaseholders.",
  },
];

export interface UseSpeechRecognitionOptions {
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
  defaultSpeakerId?: string;
  defaultSpeakerName?: string;
}

export interface UseSpeechRecognitionReturn {
  isSupported: boolean;
  isListening: boolean;
  isPaused: boolean;
  isSimulating: boolean;
  elapsedSeconds: number;
  interimTranscript: string;
  segments: TranscriptSegment[];
  transcriptText: string;
  audioLevel: number; // 0 to 1
  frequencyData: number[]; // Array of normalized frequency bins 0 to 1
  error: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  pauseListening: () => void;
  resumeListening: () => void;
  startSimulation: (customDialogue?: SimulatedDialogueLine[]) => void;
  stopSimulation: () => void;
  resetRecording: () => void;
  setSegments: React.Dispatch<React.SetStateAction<TranscriptSegment[]>>;
}

export function useSpeechRecognition({
  continuous = true,
  interimResults = true,
  lang = "en-US",
  defaultSpeakerId = "spk-user",
  defaultSpeakerName = "You (Speaker)",
}: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [frequencyData, setFrequencyData] = useState<number[]>(() =>
    new Array(24).fill(0.08)
  );
  const [error, setError] = useState<string | null>(null);

  // Refs for audio analysis & recognition lifecycle
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Simulation refs
  const simulationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const simulationStateRef = useRef<{
    dialogue: SimulatedDialogueLine[];
    lineIndex: number;
    charIndex: number;
    currentLineStartTime: number;
    isTyping: boolean;
  }>({
    dialogue: SAMPLE_SIMULATION_DIALOGUE,
    lineIndex: 0,
    charIndex: 0,
    currentLineStartTime: 0,
    isTyping: false,
  });

  // Track timestamps for accurate segment calculations
  const segmentStartTimeRef = useRef<number>(0);
  const elapsedSecondsRef = useRef<number>(0);
  elapsedSecondsRef.current = elapsedSeconds;

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      setIsSupported(Boolean(SpeechRecognitionClass));
    }
  }, []);

  // Timer interval ticker when listening or simulating
  useEffect(() => {
    if (isListening && !isPaused) {
      timerIntervalRef.current = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isListening, isPaused]);

  // Clean up audio context and stream
  const cleanupAudioAnalyser = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch {
        // ignore already closed
      }
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    setAudioLevel(0);
    setFrequencyData(new Array(24).fill(0.05));
  }, []);

  // Start microphone analysis
  const startAudioAnalyser = useCallback(async () => {
    cleanupAudioAnalyser();

    try {
      if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      mediaStreamRef.current = stream;

      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.75;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAnalysis = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Compute average amplitude (0 to 1)
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalizedLevel = Math.min(1, Math.max(0, avg / 128));
        setAudioLevel(normalizedLevel);

        // Sample 24 frequency bins for waveform visualization
        const bins = 24;
        const sampled: number[] = [];
        const step = Math.max(1, Math.floor(dataArray.length / bins));
        for (let i = 0; i < bins; i++) {
          const index = Math.min(i * step, dataArray.length - 1);
          const rawVal = dataArray[index] / 255;
          // Apply slight organic boost to make visualizer dynamic
          const boosted = Math.min(1, rawVal * 1.35 + 0.05);
          sampled.push(boosted);
        }
        setFrequencyData(sampled);

        animationFrameRef.current = requestAnimationFrame(updateAnalysis);
      };

      animationFrameRef.current = requestAnimationFrame(updateAnalysis);
    } catch (err: any) {
      console.warn("Microphone access for audio visualizer unavailable:", err);
      // Not a fatal speech recognition error, visualizer will fallback to simulated ambient motion
    }
  }, [cleanupAudioAnalyser]);

  // Handle finalize segment helper
  const finalizeSegment = useCallback(
    (text: string, speakerId = defaultSpeakerId) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const endTime = Math.max(elapsedSecondsRef.current, segmentStartTimeRef.current + 1);
      const startTime = segmentStartTimeRef.current;
      const duration = Math.max(0.5, endTime - startTime);

      // Construct individual word timestamps
      const rawWords = trimmed.split(/\s+/);
      const wordDuration = duration / Math.max(1, rawWords.length);
      const words: TranscriptWord[] = rawWords.map((wordText, i) => ({
        text: wordText,
        start: parseFloat((startTime + i * wordDuration).toFixed(2)),
        end: parseFloat((startTime + (i + 1) * wordDuration).toFixed(2)),
      }));

      const newSegment: TranscriptSegment = {
        id: `seg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        speakerId,
        start: startTime,
        end: endTime,
        text: trimmed,
        words,
      };

      setSegments((prev) => [...prev, newSegment]);
      segmentStartTimeRef.current = endTime;
      setInterimTranscript("");
    },
    [defaultSpeakerId]
  );

  // Initialize Web Speech Recognition
  const initSpeechRecognition = useCallback(() => {
    if (typeof window === "undefined") return null;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) return null;

    const recognition = new SpeechRecognitionClass();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onstart = () => {
      setError(null);
      segmentStartTimeRef.current = elapsedSecondsRef.current;
    };

    recognition.onresult = (event: any) => {
      let currentInterim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptChunk = result[0].transcript;

        if (result.isFinal) {
          finalizeSegment(transcriptChunk, defaultSpeakerId);
        } else {
          currentInterim += transcriptChunk;
        }
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.warn("Speech recognition event error:", event.error);
      if (event.error === "no-speech") {
        // Normal silence timeout, don't halt
        return;
      }
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError(
          "Microphone permission denied. Click 'Simulate Sample Meeting' to test recording without mic access."
        );
        setIsListening(false);
      } else {
        setError(`Speech recognition notice: ${event.error}`);
      }
    };

    recognition.onend = () => {
      // If user still wants to listen and is not paused/simulating, auto restart
      if (recognitionRef.current && isListening && !isPaused && !isSimulating) {
        try {
          recognition.start();
        } catch {
          // already starting or closed
        }
      }
    };

    return recognition;
  }, [
    continuous,
    interimResults,
    lang,
    defaultSpeakerId,
    finalizeSegment,
    isListening,
    isPaused,
    isSimulating,
  ]);

  // Start real microphone listening
  const startListening = useCallback(async () => {
    setError(null);
    setIsSimulating(false);

    // Stop any ongoing simulation
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }

    if (!isSupported) {
      setError(
        "Web Speech API is not supported in this browser. Switching to Sample Simulation mode."
      );
      startSimulation();
      return;
    }

    try {
      if (!recognitionRef.current) {
        recognitionRef.current = initSpeechRecognition();
      }

      await startAudioAnalyser();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e: any) {
          // In case start is called while already active
        }
      }

      setIsListening(true);
      setIsPaused(false);
    } catch (err: any) {
      setError(err?.message || "Failed to start microphone speech recognition.");
      setIsListening(false);
    }
  }, [initSpeechRecognition, isSupported, startAudioAnalyser]);

  // Stop real microphone listening
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
    }
    cleanupAudioAnalyser();
    setIsListening(false);
    setIsPaused(false);
    setIsSimulating(false);
    setInterimTranscript("");

    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
  }, [cleanupAudioAnalyser]);

  // Pause listening
  const pauseListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsPaused(true);
  }, []);

  // Resume listening
  const resumeListening = useCallback(() => {
    if (isSimulating) {
      setIsPaused(false);
      return;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch {
        // ignore
      }
    }
    setIsPaused(false);
  }, [isSimulating]);

  // ==========================================
  // Sample Audio Simulation Engine
  // ==========================================
  const startSimulation = useCallback(
    (customDialogue?: SimulatedDialogueLine[]) => {
      // Clean up mic analyzer if active
      cleanupAudioAnalyser();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }

      const dialogue =
        customDialogue && customDialogue.length > 0
          ? customDialogue
          : SAMPLE_SIMULATION_DIALOGUE;

      simulationStateRef.current = {
        dialogue,
        lineIndex: 0,
        charIndex: 0,
        currentLineStartTime: elapsedSecondsRef.current,
        isTyping: true,
      };

      setIsListening(true);
      setIsPaused(false);
      setIsSimulating(true);
      setError(null);
      setInterimTranscript("");

      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }

      // Stream dialogue characters in chunks to simulate realistic live transcription
      simulationTimerRef.current = setInterval(() => {
        const state = simulationStateRef.current;
        const currentLine = state.dialogue[state.lineIndex];

        if (!currentLine) {
          // Finished all dialogue lines; keep idling with faint waveform
          setInterimTranscript("");
          setAudioLevel(0.05);
          setFrequencyData(
            Array.from({ length: 24 }, () => 0.05 + Math.random() * 0.04)
          );
          return;
        }

        // Typing chunk progression (4 to 8 characters per tick ~ 60-80 WPM typing)
        state.charIndex += Math.floor(Math.random() * 5) + 4;

        if (state.charIndex < currentLine.text.length) {
          // Still streaming current line
          const partialText = currentLine.text.slice(0, state.charIndex);
          setInterimTranscript(
            `[${currentLine.speakerName}]: "${partialText}..."`
          );

          // Animate simulated audio frequency data to match active speech
          const simVolume = 0.45 + Math.random() * 0.4;
          setAudioLevel(simVolume);
          const dynamicBars = Array.from({ length: 24 }, (_, idx) => {
            const harmonic =
              Math.sin((idx / 24) * Math.PI) * 0.6 + Math.random() * 0.4;
            return Math.min(1, Math.max(0.1, harmonic * simVolume + 0.1));
          });
          setFrequencyData(dynamicBars);
        } else {
          // Finished line -> finalize segment
          const finalLineText = currentLine.text;
          const endTime = Math.max(
            elapsedSecondsRef.current,
            state.currentLineStartTime + 2
          );
          const duration = Math.max(1.5, endTime - state.currentLineStartTime);

          const wordsList = finalLineText.split(/\s+/);
          const wDuration = duration / Math.max(1, wordsList.length);
          const words: TranscriptWord[] = wordsList.map((w, i) => ({
            text: w,
            start: parseFloat(
              (state.currentLineStartTime + i * wDuration).toFixed(2)
            ),
            end: parseFloat(
              (state.currentLineStartTime + (i + 1) * wDuration).toFixed(2)
            ),
          }));

          const completedSegment: TranscriptSegment = {
            id: `seg-sim-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            speakerId: currentLine.speakerId,
            start: state.currentLineStartTime,
            end: endTime,
            text: finalLineText,
            words,
          };

          setSegments((prev) => [...prev, completedSegment]);
          setInterimTranscript("");

          // Brief conversational pause between speakers (waveform drops)
          setAudioLevel(0.08);
          setFrequencyData(
            Array.from({ length: 24 }, () => 0.05 + Math.random() * 0.05)
          );

          // Advance to next line
          state.lineIndex = (state.lineIndex + 1) % state.dialogue.length;
          state.charIndex = 0;
          state.currentLineStartTime = elapsedSecondsRef.current + 1;
        }
      }, 180);
    },
    [cleanupAudioAnalyser]
  );

  const stopSimulation = useCallback(() => {
    if (simulationTimerRef.current) {
      clearInterval(simulationTimerRef.current);
      simulationTimerRef.current = null;
    }
    setIsSimulating(false);
    setIsListening(false);
    setInterimTranscript("");
    setAudioLevel(0);
    setFrequencyData(new Array(24).fill(0.05));
  }, []);

  // Reset all state
  const resetRecording = useCallback(() => {
    stopListening();
    stopSimulation();
    setSegments([]);
    setInterimTranscript("");
    setElapsedSeconds(0);
    setError(null);
  }, [stopListening, stopSimulation]);

  // Aggregate full transcript text
  const transcriptText = segments
    .map((s) => `[${s.speakerId}]: ${s.text}`)
    .join("\n");

  // Unmount cleanup
  useEffect(() => {
    return () => {
      cleanupAudioAnalyser();
      if (simulationTimerRef.current) {
        clearInterval(simulationTimerRef.current);
      }
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, [cleanupAudioAnalyser]);

  return {
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
    setSegments,
  };
}
