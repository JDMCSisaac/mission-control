"use client";
import { useState } from "react";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddClientModal } from "@/components/add-client-modal";
import { LogRevenueModal } from "@/components/log-revenue-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Link from "next/link";
import {
  Users, UserPlus, DollarSign, ClipboardList,
  Activity, TrendingUp, Target, ArrowRight, CheckCircle2, Banknote, Plus, Trash2
} from "lucide-react";
import { PIPELINE_STAGES } from "@/lib/credit-repair-data";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import type { Id } from "../../convex/_generated/dataModel";

export default function HomeContent() {
  const stats = useQuery(api.clients.getStats);
  const fundingStats = useQuery(api.fundingClients.getStats);
  const clients = useQuery(api.clients.list);
  const activityItems = useQuery(api.activity.list);
  const revenueStats = useQuery(api.revenue.getStats);
  const revenueEntries = useQuery(api.revenue.list);
  const deleteRevenue = useMutation(api.revenue.deleteRevenue);

  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"revenue">; name: string } | null>(null);

  if (!stats || !fundingStats || !clients || !activityItems) {
    return (
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-white/90 tracking-tight">Credit Repair Command Center</h1>
          <p className="text-xs text-white/30 mt-0.5">Loading...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => (
            <Card key={i} className="p-4"><div className="h-12 rounded-lg animate-shimmer" /></Card>
          ))}
        </div>
      </PageTransition>
    );
  }

  const totalRevenue = revenueStats?.totalRevenue ?? stats.totalRevenue;
  const thisMonthRevenue = revenueStats?.thisMonthRevenue ?? stats.revenueThisMonth;

  const handleDeleteRevenue = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRevenue({ id: deleteTarget.id });
      toast.success("Revenue entry deleted");
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteTarget(null);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white/90 tracking-tight">Credit Repair Command Center</h1>
          <p className="text-xs text-white/40 mt-1">Business overview · Jake&apos;s Credit Repair</p>
        </div>
        <div className="flex items-center gap-2">
          <AddClientModal>
            <Button variant="primary" size="sm">
              <Plus className="h-3 w-3 mr-1" /> Add Client
            </Button>
          </AddClientModal>
          <LogRevenueModal>
            <Button variant="success" size="sm">
              <DollarSign className="h-3 w-3 mr-1" /> Log Revenue
            </Button>
          </LogRevenueModal>
        </div>
      </div>

      {/* Top Stats */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-blue-400", glow: "shadow-[0_0_20px_rgba(59,130,246,0.1)]" },
          { label: "New Leads", value: stats.newLeadsThisWeek, icon: UserPlus, color: "text-emerald-400", glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]" },
          { label: "Revenue (Month)", value: formatCurrency(thisMonthRevenue), icon: DollarSign, color: "text-amber-400", glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]" },
          { label: "Pending Onboarding", value: stats.pendingOnboarding, icon: ClipboardList, color: "text-orange-400", glow: "shadow-[0_0_20px_rgba(249,115,22,0.1)]" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className={`p-4 ${stat.glow}`}>
              <div className="flex items-center justify-between mb-3">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
              <p className="text-2xl font-semibold text-white/90 tracking-tight stat-glow">{stat.value}</p>
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
                      <div key={stage.id} className="flex items-center gap-3 py-1.5 group">
                        <span className={`text-[10px] font-medium w-28 shrink-0 ${stage.color}`}>{stage.label}</span>
                        <div className="flex-1 h-6 rounded-lg bg-white/[0.03] overflow-hidden relative">
                          <div
                            className="h-full rounded-lg bg-gradient-to-r from-blue-500/20 to-blue-500/40 transition-all duration-700 ease-out"
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
                <div className="space-y-1">
                  {activityItems.map((a) => {
                    const elapsed = Date.now() - a.createdAt;
                    const minutes = Math.floor(elapsed / 60000);
                    const hours = Math.floor(minutes / 60);
                    const days = Math.floor(hours / 24);
                    const timeStr = days > 0 ? `${days}d ago` : hours > 0 ? `${hours}h ago` : minutes > 0 ? `${minutes}m ago` : "just now";
                    return (
                      <div key={a._id} className="flex items-start gap-3 py-2.5 border-b border-white/[0.04] last:border-0 group hover:bg-white/[0.02] rounded-lg px-2 -mx-2 transition-colors">
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${a.type === "success" ? "bg-emerald-400" : a.type === "action" ? "bg-blue-400" : "bg-amber-400"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white/60 leading-relaxed">{a.text}</p>
                        </div>
                        <span className="text-[10px] text-white/20 shrink-0 font-medium">{timeStr}</span>
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
          {/* Team Workload */}
          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><ClipboardList className="h-3.5 w-3.5 text-pink-400" />Team Workload</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-pink-500/[0.06] border border-pink-500/[0.1] transition-all hover:border-pink-500/[0.2]">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-pink-400">Kim&apos;s Team (L1)</span>
                      <Badge variant="default">{stats.withKim} clients</Badge>
                    </div>
                    <p className="text-[10px] text-white/30">4 Round Sweep</p>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/[0.06] border border-purple-500/[0.1] transition-all hover:border-purple-500/[0.2]">
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
                  Revenue
                  <LogRevenueModal>
                    <button className="ml-auto text-[10px] px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all hover:shadow-[0_0_12px_rgba(245,158,11,0.15)] active:scale-95">+ Log</button>
                  </LogRevenueModal>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-white/40">Credit Repair</span>
                    <span className="text-xs font-medium text-white/70">{formatCurrency(revenueStats?.creditRepairRevenue ?? stats.l1.revenue + stats.l2.revenue)}</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-white/40">Funding</span>
                    <span className="text-xs font-medium text-white/70">{formatCurrency(revenueStats?.fundingRevenue ?? 0)}</span>
                  </div>
                  <div className="border-t border-white/[0.06] pt-2 flex items-center justify-between">
                    <span className="text-xs text-white/50 font-medium">Total</span>
                    <span className="text-sm font-semibold text-amber-400">{formatCurrency(totalRevenue)}</span>
                  </div>

                  {/* Progress ring */}
                  <div className="flex items-center gap-4 mt-2">
                    <div className="relative h-16 w-16 shrink-0">
                      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 64 64">
                        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="5" />
                        <circle cx="32" cy="32" r="26" fill="none" stroke="url(#revGradient)" strokeWidth="5"
                          strokeDasharray={`${Math.min((totalRevenue / stats.revenueGoal) * 163.4, 163.4)} 163.4`}
                          strokeLinecap="round" className="animate-progress-ring" />
                        <defs><linearGradient id="revGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#f59e0b" /><stop offset="100%" stopColor="#f97316" /></linearGradient></defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-white/80">{Math.round((totalRevenue / stats.revenueGoal) * 100)}%</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] text-white/30 mb-1">Goal: {formatCurrency(stats.revenueGoal)}</p>
                      <p className="text-[10px] text-white/30">{formatCurrency(stats.revenueGoal - totalRevenue)} remaining</p>
                    </div>
                  </div>

                  {/* Recent revenue entries with delete */}
                  {revenueEntries && revenueEntries.length > 0 && (
                    <div className="mt-3 space-y-1 border-t border-white/[0.06] pt-3">
                      <p className="text-[10px] text-white/25 uppercase tracking-wider mb-2 font-medium">Recent Entries</p>
                      {revenueEntries.slice(0, 5).map(entry => (
                        <div key={entry._id} className="flex items-center justify-between text-[10px] py-1.5 group hover:bg-white/[0.02] rounded-lg px-1.5 -mx-1.5 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${entry.type === "credit-repair" ? "bg-blue-400" : "bg-emerald-400"}`} />
                            <span className="text-white/50">{entry.clientName || entry.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-white/60 font-medium">{formatCurrency(entry.amount)}</span>
                            <button
                              onClick={() => setDeleteTarget({ id: entry._id, name: `${formatCurrency(entry.amount)} - ${entry.clientName || entry.type}` })}
                              className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    <div key={c._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] transition-all hover:border-white/[0.08]">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-white/70">{c.name}</span>
                        <span className="text-[10px] text-orange-400 font-medium">{c.onboardingProgress}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-700" style={{ width: `${c.onboardingProgress}%` }} />
                      </div>
                      <p className="text-[10px] text-white/30 mt-1.5">→ {c.nextAction}</p>
                    </div>
                  ))}
                  {clients.filter(c => c.stage === "onboarding").length === 0 && (
                    <div className="flex items-center gap-2 text-xs text-white/30 py-6 justify-center">
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
          <Card className="mt-4 p-4 cursor-pointer group relative overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.04] to-cyan-500/[0.04] pointer-events-none" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.3)]">
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
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white/60">{fundingStats.activeClients}</p>
                  <p className="text-[10px] text-white/30">Active Clients</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-cyan-400">{fundingStats.successRate}%</p>
                  <p className="text-[10px] text-white/30">Success Rate</p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/20 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Card>
        </Link>
      </StaggerItem>

      {/* Delete Revenue Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Revenue Entry?"
        description="This action cannot be undone."
        itemName={deleteTarget?.name}
        onConfirm={handleDeleteRevenue}
      />
    </PageTransition>
  );
}
