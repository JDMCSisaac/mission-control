"use client";
import { useCallback, useState } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import { Bot, Brain, Cpu, ChevronDown, ChevronUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const tabs = [
  { id: "agents", label: "Agents", icon: <Bot className="h-3 w-3" /> },
  { id: "models", label: "Models", icon: <Brain className="h-3 w-3" /> },
];

const MODELS = [
  { id: "claude-opus-4", name: "Claude Opus 4", provider: "Anthropic", tier: "L4", contextWindow: "200K", costPer1k: "$0.075", routing: "Complex reasoning, planning, architecture", status: "active" },
  { id: "claude-sonnet-4", name: "Claude Sonnet 4", provider: "Anthropic", tier: "L3", contextWindow: "200K", costPer1k: "$0.015", routing: "Code generation, analysis, general tasks", status: "active" },
  { id: "claude-haiku-3.5", name: "Claude Haiku 3.5", provider: "Anthropic", tier: "L1", contextWindow: "200K", costPer1k: "$0.001", routing: "Simple queries, classification, extraction", status: "active" },
  { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", tier: "L3", contextWindow: "128K", costPer1k: "$0.015", routing: "Fallback, image analysis", status: "standby" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", provider: "Google", tier: "L3", contextWindow: "1M", costPer1k: "$0.007", routing: "Long context, document analysis", status: "standby" },
];

async function fetchAgents() {
  const res = await fetch("/api/agents");
  return res.json();
}

export function AgentsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "agents";
  const fetcher = useCallback(() => fetchAgents(), []);
  const { data, loading } = useAutoRefresh(fetcher);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={4} /></div>;

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Agents</h1>
          <p className="text-xs text-white/30 mt-0.5">{data.stats?.total || 0} agents · {data.stats?.active || 0} active</p>
        </div>
        <TabBar tabs={tabs} layoutId="agents-tab" />
      </div>

      {activeTab === "agents" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data.agents || []).length === 0 ? (
            <div className="col-span-full"><EmptyState icon={<Bot className="h-8 w-8" />} title="No agents registered" description="Add agents to your registry to see them here" /></div>
          ) : (
            (data.agents || []).map((agent: any) => (
              <StaggerItem key={agent.id}>
                <Card className="p-4 cursor-pointer transition-colors hover:border-white/[0.1]" onClick={() => setExpanded(expanded === agent.id ? null : agent.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold ${agent.status === "active" ? "bg-blue-500/15 text-blue-400" : "bg-white/[0.06] text-white/30"}`}>
                        {agent.name?.[0] || "?"}
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/80">{agent.name}</h3>
                        <p className="text-[10px] text-white/30">{agent.role}</p>
                      </div>
                    </div>
                    <Badge variant={agent.status === "active" ? "success" : "default"}>{agent.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="info">{agent.model}</Badge>
                    <Badge>{agent.level}</Badge>
                  </div>
                  <AnimatePresence>
                    {expanded === agent.id && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="pt-3 mt-3 border-t border-white/[0.06] space-y-2">
                          {agent.soul && (
                            <div>
                              <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Soul</p>
                              <p className="text-xs text-white/50 line-clamp-4">{agent.soul}</p>
                            </div>
                          )}
                          <p className="text-[10px] text-white/20 font-mono">{agent.workspace}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="flex justify-end mt-2">
                    {expanded === agent.id ? <ChevronUp className="h-3 w-3 text-white/20" /> : <ChevronDown className="h-3 w-3 text-white/20" />}
                  </div>
                </Card>
              </StaggerItem>
            ))
          )}
        </StaggerGrid>
      )}

      {activeTab === "models" && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    {["Model", "Provider", "Tier", "Context", "Cost/1K", "Routing", "Status"].map(h => (
                      <th key={h} className="text-left p-3 text-[10px] text-white/30 uppercase tracking-wider font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m) => (
                    <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                      <td className="p-3 font-medium text-white/80">{m.name}</td>
                      <td className="p-3 text-white/50">{m.provider}</td>
                      <td className="p-3"><Badge variant="info">{m.tier}</Badge></td>
                      <td className="p-3 font-mono text-white/40">{m.contextWindow}</td>
                      <td className="p-3 font-mono text-white/40">{m.costPer1k}</td>
                      <td className="p-3 text-white/40 max-w-[200px] truncate">{m.routing}</td>
                      <td className="p-3"><Badge variant={m.status === "active" ? "success" : "default"}>{m.status}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </PageTransition>
  );
}
