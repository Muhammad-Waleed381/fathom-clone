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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function ApiKeysModal({ open: controlledOpen, onOpenChange: controlledOnOpenChange, trigger }: ApiKeysModalProps) {
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 border-slate-700 bg-slate-900/80 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <KeyRound className="h-3.5 w-3.5 text-primary" />
            <span>API Keys</span>
            {hasCustomKeys ? (
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-400" />
            )}
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] border-slate-800 bg-slate-950 text-slate-100 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  API & Intelligence Settings
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400">
                  Configure live AI providers or operate in deterministic seed mode.
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Status Badge Indicator */}
          <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-2.5">
            <span className="text-xs font-medium text-slate-300">Active Engine:</span>
            {hasCustomKeys ? (
              <Badge
                variant="outline"
                className="gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-medium py-0.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Custom Live APIs Connected
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="gap-1.5 border-amber-500/30 bg-amber-500/10 text-amber-400 font-medium py-0.5"
              >
                <Zap className="h-3.5 w-3.5" />
                Free / Seed Mode Active
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* OpenRouter Configuration */}
          <div className="space-y-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-purple-400" />
                <label className="text-xs font-semibold text-slate-200">
                  OpenRouter API Key
                </label>
              </div>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                Get Free Key <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Powers dynamic executive summaries and Ask Fathom Q&A using the free tier{" "}
              <code className="text-[10px] bg-slate-800 px-1 py-0.5 rounded text-purple-300">
                meta-llama/llama-3.3-70b-instruct:free
              </code>
              . If left blank, intelligent local synthesis is used.
            </p>

            <div className="relative">
              <Input
                type={showOpenRouter ? "text" : "password"}
                placeholder="sk-or-v1-..."
                value={openRouterKey}
                onChange={(e) => setOpenRouterKey(e.target.value)}
                className="h-9 pr-9 border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowOpenRouter(!showOpenRouter)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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
          <div className="space-y-2 rounded-lg border border-slate-800/80 bg-slate-900/40 p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-blue-400" />
                <label className="text-xs font-semibold text-slate-200">
                  Deepgram Nova-2 API Key
                </label>
              </div>
              <a
                href="https://console.deepgram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] text-primary hover:underline"
              >
                Get Key ($200 Credit) <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Enables live audio transcription with multi-speaker diarization and sub-second word alignment. If omitted, mock diarized speech is returned.
            </p>

            <div className="relative">
              <Input
                type={showDeepgram ? "text" : "password"}
                placeholder="Token or API key..."
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                className="h-9 pr-9 border-slate-800 bg-slate-950 font-mono text-xs text-slate-200 focus-visible:ring-primary"
              />
              <button
                type="button"
                onClick={() => setShowDeepgram(!showDeepgram)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
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

        <DialogFooter className="flex flex-row items-center justify-between sm:justify-between border-t border-slate-800 pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-8 gap-1.5 text-xs text-slate-400 hover:bg-slate-900 hover:text-rose-400"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Reset to Seed Mode
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 border-slate-800 text-xs text-slate-300 hover:bg-slate-900"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className={cn(
                "h-8 gap-1.5 text-xs font-semibold shadow-sm transition-all",
                savedSuccess
                  ? "bg-emerald-600 text-white hover:bg-emerald-600"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Saved!
                </>
              ) : (
                "Save Keys"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
