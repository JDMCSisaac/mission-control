"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Settings2, Bot, MessageSquare, Banknote,
  FileText, Users, BookOpen, Wrench
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl">
      <div className="mx-auto flex h-12 max-w-[1440px] items-center px-3 gap-1">
        <Link href="/" className="mr-3 flex items-center gap-2 shrink-0">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">CR</span>
          </div>
          <span className="text-xs font-semibold text-white/80 hidden sm:block">CREDIT REPAIR HQ</span>
        </Link>
        <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[clamp(10px,1.2vw,12px)] font-medium transition-colors whitespace-nowrap",
                  isActive ? "text-blue-400" : "text-white/40 hover:text-white/70"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-blue-500/[0.08] border border-blue-500/[0.12]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                  />
                )}
                <Icon className="h-3.5 w-3.5 relative z-10 shrink-0" />
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/[0.12]">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-medium text-emerald-400 tracking-wider">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  );
}
