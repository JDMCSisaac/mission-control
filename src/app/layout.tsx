import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { ConvexClientProvider } from "@/components/convex-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mission Control",
  description: "OpenClaw Mission Control Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#050507] text-white min-h-screen`}>
        <ConvexClientProvider>
          <Nav />
          <main className="mx-auto max-w-[1440px] px-3 md:px-6 py-4 md:py-6">
            {children}
          </main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
