"use client";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users, UserPlus, DollarSign, ClipboardList,
  Activity, TrendingUp, Target, ArrowRight, CheckCircle2, Banknote
} from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/credit-repair-data";
import { formatCurrency } from "@/lib/utils";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function HomeContent() {
  const stats = useQuery(api.clients.getStats);
  const fundingStats = useQuery(api.fundingClients.getStats);
  const clients = useQuery(api.clients.list);
  const activityItems = useQuery(api.activity.list);

  if (!stats || !fundingStats || !clients || !activityItems) {
    return (
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-white/90">Credit Repair Command Center</h1>
          <p className="text-xs text-white/30 mt-0.5">Loading...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="p-4 animate-pulse"><div className="h-10 bg-white/[0.04] rounded" /></Card>
          ))}
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Credit Repair Command Center</h1>
        <p className="text-xs text-white/30 mt-0.5">Business overview · Jake&apos;s Credit Repair</p>
      </div>

      {/* Top Stats */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-blue-400" },
          { label: "New Leads", value: stats.newLeadsThisWeek, icon: UserPlus, color: "text-emerald-400" },
          { label: "Revenue (Month)", value: formatCurrency(stats.revenueThisMonth), icon: DollarSign, color: "text-amber-400" },
          { label: "Pending Onboarding", value: stats.pendingOnboarding, icon: ClipboardList, color: "text-orange-400" },
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
        {/* Left Column */}
        <StaggerGrid className="lg:col-span-2 space-y-4">
          {/* Pipeline Summary */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-3.5 w-3.5 text-blue-400" />Pipeline</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {PIPELINE_STAGES.map((stage) => {
                    const count = stats.pipelineCounts[stage.id] || 0;
                    const maxCount = Math.max(...Object.values(stats.pipelineCounts));
                    const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={stage.id} className="flex items-center gap-3 py-1.5">
                        <span className={`text-[10px] font-medium w-28 shrink-0 ${stage.color}`}>{stage.label}</span>
                        <div className="flex-1 h-5 rounded-lg bg-white/[0.03] overflow-hidden relative">
                          <div
                            className="h-full rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-500/40 transition-all duration-500"
                            style={{ width: `${width}%` }}
                          />
                          <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono text-white/50">{count}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Recent Activity */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-purple-400" />Recent Activity</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activityItems.map((a) => {
                    const elapsed = Date.now() - a.createdAt;
                    const minutes = Math.floor(elapsed / 60000);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const timeStr = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : `${minutes}m ago`;
                    return (
                      <div key={a._id} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                        <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${a.type === "success" ? "bg-emerald-400" : a.type === "action" ? "bg-blue-400" : "bg-amber-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/60">{a.text}</p>
                        </div>
                        <span className="text-[10px] text-white/20 shrink-0">{timeStr}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>

        {/* Right Column */}
        <StaggerGrid className="space-y-4">
          {/* Dispute Status */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5 text-pink-400" />Team Workload</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-pink-500/[0.06] border border-pink-500/[0.1]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-pink-400">Kim&apos;s Team (L1)</span>
                      <Badge variant="default">{stats.withKim} clients</Badge>
                    </div>
                    <p className="text-[10px] text-white/30">4 Round Sweep</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/[0.06] border border-purple-500/[0.1]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-purple-400">Victor&apos;s Team (L2)</span>
                      <Badge variant="default">{stats.withVictor} clients</Badge>
                    </div>
                    <p className="text-[10px] text-white/30">VIP Advanced Litigation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Revenue Breakdown */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-3.5 w-3.5 text-amber-400" />Revenue</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-white/40">L1 (4 Round Sweep)</span>
                    <span className="text-xs font-medium text-white/70">{formatCurrency(stats.l1.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-white/40">L2 (VIP Litigation)</span>
                    <span className="text-xs font-medium text-white/70">{formatCurrency(stats.l2.revenue)}</span>
                  </div>
                  <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
                    <span className="text-xs text-white/50 font-medium">Total</span>
                    <span className="text-sm font-semibold text-amber-400">{formatCurrency(stats.totalRevenue)}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-white/30">Goal: {formatCurrency(stats.revenueGoal)}</span>
                      <span className="text-[10px] text-white/30">{Math.round((stats.totalRevenue / stats.revenueGoal) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400" style={{ width: `${Math.min((stats.totalRevenue / stats.revenueGoal) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Onboarding Queue */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5 text-orange-400" />Onboarding Queue</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clients.filter(c => c.stage === "onboarding").map(c => (
                    <div key={c._id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-white/70">{c.name}</span>
                        <span className="text-[10px] text-orange-400">{c.onboardingProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-orange-400/60" style={{ width: `${c.onboardingProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-white/30 mt-1.5">{c.nextAction}</p>
                    </div>
                  ))}
                  {clients.filter(c => c.stage === "onboarding").length === 0 && (
                    <div className="flex items-center gap-2 text-xs text-white/30 py-4 justify-center">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      All caught up!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>
      </div>

      {/* Funding Overview */}
      <StaggerItem>
        <Link href="/funding">
          <Card className="mt-4 p-4 cursor-pointer transition-all hover:border-emerald-500/20 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.04] to-cyan-500/[0.04] pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white/80">Funding Division</h3>
                  <p className="text-[10px] text-white/30">Credit card stacking &amp; business funding</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-lg font-semibold text-emerald-400">{formatCurrency(fundingStats.totalFunded)}</p>
                  <p className="text-[10px] text-white/30">Total Funded</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white/60">{fundingStats.activeClients}</p>
                  <p className="text-[10px] text-white/30">Active Clients</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-cyan-400">{fundingStats.successRate}%</p>
                  <p className="text-[10px] text-white/30">Success Rate</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-emerald-400 transition-colors" />
              </div>
            </div>
          </Card>
        </Link>
      </StaggerItem>
    </PageTransition>
  );
}
