"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const QUESTIONS = [
  {
    q: "What does Fathom actually do?",
    a: "It records a meeting, produces a word-level transcript with each speaker identified, and writes summaries and action items from it. Everything it writes links back to the seconds of audio it came from.",
  },
  {
    q: "How accurate is the speaker separation?",
    a: "The benchmark call has eight participants and is included so you can judge for yourself. Open it, pick a speaker in the timeline, and listen.",
  },
  {
    q: "Can I get different summaries for different people?",
    a: "Yes. The same call can produce an executive brief, engineering notes, a sales qualification summary, or a plain action list. Switch between them in the meeting view.",
  },
  {
    q: "Does the other side need an account?",
    a: "No. Share a clip and the recipient gets a bounded highlight with its own synced transcript, with nothing to install or sign in to.",
  },
  {
    q: "Where do action items end up?",
    a: "In one list across every meeting, with an owner, a priority, and a citation to the moment it was agreed. You can open the citation and hear it.",
  },
] as const;

export function Faq() {
  return (
    <section id="faq" className="section">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">FAQ</p>
          <h2 className="display-h2 mt-5 max-w-md text-white">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="lg:col-span-7">
          {QUESTIONS.map((item, i) => (
            <AccordionItem
              key={item.q}
              value={`q-${i}`}
              className="border-white/15"
            >
              <AccordionTrigger className="py-5 text-left text-[14px] font-medium text-white hover:no-underline sm:text-base [&>svg]:text-white/50">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-sm leading-relaxed text-white/70">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
