"use client";

import React, { useState, useRef, useEffect } from "react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { formatTime } from "@/components/player/video-scrubber";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sparkles,
  Send,
  Play,
  RotateCcw,
  Bot,
  User,
  Clock,
  Lightbulb,
  CornerDownLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Citation {
  text: string;
  time: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
}

export interface AskFathomChatProps {
  className?: string;
}

const PROMPT_PILLS = [
  "What was decided regarding database sharding?",
  "List all deadlines mentioned",
  "What were Sarah's concerns?",
];

function parseTimeToSeconds(timeStr: string): number {
  const clean = timeStr.replace(/[\[\]]/g, "");
  const parts = clean.split(":").map(Number);
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  return 0;
}

// Renders markdown-like text with bolding, bullets, and clickable timestamp chips
function MarkdownResponse({
  content,
  onSeek,
}: {
  content: string;
  onSeek: (time: number) => void;
}) {
  const lines = content.split("\n");

  const renderFormattedLine = (line: string, lineIndex: number) => {
    // Check if line is bullet
    const isBullet = line.startsWith("• ") || line.startsWith("- ") || /^\d+\.\s/.test(line);
    const textContent = isBullet
      ? line.replace(/^(?:•\s*|-\s*|\d+\.\s*)/, "")
      : line;

    // Pattern for timestamps like [05:56] or 14:22
    const tokenRegex = /(\[\d{1,2}:\d{2}(?::\d{2})?\]|\b\d{1,2}:\d{2}(?::\d{2})?\b|\*\*[^*]+\*\*)/g;
    const parts = textContent.split(tokenRegex);

    const renderedParts = parts.map((part, pIdx) => {
      if (!part) return null;

      // Clickable timestamp
      if (/^\[?\d{1,2}:\d{2}(?::\d{2})?\]?$/.test(part) && (part.includes(":") || part.startsWith("["))) {
        const cleanTime = part.replace(/[\[\]]/g, "");
        const secs = parseTimeToSeconds(cleanTime);
        return (
          <button
            key={`ts-${pIdx}`}
            type="button"
            onClick={() => onSeek(secs)}
            className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-medium text-primary bg-primary/10 hover:bg-primary/20 hover:text-white border border-primary/25 transition-colors align-middle cursor-pointer"
            title={`Seek to ${cleanTime}`}
          >
            <Play className="h-2 w-2 fill-current" />
            <span>{cleanTime}</span>
          </button>
        );
      }

      // Bold text
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={`b-${pIdx}`} className="font-semibold text-slate-100">
            {part.slice(2, -2)}
          </strong>
        );
      }

      return <span key={`txt-${pIdx}`}>{part}</span>;
    });

    if (isBullet) {
      return (
        <li key={`line-${lineIndex}`} className="flex items-start gap-2 my-1 leading-relaxed">
          <span className="mt-2 h-1 w-1 rounded-full bg-primary/70 shrink-0" />
          <span className="flex-1">{renderedParts}</span>
        </li>
      );
    }

    if (line.trim() === "") {
      return <div key={`empty-${lineIndex}`} className="h-2" />;
    }

    return (
      <p key={`line-${lineIndex}`} className="my-1 leading-relaxed">
        {renderedParts}
      </p>
    );
  };

  return (
    <div className="text-xs text-slate-200 space-y-1">
      {lines.map((line, idx) => renderFormattedLine(line, idx))}
    </div>
  );
}

