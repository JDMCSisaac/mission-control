"use client";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCards } from "@/components/loading-cards";
import { useCallback } from "react";
import {
  Activity, Bot, MessageSquare, FileText, AlertTriangle,
  CheckCircle2, Clock, DollarSign, Server, Zap
} from "lucide-react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";

async function fetchDashboard() {
  const [health, agents, revenue, crons, priorities, observations] = await Promise.all([
    fetch("/api/health").then(r => r.json()),
    fetch("/api/agents").then(r => r.json()),
    fetch("/api/revenue").then(r => r.json()),
    fetch("/api/cron-health").then(r => r.json()),
    fetch("/api/priorities").then(r => r.json()),
    fetch("/api/observations").then(r => r.json()),
  ]);
  return { health, agents, revenue, crons, priorities, observations };
}

export default function HomePage() {
  const fetcher = useCallback(() => fetchDashboard(), []);
  const { data, loading } = useAutoRefresh(fetcher);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={8} /></div>;

  const { health, agents, revenue, crons, priorities, observations } = data;
  const failedCrons = (crons.jobs || []).filter((j: any) => j.lastStatus === "error");

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Mission Control</h1>
        <p className="text-xs text-white/30 mt-0.5">System overview · Auto-refreshing every 15s</p>
      </div>

      <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Uptime", value: health.uptimeFormatted, icon: Clock, color: "text-emerald-400" },
          { label: "Agents", value: `${agents.stats?.active || 0}/${agents.stats?.total || 0}`, icon: Bot, color: "text-blue-400" },
          { label: "MRR", value: formatCurrency(revenue.mrr || 0), icon: DollarSign, color: "text-amber-400" },
          { label: "Cron Errors", value: failedCrons.length, icon: failedCrons.length > 0 ? AlertTriangle : CheckCircle2, color: failedCrons.length > 0 ? "text-red-400" : "text-emerald-400" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-xl font-semibold text-white/90">{stat.value}</p>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StaggerGrid className="lg:col-span-2 space-y-4">
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-blue-400" />Priorities</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(priorities.priorities || []).map((p: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <span className="text-[10px] font-mono text-white/20 mt-0.5 w-4">{String(i + 1).padStart(2, "0")}</span>
                      <p className="text-xs text-white/60 leading-relaxed">{p}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-purple-400" />Observations</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(observations.observations || []).map((o: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 py-1.5">
                      <div className="h-1 w-1 rounded-full bg-white/20 mt-1.5 shrink-0" />
                      <p className="text-xs text-white/50">{o}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>

        <StaggerGrid className="space-y-4">
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Bot className="h-3.5 w-3.5 text-blue-400" />Agents</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(agents.agents || []).map((a: any) => (
                    <div key={a.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${a.status === "active" ? "bg-emerald-400" : "bg-white/20"}`} />
                        <span className="text-xs text-white/70">{a.name}</span>
                      </div>
                      <Badge variant={a.status === "active" ? "success" : "default"}>{a.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-3.5 w-3.5 text-emerald-400" />Cron Jobs</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {(crons.jobs || []).map((j: any) => (
                    <div key={j.name} className="flex items-center justify-between py-1">
                      <span className="text-xs text-white/60 font-mono">{j.name}</span>
                      <Badge variant={j.lastStatus === "ok" ? "success" : "danger"}>{j.lastStatus}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-amber-400" />Revenue</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: "This Month", value: formatCurrency(revenue.currentMonth?.revenue || 0) },
                    { label: "Burn", value: formatCurrency(revenue.currentMonth?.burn || 0) },
                    { label: "Net", value: formatCurrency(revenue.currentMonth?.net || 0) },
                    { label: "YTD", value: formatCurrency(revenue.ytd?.revenue || 0) },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center justify-between py-1">
                      <span className="text-xs text-white/40">{r.label}</span>
                      <span className="text-xs font-medium text-white/70">{r.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>
      </div>
    </PageTransition>
  );
}
