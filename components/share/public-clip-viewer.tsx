"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Meeting, Speaker } from "@/types/meeting";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { formatTime } from "@/components/player/video-scrubber";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  ExternalLink,
  Clock,
  Users,
  Repeat,
  Video as VideoIcon,
  LayoutGrid,
  Sparkles,
  MessageSquareQuote,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PublicClipViewerProps {
  meeting: Meeting;
  startTime: number;
  endTime: number;
  clipTitle?: string;
  isDemoFallback?: boolean;
}

export function PublicClipViewer({
  meeting,
  startTime: rawStart,
  endTime: rawEnd,
  clipTitle,
  isDemoFallback = false,
}: PublicClipViewerProps) {
  // Normalize boundaries
  const totalDuration = meeting.duration || 3600;
  const clipStart = Math.max(0, Math.min(rawStart, totalDuration - 1));
  const clipEnd = Math.max(clipStart + 1, Math.min(rawEnd, totalDuration));
  const clipDuration = clipEnd - clipStart;

  const displayTitle = clipTitle || `Clip from ${meeting.title}`;

  // Playback state
  const [currentTime, setCurrentTime] = useState<number>(clipStart);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(1);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"gallery" | "video">(
    meeting.videoUrl ? "video" : "gallery"
  );
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const transcriptContainerRef = useRef<HTMLDivElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Filter transcript segments in [clipStart, clipEnd]
  const clipSegments = useMemo(() => {
    return meeting.transcript.filter(
      (segment) => segment.start < clipEnd && segment.end > clipStart
    );
  }, [meeting.transcript, clipStart, clipEnd]);

  // Speakers present in this clip
  const clipSpeakerIds = useMemo(() => {
    return new Set(clipSegments.map((s) => s.speakerId));
  }, [clipSegments]);

  const clipSpeakers = useMemo(() => {
    const list = meeting.participants.filter((p) => clipSpeakerIds.has(p.id));
    return list.length > 0 ? list : meeting.participants.slice(0, 3);
  }, [meeting.participants, clipSpeakerIds]);

  // Active speaker at current time
  const activeSpeakerId = useMemo(() => {
    const currentSeg = clipSegments.find(
      (s) => currentTime >= s.start && currentTime <= s.end
    );
    return currentSeg ? currentSeg.speakerId : null;
  }, [clipSegments, currentTime]);

  // Speaker map for quick lookups
  const speakerMap = useMemo(() => {
    const map = new Map<string, Speaker>();
    meeting.participants.forEach((p) => map.set(p.id, p));
    return map;
  }, [meeting.participants]);

  // Reset to start if bounds change
  useEffect(() => {
    setCurrentTime(clipStart);
    setIsPlaying(false);
  }, [clipStart, clipEnd]);

  // Playback Loop Animation Frame
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      const isVideoActive =
        viewMode === "video" &&
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended;

      if (!isVideoActive) {
        setCurrentTime((prev) => {
          const next = prev + delta * playbackRate;
          if (next >= clipEnd) {
            if (isLooping) {
              return clipStart;
            } else {
              setIsPlaying(false);
              return clipEnd;
            }
          }
          return next;
        });
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackRate, viewMode, clipStart, clipEnd, isLooping]);

  // Sync HTML5 video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      if (video.currentTime < clipStart || video.currentTime >= clipEnd) {
        video.currentTime = clipStart;
      }
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, clipStart, clipEnd]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = isMuted ? 0 : volume;
    video.muted = isMuted;
  }, [volume, isMuted]);

  const handleVideoTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    setCurrentTime(video.currentTime);

    if (video.currentTime >= clipEnd) {
      if (isLooping) {
        video.currentTime = clipStart;
        setCurrentTime(clipStart);
        video.play().catch(() => {});
      } else {
        video.pause();
        setIsPlaying(false);
        setCurrentTime(clipEnd);
      }
    }
  };

  const handleTogglePlay = () => {
    if (currentTime >= clipEnd) {
      seekClip(clipStart);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const seekClip = (targetTime: number) => {
    const clamped = Math.max(clipStart, Math.min(clipEnd, targetTime));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const handleRestart = () => {
    seekClip(clipStart);
    setIsPlaying(true);
  };

  // Auto-scroll active word into view inside transcript container
  useEffect(() => {
    if (activeWordRef.current && transcriptContainerRef.current) {
      const container = transcriptContainerRef.current;
      const element = activeWordRef.current;

      const containerTop = container.scrollTop;
      const containerBottom = containerTop + container.clientHeight;

      const elemTop = element.offsetTop;
      const elemBottom = elemTop + element.clientHeight;

      if (elemTop < containerTop + 40 || elemBottom > containerBottom - 40) {
        container.scrollTo({
          top: elemTop - container.clientHeight / 2 + 30,
          behavior: "smooth",
        });
      }
    }
  }, [currentTime]);

  const handleCopyLink = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleToggleFullscreen = async () => {
    if (!playerContainerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await playerContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Ignore
    }
  };

  const progressPercent =
    clipDuration > 0
      ? Math.max(0, Math.min(100, ((currentTime - clipStart) / clipDuration) * 100))
      : 0;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-black flex flex-col font-sans selection:bg-[#FEF08A] selection:text-black">
      {/* Demo notice banner if fallback */}
      {isDemoFallback && (
        <div className="w-full border-b-2 border-black bg-[#FEF08A] px-4 py-2 text-center font-mono text-xs font-black uppercase text-black">
          GUEST PREVIEW: DEMO BENCHMARK HIGHLIGHT ACTIVE
        </div>
      )}

      {/* Top Navbar: Editorial Brand & CTAs */}
      <header className="sticky top-0 z-40 border-b-2 border-black bg-[#FAF8F5]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-black shadow-neo-sm">
                <span className="font-mono text-base font-black text-white">F</span>
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs font-black uppercase tracking-wider text-black flex items-center gap-1.5">
                  FATHOM // GUEST CLIP
                  <span className="rounded border border-black bg-[#A7F3D0] px-1.5 py-0.2 font-mono text-[9px] font-black text-black">
                    ZERO LOGIN
                  </span>
                </span>
                <span className="font-mono text-[10px] text-neutral-600 uppercase font-bold">
                  AI MEETING INTELLIGENCE
                </span>
              </div>
            </Link>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className={cn(
                "h-9 flex items-center gap-1.5 rounded-md border-2 border-black px-3 font-mono text-xs font-black uppercase tracking-wider text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all",
                copiedLink ? "bg-[#A7F3D0]" : "bg-white hover:bg-[#FAF8F5]"
              )}
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>LINK COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">COPY CLIP LINK</span>
                  <span className="sm:hidden">COPY</span>
                </>
              )}
            </button>

            <Link
              href={`/meetings/${meeting.id}`}
              className="h-9 inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#BAE6FD] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">FULL MEETING</span>
              <span className="sm:hidden">FULL</span>
            </Link>

            <Link
              href="/"
              className="h-9 inline-flex items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-3.5 font-mono text-xs font-black uppercase text-black shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>TRY FATHOM</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Clip Title & Meeting Header */}
        <div className="space-y-2 border-b-2 border-black pb-5">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-black">
            <span className="flex items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-2.5 py-0.5 uppercase text-black shadow-neo-sm">
              <Sparkles className="h-3 w-3 stroke-[2.5]" />
              KEY MOMENT CLIP
            </span>

            <span className="flex items-center gap-1 rounded-md border-2 border-black bg-white px-2.5 py-0.5 uppercase text-black shadow-neo-sm">
              <Clock className="h-3 w-3 stroke-[2.5]" />
              {formatTime(clipDuration)} ({clipDuration}S)
            </span>

            <span className="rounded-md border-2 border-black bg-[#FAF8F5] px-2.5 py-0.5 uppercase text-neutral-800 shadow-neo-sm">
              {formatTime(clipStart)} – {formatTime(clipEnd)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-black">
            {displayTitle}
          </h1>

          <p className="font-mono text-xs font-bold uppercase text-neutral-600 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>FROM: <strong className="text-black">{meeting.title}</strong></span>
            <span>•</span>
            <span>{new Date(meeting.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
            <span>•</span>
            <span>{clipSpeakers.length} SPEAKERS IN CLIP</span>
          </p>
        </div>

        {/* 2-Column Split: Player (left 7 cols) & Synchronized Transcript (right 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Video Player Card */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-xl border-2 border-black bg-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
              <div
                ref={playerContainerRef}
                className="relative aspect-video w-full bg-black flex flex-col justify-between overflow-hidden select-none group"
              >
                {/* Media Canvas */}
                {viewMode === "video" && meeting.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={meeting.videoUrl}
                    className="h-full w-full object-cover"
                    playsInline
                    onTimeUpdate={handleVideoTimeUpdate}
                    onClick={handleTogglePlay}
                  />
                ) : (
                  /* Multi-Speaker Gallery */
                  <div className="w-full h-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-neutral-900">
                    {clipSpeakers.map((speaker) => {
                      const isActive = activeSpeakerId === speaker.id;
                      const initials = speaker.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <div
                          key={speaker.id}
                          className={cn(
                            "relative rounded-xl border-2 border-black flex flex-col items-center justify-center p-3 transition-all duration-200",
                            isActive
                              ? "bg-[#FEF08A] text-black shadow-neo"
                              : "bg-white text-black"
                          )}
                        >
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-black shadow-neo-sm">
                            {speaker.avatarUrl && (
                              <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                            )}
                            <AvatarFallback
                              style={{ backgroundColor: speaker.color || "#DDD6FE" }}
                              className="font-mono text-xs font-black text-black"
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="mt-2 text-center min-w-0 px-1">
                            <p className="font-sans text-xs font-black text-black truncate">
                              {speaker.name}
                            </p>
                            <p className="font-mono text-[9px] font-bold uppercase text-neutral-600 truncate">
                              {speaker.role || speaker.company || "Participant"}
                            </p>
                          </div>

                          {isActive && (
                            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded border border-black bg-black px-1.5 py-0.2 font-mono text-[8px] font-black text-white">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#A7F3D0] animate-ping" />
                              SPEAKING
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Big Center Play Button Overlay if paused */}
                {!isPlaying && (
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full border-2 border-black bg-[#FEF08A] text-black flex items-center justify-center shadow-neo hover:scale-110 active:scale-95 transition-all z-20 cursor-pointer"
                    aria-label="Play Clip"
                  >
                    <Play className="h-7 w-7 fill-black translate-x-0.5" />
                  </button>
                )}

                {/* Top Overlay Mode Selector */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 rounded-md border-2 border-black bg-white p-1 shadow-neo-sm">
                  <button
                    type="button"
                    onClick={() => setViewMode("gallery")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase transition-colors",
                      viewMode === "gallery"
                        ? "bg-black text-white"
                        : "text-black hover:bg-[#FEF08A]"
                    )}
                  >
                    <LayoutGrid className="h-3 w-3" />
                    <span>GALLERY</span>
                  </button>

                  {meeting.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setViewMode("video")}
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-black uppercase transition-colors",
                        viewMode === "video"
                          ? "bg-black text-white"
                          : "text-black hover:bg-[#FEF08A]"
                      )}
                    >
                      <VideoIcon className="h-3 w-3" />
                      <span>VIDEO</span>
                    </button>
                  )}
                </div>

                {/* Bottom Player Controls Bar */}
                <div className="relative z-30 bg-white border-t-2 border-black p-3 space-y-2">
                  {/* Bounded Clip Progress Scrubber */}
                  <div
                    className="group/scrub relative h-3 w-full cursor-pointer rounded-full border-2 border-black bg-[#FAF8F5] hover:h-3.5 transition-all"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
                      const pct = clickX / rect.width;
                      const target = clipStart + pct * clipDuration;
                      seekClip(target);
                    }}
                  >
                    {/* Played fill */}
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-[#FEF08A] border-r-2 border-black"
                      style={{ width: `${progressPercent}%` }}
                    />

                    {/* Scrubber thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-black bg-white shadow-neo-sm scale-0 group-hover/scrub:scale-100 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Buttons & Time row */}
                  <div className="flex items-center justify-between font-mono text-xs text-black">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-white shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                          <Play className="h-4 w-4 fill-black translate-x-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-white shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title="Restart Clip"
                      >
                        <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsLooping(!isLooping)}
                        className={cn(
                          "h-8 w-8 flex items-center justify-center rounded border-2 border-black font-mono shadow-neo-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all",
                          isLooping
                            ? "bg-[#FEF08A] text-black"
                            : "bg-white text-black hover:bg-[#FAF8F5]"
                        )}
                        title={isLooping ? "Disable Loop" : "Loop Clip"}
                      >
                        <Repeat className="h-3.5 w-3.5 stroke-[2.5]" />
                      </button>

                      {/* Time Readout */}
                      <span className="font-mono text-xs font-black text-black ml-1">
                        {formatTime(Math.max(0, currentTime - clipStart))} / {formatTime(clipDuration)}
                        <span className="text-neutral-500 ml-1 text-[11px] font-bold">
                          ({formatTime(currentTime)})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Playback rate */}
                      <button
                        type="button"
                        onClick={() => {
                          const rates = [1, 1.25, 1.5, 2];
                          const idx = rates.indexOf(playbackRate);
                          const nextRate = rates[(idx + 1) % rates.length];
                          setPlaybackRate(nextRate);
                        }}
                        className="h-8 px-2 rounded border-2 border-black bg-white font-mono text-xs font-black shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title="Change Speed"
                      >
                        {playbackRate}X
                      </button>

                      {/* Mute */}
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-white shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                          <Volume2 className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>

                      {/* Fullscreen */}
                      <button
                        type="button"
                        onClick={handleToggleFullscreen}
                        className="h-8 w-8 flex items-center justify-center rounded border-2 border-black bg-white shadow-neo-sm hover:bg-[#FEF08A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4 stroke-[2.5]" />
                        ) : (
                          <Maximize2 className="h-4 w-4 stroke-[2.5]" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees / Speakers in Clip Details */}
            <div className="rounded-xl border-2 border-black bg-white p-4 shadow-neo-sm">
              <div className="flex items-center justify-between mb-3 border-b-2 border-black pb-2">
                <div className="flex items-center gap-2 font-mono text-xs font-black uppercase text-black">
                  <Users className="h-4 w-4 stroke-[2.5]" />
                  <span>SPEAKERS IN THIS CLIP</span>
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-600">
                  {clipSpeakers.length} ATTENDEES PRESENT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {clipSpeakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="flex items-center gap-2.5 rounded-lg border-2 border-black bg-[#FAF8F5] p-2 text-xs shadow-neo-sm"
                  >
                    <Avatar className="h-8 w-8 border-2 border-black shrink-0">
                      {spk.avatarUrl && <AvatarImage src={spk.avatarUrl} alt={spk.name} />}
                      <AvatarFallback
                        style={{ backgroundColor: spk.color || "#FEF08A" }}
                        className="font-mono text-xs font-black text-black"
                      >
                        {spk.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans font-bold text-black truncate">{spk.name}</p>
                      <p className="font-mono text-[10px] font-semibold text-neutral-600 uppercase truncate">
                        {spk.role || spk.company || "Attendee"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Synchronized Interactive Transcript Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_#000] flex flex-col h-[540px] overflow-hidden">
              <div className="p-4 border-b-2 border-black bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <h3 className="font-mono text-xs font-black uppercase text-black flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4 stroke-[2.5]" />
                    <span>CLIP TRANSCRIPT // KARAOKE SYNC</span>
                  </h3>
                  <p className="font-mono text-[10px] font-bold uppercase text-neutral-600">
                    CLICK ANY WORD TO SEEK PLAYBACK
                  </p>
                </div>
                <span className="rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[10px] font-black uppercase text-black shadow-neo-sm">
                  LIVE SYNC
                </span>
              </div>

              {/* Scrollable Transcript Lines */}
              <div
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs scroll-smooth"
              >
                {clipSegments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-neutral-500 p-6">
                    <MessageSquareQuote className="h-8 w-8 mb-2 stroke-[1.5]" />
                    <p className="font-bold uppercase text-xs">
                      No transcript segments in this interval.
                    </p>
                  </div>
                ) : (
                  clipSegments.map((segment) => {
                    const speaker = speakerMap.get(segment.speakerId);
                    const isSegmentActive =
                      currentTime >= segment.start && currentTime <= segment.end;

                    return (
                      <div
                        key={segment.id}
                        className={cn(
                          "rounded-lg border-2 border-black p-3 transition-colors shadow-neo-sm",
                          isSegmentActive
                            ? "bg-[#FEF08A]/25 ring-2 ring-black"
                            : "bg-[#FAF8F5]"
                        )}
                      >
                        {/* Segment Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded border border-black bg-[#DDD6FE] px-1.5 py-0.2 font-mono text-[9px] font-black uppercase">
                              {speaker?.name || "SPEAKER"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => seekClip(segment.start)}
                            className="rounded border border-black bg-white px-1.5 py-0.2 font-mono text-[10px] font-black text-black hover:bg-[#FEF08A] transition-colors"
                            title="Seek to start of segment"
                          >
                            {formatTime(segment.start)}
                          </button>
                        </div>

                        {/* Words with yellow karaoke highlighting */}
                        <p className="font-sans text-xs font-medium text-black leading-relaxed">
                          {segment.words && segment.words.length > 0 ? (
                            segment.words.map((word, wIdx) => {
                              const isCurrentWord =
                                currentTime >= word.start && currentTime <= word.end;

                              return (
                                <span
                                  key={wIdx}
                                  ref={isCurrentWord ? activeWordRef : null}
                                  onClick={() => seekClip(word.start)}
                                  className={cn(
                                    "cursor-pointer rounded px-0.5 py-0.5 transition-colors font-medium",
                                    isCurrentWord
                                      ? "bg-[#FEF08A] text-black font-black ring-2 ring-black shadow-neo-sm"
                                      : "hover:bg-neutral-200"
                                  )}
                                  title={`Seek to ${formatTime(word.start)}`}
                                >
                                  {word.text}{" "}
                                </span>
                              );
                            })
                          ) : (
                            <span
                              onClick={() => seekClip(segment.start)}
                              className="cursor-pointer hover:bg-[#FEF08A]"
                            >
                              {segment.text}
                            </span>
                          )}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Quick Seek Action */}
              <div className="p-3 border-t-2 border-black bg-[#FAF8F5] flex items-center justify-between font-mono text-[11px] font-bold text-black">
                <span>CLICK WORDS TO SEEK</span>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="hover:underline flex items-center gap-1 font-black"
                >
                  <RotateCcw className="h-3 w-3 stroke-[2.5]" />
                  REPLAY FROM START
                </button>
              </div>
            </div>

            {/* Viral CTA Card */}
            <div className="rounded-xl border-2 border-black bg-[#A7F3D0] p-4 shadow-neo-sm space-y-2.5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-md border-2 border-black bg-white flex items-center justify-center text-black shrink-0 shadow-neo-sm">
                  <ShieldCheck className="h-5 w-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-mono text-xs font-black uppercase text-black">
                    FATHOM WORKSPACE INTELLIGENCE
                  </h4>
                  <p className="font-sans text-xs font-medium text-neutral-800 leading-snug">
                    Record, transcribe, highlight, and summarize meeting calls with 100% accuracy and zero AI slop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/"
                  className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-md border-2 border-black bg-black px-3 font-mono text-xs font-black uppercase text-white shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  <span>TRY FATHOM FREE</span>
                  <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
                </Link>
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="h-8 flex items-center justify-center rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
                >
                  FULL VIDEO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest Footer */}
      <footer className="border-t-2 border-black bg-white py-6 mt-8 font-mono text-xs font-bold uppercase text-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 FATHOM AI INC. PUBLIC GUEST CLIP PLAYER.</p>
          <div className="flex items-center gap-4 text-xs font-black">
            <Link href="/" className="hover:underline">
              WORKSPACE
            </Link>
            <Link href={`/meetings/${meeting.id}`} className="hover:underline">
              FULL RECORDING
            </Link>
            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:underline"
            >
              SHARE LINK
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
