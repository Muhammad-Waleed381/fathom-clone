import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/smooth-scroll-provider";
import { FluidHeader } from "@/components/layout/fluid-header";
import { FluidFooter } from "@/components/layout/fluid-footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fathom — AI Meeting Assistant & Intelligence",
  description: "Synchronized meeting recordings, multi-speaker diarization, dynamic AI templates, and interactive action items.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SmoothScrollProvider>
          <FluidHeader />
          <main className="min-h-screen">{children}</main>
          <FluidFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
