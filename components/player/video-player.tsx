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
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  // Quick 30s Highlight creation (HotKey: H)
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
    });

    showToast(`Highlight Saved: ${formatTime(start)} – ${formatTime(end)}`);
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

  // Synchronized Playback Loop
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
      video.play().catch(() => {});
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (Math.abs(video.currentTime - currentTime) > 0.8) {
      video.currentTime = currentTime;
    }
  }, [currentTime]);

  // Global Keyboard Shortcuts (Space, J, L, H, F, M) with input collision guards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
          "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/15 bg-black/70 shadow-2xl backdrop-blur-xl select-none font-mono",
          isFullscreen ? "h-screen w-screen rounded-none border-0 shadow-none" : "min-h-[460px] aspect-video",
          className
        )}
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-black/90 px-3.5 py-1.5 text-xs font-medium text-white shadow-xl backdrop-blur-xl">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Header Overlay Bar */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3.5 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-200",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/80">
              <Zap className="w-3 h-3 text-white" />
              <span>SPATIAL STAGE</span>
            </span>
            <span className="truncate text-xs font-medium text-white/70 max-w-[220px] sm:max-w-md">
              {currentMeeting?.title || "Meeting Recording"}
            </span>
          </div>

          {/* View Mode Toggle: Stage vs Stream */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/15 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewMode("gallery")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-all",
                viewMode === "gallery"
                  ? "bg-white text-black font-semibold shadow-sm"
                  : "text-white/60 hover:text-white"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Stage</span>
            </button>

            {currentMeeting?.videoUrl && (
              <button
                type="button"
                onClick={() => setViewMode("video")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium uppercase tracking-wider transition-all",
                  viewMode === "video"
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "text-white/60 hover:text-white"
                )}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Stream</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Canvas Area: Clean Video Tiles Grid */}
        <div
          className="relative flex-1 w-full h-full flex items-center justify-center bg-zinc-950 overflow-hidden"
          style={{
            perspective: "800px",
          }}
        >
          {viewMode === "gallery" ? (
            /* Multi-Participant Video Conference Grid */
            <div
              className="w-full h-full p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 gap-3.5 items-center justify-center"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
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
                    style={{
                      transform: isActive ? "translateZ(14px)" : "translateZ(0px)",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",
                    }}
                    className={cn(
                      "relative rounded-2xl flex flex-col items-center justify-center p-3 sm:p-4 select-none transition-all",
                      isActive
                        ? "border border-white/40 bg-white/10 ring-1 ring-white/50 shadow-2xl z-20 backdrop-blur-md"
                        : "border border-white/10 bg-black/40 opacity-80 hover:opacity-100 hover:border-white/25"
                    )}
                  >
                    {/* Participant Avatar */}
                    <div className="relative mb-2.5">
                      <Avatar
                        className={cn(
                          "h-12 w-12 sm:h-14 sm:w-14 rounded-2xl border transition-transform duration-200",
                          isActive
                            ? "border-white/60 scale-105"
                            : "border-white/15"
                        )}
                      >
                        {speaker.avatarUrl && (
                          <AvatarImage
                            src={speaker.avatarUrl}
                            alt={speaker.name}
                          />
                        )}
                        <AvatarFallback className="rounded-2xl bg-white/10 text-xs font-mono font-medium text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Active Speaking Indicator */}
                      {isActive && (
                        <span className="absolute -inset-1 rounded-2xl border border-white/40 animate-ping opacity-40 pointer-events-none" />
                      )}
                    </div>

                    {/* Speaker Name & Role */}
                    <div className="text-center px-1 max-w-full">
                      <p className={cn("truncate text-xs font-mono font-medium", isActive ? "text-white" : "text-white/80")}>
                        {speaker.name}
                      </p>
                      <p className="truncate text-[10px] font-mono text-white/40">
                        {speaker.role || "Participant"}
                      </p>
                    </div>

                    {/* Speaking Status Pill */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      {isActive ? (
                        <div className="flex items-center gap-1 rounded-lg border border-white/20 bg-white/15 px-1.5 py-0.5 text-[10px] font-mono font-medium text-white">
                          <Mic className="w-2.5 h-2.5 text-white" />
                          <span>ACTIVE</span>
                        </div>
                      ) : (
                        <div className="flex items-center rounded-lg border border-white/10 bg-black/40 px-1 py-0.5 text-white/30">
                          <MicOff className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Active Speaker Soundwave Equalizer */}
                    {isActive && isPlaying && (
                      <div className="absolute bottom-2.5 right-2 flex items-end gap-0.5 h-3 px-1">
                        <span className="w-0.5 h-2 bg-white rounded-xs animate-[pulse_0.35s_ease-in-out_infinite]" />
                        <span className="w-0.5 h-3 bg-white rounded-xs animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
                        <span className="w-0.5 h-1.5 bg-white rounded-xs animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
                        <span className="w-0.5 h-2.5 bg-white rounded-xs animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
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

          {/* Centered Rectangular Tactile Play Button when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute z-20 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-black/80 text-white shadow-2xl backdrop-blur-md hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all"
              aria-label="Play video"
            >
              <Play className="w-6 h-6 ml-0.5 fill-current" />
            </button>
          )}
        </div>

        {/* Bottom Tactile Controls Bar */}
        <div
          className={cn(
            "relative z-30 flex flex-col gap-2.5 p-3.5 bg-black/85 backdrop-blur-xl border-t border-white/15 transition-opacity duration-200",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Integrated Audio-Synchronized Video Scrubber */}
          <VideoScrubber
            currentTime={currentTime}
            duration={duration}
            highlights={currentMeeting?.highlights || []}
            onSeek={seekTo}
          />

          {/* Video Controls Bar Row */}
          <div className="flex items-center justify-between pt-0.5 font-mono">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume */}
            <div className="flex items-center gap-1.5">
              {/* Play / Pause Tactile Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-black shadow-sm hover:bg-white/90 active:scale-95 transition-all"
                    aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-black text-black" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-black text-black" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
                  {isPlaying ? "Pause (Space)" : "Play (Space)"}
                </TooltipContent>
              </Tooltip>

              {/* Jump -10s (J) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleJump(-10)}
                    className="flex h-8 items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 text-xs font-mono uppercase text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                    aria-label="Rewind 10s (J)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">-10s</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
                  Rewind 10s (J)
                </TooltipContent>
              </Tooltip>

              {/* Jump +10s (L) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleJump(10)}
                    className="flex h-8 items-center gap-1 rounded-xl border border-white/15 bg-white/10 px-2.5 text-xs font-mono uppercase text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                    aria-label="Forward 10s (L)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">+10s</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
                  Forward 10s (L)
                </TooltipContent>
              </Tooltip>

              {/* Volume Slider & Mute */}
              <div className="flex items-center gap-1.5 ml-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                      aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
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

            {/* Right Controls: Highlight (H), Speed Dropdown, Fullscreen (F) */}
            <div className="flex items-center gap-1.5">
              {/* Quick 30s Highlight Button (H) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCreate30sHighlight}
                    className="flex h-8 items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-mono uppercase text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Highlight</span>
                    <span className="rounded-sm border border-white/20 bg-white/10 px-1 py-0.2 font-mono text-[10px] text-white/70">H</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
                  Create 30s Highlight (H)
                </TooltipContent>
              </Tooltip>

              {/* Speed Selector Dropdown (1x, 1.25x, 1.5x, 2x) */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-3 text-xs font-mono text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                      >
                        {playbackRate}x
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
                    Playback speed
                  </TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="min-w-[5.5rem] rounded-2xl border border-white/15 bg-black/95 text-white backdrop-blur-2xl shadow-2xl p-1.5"
                >
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => setPlaybackRate(speed)}
                      className="flex items-center justify-between text-xs cursor-pointer rounded-xl px-2.5 py-1.5 hover:bg-white hover:text-black transition-colors"
                    >
                      <span>{speed}x</span>
                      {playbackRate === speed && (
                        <Check className="w-3.5 h-3.5 text-current" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Fullscreen Toggle (F) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white/80 hover:bg-white hover:text-black active:scale-95 transition-all"
                    aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4" />
                    ) : (
                      <Maximize className="w-4 h-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="rounded-xl border border-white/15 bg-black/95 text-white text-xs px-2.5 py-1 shadow-xl">
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
