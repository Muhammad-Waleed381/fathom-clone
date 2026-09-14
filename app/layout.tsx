import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { FluidHeader } from "@/components/layout/fluid-header";
import { FluidFooter } from "@/components/layout/fluid-footer";

// Reference pairing: Outfit for display headings, Inter for everything else.
// JetBrains Mono is kept for genuinely monospaced UI (timestamps, code).
const displayFont = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600"],
});

const sansFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Fathom — Meeting intelligence that shows its work",
  description:
    "Record, transcribe and act on every meeting. Word-level transcripts, summaries for every audience, and action items you can trace back to the second they were said.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${displayFont.variable} ${sansFont.variable} ${monoFont.variable}`}
    >
      <body className="min-h-screen bg-[#0a0a0a] font-sans text-white antialiased selection:bg-white selection:text-black">
        <SmoothScrollProvider>
          <FluidHeader />
          <main className="relative z-10 min-h-screen">{children}</main>
          <FluidFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
