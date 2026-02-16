"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Settings2, Bot, MessageSquare, Banknote,
  FileText, Users, BookOpen, Wrench, Menu, X
} from "lucide-react";

const items = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/ops", label: "Pipeline", icon: Settings2 },
  { href: "/funding", label: "Funding", icon: Banknote },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/content", label: "Content", icon: FileText },
  { href: "/comms", label: "Clients", icon: Users },
  { href: "/knowledge", label: "Knowledge", icon: BookOpen },
  { href: "/code", label: "Tools", icon: Wrench },
];

export function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050507]/80 backdrop-blur-2xl">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center px-3 gap-1">
        <Link href="/" className="mr-3 flex items-center gap-2 shrink-0">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)]">
            <span className="text-[10px] font-bold text-white">CR</span>
          </div>
          <span className="text-xs font-semibold text-white/80 hidden sm:block tracking-wide">CREDIT REPAIR HQ</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[clamp(10px,1.2vw,12px)] font-medium transition-all duration-200 whitespace-nowrap",
                  isActive ? "text-blue-400" : "text-white/40 hover:text-white/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-blue-500/[0.08] border border-blue-500/[0.12] shadow-[0_0_12px_rgba(59,130,246,0.1)]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <div className="flex-1 md:hidden" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-white/50 hover:text-white/80 transition-colors p-1.5 rounded-lg hover:bg-white/[0.05]"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.12]">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 tracking-wider">LIVE</span>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/[0.06] bg-[#050507]/95 backdrop-blur-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-2 gap-0.5">
              {items.map(({ href, label, icon: Icon }) => {
                const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                      isActive ? "text-blue-400 bg-blue-500/[0.08]" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
