"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { Meeting, TranscriptSegment, Speaker } from "@/types/meeting";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Share2,
  Sparkles,
  ExternalLink,
  Clock,
  Users,
  Repeat,
  Video as VideoIcon,
  LayoutGrid,
  ArrowRight,
  ChevronRight,
  MessageSquareQuote,
  ShieldCheck,
} from "lucide-react";

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

      // Check if video element is actively ticking
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
      // Ensure video is within clip bounds
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

  // Check video boundary
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
      // Restart from beginning if ended
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

  // Auto-scroll active word into view smoothly inside transcript container
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

  // Copy clip share link
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

  // Fullscreen
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500/30">
      {/* Demo notice banner if fallback */}
      {isDemoFallback && (
        <div className="w-full bg-indigo-950/80 border-b border-indigo-500/30 px-4 py-2 text-center text-xs text-indigo-200">
          <span className="font-semibold text-indigo-300">Guest Preview:</span> Meeting
          record not found in local cache; displaying benchmark recording highlight.
        </div>
      )}

      {/* Top Navbar: Brand & CTAs */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16">
          {/* Fathom Brand */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-transform active:scale-95"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30 text-white font-black text-lg">
                F
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  Fathom
                  <Badge
                    variant="outline"
                    className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-[10px] px-1.5 py-0 uppercase font-mono tracking-wider"
                  >
                    Guest View
                  </Badge>
                </span>
                <span className="text-[11px] text-slate-400">AI Meeting Intelligence</span>
              </div>
            </Link>
          </div>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white text-xs h-9 gap-1.5"
            >
              {copiedLink ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Copy Clip Link</span>
                  <span className="sm:hidden">Copy</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="border-slate-800 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white text-xs h-9 gap-1.5"
            >
              <Link href={`/meetings/${meeting.id}`}>
                <ExternalLink className="h-3.5 w-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Watch Full Meeting</span>
                <span className="sm:hidden">Full Meeting</span>
              </Link>
            </Button>

            <Button
              size="sm"
              asChild
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs h-9 px-3.5 shadow-md shadow-indigo-600/30 gap-1.5"
            >
              <Link href="/">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Try Fathom Free</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto flex-1 w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Clip Title & Meeting Header */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs px-2.5 py-0.5 font-medium flex items-center gap-1.5"
            >
              <Sparkles className="h-3 w-3" />
              Shared Highlight Clip
            </Badge>

            <Badge
              variant="outline"
              className="border-slate-800 bg-slate-900 text-slate-300 font-mono text-xs px-2.5 py-0.5 flex items-center gap-1"
            >
              <Clock className="h-3 w-3 text-slate-400" />
              {formatTime(clipDuration)} ({clipDuration}s)
            </Badge>

            <Badge
              variant="outline"
              className="border-slate-800 bg-slate-900 text-slate-400 font-mono text-xs px-2.5 py-0.5"
            >
              {formatTime(clipStart)} – {formatTime(clipEnd)}
            </Badge>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            {displayTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>From: <strong className="text-slate-200">{meeting.title}</strong></span>
            <span>•</span>
            <span>{new Date(meeting.date).toLocaleDateString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}</span>
            <span>•</span>
            <span>{clipSpeakers.length} speaker{clipSpeakers.length === 1 ? "" : "s"} in clip</span>
          </p>
        </div>

        {/* 2-Column Split: Player (left) & Synchronized Transcript (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Video Player Card (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <Card className="border-slate-800 bg-slate-900/60 overflow-hidden shadow-2xl rounded-2xl">
              <div
                ref={playerContainerRef}
                className="relative aspect-video w-full bg-slate-950 flex flex-col justify-between overflow-hidden select-none group"
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
                  /* Multi-Speaker Zoom-Style Gallery with Active Glow */
                  <div className="w-full h-full p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-950/95">
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
                          className={`relative rounded-xl flex flex-col items-center justify-center p-3 border transition-all duration-300 ${
                            isActive
                              ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/70 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                              : "bg-slate-900/70 border-slate-800/80"
                          }`}
                        >
                          <Avatar
                            className={`h-14 w-14 sm:h-16 sm:w-16 border-2 transition-transform duration-300 ${
                              isActive ? "border-emerald-400 scale-105" : "border-slate-700"
                            }`}
                          >
                            {speaker.avatarUrl && (
                              <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                            )}
                            <AvatarFallback
                              style={{ backgroundColor: speaker.color || "#6366F1" }}
                              className="text-base font-bold text-white"
                            >
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="mt-2 text-center min-w-0 px-1">
                            <p className="text-xs font-semibold text-slate-100 truncate">
                              {speaker.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {speaker.role || speaker.company || "Participant"}
                            </p>
                          </div>

                          {isActive && (
                            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 border border-emerald-500/40">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
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
                    className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur hover:scale-110 hover:bg-indigo-500 transition-all z-20"
                    aria-label="Play Clip"
                  >
                    <Play className="h-7 w-7 fill-white translate-x-0.5" />
                  </button>
                )}

                {/* Top Overlay Mode Selector */}
                <div className="absolute top-3 right-3 z-30 flex items-center gap-1 bg-slate-900/80 p-1 rounded-lg border border-slate-800 backdrop-blur-md opacity-90 hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => setViewMode("gallery")}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                      viewMode === "gallery"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <LayoutGrid className="h-3 w-3" />
                    <span>Gallery</span>
                  </button>

                  {meeting.videoUrl && (
                    <button
                      type="button"
                      onClick={() => setViewMode("video")}
                      className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        viewMode === "video"
                          ? "bg-indigo-600 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <VideoIcon className="h-3 w-3" />
                      <span>Video</span>
                    </button>
                  )}
                </div>

                {/* Bottom Player Controls Bar */}
                <div className="relative z-30 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-3 pt-6 space-y-2">
                  {/* Bounded Clip Progress Scrubber */}
                  <div
                    className="group/scrub relative h-2 w-full cursor-pointer rounded-full bg-slate-700/60 hover:h-2.5 transition-all"
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
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                      style={{ width: `${progressPercent}%` }}
                    />

                    {/* Scrubber thumb */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md border-2 border-indigo-500 scale-0 group-hover/scrub:scale-100 transition-transform"
                      style={{ left: `${progressPercent}%` }}
                    />
                  </div>

                  {/* Buttons & Time row */}
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleTogglePlay}
                        className="h-8 w-8 p-0 text-white hover:bg-white/10"
                        title={isPlaying ? "Pause" : "Play"}
                      >
                        {isPlaying ? (
                          <Pause className="h-4 w-4 fill-white" />
                        ) : (
                          <Play className="h-4 w-4 fill-white translate-x-0.5" />
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRestart}
                        className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                        title="Restart Clip"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsLooping(!isLooping)}
                        className={`h-8 w-8 p-0 hover:bg-white/10 ${
                          isLooping ? "text-indigo-400 bg-indigo-500/20" : "text-slate-400 hover:text-white"
                        }`}
                        title={isLooping ? "Disable Loop" : "Loop Clip"}
                      >
                        <Repeat className="h-3.5 w-3.5" />
                      </Button>

                      {/* Time Readout: Elapsed clip time & relative total */}
                      <span className="font-mono text-[11px] text-slate-300 ml-1">
                        {formatTime(Math.max(0, currentTime - clipStart))} / {formatTime(clipDuration)}
                        <span className="text-slate-500 ml-1 text-[10px]">
                          ({formatTime(currentTime)})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Playback rate cycle */}
                      <button
                        type="button"
                        onClick={() => {
                          const rates = [1, 1.25, 1.5, 2];
                          const idx = rates.indexOf(playbackRate);
                          const nextRate = rates[(idx + 1) % rates.length];
                          setPlaybackRate(nextRate);
                        }}
                        className="h-7 px-2 rounded font-mono text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                        title="Change Speed"
                      >
                        {playbackRate}x
                      </button>

                      {/* Mute toggle */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMuted(!isMuted)}
                        className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                        title={isMuted ? "Unmute" : "Mute"}
                      >
                        {isMuted ? (
                          <VolumeX className="h-4 w-4 text-rose-400" />
                        ) : (
                          <Volume2 className="h-4 w-4" />
                        )}
                      </Button>

                      {/* Fullscreen */}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleToggleFullscreen}
                        className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-white/10"
                        title="Toggle Fullscreen"
                      >
                        {isFullscreen ? (
                          <Minimize2 className="h-4 w-4" />
                        ) : (
                          <Maximize2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Attendees / Speakers in Clip Details */}
            <Card className="border-slate-800 bg-slate-900/50 p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-semibold text-slate-200">
                    Speakers in this Clip
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">
                  {clipSpeakers.length} participants speaking
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {clipSpeakers.map((spk) => (
                  <div
                    key={spk.id}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 text-xs"
                  >
                    <Avatar className="h-8 w-8 border border-slate-700">
                      {spk.avatarUrl && <AvatarImage src={spk.avatarUrl} alt={spk.name} />}
                      <AvatarFallback
                        style={{ backgroundColor: spk.color || "#6366F1" }}
                        className="text-xs font-bold text-white"
                      >
                        {spk.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-slate-200 truncate">{spk.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {spk.role || spk.company || "Attendee"}
                      </p>
                    </div>
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: spk.color || "#6366F1" }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right: Synchronized Interactive Transcript Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="border-slate-800 bg-slate-900/60 shadow-xl rounded-2xl flex flex-col h-[560px]">
              <CardHeader className="p-4 border-b border-slate-800/80 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4 text-indigo-400" />
                    Clip Transcript
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Synchronized word-level playback. Click any word to seek.
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-mono text-[10px] px-2 py-0.5"
                >
                  Live Sync
                </Badge>
              </CardHeader>

              {/* Scrollable Transcript Lines */}
              <div
                ref={transcriptContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 text-xs scroll-smooth"
              >
                {clipSegments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 p-6">
                    <MessageSquareQuote className="h-8 w-8 mb-2 opacity-40" />
                    <p>No transcript segments recorded in this clip interval.</p>
                  </div>
                ) : (
                  clipSegments.map((segment) => {
                    const speaker = speakerMap.get(segment.speakerId);
                    const isSegmentActive =
                      currentTime >= segment.start && currentTime <= segment.end;

                    return (
                      <div
                        key={segment.id}
                        className={`rounded-xl border p-3 transition-all ${
                          isSegmentActive
                            ? "border-indigo-500/50 bg-indigo-950/20 shadow-md shadow-indigo-950/40"
                            : "border-slate-800/70 bg-slate-950/50 hover:border-slate-700"
                        }`}
                      >
                        {/* Segment Header: Speaker & Timestamp */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: speaker?.color || "#6366F1" }}
                            />
                            <span className="font-semibold text-slate-200">
                              {speaker?.name || "Speaker"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => seekClip(segment.start)}
                            className="font-mono text-[10px] text-slate-400 hover:text-indigo-300 transition-colors"
                            title="Seek to start of segment"
                          >
                            {formatTime(segment.start)}
                          </button>
                        </div>

                        {/* Words with synchronized highlighting */}
                        <p className="text-slate-300 leading-relaxed text-xs">
                          {segment.words && segment.words.length > 0 ? (
                            segment.words.map((word, wIdx) => {
                              const isCurrentWord =
                                currentTime >= word.start && currentTime <= word.end;

                              return (
                                <span
                                  key={wIdx}
                                  ref={isCurrentWord ? activeWordRef : null}
                                  onClick={() => seekClip(word.start)}
                                  className={`cursor-pointer rounded px-0.5 py-0.5 transition-colors ${
                                    isCurrentWord
                                      ? "bg-indigo-500 text-white font-semibold shadow-sm"
                                      : "hover:bg-slate-800 hover:text-white"
                                  }`}
                                  title={`Seek to ${formatTime(word.start)}`}
                                >
                                  {word.text}{" "}
                                </span>
                              );
                            })
                          ) : (
                            <span
                              onClick={() => seekClip(segment.start)}
                              className="cursor-pointer hover:text-white"
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
              <CardFooter className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-400">
                <span>💡 Click words to jump playback directly</span>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Replay from start
                </button>
              </CardFooter>
            </Card>

            {/* Viral CTA Card: Try Fathom Free */}
            <Card className="border-indigo-500/30 bg-gradient-to-br from-indigo-950/70 via-slate-900 to-purple-950/40 p-4 rounded-xl shadow-xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    Never take meeting notes again
                  </h3>
                  <p className="text-[11px] text-slate-300 leading-normal">
                    Fathom records, transcribes, highlights, and summarizes your Zoom, Google Meet, and Teams calls with 100% accuracy.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  size="sm"
                  asChild
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold h-8 shadow-md shadow-indigo-600/30 gap-1.5"
                >
                  <Link href="/">
                    Try Fathom Free
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="shrink-0 border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white text-xs h-8"
                >
                  <Link href={`/meetings/${meeting.id}`}>
                    Full Video
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* Guest Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Fathom AI Inc. Public Guest Clip Player.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Fathom Workspace
            </Link>
            <Link href={`/meetings/${meeting.id}`} className="hover:text-slate-300 transition-colors">
              Full Meeting View
            </Link>
            <button
              type="button"
              onClick={handleCopyLink}
              className="hover:text-slate-300 transition-colors"
            >
              Share Clip
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
