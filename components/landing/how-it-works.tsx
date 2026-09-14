import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Record",
    body: "Join the call or upload a recording. Fathom separates each speaker and keeps the audio.",
    href: "/dashboard",
  },
  {
    number: "02",
    title: "Transcribe",
    body: "Every word gets a timestamp. Click any word to hear exactly what was said and when.",
    href: "/meetings/meeting-1",
  },
  {
    number: "03",
    title: "Act",
    body: "Summaries for each audience, and action items that cite the moment they were agreed.",
    href: "/actions",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section-screen">
      <div className="max-w-3xl">
        <p className="eyebrow">How it works</p>
        <h2 className="display-h2 mt-5 text-white">
          Record once.
          <br />
          Get everything.
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-10 border-t border-white/15 pt-8 md:grid-cols-3 md:gap-8">
        {STEPS.map((step) => (
          <div key={step.number}>
            <span className="step-number">{step.number}</span>
            <Link
              href={step.href}
              className="group mt-3 inline-flex items-center gap-1.5 text-base font-medium text-white sm:text-lg"
            >
              {step.title}
              <ArrowUpRight className="h-4 w-4 text-white/50 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
            </Link>
            <p className="mt-1.5 text-sm leading-relaxed text-white/80">
              {step.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
