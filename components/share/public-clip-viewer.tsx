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
    const vid = videoRef.current;
    if (!vid) return;

    vid.playbackRate = playbackRate;
    vid.muted = isMuted;
    vid.volume = volume;

    if (Math.abs(vid.currentTime - currentTime) > 0.3) {
      vid.currentTime = currentTime;
    }

    if (isPlaying && vid.paused) {
      vid.play().catch(() => {});
    } else if (!isPlaying && !vid.paused) {
      vid.pause();
    }
  }, [isPlaying, currentTime, playbackRate, isMuted, volume]);

  // Auto-scroll transcript to active word
  useEffect(() => {
    if (activeWordRef.current && transcriptContainerRef.current) {
      activeWordRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "nearest",
      });
    }
  }, [currentTime]);

  const handleTogglePlay = () => {
    if (currentTime >= clipEnd) {
      setCurrentTime(clipStart);
    }
    setIsPlaying(!isPlaying);
  };

  const handleRestart = () => {
    setCurrentTime(clipStart);
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.currentTime = clipStart;
      videoRef.current.play().catch(() => {});
    }
  };

  const seekClip = (time: number) => {
    const clamped = Math.max(clipStart, Math.min(clipEnd, time));
    setCurrentTime(clamped);
    if (videoRef.current) {
      videoRef.current.currentTime = clamped;
    }
  };

  const handleVideoTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    if (t >= clipEnd) {
      if (isLooping) {
        seekClip(clipStart);
        videoRef.current.play().catch(() => {});
      } else {
        setIsPlaying(false);
        videoRef.current.pause();
      }
    }
  };

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
    <div className="min-h-screen bg-surface-raised text-white flex flex-col font-sans selection:bg-white/15 selection:text-white">
      {/* Demo notice banner if fallback */}
      {isDemoFallback && (
        <div className="w-full border-b border-white/15 bg-white/10 px-4 py-2 text-center text-[13px] font-medium text-white/80">
          Guest Preview: Demo benchmark highlight active
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-white/15 bg-surface-raised/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shadow-sm">
                <span className="text-base font-bold">F</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  Fathom · guest clip
                  <span className="rounded-xl border border-white/15 bg-white/10 px-1.5 py-0.2 text-[9px] font-semibold text-white/80">
                    Public
                  </span>
                </span>
                <span className="text-[10px] text-white/60 font-medium">
                  AI Meeting Intelligence
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
                "h-9 flex items-center gap-1.5 rounded-xl border border-white/15 px-3 text-[13px] font-medium transition-all shadow-sm",
                copiedLink
                  ? "bg-white text-black border-white"
                  : "bg-transparent text-white/90 hover:bg-white/5 hover:border-white/25"
              )}
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>Link copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Copy clip link</span>
                  <span className="sm:hidden">Copy</span>
                </>
              )}
            </button>

            <Link
              href={`/meetings/${meeting.id}`}
              className="h-9 inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface-raised px-3 text-[13px] font-medium text-white/90 shadow-sm hover:bg-white/5 hover:border-white/25 transition-all"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Full meeting</span>
              <span className="sm:hidden">Full</span>
            </Link>

            <Link
              href="/"
              className="h-9 inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 text-[13px] font-medium text-black shadow-sm hover:bg-white/90 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Try Fathom</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Clip Title & Meeting Header */}
        <div className="space-y-2 border-b border-white/15 pb-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
            <span className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-surface-raised px-2.5 py-0.5 text-white shadow-sm">
              <Sparkles className="h-3 w-3" />
              Key moment clip
            </span>

            <span className="flex items-center gap-1 rounded-xl border border-white/15 bg-surface-raised px-2.5 py-0.5 text-white/80 shadow-sm">
              <Clock className="h-3 w-3" />
              {formatTime(clipDuration)} ({clipDuration}S)
            </span>

            <span className="rounded-xl border border-white/15 bg-white/10 px-2.5 py-0.5 text-white/70">
              {formatTime(clipStart)} – {formatTime(clipEnd)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {displayTitle}
          </h1>

          <p className="text-xs text-white/60 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>From: <strong className="text-white font-semibold">{meeting.title}</strong></span>
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
            <div className="rounded-2xl border border-white/15 bg-surface-raised overflow-hidden">
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
                  <div className="w-full h-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-black">
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
                            "relative rounded-xl border flex flex-col items-center justify-center p-3 transition-all duration-200",
                            isActive
                              ? "bg-zinc-800 border-zinc-400 text-white ring-2 ring-white/30 shadow-md"
                              : "bg-black border-zinc-800 text-white/35"
                          )}
                        >
                          <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border border-zinc-700 shadow-sm">
                            {speaker.avatarUrl && (
                              <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                            )}
                            <AvatarFallback
                              style={{ backgroundColor: speaker.color || "#27272a" }}
                              className="text-xs font-bold text-white"
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="mt-2 text-center min-w-0 px-1">
                            <p className="font-sans text-xs font-medium text-zinc-100 truncate">
                              {speaker.name}
                            </p>
                            <p className="text-[9px] text-white/45 truncate">
                              {speaker.role || speaker.company || "Participant"}
                            </p>
                          </div>

                          {isActive && (
                            <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 rounded-full border border-white/20 bg-black/70 px-1.5 py-0.5 text-[8px] font-semibold text-white/80">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Speaking
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
                    className="absolute inset-0 m-auto h-16 w-16 rounded-xl border border-zinc-700 bg-surface-raised text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                    aria-label="Play Clip"
                  >
                    <Play className="h-7 w-7 fill-zinc-950 translate-x-0.5" />
                  </button>
                )}

                {/* Top Overlay Mode Selector */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 rounded-xl border border-zinc-700 bg-white/90 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("gallery")}
                    className={cn(
                      "flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold transition-colors",
                      viewMode === "gallery"
                        ? "bg-white text-black"
                        : "text-white/45 hover:text-white"
                    )}
                  >
                    <LayoutGrid className="h-3 w-3" />
                    <span>Gallery</span>
                  </button>

                  {meeting.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setViewMode("video")}
                      className={cn(
                        "flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-semibold transition-colors",
                        viewMode === "video"
                          ? "bg-white text-black"
                          : "text-white/45 hover:text-white"
                      )}
                    >
                      <VideoIcon className="h-3 w-3" />
                      <span>Video</span>
                    </button>
                  )}
                </div>

                {/* Bottom Player Controls Bar */}
                <div className="relative z-30 bg-black border-t border-white/15 p-3 space-y-2">
                  {/* Bounded Clip Progress Scrubber */}
                  <div
                    className="group/scrub relative h-2 w-full cursor-pointer rounded-sm bg-white/10 border border-white/15 hover:h-2.5 transition-all"
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
                      className="absolute inset-y-0 left-0 rounded-sm bg-white"
                      style={{ width: `${progressPercent}%` }}
                    />

                    {/* Scrubber thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3 rounded-sm border border-zinc-700 bg-white shadow-sm scale-0 group-hover/scrub:scale-100 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Buttons & Time row */}
                  <div className="flex items-center justify-between text-xs text-white">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="h-8 w-8 flex items-center justify-center rounded-xl border border-white/15 bg-surface-raised shadow-sm hover:bg-white/5 active:scale-95 transition-all"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4 fill-zinc-950 translate-x-0.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleRestart}
                        className="h-8 w-8 flex items-center justify-center rounded-xl border border-white/15 bg-surface-raised shadow-sm hover:bg-white/5 active:scale-95 transition-all"
                        title="Restart Clip"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsLooping(!isLooping)}
                        className={cn(
                          "h-8 w-8 flex items-center justify-center rounded-xl border border-white/15 shadow-sm active:scale-95 transition-all",
                          isLooping
                            ? "bg-white text-black border-white"
                            : "bg-surface-raised text-white/80 hover:bg-white/5"
                        )}
                        title={isLooping ? "Disable Loop" : "Loop Clip"}
                      >
                        <Repeat className="h-3.5 w-3.5" />
                      </button>

                      {/* Time Readout */}
                      <span className="text-xs font-semibold text-white ml-1">
                        {formatTime(Math.max(0, currentTime - clipStart))} / {formatTime(clipDuration)}
                        <span className="text-white/60 ml-1 text-[11px] font-normal">
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
                        className="h-8 px-2 rounded-xl border border-white/15 bg-surface-raised text-xs font-medium shadow-sm hover:bg-white/5 active:scale-95 transition-all"
                        title="Change Speed"
                      >
                        {playbackRate}X
                      </button>

                      {/* Mute */}
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-8 w-8 flex items-center justify-center rounded-xl border border-white/15 bg-surface-raised shadow-sm hover:bg-white/5 active:scale-95 transition-all"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </button>

                      {/* Fullscreen */}
                      <button
                        type="button"
                        onClick={handleToggleFullscreen}
                        className="h-8 w-8 flex items-center justify-center rounded-xl border border-white/15 bg-surface-raised shadow-sm hover:bg-white/5 active:scale-95 transition-all"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendees / Speakers in Clip Details */}
            <div className="rounded-xl border border-white/15 bg-surface-raised p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3 border-b border-white/15 pb-2">
                <div className="flex items-center gap-2 text-[13px] font-medium text-white">
                  <Users className="h-4 w-4" />
                  <span>Speakers in this clip</span>
                </div>
                <span className="text-[11px] text-white/60">
                  {clipSpeakers.length} ATTENDEES PRESENT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {clipSpeakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="flex items-center gap-2.5 rounded-lg border border-white/15 bg-surface-raised p-2 text-xs shadow-sm"
                  >
                    <Avatar className="h-8 w-8 border border-white/15 shrink-0">
                      {spk.avatarUrl && <AvatarImage src={spk.avatarUrl} alt={spk.name} />}
                      <AvatarFallback
                        style={{ backgroundColor: spk.color || "#e4e4e7" }}
                        className="text-xs font-bold text-white/90"
                      >
                        {spk.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-sans font-medium text-white truncate">{spk.name}</p>
                      <p className="text-[10px] text-white/60 truncate">
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
            <div className="rounded-xl border border-white/15 bg-surface-raised shadow-black/[0.04] flex flex-col h-[540px] overflow-hidden">
              <div className="p-4 border-b border-white/15 bg-surface-raised flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4" />
                    <span>Clip transcript · karaoke sync</span>
                  </h3>
                  <p className="text-[10px] text-white/60 uppercase">
                    Click any word to seek playback
                  </p>
                </div>
                <span className="rounded-xl border border-white/15 bg-surface-raised px-2 py-0.5 text-[10px] font-semibold text-white/90 shadow-sm">
                  Live sync
                </span>
              </div>

              {/* Scrollable Transcript Lines */}
              <div
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 text-xs scroll-smooth"
              >
                {clipSegments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-white/45 p-6">
                    <MessageSquareQuote className="h-8 w-8 mb-2 stroke-[1.5]" />
                    <p className="font-medium text-xs">
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
                          "rounded-lg border p-3 transition-colors shadow-sm",
                          isSegmentActive
                            ? "bg-surface-raised border-zinc-400 ring-1 ring-white/30"
                            : "bg-surface-raised border-white/15"
                        )}
                      >
                        {/* Segment Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-sm border border-white/15 bg-white/10 px-1.5 py-0.2 text-[9px] font-semibold text-white/80">
                              {speaker?.name || "Speaker"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => seekClip(segment.start)}
                            className="rounded-sm border border-white/15 bg-surface-raised px-1.5 py-0.2 text-[10px] font-medium text-white/80 hover:bg-white/10 transition-colors"
                            title="Seek to start of segment"
                          >
                            {formatTime(segment.start)}
                          </button>
                        </div>

                        {/* Words with amber karaoke spotlighting */}
                        <p className="font-sans text-xs font-normal text-white leading-relaxed">
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
                                    "cursor-pointer rounded-sm px-0.5 py-0.5 transition-colors",
                                    isCurrentWord
                                      ? "bg-amber-400/30 text-white font-semibold"
                                      : "hover:bg-white/10"
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
                              className="cursor-pointer hover:bg-white/10"
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
              <div className="p-3 border-t border-white/15 bg-surface-raised flex items-center justify-between text-[11px] font-medium text-white/80">
                <span>Click words to seek</span>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="hover:underline flex items-center gap-1 font-semibold text-white"
                >
                  <RotateCcw className="h-3 w-3" />
                  Replay from start
                </button>
              </div>
            </div>

            {/* Viral CTA Card */}
            <div className="rounded-2xl border border-white/15 bg-surface-raised p-4 space-y-2.5 text-white">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl border border-white/15 bg-white/10 flex items-center justify-center text-white shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    Fathom workspace intelligence
                  </h4>
                  <p className="font-sans text-xs text-white/35 leading-snug mt-0.5">
                    Record, transcribe, highlight, and summarize meeting calls with 100% accuracy and zero AI slop.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Link
                  href="/"
                  className="flex-1 h-8 flex items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-black shadow-sm hover:bg-white/10 active:scale-95 transition-all"
                >
                  <span>Try Fathom free</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href={`/meetings/${meeting.id}`}
                  className="h-8 flex items-center justify-center rounded-xl border border-zinc-700 bg-white px-3 text-[13px] font-medium text-black hover:bg-white/90 active:scale-95 transition-all"
                >
                  Full video
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Guest Footer */}
      <footer className="border-t border-white/15 bg-surface-raised py-6 mt-8 text-xs text-white/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Fathom AI Inc. Public Guest Clip Player.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-white/80">
            <Link href="/" className="hover:text-white">
              Workspace
            </Link>
            <Link href={`/meetings/${meeting.id}`} className="hover:text-white">
              Full recording
            </Link>
            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:text-white"
            >
              Share link
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
