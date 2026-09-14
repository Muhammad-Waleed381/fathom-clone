import Link from "next/link";
import { ArrowRight } from "lucide-react";

const AREAS = [
  {
    number: "01",
    title: "Dashboard",
    body: "Every recording in one place. Filter by team, search by speaker or topic, share from the card.",
    href: "/dashboard",
    cta: "Open dashboard",
  },
  {
    number: "02",
    title: "Meeting view",
    body: "Video, live-highlighted transcript, speaker timeline and summaries side by side.",
    href: "/meetings/meeting-1",
    cta: "Open the benchmark call",
  },
  {
    number: "03",
    title: "Action items",
    body: "Owners, priorities and due dates across every meeting, each one citing its timestamp.",
    href: "/actions",
    cta: "Open action items",
  },
] as const;

export function ProductGrid() {
  return (
    <section className="section bg-black">
      <div className="max-w-3xl">
        <p className="eyebrow">Inside Fathom</p>
        <h2 className="display-h2 mt-5 text-white">Three places to work</h2>
        <p className="lede mt-6 text-white/70">
          Recordings live on the dashboard, each call opens into its own
          workspace, and everything anyone agreed to rolls up into one list.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        {AREAS.map((area) => (
          <Link key={area.number} href={area.href} className="group card-invert">
            <div>
              <span className="card-invert-faint text-xs">{area.number}</span>
              <p className="mt-4 text-lg font-medium">{area.title}</p>
              <p className="card-invert-muted mt-3 text-sm leading-relaxed">
                {area.body}
              </p>
            </div>
            <span className="card-invert-muted mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
              {area.cta}
              <ArrowRight className="card-arrow" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
