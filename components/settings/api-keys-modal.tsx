"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  KeyRound,
  ShieldCheck,
  Zap,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
  Cpu,
  Mic,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const STORAGE_KEYS = {
  OPENROUTER: "fathom_openrouter_api_key",
  DEEPGRAM: "fathom_deepgram_api_key",
} as const;

export interface ApiKeysState {
  openRouterKey: string;
  deepgramKey: string;
  hasCustomKeys: boolean;
}

/**
 * Utility to read stored API keys in the browser
 */
export function getClientApiKeys(): ApiKeysState {
  if (typeof window === "undefined") {
    return { openRouterKey: "", deepgramKey: "", hasCustomKeys: false };
  }
  const openRouterKey = localStorage.getItem(STORAGE_KEYS.OPENROUTER)?.trim() || "";
  const deepgramKey = localStorage.getItem(STORAGE_KEYS.DEEPGRAM)?.trim() || "";
  return {
    openRouterKey,
    deepgramKey,
    hasCustomKeys: Boolean(openRouterKey || deepgramKey),
  };
}

/**
 * React hook to subscribe to stored API keys
 */
export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKeysState>({
    openRouterKey: "",
    deepgramKey: "",
    hasCustomKeys: false,
  });

  const refreshKeys = () => {
    setKeys(getClientApiKeys());
  };

  useEffect(() => {
    refreshKeys();

    const handleUpdate = () => refreshKeys();
    window.addEventListener("fathom-api-keys-updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("fathom-api-keys-updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return keys;
}

export interface ApiKeysModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export function ApiKeysModal({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
}: ApiKeysModalProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setIsOpen = controlledOnOpenChange || setUncontrolledOpen;

  const [openRouterKey, setOpenRouterKey] = useState("");
  const [deepgramKey, setDeepgramKey] = useState("");
  const [showOpenRouter, setShowOpenRouter] = useState(false);
  const [showDeepgram, setShowDeepgram] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync state with localStorage on open
  useEffect(() => {
    if (isOpen && typeof window !== "undefined") {
      setOpenRouterKey(localStorage.getItem(STORAGE_KEYS.OPENROUTER) || "");
      setDeepgramKey(localStorage.getItem(STORAGE_KEYS.DEEPGRAM) || "");
      setSavedSuccess(false);
    }
  }, [isOpen]);

  const hasCustomKeys = Boolean(openRouterKey.trim() || deepgramKey.trim());

  const handleSave = () => {
    if (typeof window !== "undefined") {
      if (openRouterKey.trim()) {
        localStorage.setItem(STORAGE_KEYS.OPENROUTER, openRouterKey.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.OPENROUTER);
      }

      if (deepgramKey.trim()) {
        localStorage.setItem(STORAGE_KEYS.DEEPGRAM, deepgramKey.trim());
      } else {
        localStorage.removeItem(STORAGE_KEYS.DEEPGRAM);
      }

      window.dispatchEvent(new CustomEvent("fathom-api-keys-updated"));
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        setIsOpen(false);
      }, 900);
    }
  };

  const handleClear = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.OPENROUTER);
      localStorage.removeItem(STORAGE_KEYS.DEEPGRAM);
      setOpenRouterKey("");
      setDeepgramKey("");
      window.dispatchEvent(new CustomEvent("fathom-api-keys-updated"));
      setSavedSuccess(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <button
            type="button"
            className="h-8 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-2.5 font-mono text-xs font-bold uppercase text-black shadow-neo-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#FAF8F5] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <KeyRound className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>API KEYS</span>
            {hasCustomKeys ? (
              <span className="h-2 w-2 rounded-full bg-[#A7F3D0] border border-black animate-pulse" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-[#FEF08A] border border-black" />
            )}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] border-2 border-black bg-[#FAF8F5] text-black shadow-[6px_6px_0px_0px_#000] p-6 sm:rounded-xl">
        <DialogHeader className="border-b-2 border-black pb-4">
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-md border-2 border-black bg-[#FEF08A] shadow-neo-sm">
                <KeyRound className="h-5 w-5 stroke-[2.5] text-black" />
              </div>
              <div>
                <DialogTitle className="font-mono text-base font-black uppercase text-black">
                  API & INTELLIGENCE CONFIG
                </DialogTitle>
                <DialogDescription className="font-mono text-[11px] font-bold uppercase text-neutral-600">
                  LIVE AI PROVIDERS VS DETERMINISTIC SEED MODE
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Status Badge Indicator */}
          <div className="mt-3 flex items-center justify-between rounded-md border-2 border-black bg-white p-2.5 shadow-neo-sm">
            <span className="font-mono text-xs font-black uppercase text-black">
              ACTIVE ENGINE:
            </span>
            {hasCustomKeys ? (
              <span className="flex items-center gap-1.5 rounded border-2 border-black bg-[#A7F3D0] px-2 py-0.5 font-mono text-[11px] font-black uppercase text-black shadow-neo-sm">
                <ShieldCheck className="h-3.5 w-3.5 stroke-[2.5]" />
                CUSTOM LIVE APIS
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded border-2 border-black bg-[#FEF08A] px-2 py-0.5 font-mono text-[11px] font-black uppercase text-black shadow-neo-sm">
                <Zap className="h-3.5 w-3.5 stroke-[2.5]" />
                SEED MODE ACTIVE
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* OpenRouter Configuration */}
          <div className="space-y-2 rounded-lg border-2 border-black bg-white p-3.5 shadow-neo-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 stroke-[2.5] text-black" />
                <label className="font-mono text-xs font-black uppercase text-black">
                  OPENROUTER API KEY
                </label>
              </div>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] font-black uppercase text-black hover:underline"
              >
                GET FREE KEY <ExternalLink className="h-3 w-3 stroke-[2.5]" />
              </a>
            </div>

            <p className="font-mono text-[10px] text-neutral-600 uppercase font-semibold leading-relaxed">
              Powers live executive summaries via free tier models. If empty, local seed intelligence is used.
            </p>

            <div className="relative">
              <input
                type={showOpenRouter ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                className="h-9 w-full rounded border-2 border-black bg-[#FAF8F5] px-3 pr-9 font-mono text-xs text-black shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowOpenRouter(!showOpenRouter)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform"
              >
                {showOpenRouter ? (
                  <EyeOff className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>

          {/* Deepgram Configuration */}
          <div className="space-y-2 rounded-lg border-2 border-black bg-white p-3.5 shadow-neo-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 stroke-[2.5] text-black" />
                <label className="font-mono text-xs font-black uppercase text-black">
                  DEEPGRAM NOVA-2 API KEY
                </label>
              </div>
              <a
                href="https://console.deepgram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] font-black uppercase text-black hover:underline"
              >
                GET KEY ($200 CREDIT) <ExternalLink className="h-3 w-3 stroke-[2.5]" />
              </a>
            </div>

            <p className="font-mono text-[10px] text-neutral-600 uppercase font-semibold leading-relaxed">
              Enables live browser transcription with multi-speaker diarization. If omitted, mock diarized speech is used.
            </p>

            <div className="relative">
              <input
                type={showDeepgram ? "text" : "password"}
                placeholder="Token or API key..."
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                className="h-9 w-full rounded border-2 border-black bg-[#FAF8F5] px-3 pr-9 font-mono text-xs text-black shadow-neo-sm focus:bg-[#FEF08A]/20 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowDeepgram(!showDeepgram)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform"
              >
                {showDeepgram ? (
                  <EyeOff className="h-4 w-4 stroke-[2]" />
                ) : (
                  <Eye className="h-4 w-4 stroke-[2]" />
                )}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between border-t-2 border-black pt-3">
          <button
            type="button"
            onClick={handleClear}
            className="h-9 flex items-center gap-1.5 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-[#FECDD3] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Trash2 className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>SEED MODE</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-9 rounded-md border-2 border-black bg-white px-3 font-mono text-xs font-black uppercase text-black shadow-neo-sm hover:bg-neutral-100 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "h-9 flex items-center gap-1.5 rounded-md border-2 border-black px-4 font-mono text-xs font-black uppercase tracking-wider transition-all shadow-neo hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none",
                savedSuccess
                  ? "bg-[#A7F3D0] text-black"
                  : "bg-[#FEF08A] text-black"
              )}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 stroke-[3]" />
                  <span>SAVED!</span>
                </>
              ) : (
                "SAVE KEYS"
              )}
            </button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
