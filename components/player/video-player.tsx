"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Volume2,
  Volume1,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles,
  LayoutGrid,
  Video as VideoIcon,
  Mic,
  MicOff,
  Check,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { VideoScrubber, formatTime } from "./video-scrubber";
import { cn } from "@/lib/utils";

const PLAYBACK_SPEEDS = [0.75, 1, 1.25, 1.5, 1.75, 2];

export interface VideoPlayerProps {
  className?: string;
  autoPlay?: boolean;
}

export function VideoPlayer({ className }: VideoPlayerProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const currentTime = useMeetingStore((s) => s.currentTime);
  const isPlaying = useMeetingStore((s) => s.isPlaying);
  const playbackRate = useMeetingStore((s) => s.playbackRate);

  const setCurrentTime = useMeetingStore((s) => s.setCurrentTime);
  const setIsPlaying = useMeetingStore((s) => s.setIsPlaying);
  const setPlaybackRate = useMeetingStore((s) => s.setPlaybackRate);
  const seekTo = useMeetingStore((s) => s.seekTo);
  const addHighlight = useMeetingStore((s) => s.addHighlight);

  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"gallery" | "video">("gallery");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = currentMeeting?.duration || 100;
  const participants = currentMeeting?.participants || [];

  // Determine currently active speaker based on transcript segment
  const activeSpeaker = useMemo(() => {
    if (!currentMeeting?.transcript) return null;
    const seg = currentMeeting.transcript.find(
      (s) => s.start <= currentTime && currentTime <= s.end
    );
    if (!seg) return null;
    return participants.find((p) => p.id === seg.speakerId) || null;
  }, [currentMeeting, currentTime, participants]);

  // Show Toast Notification
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  }, []);

  // Quick 30s Highlight creation
  const handleCreate30sHighlight = useCallback(() => {
    if (!currentMeeting) return;
    const end = Math.min(duration, currentTime);
    const start = Math.max(0, end - 30);
    const title = `Highlight at ${formatTime(end)}`;

    addHighlight(currentMeeting.id, {
      title,
      start,
      end,
      category: "key_moment",
      color: "#F59E0B",
    });

    showToast(`✨ Created 30s Highlight (${formatTime(start)} – ${formatTime(end)})`);
  }, [currentMeeting, currentTime, duration, addHighlight, showToast]);

  // Jump handlers
  const handleJump = useCallback(
    (seconds: number) => {
      seekTo(Math.max(0, Math.min(duration, currentTime + seconds)));
    },
    [currentTime, duration, seekTo]
  );

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying, setIsPlaying]);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Ignore fullscreen permission errors
    }
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Auto-hide controls when playing in fullscreen or video view
  const handleActivity = () => {
    setControlsVisible(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    if (isPlaying) {
      hideControlsTimerRef.current = setTimeout(() => {
        setControlsVisible(false);
      }, 3500);
    }
  };

  // Synchronized Playback Loop (drives time when in Zoom Gallery mode or when video is detached)
  useEffect(() => {
    if (!isPlaying) return;

    let animId: number;
    lastTimeRef.current = performance.now();

    const tick = (now: number) => {
      const delta = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      // Only advance time artificially if video is NOT actively playing natively
      const isVideoActive =
        viewMode === "video" &&
        videoRef.current &&
        !videoRef.current.paused &&
        !videoRef.current.ended;

      if (!isVideoActive) {
        const cur = useMeetingStore.getState().currentTime;
        const dur = useMeetingStore.getState().currentMeeting?.duration || 100;
        const nextTime = Math.min(dur, cur + delta * playbackRate);

        setCurrentTime(nextTime);

        if (nextTime >= dur) {
          setIsPlaying(false);
          return;
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, playbackRate, viewMode, setCurrentTime, setIsPlaying]);

  // Synchronize HTML5 video element when in Video View
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.play().catch(() => {
        // Autoplay may be blocked; fall back gracefully
      });
    } else {
      video.pause();
    }
  }, [isPlaying]);

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

  // Synchronize video currentTime if drifted
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - currentTime) > 0.8) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Global Keyboard Shortcuts (Space, J, L, H, F, M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when user is typing in inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;
        case "KeyJ":
          e.preventDefault();
          handleJump(-10);
          break;
        case "KeyL":
          e.preventDefault();
          handleJump(10);
          break;
        case "KeyH":
          e.preventDefault();
          handleCreate30sHighlight();
          break;
        case "KeyF":
          e.preventDefault();
          toggleFullscreen();
          break;
        case "KeyM":
          e.preventDefault();
          toggleMute();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handleJump(-5);
          break;
        case "ArrowRight":
          e.preventDefault();
          handleJump(5);
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    togglePlay,
    handleJump,
    handleCreate30sHighlight,
    toggleFullscreen,
    toggleMute,
  ]);

  return (
    <TooltipProvider delayDuration={150}>
      <div
        ref={containerRef}
        onMouseMove={handleActivity}
        onMouseEnter={() => setControlsVisible(true)}
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl transition-all select-none",
          isFullscreen ? "h-screen w-screen rounded-none" : "min-h-[440px] aspect-video",
          className
        )}
      >
        {/* Floating Toast / Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/95 border border-indigo-500/50 px-4 py-1.5 text-xs font-medium text-white shadow-2xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Header Overlay Bar */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Badge
              variant="outline"
              className="bg-indigo-950/70 border-indigo-500/40 text-indigo-300 text-[11px] gap-1 px-2 py-0.5"
            >
              <Zap className="w-3 h-3 text-indigo-400 fill-indigo-400" />
              <span>Fathom Synced Player</span>
            </Badge>
            <span className="truncate text-xs font-medium text-slate-200">
              {currentMeeting?.title || "Meeting Recording"}
            </span>
          </div>

          {/* View Mode Toggle: Zoom Gallery vs Video */}
          <div className="flex items-center gap-1.5 bg-slate-900/80 p-0.5 rounded-lg border border-slate-800 backdrop-blur-sm">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => setViewMode("gallery")}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                    viewMode === "gallery"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white"
                  )}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Zoom Gallery</span>
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Multi-speaker Zoom tiles with live active speaker glow</TooltipContent>
            </Tooltip>

            {currentMeeting?.videoUrl && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => setViewMode("video")}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                      viewMode === "video"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>Video Stream</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Recorded video playback stream</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Main Canvas Area */}
        <div className="relative flex-1 w-full h-full flex items-center justify-center bg-slate-950 overflow-hidden">
          {viewMode === "gallery" ? (
            /* Multi-Speaker Zoom-Style Canvas Grid */
            <div className="w-full h-full p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {participants.map((speaker) => {
                const isActive = activeSpeaker?.id === speaker.id;
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
                      "relative rounded-xl flex flex-col items-center justify-center p-3 border transition-all duration-300 overflow-hidden select-none",
                      isActive
                        ? "bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/70 shadow-[0_0_24px_rgba(16,185,129,0.25)]"
                        : "bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900"
                    )}
                  >
                    {/* Participant Avatar */}
                    <div className="relative mb-2">
                      <Avatar
                        className={cn(
                          "h-14 w-14 sm:h-16 sm:w-16 border-2 transition-transform duration-300",
                          isActive ? "border-emerald-400 scale-105" : "border-slate-700"
                        )}
                      >
                        {speaker.avatarUrl && (
                          <AvatarImage src={speaker.avatarUrl} alt={speaker.name} />
                        )}
                        <AvatarFallback
                          style={{ backgroundColor: speaker.color }}
                          className="text-base font-bold text-white"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Speaking Glow Ring */}
                      {isActive && (
                        <span className="absolute -inset-1 rounded-full border-2 border-emerald-400/60 animate-ping" />
                      )}
                    </div>

                    {/* Speaker Name & Role */}
                    <div className="text-center px-1 max-w-full">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className="truncate text-xs font-semibold text-white">
                          {speaker.name}
                        </span>
                      </div>
                      <p className="truncate text-[10px] text-slate-400">
                        {speaker.role || "Participant"}
                      </p>
                    </div>

                    {/* Status Badges: Soundwave Equalizer or Mic Status */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[10px] border border-slate-800">
                      {isActive ? (
                        <div className="flex items-center gap-1">
                          <Mic className="w-3 h-3 text-emerald-400" />
                          <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase">
                            Speaking
                          </span>
                        </div>
                      ) : (
                        <MicOff className="w-3 h-3 text-slate-500" />
                      )}
                    </div>

                    {/* Active Speaker Soundwave Bars */}
                    {isActive && isPlaying && (
                      <div className="absolute bottom-2 right-2 flex items-end gap-0.5 h-3.5 px-1">
                        <span className="w-0.5 h-2 bg-emerald-400 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
                        <span className="w-0.5 h-3.5 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.1s]" />
                        <span className="w-0.5 h-1.5 bg-emerald-400 rounded-full animate-[pulse_0.5s_ease-in-out_infinite_0.2s]" />
                        <span className="w-0.5 h-3 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.15s]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* HTML5 Video Element */
            <video
              ref={videoRef}
              src={currentMeeting?.videoUrl}
              onClick={togglePlay}
              onTimeUpdate={() => {
                if (videoRef.current && isPlaying) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onEnded={() => setIsPlaying(false)}
              playsInline
              className="h-full w-full object-contain cursor-pointer"
            />
          )}

          {/* Centered Large Play Button when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute z-20 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white shadow-2xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95"
              aria-label="Play video"
            >
              <Play className="w-7 h-7 ml-1 fill-white" />
            </button>
          )}
        </div>

        {/* Bottom Floating Controls Bar */}
        <div
          className={cn(
            "relative z-30 flex flex-col gap-2 p-3 bg-gradient-to-t from-black/90 via-black/70 to-transparent transition-opacity duration-300",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Integrated Video Scrubber with highlight markers */}
          <VideoScrubber
            currentTime={currentTime}
            duration={duration}
            highlights={currentMeeting?.highlights || []}
            onSeek={seekTo}
          />

          {/* Playback Controls Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="h-8 w-8 p-0 text-white hover:bg-slate-800 hover:text-indigo-400"
                    aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-current" />
                    ) : (
                      <Play className="w-4 h-4 fill-current" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isPlaying ? "Pause (Space)" : "Play (Space)"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleJump(-10)}
                    className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
                    aria-label="Rewind 10s (J)"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Rewind 10s (J)</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleJump(10)}
                    className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
                    aria-label="Forward 10s (L)"
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Forward 10s (L)</TooltipContent>
              </Tooltip>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-1.5 ml-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={toggleMute}
                      className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
                      aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    {isMuted ? "Unmute (M)" : "Mute (M)"}
                  </TooltipContent>
                </Tooltip>

                <div className="w-16 sm:w-20 hidden sm:block">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    min={0}
                    max={1}
                    step={0.05}
                    onValueChange={([val]) => {
                      setVolume(val);
                      if (isMuted && val > 0) setIsMuted(false);
                    }}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Controls: Highlight (H), Speed Selector, Fullscreen */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Quick 30s Highlight button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreate30sHighlight}
                    className="h-8 px-2.5 gap-1.5 border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 text-xs font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Highlight</span>
                    <span className="font-mono text-[10px] text-amber-400/80">(H)</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  Bookmark the last 30s of conversation (HotKey: H)
                </TooltipContent>
              </Tooltip>

              {/* Speed Selector Dropdown */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs font-mono font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
                      >
                        {playbackRate}x
                      </Button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top">Playback speed</TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="min-w-[6rem] bg-slate-900 border-slate-800 text-slate-200"
                >
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => setPlaybackRate(speed)}
                      className="flex items-center justify-between text-xs cursor-pointer focus:bg-slate-800 focus:text-white"
                    >
                      <span>{speed}x</span>
                      {playbackRate === speed && (
                        <Check className="w-3.5 h-3.5 text-indigo-400" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen Toggle */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={toggleFullscreen}
                    className="h-8 w-8 p-0 text-slate-300 hover:bg-slate-800 hover:text-white"
                    aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
