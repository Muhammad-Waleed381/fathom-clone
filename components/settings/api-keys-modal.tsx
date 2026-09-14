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
  Headphones,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      ) : controlledOpen !== undefined ? null : (
        <DialogTrigger asChild>
          <button
            type="button"
            className="h-8 flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-xs font-medium text-white hover:bg-white/20 transition-colors"
          >
            <KeyRound className="h-3.5 w-3.5" />
            <span>API keys</span>
            {hasCustomKeys ? (
              <span className="h-2 w-2 rounded-full bg-white" />
            ) : (
              <span className="h-2 w-2 rounded-full bg-white/30" />
            )}
          </button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[500px] border border-white/15 bg-black/90 text-white p-6 sm:rounded-2xl">
        <DialogHeader className="border-b border-white/10 pb-4">
          <div className="flex items-center justify-between pr-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white shadow-sm">
                <KeyRound className="h-5 w-5 text-white" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-white">
                  API & intelligence config
                </DialogTitle>
                <DialogDescription className="text-xs text-white/50">
                  Live AI providers vs deterministic seed mode
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Status Badge Indicator */}
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-[13px] font-medium text-white/70">
              Active engine:
            </span>
            {hasCustomKeys ? (
              <span className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-black">
                <ShieldCheck className="h-3.5 w-3.5" />
                Custom live APIs
              </span>
            ) : (
              <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/80">
                <Zap className="h-3.5 w-3.5" />
                Seed mode active
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* OpenRouter Configuration */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-white" />
                <label className="text-[13px] font-medium text-white">
                  OpenRouter API key
                </label>
              </div>
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-white/60 hover:text-white underline"
              >
                Get Key
              </a>
            </div>
            <Input
              type="password"
              placeholder="sk-or-v1-..."
              value={openRouterKey}
              onChange={(e) => setOpenRouterKey(e.target.value)}
              className="border-white/15 bg-surface-raised text-white placeholder:text-white/30 rounded-xl text-xs focus:border-white"
            />
            <p className="text-[10px] text-white/50">
              Powers multi-perspective synthesis and chat.
            </p>
          </div>

          {/* Deepgram Configuration */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Headphones className="h-4 w-4 text-white" />
                <label className="text-[13px] font-medium text-white">
                  Deepgram API key
                </label>
              </div>
              <a
                href="https://console.deepgram.com"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-white/60 hover:text-white underline"
              >
                Get Key
              </a>
            </div>
            <Input
              type="password"
              placeholder="dg-..."
              value={deepgramKey}
              onChange={(e) => setDeepgramKey(e.target.value)}
              className="border-white/15 bg-surface-raised text-white placeholder:text-white/30 rounded-xl text-xs focus:border-white"
            />
            <p className="text-[10px] text-white/50">
              Powers neural Nova-2 speech diarization.
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="rounded-xl border border-white/20 bg-white/10 p-2.5 text-center text-xs text-white">
            Keys saved securely to local browser storage.
          </div>
        )}

        <DialogFooter className="border-t border-white/10 pt-4 flex flex-row items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/100/100/10 rounded-full"
          >
            Clear Stored Keys
          </Button>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="text-xs border-white/20 text-white hover:bg-white/10 rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="text-xs bg-white text-black hover:bg-white/90 rounded-full font-semibold"
            >
              Save Keys
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
