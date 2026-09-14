import type { Metadata } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { FluidHeader } from "@/components/layout/fluid-header";
import { FluidFooter } from "@/components/layout/fluid-footer";

const serifFont = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "FATHOM — Autonomous Meeting Intelligence & Verification",
  description:
    "Private, high-fidelity meeting intelligence powered by synchronized audio diarization and compute-backed verification.",
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
    <html lang="en" className={`${serifFont.variable} ${monoFont.variable}`}>
      <body className="font-mono bg-[#FFFFFF] text-[#0B0B0B] antialiased selection:bg-[#0B0B0B] selection:text-white">
        <SmoothScrollProvider>
          <FluidHeader />
          <main className="min-h-screen">{children}</main>
          <FluidFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
