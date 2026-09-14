"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useMeetingStore } from "@/lib/store/use-meeting-store";

export function Hero() {
  const router = useRouter();
  const meetings = useMeetingStore((s) => s.meetings);
  const setCurrentMeeting = useMeetingStore((s) => s.setCurrentMeeting);

  const benchmark =
    meetings.find((m) => m.id === "meeting-1") ??
    meetings.find((m) => m.participants.length >= 8) ??
    meetings[0];

  const openBenchmark = () => {
    if (!benchmark) return;
    setCurrentMeeting(benchmark.id);
    router.push(`/meetings/${benchmark.id}`);
  };

  const minutes = benchmark ? Math.round(benchmark.duration / 60) : 0;

  return (
    <section className="section-screen relative overflow-hidden">
      {/* Background footage, flat — no glass on top of it. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/hero-poster.jpg"
          src="/hero-video.mp4"
          className="h-full w-full object-cover opacity-30 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/40 via-[#0a0a0a]/60 to-[#0a0a0a]" />
      </div>

      <div className="max-w-4xl">
        <h1 className="display-h1 text-white">
          Every meeting, transcribed,
          <br />
          summarised and actioned.
        </h1>
        <p className="lede mt-6 max-w-xl text-white/70">
          Fathom records the call, writes the transcript word by word, and turns
          what was said into summaries and tasks you can trace back to the
          second.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        {benchmark && (
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
            </span>
            <div>
              <p className="eyebrow">Benchmark call</p>
              <p className="mt-1 text-sm font-medium text-white">
                {benchmark.participants.length} people · {minutes} min ·{" "}
                {benchmark.transcript?.length ?? 0} segments
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openBenchmark}
            className="cta border border-white bg-white text-black"
          >
            <span className="cta-bg bg-white" />
            <span className="cta-text text-black">Open the benchmark</span>
            <span className="cta-circle bg-black text-white">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </button>
          <Link
            href="/dashboard"
            className="cta border border-white/25 text-white hover:border-white/60"
          >
            <span className="cta-bg bg-white/10" />
            <span className="cta-text text-white">Go to dashboard</span>
            <span className="cta-circle bg-white/15 text-white">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
