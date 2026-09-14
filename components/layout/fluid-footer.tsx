"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const COLUMNS = [
  {
    label: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Benchmark call", href: "/meetings/meeting-1" },
      { label: "Action items", href: "/actions" },
    ],
  },
  {
    label: "Learn",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
] as const;

const linkClass =
  "text-[15px] font-semibold leading-[1.1] text-white/[0.88] transition-[color,transform] duration-[180ms] ease-out hover:translate-x-0.5 hover:text-white";

export function FluidFooter() {
  const pathname = usePathname();

  if (pathname.startsWith("/share")) return null;

  return (
    <footer className="relative z-10 overflow-hidden bg-black text-white">
      <div className="section pb-10 md:pb-12">
        <div className="grid grid-cols-2 gap-10 border-t border-white/15 pt-12 md:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.label}>
              <span className="eyebrow">{col.label}</span>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className={linkClass}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <span className="eyebrow">Contact</span>
            <ul className="mt-5 flex flex-col gap-3">
              <li>
                <a href="mailto:support@fathom.internal" className={linkClass}>
                  support@fathom.internal
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6 border-t border-white/15 pt-6">
          <p className="text-xs text-white/45">
            © {new Date().getFullYear()} Fathom. Meeting intelligence that shows its work.
          </p>
        </div>
      </div>

      {/* Reference wordmark: oversized, clipped at the bottom edge. */}
      <div aria-hidden className="pointer-events-none select-none px-5 sm:px-8 md:px-12">
        <span className="block -mb-[0.22em] whitespace-nowrap font-display text-[24vw] font-medium leading-none tracking-tight text-white/[0.06] md:text-[18vw]">
          FATHOM
        </span>
      </div>

    </footer>
  );
}
