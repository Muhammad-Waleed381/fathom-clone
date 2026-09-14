"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Video } from "lucide-react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { CalendarStrip } from "@/components/dashboard/calendar-strip";
import { MeetingCard } from "@/components/dashboard/meeting-card";
import { ClipShareModal } from "@/components/highlights/clip-share-modal";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Meeting } from "@/types/meeting";
import { cn } from "@/lib/utils";

type CategoryFilter = "all" | "engineering" | "sales" | "design" | "1-on-1s";

const CATEGORY_TABS: { id: CategoryFilter; label: string; tags: string[] }[] = [
  { id: "all", label: "All", tags: [] },
  {
    id: "engineering",
    label: "Engineering",
    tags: ["engineering", "architecture", "scalability", "kubernetes"],
  },
  { id: "sales", label: "Sales", tags: ["sales", "enterprise", "discovery", "meddpicc"] },
  { id: "design", label: "Design", tags: ["design", "product", "ux", "critique", "scrubber"] },
  { id: "1-on-1s", label: "1-on-1s", tags: ["1-on-1", "mentorship", "career", "feedback"] },
];

export default function DashboardPage() {
  const router = useRouter();
  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);

  const [activeTab, setActiveTab] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [shareMeeting, setShareMeeting] = useState<Meeting | null>(null);

  const benchmark = useMemo(
    () =>
      meetings.find((m) => m.id === "meeting-1") ??
      meetings.find((m) => m.participants.length >= 8) ??
      meetings[0],
    [meetings]
  );

  const filtered = useMemo(() => {
    const tab = CATEGORY_TABS.find((t) => t.id === activeTab);
    const q = query.trim().toLowerCase();
    return meetings.filter((m) => {
      if (tab && tab.tags.length > 0) {
        const hit = m.tags?.some((t) => tab.tags.includes(t.toLowerCase()));
        if (!hit) return false;
      }
      if (q) {
        return (
          m.title.toLowerCase().includes(q) ||
          m.participants.some((p) => p.name.toLowerCase().includes(q)) ||
          Boolean(m.tags?.some((t) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [meetings, activeTab, query]);

  const openBenchmark = () => {
    if (!benchmark) return;
    setCurrentMeeting(benchmark.id);
    router.push(`/meetings/${benchmark.id}`);
  };

  return (
    <div className="section pt-28 sm:pt-32 md:pt-36">
      <CalendarStrip onSimulateCall={openBenchmark} />

      <section aria-label="Recordings" className="mt-24">
        <div className="flex flex-col gap-6 border-b border-white/15 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow">Recordings</p>
            <h2 className="display-h2 mt-2 text-white">
              {meetings.length} meetings
            </h2>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div role="tablist" className="flex items-center gap-1 overflow-x-auto">
              {CATEGORY_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "bg-white text-black"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <label className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                type="search"
                placeholder="Search title, speaker, topic"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-full border border-white/15 bg-transparent pl-10 pr-4 text-sm text-white placeholder:text-white/40 focus:border-white/60 focus:outline-none"
              />
            </label>
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((meeting) => (
              <MeetingCard key={meeting.id} meeting={meeting} onShare={setShareMeeting} />
            ))}
          </div>
        ) : (
          <Empty className="mt-8 rounded-2xl border border-dashed border-white/20">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-white/10 text-white">
                <Video />
              </EmptyMedia>
              <EmptyTitle className="text-white">No matching meetings</EmptyTitle>
              <EmptyDescription className="text-white/60">
                Try another category or clear the search.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("all");
                  setQuery("");
                }}
                className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white hover:text-black"
              >
                Reset filters
              </button>
            </EmptyContent>
          </Empty>
        )}
      </section>

      {shareMeeting && (
        <ClipShareModal
          open
          onOpenChange={(open) => {
            if (!open) setShareMeeting(null);
          }}
          meetingId={shareMeeting.id}
          startTime={0}
          endTime={Math.min(shareMeeting.duration, 60)}
          title={shareMeeting.title}
          speakers={shareMeeting.participants}
          transcriptSnippet={
            shareMeeting.transcript?.[0]?.text ||
            shareMeeting.summaries?.executive?.overview
          }
        />
      )}
    </div>
  );
}
