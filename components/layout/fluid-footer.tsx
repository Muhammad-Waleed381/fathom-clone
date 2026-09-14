"use client";

import React from "react";

export function FluidFooter() {
  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-[#E4E4E7] bg-white py-6 text-xs text-[#737373] font-mono">
      <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Copyright & Tagline */}
        <div className="flex items-center gap-2 uppercase tracking-wide text-[11px]">
          <span>© 2026 FATHOM. AUTONOMOUS MEETING INTELLIGENCE.</span>
        </div>

        {/* Center: System Status */}
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#0B0B0B]" />
          <span>NETWORK: VERIFIED</span>
        </div>

        {/* Right: Back to Top with Stipple Underline */}
        <div>
          <button
            type="button"
            onClick={handleScrollToTop}
            className="relative group text-[#737373] hover:text-[#0B0B0B] transition-colors cursor-pointer focus:outline-none uppercase text-[11px] tracking-wider"
          >
            <span>BACK TO TOP ↑</span>
            <span className="stipple-underline w-0 group-hover:w-full" />
          </button>
        </div>
      </div>
    </footer>
  );
}
