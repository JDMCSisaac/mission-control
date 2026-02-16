"use client";
import { useState } from "react";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AddFundingClientModal } from "@/components/add-funding-client-modal";
import { EditFundingClientModal } from "@/components/edit-funding-client-modal";
import { AddApplicationModal } from "@/components/add-application-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  Users, DollarSign, TrendingUp, Target, CreditCard,
  CheckCircle2, Clock, XCircle, Banknote, BarChart3,
  Zap, Trophy, Layers, Plus, Trash2
} from "lucide-react";
import { FUNDING_PIPELINE_STAGES, FUNDING_PRODUCTS } from "@/lib/funding-data";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

export default function FundingContent() {
  const stats = useQuery(api.fundingClients.getStats);
  const fundingClientsWithApps = useQuery(api.fundingClients.listWithApplications);
  const allApplications = useQuery(api.applications.listAll);
  const updateAppStatus = useMutation(api.applications.updateApplicationStatus);
  const deleteApp = useMutation(api.applications.deleteApplication);
  const updateFundingClient = useMutation(api.fundingClients.updateFundingClient);
  const deleteFundingClient = useMutation(api.fundingClients.deleteFundingClient);

  const [editingClient, setEditingClient] = useState<Doc<"fundingClients"> | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: "client" | "app"; id: string; name: string } | null>(null);

  const isLoading = !stats || !fundingClientsWithApps || !allApplications;

  if (isLoading) {
    return (
      <PageTransition>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.3)]">
              <Banknote className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white/90 tracking-tight">Funding Command Center</h1>
              <p className="text-xs text-white/30">Loading...</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {[1,2,3,4,5,6].map(i => (
            <Card key={i} className="p-4"><div className="h-16 rounded-lg animate-shimmer" /></Card>
          ))}
        </div>
      </PageTransition>
    );
  }

  const pendingApps = allApplications.filter(a => a.status === "pending");
  const approvedApps = allApplications.filter(a => a.status === "approved");
  const deniedApps = allApplications.filter(a => a.status === "denied");

  const clientNameMap: Record<string, string> = {};
  for (const fc of fundingClientsWithApps) {
    clientNameMap[fc._id] = fc.name;
  }

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "client") {
        await deleteFundingClient({ id: deleteTarget.id as Id<"fundingClients"> });
      } else {
        await deleteApp({ id: deleteTarget.id as Id<"applications"> });
      }
      toast.success(`${deleteTarget.name} deleted`);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteTarget(null);
  };

  const handleApprove = async (app: Doc<"applications">) => {
    const amount = prompt("Approved amount:", String(app.amountRequested));
    if (amount !== null) {
      try {
        await updateAppStatus({ id: app._id, status: "approved", amountApproved: Number(amount) || 0 });
        toast.success("Application approved! 🎉");
      } catch {
        toast.error("Failed to approve");
      }
    }
  };

  const handleDeny = async (app: Doc<"applications">) => {
    try {
      await updateAppStatus({ id: app._id, status: "denied" });
      toast("Application denied");
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleStatusCycle = async (app: Doc<"applications">) => {
    const statusOrder: Array<"pending" | "approved" | "denied"> = ["pending", "approved", "denied"];
    const currentIdx = statusOrder.indexOf(app.status);
    const nextStatus = statusOrder[(currentIdx + 1) % statusOrder.length];
    try {
      if (nextStatus === "approved") {
        const amount = prompt("Approved amount:", String(app.amountRequested));
        if (amount === null) return;
        await updateAppStatus({ id: app._id, status: "approved", amountApproved: Number(amount) || 0 });
      } else {
        await updateAppStatus({ id: app._id, status: nextStatus });
      }
      toast.success(`Status → ${nextStatus}`);
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <PageTransition>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 mb-1">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-[0_0_16px_rgba(16,185,129,0.3)]">
              <Banknote className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white/90 tracking-tight">Funding Command Center</h1>
              <p className="text-xs text-white/40">Credit card stacking &amp; business funding · Jake&apos;s Capital Division</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AddApplicationModal>
              <Button variant="default" size="sm">
                <CreditCard className="h-3 w-3 mr-1" /> Add App
              </Button>
            </AddApplicationModal>
            <AddFundingClientModal>
              <Button variant="primary" size="sm">
                <Plus className="h-3 w-3 mr-1" /> Add Client
              </Button>
            </AddFundingClientModal>
          </div>
        </div>
      </div>

      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {[
          { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-blue-400", accent: "from-blue-500/20 to-blue-500/5", glow: "shadow-[0_0_20px_rgba(59,130,246,0.08)]" },
          { label: "Total Funded", value: formatCurrency(stats.totalFunded), icon: DollarSign, color: "text-emerald-400", accent: "from-emerald-500/20 to-emerald-500/5", glow: "shadow-[0_0_20px_rgba(16,185,129,0.08)]" },
          { label: "Funded This Month", value: formatCurrency(stats.fundedThisMonth), icon: TrendingUp, color: "text-cyan-400", accent: "from-cyan-500/20 to-cyan-500/5", glow: "shadow-[0_0_20px_rgba(6,182,212,0.08)]" },
          { label: "Avg Per Client", value: formatCurrency(stats.avgFunding), icon: BarChart3, color: "text-amber-400", accent: "from-amber-500/20 to-amber-500/5", glow: "shadow-[0_0_20px_rgba(245,158,11,0.08)]" },
          { label: "Pending Apps", value: stats.pendingApps, icon: Clock, color: "text-orange-400", accent: "from-orange-500/20 to-orange-500/5", glow: "shadow-[0_0_20px_rgba(249,115,22,0.08)]" },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: Target, color: "text-purple-400", accent: "from-purple-500/20 to-purple-500/5", glow: "shadow-[0_0_20px_rgba(139,92,246,0.08)]" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className={`p-4 relative overflow-hidden ${stat.glow}`}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-semibold text-white/90 tracking-tight">{stat.value}</p>
                <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{stat.label}</span>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <StaggerGrid className="lg:col-span-2 space-y-4">
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-blue-400" />
                  Funding Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {FUNDING_PIPELINE_STAGES.map((stage) => {
                    const stageClients = fundingClientsWithApps.filter(c => c.stage === stage.id);
                    const count = stageClients.length;
                    const maxCount = Math.max(...Object.values(stats.pipelineCounts), 1);
                    const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={stage.id}>
                        <div className="flex items-center gap-3 py-1.5">
                          <span className={`text-[10px] font-semibold w-32 shrink-0 ${stage.color}`}>{stage.label}</span>
                          <div className="flex-1 h-6 rounded-lg bg-white/[0.03] overflow-hidden relative">
                            <div className="h-full rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/30 transition-all duration-700" style={{ width: `${Math.max(width, count > 0 ? 8 : 0)}%` }} />
                            <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono text-white/50">{count}</span>
                          </div>
                        </div>
                        {stageClients.length > 0 && (
                          <div className="ml-36 mb-2 space-y-1.5">
                            {stageClients.map(client => (
                              <div key={client._id} className={`p-2.5 rounded-xl border ${stage.bg} transition-all duration-200 hover:border-white/[0.15] hover:scale-[1.01] group cursor-pointer`} onClick={() => setEditingClient(client)}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-white/70">{client.name}</span>
                                    <span className="text-[10px] text-white/30">·</span>
                                    <span className="text-[10px] text-white/40">{client.businessName}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-white/30">{client.creditScoreRange}</span>
                                    {"bureauCounts" in client && (
                                      <div className="flex items-center gap-1 text-[8px]">
                                        <span className="px-1 py-0.5 rounded bg-red-500/10 text-red-400/60" title="Experian">EX:{(client as any).bureauCounts.experian}</span>
                                        <span className="px-1 py-0.5 rounded bg-blue-500/10 text-blue-400/60" title="Equifax">EQ:{(client as any).bureauCounts.equifax}</span>
                                        <span className="px-1 py-0.5 rounded bg-emerald-500/10 text-emerald-400/60" title="TransUnion">TU:{(client as any).bureauCounts.transunion}</span>
                                      </div>
                                    )}
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: "client", id: client._id, name: client.name }); }}
                                      className="opacity-0 group-hover:opacity-100 transition-all text-white/20 hover:text-red-400"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-[10px] text-white/30">{formatCurrency(client.approvedSoFar)} / {formatCurrency(client.targetFunding)}</span>
                                      <span className="text-[10px] text-white/40">{client.cardsApproved} cards</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                      <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700" style={{ width: `${Math.min((client.approvedSoFar / client.targetFunding) * 100, 100)}%` }} />
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-all" onClick={e => e.stopPropagation()}>
                                  <select value={client.stage} onChange={e => {
                                    updateFundingClient({ id: client._id, stage: e.target.value });
                                    toast.success(`Moved to ${FUNDING_PIPELINE_STAGES.find(s => s.id === e.target.value)?.label}`);
                                  }} className="w-full text-[9px] rounded-lg bg-white/[0.06] border border-white/[0.1] px-1.5 py-0.5 text-white/50 focus:outline-none">
                                    {FUNDING_PIPELINE_STAGES.map(s => (<option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.label}</option>))}
                                  </select>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-orange-400" />
                  Active Applications Tracker
                  <Badge variant="default" className="ml-auto">{pendingApps.length} pending</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full table-zebra">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-left py-2 px-2 font-semibold">Client</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-left py-2 px-2 font-semibold">Bank / Product</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-right py-2 px-2 font-semibold">Requested</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-center py-2 px-2 font-semibold">Bureau</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-center py-2 px-2 font-semibold">Status</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-right py-2 px-2 font-semibold">Date</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-center py-2 px-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingApps.map((app) => (
                        <tr key={app._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                          <td className="text-xs text-white/60 py-2.5 px-2">{clientNameMap[app.fundingClientId] || "—"}</td>
                          <td className="py-2.5 px-2"><span className="text-xs text-white/70">{app.bank}</span><br /><span className="text-[10px] text-white/30">{app.product}</span></td>
                          <td className="text-xs text-white/60 text-right py-2.5 px-2">{formatCurrency(app.amountRequested)}</td>
                          <td className="text-center py-2.5 px-2"><span className="text-[10px] text-white/40 uppercase">{app.bureau || "—"}</span></td>
                          <td className="text-center py-2.5 px-2">
                            <button
                              onClick={() => handleStatusCycle(app)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.12] text-[10px] text-amber-400 hover:bg-amber-500/[0.15] transition-all cursor-pointer"
                            >
                              <Clock className="h-2.5 w-2.5" /> Pending
                            </button>
                          </td>
                          <td className="text-[10px] text-white/40 text-right py-2.5 px-2">{app.dateSubmitted}</td>
                          <td className="text-center py-2.5 px-2">
                            <div className="flex items-center gap-1 justify-center">
                              <button onClick={() => handleApprove(app)} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all active:scale-95">✓ Approve</button>
                              <button onClick={() => handleDeny(app)} className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all active:scale-95">✗ Deny</button>
                              <button onClick={() => setDeleteTarget({ type: "app", id: app._id, name: `${app.bank} - ${app.product}` })} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/30 hover:text-red-400 transition-all active:scale-95">🗑</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {approvedApps.slice(0, 5).map((app) => (
                        <tr key={app._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors group">
                          <td className="text-xs text-white/60 py-2.5 px-2">{clientNameMap[app.fundingClientId] || "—"}</td>
                          <td className="py-2.5 px-2"><span className="text-xs text-white/70">{app.bank}</span><br /><span className="text-[10px] text-white/30">{app.product}</span></td>
                          <td className="text-xs text-white/60 text-right py-2.5 px-2">{formatCurrency(app.amountApproved)}</td>
                          <td className="text-center py-2.5 px-2"><span className="text-[10px] text-white/40 uppercase">{app.bureau || "—"}</span></td>
                          <td className="text-center py-2.5 px-2">
                            <button
                              onClick={() => handleStatusCycle(app)}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.12] text-[10px] text-emerald-400 hover:bg-emerald-500/[0.15] transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5" /> Approved
                            </button>
                          </td>
                          <td className="text-[10px] text-white/40 text-right py-2.5 px-2">{app.dateSubmitted}</td>
                          <td className="text-center py-2.5 px-2">
                            <button
                              onClick={() => setDeleteTarget({ type: "app", id: app._id, name: `${app.bank} - ${app.product}` })}
                              className="opacity-0 group-hover:opacity-100 text-[9px] text-white/20 hover:text-red-400 transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="h-3.5 w-3.5 text-amber-400" />Funding Strategies</CardTitle></CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FUNDING_PRODUCTS.map((product) => (
                    <div key={product.name} className={`p-3 rounded-xl border ${product.bgColor} transition-all duration-200 hover:border-white/[0.15] hover:scale-[1.01]`}>
                      <div className="flex items-center gap-2 mb-2"><span className="text-lg">{product.icon}</span><span className={`text-xs font-semibold ${product.color}`}>{product.name}</span></div>
                      <p className="text-[10px] text-white/40 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between"><span className="text-[10px] text-white/50 font-medium">{product.approvalRange}</span></div>
                      <p className="text-[10px] text-white/25 mt-1">{product.requirements}</p>
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
              <CardHeader><CardTitle className="flex items-center gap-2"><Trophy className="h-3.5 w-3.5 text-amber-400" />Funding Leaderboard</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentWins.slice(0, 8).map((client: { _id: string; name: string; businessName: string; approvedSoFar: number }, i: number) => (
                    <div key={client._id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] rounded-lg px-1 -mx-1 transition-colors">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i === 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : i === 1 ? "bg-white/[0.06] text-white/50 border border-white/[0.1]" : i === 2 ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-white/[0.03] text-white/30 border border-white/[0.06]"}`}>{i + 1}</div>
                      <div className="flex-1 min-w-0"><p className="text-xs text-white/70 font-medium truncate">{client.name}</p><p className="text-[10px] text-white/30 truncate">{client.businessName}</p></div>
                      <span className="text-xs font-semibold text-emerald-400 shrink-0">{formatCurrency(client.approvedSoFar)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><DollarSign className="h-3.5 w-3.5 text-emerald-400" />Funding Revenue</CardTitle></CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.1]"><span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">Total Revenue (10% fee)</span><p className="text-xl font-semibold text-emerald-400 mt-1">{formatCurrency(stats.totalRevenue)}</p></div>
                  <div className="p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/[0.1]"><span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">This Month</span><p className="text-lg font-semibold text-cyan-400 mt-1">{formatCurrency(stats.monthlyRevenue)}</p></div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs"><span className="text-white/40">Total Capital Deployed</span><span className="text-white/60 font-medium">{formatCurrency(stats.totalFunded)}</span></div>
                    <div className="flex items-center justify-between text-xs"><span className="text-white/40">Clients Funded</span><span className="text-white/60 font-medium">{stats.recentWins.length}</span></div>
                    <div className="flex items-center justify-between text-xs"><span className="text-white/40">Avg Revenue/Client</span><span className="text-white/60 font-medium">{formatCurrency(stats.avgFunding * 0.10)}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-3.5 w-3.5 text-purple-400" />Approval Analytics</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative h-28 w-28">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gradient)" strokeWidth="10" strokeDasharray={`${stats.successRate * 3.14} ${314 - stats.successRate * 3.14}`} strokeLinecap="round" className="animate-progress-ring" />
                      <defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#10b981" /><stop offset="100%" stopColor="#06b6d4" /></linearGradient></defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-2xl font-bold text-white/90">{stats.successRate}%</span><span className="text-[10px] text-white/30">Approval Rate</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { label: "Approved", count: approvedApps.length, color: "text-emerald-400", icon: CheckCircle2 },
                    { label: "Pending", count: pendingApps.length, color: "text-amber-400", icon: Clock },
                    { label: "Denied", count: deniedApps.length, color: "text-red-400", icon: XCircle },
                  ].map(item => (
                    <div key={item.label} className="text-center p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <item.icon className={`h-3.5 w-3.5 mx-auto mb-1 ${item.color}`} />
                      <p className="text-sm font-semibold text-white/80">{item.count}</p>
                      <p className="text-[10px] text-white/30">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>
      </div>

      {/* Modals */}
      {editingClient && (
        <EditFundingClientModal client={editingClient} open={!!editingClient} onOpenChange={(open) => { if (!open) setEditingClient(null); }} />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === "client" ? "Funding Client" : "Application"}?`}
        description="This action cannot be undone."
        itemName={deleteTarget?.name}
        onConfirm={handleDelete}
      />
    </PageTransition>
  );
}
