"use client";

import React from "react";

export function FluidFooter() {
  const handleScrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-zinc-200 bg-white py-6 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left: Copyright & Tagline */}
        <div className="flex items-center gap-2">
          <span>© 2026 Fathom AI. Intelligence from conversation.</span>
        </div>

        {/* Center: System Status */}
        <div className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>Status: Operational</span>
        </div>

        {/* Right: Back to Top */}
        <div>
          <button
            type="button"
            onClick={handleScrollToTop}
            className="hover:text-zinc-950 transition-colors cursor-pointer focus:outline-none"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}
