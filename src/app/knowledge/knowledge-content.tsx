"use client";
import { useCallback } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import Link from "next/link";
import { BookOpen, Package, ExternalLink, Star, GitBranch } from "lucide-react";

const tabs = [
  { id: "knowledge", label: "Knowledge", icon: <BookOpen className="h-3 w-3" /> },
  { id: "ecosystem", label: "Ecosystem", icon: <Package className="h-3 w-3" /> },
];

const KNOWLEDGE_ITEMS = [
  { title: "Agent Architecture", category: "Systems", description: "Multi-agent orchestration patterns with memory persistence", updated: "2h ago", tags: ["agents", "architecture"] },
  { title: "Prompt Engineering", category: "AI", description: "Best practices for system prompts, few-shot, and chain-of-thought", updated: "1d ago", tags: ["prompts", "llm"] },
  { title: "Deployment Playbook", category: "Ops", description: "Zero-downtime deployment strategies for agent infrastructure", updated: "3d ago", tags: ["devops", "infra"] },
  { title: "Memory Systems", category: "Systems", description: "SOUL.md, MEMORY.md, daily files, and heartbeat state management", updated: "5h ago", tags: ["memory", "persistence"] },
  { title: "Client Onboarding", category: "Business", description: "Step-by-step process for new client integration", updated: "1w ago", tags: ["clients", "process"] },
  { title: "Security Protocols", category: "Ops", description: "Data handling, access controls, and safety guidelines", updated: "2w ago", tags: ["security", "safety"] },
];

const ECOSYSTEM_PRODUCTS = [
  { slug: "openclaw", name: "OpenClaw", description: "AI agent platform with multi-channel support", category: "Platform", stars: 342, status: "active" },
  { slug: "convex", name: "Convex", description: "Reactive backend-as-a-service", category: "Backend", stars: 12400, status: "active" },
  { slug: "vercel", name: "Vercel", description: "Frontend deployment platform", category: "Hosting", stars: 11200, status: "active" },
  { slug: "nextjs", name: "Next.js", description: "React framework for production", category: "Framework", stars: 120000, status: "active" },
  { slug: "tailwindcss", name: "Tailwind CSS", description: "Utility-first CSS framework", category: "Styling", stars: 78000, status: "active" },
  { slug: "framer-motion", name: "Framer Motion", description: "Production-ready motion library for React", category: "Animation", stars: 22000, status: "active" },
];

async function fetchKnowledge() {
  return { items: KNOWLEDGE_ITEMS, products: ECOSYSTEM_PRODUCTS };
}

export function KnowledgeContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "knowledge";
  const fetcher = useCallback(() => fetchKnowledge(), []);
  const { data, loading } = useAutoRefresh(fetcher, 60000);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={6} /></div>;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Knowledge</h1>
          <p className="text-xs text-white/30 mt-0.5">Documentation & ecosystem</p>
        </div>
        <TabBar tabs={tabs} layoutId="knowledge-tab" />
      </div>

      {activeTab === "knowledge" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.items.map((item: any, i: number) => (
            <StaggerItem key={item.title}>
              <Card className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={item.category === "Systems" ? "info" : item.category === "AI" ? "purple" : item.category === "Ops" ? "success" : "warning"}>
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-white/20">{item.updated}</span>
                </div>
                <h3 className="text-sm font-medium text-white/80 mb-1">{item.title}</h3>
                <p className="text-xs text-white/40 mb-3 flex-1">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag: string) => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-white/25">{tag}</span>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}

      {activeTab === "ecosystem" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.products.map((product: any) => (
            <StaggerItem key={product.slug}>
              <Link href={`/ecosystem/${product.slug}`}>
                <Card className="p-4 h-full hover:border-white/[0.1] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="info">{product.category}</Badge>
                    <div className="flex items-center gap-1 text-[10px] text-amber-400/60">
                      <Star className="h-3 w-3" />
                      {product.stars >= 1000 ? `${(product.stars / 1000).toFixed(1)}k` : product.stars}
                    </div>
                  </div>
                  <h3 className="text-sm font-medium text-white/80 mb-1 flex items-center gap-1.5">
                    {product.name}
                    <ExternalLink className="h-3 w-3 text-white/20" />
                  </h3>
                  <p className="text-xs text-white/40">{product.description}</p>
                </Card>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  );
}
