import React from "react";

export function FathomLogo({
  className = "h-6.5 w-6.5",
  size = 26,
}: {
  className?: string;
  size?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="7" fill="#09090b" />
      {/* Vertical spine bar */}
      <rect x="7" y="6" width="3.5" height="20" rx="1.75" fill="#ffffff" />
      {/* Top horizontal sound bar */}
      <rect x="12" y="6" width="13" height="3.5" rx="1.75" fill="#ffffff" />
      {/* Middle harmonic wave bar */}
      <rect x="12" y="13.5" width="9" height="3.5" rx="1.75" fill="#ffffff" />
      {/* Acoustic dot accent */}
      <circle cx="23.5" cy="15.25" r="1.75" fill="#10b981" />
    </svg>
  );
}
