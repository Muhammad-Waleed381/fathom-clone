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
      color: "#FEF08A",
    });

    showToast(`✨ Highlight Saved: ${formatTime(start)} – ${formatTime(end)}`);
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

  // Global Keyboard Shortcuts (Space, J, L, H, F, M)
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
          "group relative flex flex-col justify-between overflow-hidden rounded-xl border-2 border-black bg-neutral-950 shadow-[6px_6px_0px_0px_#000] select-none",
          isFullscreen ? "h-screen w-screen rounded-none border-0 shadow-none" : "min-h-[460px] aspect-video",
          className
        )}
      >
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
            <div className="flex items-center gap-2 rounded-md border-2 border-black bg-[#FEF08A] px-3.5 py-1.5 font-mono text-xs font-black text-black shadow-neo">
              <Sparkles className="w-4 h-4 text-black" />
              <span>{toastMessage}</span>
            </div>
          </div>
        )}

        {/* Top Header Overlay Bar */}
        <div
          className={cn(
            "absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent transition-opacity duration-200",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[10px] font-black uppercase tracking-wider text-black shadow-neo-sm">
              <Zap className="w-3 h-3 text-black fill-black" />
              <span>3D SPATIAL STAGE</span>
            </span>
            <span className="truncate font-mono text-xs font-bold text-white max-w-[220px] sm:max-w-md">
              {currentMeeting?.title || "Meeting Recording"}
            </span>
          </div>

          {/* View Mode Toggle: 3D Stage vs Video */}
          <div className="flex items-center gap-1 bg-black/80 p-1 rounded-lg border-2 border-black shadow-neo-sm">
            <button
              type="button"
              onClick={() => setViewMode("gallery")}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                viewMode === "gallery"
                  ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                  : "text-neutral-400 hover:text-white"
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>3D Stage</span>
            </button>

            {currentMeeting?.videoUrl && (
              <button
                type="button"
                onClick={() => setViewMode("video")}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono font-bold transition-all",
                  viewMode === "video"
                    ? "bg-[#FEF08A] text-black border border-black shadow-neo-sm"
                    : "text-neutral-400 hover:text-white"
                )}
              >
                <VideoIcon className="w-3.5 h-3.5" />
                <span>Stream</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Canvas Area: 3D Spatial Stage Canvas */}
        <div
          className="relative flex-1 w-full h-full flex items-center justify-center bg-neutral-950 overflow-hidden"
          style={{
            perspective: "800px",
          }}
        >
          {viewMode === "gallery" ? (
            /* Multi-Participant 3D Spatial Video Conference Grid */
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
                      transform: isActive ? "translateZ(18px)" : "translateZ(0px)",
                      transformStyle: "preserve-3d",
                      transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease",
                    }}
                    className={cn(
                      "relative rounded-xl flex flex-col items-center justify-center p-3 sm:p-4 select-none transition-colors",
                      isActive
                        ? "bg-neutral-900 border-2 border-black ring-2 ring-[#FEF08A] shadow-[0_16px_32px_rgba(0,0,0,0.8),_4px_4px_0px_0px_#000] z-20"
                        : "bg-neutral-900/80 border-2 border-black/70 shadow-neo-sm opacity-85 hover:opacity-100 hover:border-black"
                    )}
                  >
                    {/* Participant Avatar */}
                    <div className="relative mb-2.5">
                      <Avatar
                        className={cn(
                          "h-12 w-12 sm:h-16 sm:w-16 border-2 transition-transform duration-300",
                          isActive
                            ? "border-black scale-105 shadow-[0_0_16px_rgba(254,240,138,0.5)]"
                            : "border-neutral-700"
                        )}
                      >
                        {speaker.avatarUrl && (
                          <AvatarImage
                            src={speaker.avatarUrl}
                            alt={speaker.name}
                          />
                        )}
                        <AvatarFallback
                          style={{ backgroundColor: speaker.color || "#DDD6FE" }}
                          className="font-mono text-base font-black text-black"
                        >
                          {initials}
                        </AvatarFallback>
                      </Avatar>

                      {/* Active Speaking Pulsing Ring */}
                      {isActive && (
                        <span className="absolute -inset-1.5 rounded-full border-2 border-[#FEF08A] animate-ping opacity-60 pointer-events-none" />
                      )}
                    </div>

                    {/* Speaker Name & Role */}
                    <div className="text-center px-1 max-w-full">
                      <div className="flex items-center justify-center gap-1">
                        <span className={cn("truncate font-mono text-xs font-bold", isActive ? "text-[#FEF08A]" : "text-white")}>
                          {speaker.name}
                        </span>
                      </div>
                      <p className="truncate font-mono text-[10px] text-neutral-400">
                        {speaker.role || "Participant"}
                      </p>
                    </div>

                    {/* Speaking Status Pill */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      {isActive ? (
                        <div className="flex items-center gap-1 rounded border-2 border-black bg-[#FEF08A] px-1.5 py-0.5 font-mono text-[9px] font-black uppercase text-black shadow-neo-sm">
                          <Mic className="w-2.5 h-2.5 text-black" />
                          <span>SPEAKING</span>
                        </div>
                      ) : (
                        <div className="flex items-center rounded border border-neutral-700 bg-black/60 px-1 py-0.5 text-neutral-400">
                          <MicOff className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </div>

                    {/* Active Speaker Soundwave Equalizer */}
                    {isActive && isPlaying && (
                      <div className="absolute bottom-2.5 right-2 flex items-end gap-0.5 h-3.5 px-1">
                        <span className="w-1 h-2 bg-[#FEF08A] rounded-xs border border-black animate-[pulse_0.35s_ease-in-out_infinite]" />
                        <span className="w-1 h-3.5 bg-[#FEF08A] rounded-xs border border-black animate-[pulse_0.5s_ease-in-out_infinite_0.1s]" />
                        <span className="w-1 h-1.5 bg-[#FEF08A] rounded-xs border border-black animate-[pulse_0.4s_ease-in-out_infinite_0.2s]" />
                        <span className="w-1 h-3 bg-[#FEF08A] rounded-xs border border-black animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
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

          {/* Centered Tactile Large Play Button when paused */}
          {!isPlaying && (
            <button
              type="button"
              onClick={togglePlay}
              className="absolute z-20 flex h-16 w-16 items-center justify-center rounded-full border-2 border-black bg-[#FEF08A] text-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:scale-105 active:scale-95 transition-all"
              aria-label="Play video"
            >
              <Play className="w-7 h-7 ml-1 fill-black text-black" />
            </button>
          )}
        </div>

        {/* Bottom Tactile Controls Bar */}
        <div
          className={cn(
            "relative z-30 flex flex-col gap-2.5 p-3.5 bg-[#FAF8F5] border-t-2 border-black transition-opacity duration-200",
            controlsVisible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
        >
          {/* Integrated Physical Video Scrubber with highlight markers */}
          <VideoScrubber
            currentTime={currentTime}
            duration={duration}
            highlights={currentMeeting?.highlights || []}
            onSeek={seekTo}
          />

          {/* Tactile Video Controls Bar Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Left Controls: Play/Pause, -10s, +10s, Volume */}
            <div className="flex items-center gap-2">
              {/* Play / Pause Tactile Button */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-[#FEF08A] text-black shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
                    aria-label={isPlaying ? "Pause (Space)" : "Play (Space)"}
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4 fill-black text-black" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 fill-black text-black" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
                  {isPlaying ? "Pause (Space)" : "Play (Space)"}
                </TooltipContent>
              </Tooltip>

              {/* Jump -10s (J) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleJump(-10)}
                    className="flex h-9 items-center gap-1 rounded-md border-2 border-black bg-white px-2 text-xs font-mono font-bold text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
                    aria-label="Rewind 10s (J)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">-10s</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
                  Rewind 10s (J)
                </TooltipContent>
              </Tooltip>

              {/* Jump +10s (L) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={() => handleJump(10)}
                    className="flex h-9 items-center gap-1 rounded-md border-2 border-black bg-white px-2 text-xs font-mono font-bold text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 active:shadow-neo-sm transition-all"
                    aria-label="Forward 10s (L)"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">+10s</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
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
                      className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-white text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 transition-all"
                      aria-label={isMuted ? "Unmute (M)" : "Mute (M)"}
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="w-4 h-4 text-black" />
                      ) : volume < 0.5 ? (
                        <Volume1 className="w-4 h-4 text-black" />
                      ) : (
                        <Volume2 className="w-4 h-4 text-black" />
                      )}
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
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

            {/* Right Controls: Highlight (H), Speed Dropdown, Fullscreen */}
            <div className="flex items-center gap-2">
              {/* Quick 30s Highlight Button (H) */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCreate30sHighlight}
                    className="flex h-9 items-center gap-1.5 rounded-md border-2 border-black bg-[#FEF08A] px-2.5 font-mono text-xs font-black text-black shadow-neo-sm hover:shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-black" />
                    <span className="hidden sm:inline">Highlight</span>
                    <span className="rounded border border-black bg-white px-1 font-mono text-[10px]">H</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
                  Create 30s Highlight (HotKey: H)
                </TooltipContent>
              </Tooltip>

              {/* Speed Selector Dropdown (1x, 1.25x, 1.5x, 2x) */}
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-9 items-center justify-center rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-black text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 transition-all"
                      >
                        {playbackRate}x
                      </button>
                    </DropdownMenuTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
                    Playback speed
                  </TooltipContent>
                </Tooltip>

                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="min-w-[6rem] border-2 border-black bg-white text-black shadow-neo font-mono text-xs font-bold"
                >
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <DropdownMenuItem
                      key={speed}
                      onClick={() => setPlaybackRate(speed)}
                      className="flex items-center justify-between cursor-pointer focus:bg-[#FEF08A] focus:text-black py-1.5"
                    >
                      <span>{speed}x</span>
                      {playbackRate === speed && (
                        <Check className="w-3.5 h-3.5 text-black" />
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
                    className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-white text-black shadow-neo-sm hover:bg-[#FEF08A] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-neo active:translate-x-0 active:translate-y-0 transition-all"
                    aria-label={isFullscreen ? "Exit Fullscreen (F)" : "Fullscreen (F)"}
                  >
                    {isFullscreen ? (
                      <Minimize className="w-4 h-4 text-black" />
                    ) : (
                      <Maximize className="w-4 h-4 text-black" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="border-2 border-black bg-white text-black font-mono text-xs">
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
