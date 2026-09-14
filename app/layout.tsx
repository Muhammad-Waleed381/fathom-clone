import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { FluidHeader } from "@/components/layout/fluid-header";
import { FluidFooter } from "@/components/layout/fluid-footer";

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
    <html lang="en" className="dark">
      <body className="font-sans bg-[#0A0A0A] text-white antialiased selection:bg-white selection:text-black min-h-screen">
        <SmoothScrollProvider>
          <FluidHeader />
          <main className="min-h-screen relative z-10">{children}</main>
          <FluidFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
