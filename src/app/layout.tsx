import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Providers from "@/context/Providers";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "GIZMONEPAL — Premium Gadgets, Nepal",
  description: "Phones, tablets, drones, watches and more — curated and shipped across Nepal.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-[radial-gradient(circle_at_15%_8%,#dde3ff_0%,transparent_45%),radial-gradient(circle_at_85%_92%,#ffe9d1_0%,transparent_40%),#eef0f4] font-body text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
