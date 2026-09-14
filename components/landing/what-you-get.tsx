import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";

const POINTS = [
  {
    number: "01",
    title: "A transcript you can click",
    body: "Word-level timestamps. Jump to any moment, not just the nearest minute.",
  },
  {
    number: "02",
    title: "One summary per audience",
    body: "Executive brief, engineering notes, sales qualification, or an action list — from the same call.",
  },
  {
    number: "03",
    title: "Action items with receipts",
    body: "Every task links to the seconds where it was agreed. No arguing about who said what.",
  },
  {
    number: "04",
    title: "Share a clip, not a recording",
    body: "Send a bounded highlight with its own synced transcript. No login needed to watch.",
  },
] as const;

export function WhatYouGet() {
  return (
    <section className="section bg-white text-[#0a0a0a]">
      <div className="max-w-3xl">
        <p className="eyebrow-dark">What you get</p>
        <h2 className="display-h2 mt-5">
          Built for the people
          <br />
          who run the meeting
        </h2>
        <p className="lede mt-7 text-black/65 sm:text-lg">
          Fathom is for teams that make decisions in calls and need them to
          survive the call. Nothing to install on the other side.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-black/10 bg-black/10 sm:grid-cols-2 lg:grid-cols-4">
        {POINTS.map((point) => (
          <Item
            key={point.number}
            className="group rounded-none bg-white p-6 transition-colors duration-500 hover:bg-[#0a0a0a] sm:p-7"
          >
            <ItemContent className="gap-0">
              <span className="text-xs text-black/45 transition-colors duration-500 group-hover:text-white/60">
                {point.number}
              </span>
              <ItemTitle className="mt-4 text-base font-medium leading-snug text-[#0a0a0a] transition-colors duration-500 group-hover:text-white">
                {point.title}
              </ItemTitle>
              <ItemDescription className="mt-3 line-clamp-none text-sm leading-relaxed text-black/60 transition-colors duration-500 group-hover:text-white/70">
                {point.body}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </div>
    </section>
  );
}
