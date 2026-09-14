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
            className="h-8 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 font-mono text-xs font-medium uppercase text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>API KEYS</span>
            {hasCustomKeys ? (
              <span className="h-2 w-2 rounded-sm bg-zinc-950 animate-pulse" />
            ) : (
              <span className="h-2 w-2 rounded-sm bg-zinc-300" />
            )}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] border border-zinc-200 bg-white text-zinc-950 shadow-2xl shadow-black/[0.08] p-6 sm:rounded-xl">
        <DialogHeader className="border-b border-zinc-200 pb-4">
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 shadow-sm">
                <KeyRound className="h-5 w-5 text-zinc-950" />
              </div>
              <div>
                <DialogTitle className="font-mono text-base font-semibold uppercase text-zinc-950">
                  API & INTELLIGENCE CONFIG
                </DialogTitle>
                <DialogDescription className="font-mono text-[11px] font-medium uppercase text-zinc-500">
                  LIVE AI PROVIDERS VS DETERMINISTIC SEED MODE
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Status Badge Indicator */}
          <div className="mt-3 flex items-center justify-between rounded-md border border-zinc-200 bg-zinc-50 p-2.5">
            <span className="font-mono text-xs font-semibold uppercase text-zinc-700">
              ACTIVE ENGINE:
            </span>
            {hasCustomKeys ? (
              <span className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-zinc-950 px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-white">
                <ShieldCheck className="h-3.5 w-3.5" />
                CUSTOM LIVE APIS
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] font-semibold uppercase text-zinc-700 shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                SEED MODE ACTIVE
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* OpenRouter Configuration */}
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-zinc-950" />
                <label className="font-mono text-xs font-semibold uppercase text-zinc-950">
                  OPENROUTER API KEY
                </label>
              </div>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase text-zinc-500 hover:text-zinc-950 hover:underline transition-colors"
              >
                GET FREE KEY <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="font-mono text-[10px] text-zinc-500 uppercase font-medium leading-relaxed">
              Powers live executive summaries via free tier models. If empty, local seed intelligence is used.
            </p>

            <div className="relative">
              <input
                type={showOpenRouter ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 pr-9 font-mono text-xs text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowOpenRouter(!showOpenRouter)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors"
              >
                {showOpenRouter ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Deepgram Configuration */}
          <div className="space-y-2 rounded-xl border border-zinc-200 bg-zinc-50 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-zinc-950" />
                <label className="font-mono text-xs font-semibold uppercase text-zinc-950">
                  DEEPGRAM NOVA-2 API KEY
                </label>
              </div>
              <a
                href="https://console.deepgram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 font-mono text-[10px] font-medium uppercase text-zinc-500 hover:text-zinc-950 hover:underline transition-colors"
              >
                GET KEY ($200 CREDIT) <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="font-mono text-[10px] text-zinc-500 uppercase font-medium leading-relaxed">
              Enables live browser transcription with multi-speaker diarization. If omitted, mock diarized speech is used.
            </p>

            <div className="relative">
              <input
                type={showDeepgram ? "text" : "password"}
                placeholder="Token or API key..."
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                className="h-9 w-full rounded-md border border-zinc-200 bg-white px-3 pr-9 font-mono text-xs text-zinc-950 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowDeepgram(!showDeepgram)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-950 transition-colors"
              >
                {showDeepgram ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-row items-center justify-between border-t border-zinc-200 pt-3">
          <button
            type="button"
            onClick={handleClear}
            className="h-9 flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>SEED MODE</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="h-9 rounded-md border border-zinc-200 bg-white px-3 font-mono text-xs font-semibold uppercase text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={cn(
                "h-9 flex items-center gap-1.5 rounded-md border px-4 font-mono text-xs font-semibold uppercase tracking-wider transition-colors",
                savedSuccess
                  ? "border-zinc-200 bg-zinc-100 text-zinc-700"
                  : "border-zinc-950 bg-zinc-950 text-white hover:bg-zinc-800"
              )}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
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
