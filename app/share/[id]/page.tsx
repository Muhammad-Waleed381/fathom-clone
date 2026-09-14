"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useMeetingStore } from "@/lib/store/use-meeting-store";
import { SEED_MEETINGS } from "@/data/seed-meetings";
import { PublicClipViewer } from "@/components/share/public-clip-viewer";

function SharePageContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const id = (params?.id as string) || "";
  const queryStart = searchParams?.get("start");
  const queryEnd = searchParams?.get("end");
  const queryTitle = searchParams?.get("title");

  const [hasHydrated, setHasHydrated] = useState(false);
  const storeMeetings = useMeetingStore((s) => s.meetings);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const { meeting, isFallback } = useMemo(() => {
    // 1. First search in current store meetings (if hydrated)
    if (storeMeetings && storeMeetings.length > 0) {
      const match = storeMeetings.find((m) => m.id === id);
      if (match) return { meeting: match, isFallback: false };
    }

    // 2. Search in SEED_MEETINGS
    const seedMatch = SEED_MEETINGS.find((m) => m.id === id);
    if (seedMatch) return { meeting: seedMatch, isFallback: false };

    // 3. Fallback to default benchmark meeting
    return {
      meeting: SEED_MEETINGS[0],
      isFallback: true,
    };
  }, [id, storeMeetings, hasHydrated]);

  // Compute start and end times
  const startTime = useMemo(() => {
    if (queryStart) {
      const parsed = parseFloat(queryStart);
      if (!isNaN(parsed) && parsed >= 0) return parsed;
    }
    // Default to first highlight if present, else 0
    if (meeting.highlights && meeting.highlights.length > 0) {
      return meeting.highlights[0].start;
    }
    return 0;
  }, [queryStart, meeting]);

  const endTime = useMemo(() => {
    if (queryEnd) {
      const parsed = parseFloat(queryEnd);
      if (!isNaN(parsed) && parsed > startTime) return parsed;
    }
    // Default to matching highlight end or start + 30s
    if (meeting.highlights && meeting.highlights.length > 0) {
      const hl = meeting.highlights.find(
        (h) => Math.abs(h.start - startTime) < 2
      );
      if (hl) return hl.end;
    }
    return Math.min(meeting.duration, startTime + 30);
  }, [queryEnd, startTime, meeting]);

  const clipTitle = useMemo(() => {
    if (queryTitle) {
      try {
        return decodeURIComponent(queryTitle);
      } catch {
        return queryTitle;
      }
    }
    // Try to match an existing highlight title
    const matchingHl = meeting.highlights?.find(
      (h) => Math.abs(h.start - startTime) < 3
    );
    if (matchingHl) return matchingHl.title;

    return `Clip: ${meeting.title}`;
  }, [queryTitle, startTime, meeting]);

  return (
    <PublicClipViewer
      meeting={meeting}
      startTime={startTime}
      endTime={endTime}
      clipTitle={clipTitle}
      isDemoFallback={isFallback}
    />
  );
}

export default function SharePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-950">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-zinc-200 bg-white p-8 shadow-xl shadow-black/[0.06]">
            <div className="h-8 w-8 animate-spin rounded-sm border-4 border-zinc-200 border-t-zinc-950" />
            <p className="font-mono text-xs font-semibold uppercase text-zinc-500 tracking-wider">
              LOADING GUEST CLIP VIEWER...
            </p>
          </div>
        </div>
      }
    >
      <SharePageContent />
    </Suspense>
  );
}
