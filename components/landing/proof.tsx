"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";

export function Proof() {
  const router = useRouter();
  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);

  const benchmark =
    meetings.find((m) => m.id === "meeting-1") ??
    meetings.find((m) => m.participants.length >= 8) ??
    meetings[0];

  if (!benchmark) return null;

  const minutes = Math.round(benchmark.duration / 60);
  const people = benchmark.participants.length;
  const segments = benchmark.transcript?.length ?? 0;

  return (
    <section className="section bg-[#f9fafb] text-[#0a0a0a]">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-display text-[28px] font-medium tracking-tight sm:text-[36px] md:text-[56px] md:leading-[1.02]">
            {minutes} minutes.
            <br />
            {people} voices. {segments} segments.
          </h2>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-[#64748b] md:text-base">
            The benchmark call is a real multi-speaker recording. Open it, click
            a word, and watch the audio land on it.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCurrentMeeting(benchmark.id);
            router.push(`/meetings/${benchmark.id}`);
          }}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0a0a0a] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2937]"
        >
          Open the benchmark call
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}