export function AskFathomChat({ className }: AskFathomChatProps) {
  const currentMeeting = useMeetingStore((s) => s.currentMeeting);
  const seekTo = useMeetingStore((s) => s.seekTo);

  const [inputQuery, setInputQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      content:
        "Hi! I'm **Fathom AI**. Ask me anything about this meeting's architecture decisions, action items, or specific speaker contributions. Click any timestamp to jump the video directly to that discussion.",
      timestamp: "Just now",
      citations: [
        { text: "Meeting Start", time: 0 },
      ],
    },
  ]);

  const scrollViewportRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop =
        scrollViewportRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateAnswer = (query: string): { content: string; citations: Citation[] } => {
    const q = query.toLowerCase();

    // Decision regarding database / sharding / CockroachDB
    if (q.includes("database") || q.includes("shard") || q.includes("cockroach") || q.includes("aurora")) {
      return {
        content:
          "The leadership reviewed database scalability options and decided against manual sharding of Aurora PostgreSQL due to operational complexity. Instead, the team reached two decisive agreements:\n" +
          "• **Immediate Mitigation:** Standardized on AWS RDS Proxy with transaction connection pooling and offloaded presence heartbeats to a 3-shard Redis Cluster [07:55] to eliminate socket exhaustion.\n" +
          "• **Strategic Architecture:** Unanimously approved the RFC to migrate to **CockroachDB v24** multi-region active-active cluster across us-east, us-west, and eu-central [13:20].\n" +
          "• **Consensus & Localization:** Utilizing Multi-Raft consensus with range leaseholders localized per organization ID ensures single-region write latency remains under 18ms without cross-continental roundtrips [14:56].",
        citations: [
          { text: "Redis Cluster Load Test", time: 475 },
          { text: "CockroachDB Multi-Region RFC", time: 800 },
          { text: "Raft Range Leases Decision", time: 896 },
        ],
      };
    }

    // List all deadlines mentioned
    if (q.includes("deadline") || q.includes("date") || q.includes("due") || q.includes("deliverable")) {
      return {
        content:
          "Seven concrete deliverables and deadlines were established during this sync:\n" +
          "• **Sep 20, 2026** — **Sarah Chen**: Run load testing benchmark on Redis cluster with 50k RPS target [10:18].\n" +
          "• **Sep 21, 2026** — **David Kim**: Audit Kafka consumer group lag and implement composite partition keys [35:28].\n" +
          "• **Sep 22, 2026** — **Alex Rivera**: Draft RFC for multi-region active-active CockroachDB migration [14:56].\n" +
          "• **Sep 24, 2026** — **Maya Lin**: Profile Next.js SSR bundle hydration time and add edge caching headers [35:45].\n" +
          "• **Sep 25, 2026** — **Marcus Brody**: Implement Istio Ambient Mesh canary deployment pipeline in staging [24:05].\n" +
          "• **Sep 28, 2026** — **Elena Rostova**: Create automated chaos engineering test suite in Chaos Mesh [29:45].\n" +
          "• **Sep 30, 2026** — **James Wilson**: Complete SOC2 Type II compliance gap analysis for zero-trust mTLS proxies [39:40].",
        citations: [
          { text: "Sarah Chen commitment", time: 618 },
          { text: "Alex Rivera RFC timeline", time: 896 },
          { text: "Elena Rostova chaos test", time: 1785 },
          { text: "David Kim Kafka audit", time: 2128 },
          { text: "James Wilson SOC2 timeline", time: 2380 },
        ],
      };
    }

    // Sarah's concerns
    if (q.includes("sarah") || q.includes("concern") || q.includes("latency")) {
      return {
        content:
          "**Sarah Chen** (Staff Backend Engineer) raised several critical technical concerns:\n" +
          "• **Tail-Latency Degradation:** Sarah highlighted that peak enterprise traffic caused p99 latency to spike from 45ms to 820ms due to database socket exhaustion during pod autoscaling [05:56].\n" +
          "• **Session State Bloat:** She emphasized that storing ephemeral presence heartbeats in the primary relational database was choking connection pools [07:55].\n" +
          "• **Verification Standard:** She insisted that the Redis cluster mitigation must pass a rigorous 50k RPS load test with k6 before being considered production-ready [10:18].",
        citations: [
          { text: "Root cause analysis", time: 356 },
          { text: "Redis cluster 50k RPS", time: 475 },
          { text: "Sarah Chen benchmark commitment", time: 618 },
        ],
      };
    }

    // Generic intelligent response grounded in meeting data
    const meetingTitle = currentMeeting?.title || "this meeting";
    const overview = currentMeeting?.summaries?.executive?.overview || "";
    const firstSection = currentMeeting?.summaries?.executive?.sections?.[0];

    return {
      content:
        `Based on the transcript and executive synthesis for **${meetingTitle}**:\n\n` +
        `• ${overview.slice(0, 280)}...\n\n` +
        `Key discussion points include **${firstSection?.title || "Platform Architecture"}** [04:15]. You can click the citation timestamps below to jump straight to the source recording!`,
      citations: [
        { text: "Discussion Overview", time: 255 },
        { text: "Architecture Sync", time: 600 },
      ],
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend ?? inputQuery).trim();
    if (!query || isTyping) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: formatTime(useMeetingStore.getState().currentTime),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery("");
    setIsTyping(true);

    // Simulate AI thinking and streaming response
    setTimeout(() => {
      const { content, citations } = generateAnswer(query);
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content,
        timestamp: "Just now",
        citations,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "msg-welcome",
        role: "assistant",
        content:
          "Hi! I'm **Fathom AI**. Ask me anything about this meeting's architecture decisions, action items, or specific speaker contributions. Click any timestamp to jump the video directly to that discussion.",
        timestamp: "Just now",
        citations: [{ text: "Meeting Start", time: 0 }],
      },
    ]);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-[520px] rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl overflow-hidden backdrop-blur-md",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-semibold text-white tracking-tight">
                Ask Fathom AI
              </h3>
              <Badge
                variant="outline"
                className="text-[9px] font-mono px-1 py-0 border-primary/40 bg-primary/10 text-primary font-semibold"
              >
                GPT-4o
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400">
              Grounded in transcript with interactive playback jumps
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="h-7 w-7 p-0 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          title="Reset conversation"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Suggested Prompt Pills */}
      <div className="px-3.5 py-2.5 bg-slate-900/40 border-b border-slate-800/60 overflow-x-auto scrollbar-none flex items-center gap-1.5">
        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium shrink-0 mr-1">
          <Lightbulb className="h-3 w-3 text-amber-400" />
          <span>Try:</span>
        </div>
        {PROMPT_PILLS.map((pill, idx) => (
          <button
            key={`pill-${idx}`}
            type="button"
            onClick={() => handleSendMessage(pill)}
            disabled={isTyping}
            className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-primary/20 hover:text-primary hover:border-primary/40 text-slate-300 border border-slate-700/60 transition-all cursor-pointer select-none text-left disabled:opacity-50"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isAi = msg.role === "assistant";

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-2.5",
                  isAi ? "justify-start" : "justify-end"
                )}
              >
                {isAi && (
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5 border border-primary/30">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                      <Bot className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl p-3 shadow-xs",
                    isAi
                      ? "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-sm"
                      : "bg-primary text-white rounded-tr-sm ml-auto"
                  )}
                >
                  {isAi ? (
                    <div className="space-y-2">
                      <MarkdownResponse
                        content={msg.content}
                        onSeek={seekTo}
                      />

                      {/* Interactive Citations Bar */}
                      {msg.citations && msg.citations.length > 0 && (
                        <div className="pt-2 mt-2 border-t border-slate-800 flex flex-wrap gap-1.5 items-center">
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="h-2.5 w-2.5" /> Citations:
                          </span>
                          {msg.citations.map((cite, cIdx) => (
                            <button
                              key={`c-${cIdx}`}
                              type="button"
                              onClick={() => seekTo(cite.time)}
                              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
                              title={`Jump video to ${formatTime(cite.time)}`}
                            >
                              <Play className="h-2 w-2 text-primary fill-primary/30" />
                              <span className="text-primary font-semibold">
                                {formatTime(cite.time)}
                              </span>
                              <span className="text-slate-400 truncate max-w-[120px]">
                                {cite.text}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs leading-relaxed font-medium">
                      {msg.content}
                    </p>
                  )}
                </div>

                {!isAi && (
                  <Avatar className="h-6 w-6 shrink-0 mt-0.5 border border-slate-700">
                    <AvatarFallback className="bg-slate-800 text-slate-300 text-[10px] font-semibold">
                      <User className="h-3.5 w-3.5" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-start gap-2.5">
              <Avatar className="h-6 w-6 shrink-0 mt-0.5 border border-primary/30">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  <Bot className="h-3.5 w-3.5 animate-pulse" />
                </AvatarFallback>
              </Avatar>
              <div className="rounded-2xl rounded-tl-sm bg-slate-900/90 border border-slate-800 px-3 py-2 text-slate-400 text-xs flex items-center gap-1.5 shadow-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
                <span className="ml-1.5 text-[11px] text-slate-400">
                  Fathom AI is researching transcript...
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input row */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/60">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Input
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about this meeting..."
              disabled={isTyping}
              className="h-9 pr-9 text-xs bg-slate-950/80 border-slate-800 focus-visible:ring-primary/60 text-slate-100 placeholder:text-slate-500 rounded-xl"
            />
          </div>
          <Button
            type="submit"
            size="sm"
            disabled={!inputQuery.trim() || isTyping}
            className="h-9 w-9 p-0 rounded-xl bg-primary hover:bg-primary/90 text-white shrink-0 cursor-pointer disabled:opacity-40"
            title="Send query"
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
