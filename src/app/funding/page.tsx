"use client";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, DollarSign, TrendingUp, Target, CreditCard,
  CheckCircle2, Clock, XCircle, Banknote, BarChart3,
  ArrowRight, Zap, Trophy, Layers
} from "lucide-react";
import { FUNDING_CLIENTS, FUNDING_PIPELINE_STAGES, FUNDING_PRODUCTS, getFundingStats } from "@/lib/funding-data";
import { formatCurrency } from "@/lib/utils";

export default function FundingPage() {
  const stats = getFundingStats();
  const allApps = FUNDING_CLIENTS.flatMap(c => c.applications.map(a => ({ ...a, clientName: c.name })));
  const pendingApps = allApps.filter(a => a.status === "pending");

  return (
    <PageTransition>
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
            <Banknote className="h-4 w-4 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white/90">Funding Command Center</h1>
            <p className="text-xs text-white/30">Credit card stacking &amp; business funding · Jake&apos;s Capital Division</p>
          </div>
        </div>
      </div>

      {/* Top Stats */}
      <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Active Clients", value: stats.activeClients, icon: Users, color: "text-blue-400", accent: "from-blue-500/20 to-blue-500/5" },
          { label: "Total Funded", value: formatCurrency(stats.totalFunded), icon: DollarSign, color: "text-emerald-400", accent: "from-emerald-500/20 to-emerald-500/5" },
          { label: "Funded This Month", value: formatCurrency(stats.fundedThisMonth), icon: TrendingUp, color: "text-cyan-400", accent: "from-cyan-500/20 to-cyan-500/5" },
          { label: "Avg Per Client", value: formatCurrency(stats.avgFunding), icon: BarChart3, color: "text-amber-400", accent: "from-amber-500/20 to-amber-500/5" },
          { label: "Pending Apps", value: stats.pendingApps, icon: Clock, color: "text-orange-400", accent: "from-orange-500/20 to-orange-500/5" },
          { label: "Success Rate", value: `${stats.successRate}%`, icon: Target, color: "text-purple-400", accent: "from-purple-500/20 to-purple-500/5" },
        ].map((stat) => (
          <StaggerItem key={stat.label}>
            <Card className="p-4 relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} pointer-events-none`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <p className="text-xl font-semibold text-white/90">{stat.value}</p>
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerGrid>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Pipeline & Applications */}
        <StaggerGrid className="lg:col-span-2 space-y-4">
          {/* Pipeline */}
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
                    const clients = FUNDING_CLIENTS.filter(c => c.stage === stage.id);
                    const count = clients.length;
                    const maxCount = Math.max(...Object.values(stats.pipelineCounts));
                    const width = maxCount > 0 ? (count / maxCount) * 100 : 0;
                    return (
                      <div key={stage.id}>
                        <div className="flex items-center gap-3 py-1.5">
                          <span className={`text-[10px] font-medium w-32 shrink-0 ${stage.color}`}>{stage.label}</span>
                          <div className="flex-1 h-6 rounded-lg bg-white/[0.03] overflow-hidden relative">
                            <div
                              className="h-full rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/30 transition-all duration-500"
                              style={{ width: `${Math.max(width, count > 0 ? 8 : 0)}%` }}
                            />
                            <span className="absolute inset-0 flex items-center px-2 text-[10px] font-mono text-white/50">{count}</span>
                          </div>
                        </div>
                        {clients.length > 0 && (
                          <div className="ml-36 mb-2 space-y-1.5">
                            {clients.map(client => (
                              <div key={client.id} className={`p-2.5 rounded-xl border ${stage.bg} transition-all hover:border-white/[0.12]`}>
                                <div className="flex items-center justify-between mb-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-white/70">{client.name}</span>
                                    <span className="text-[10px] text-white/30">·</span>
                                    <span className="text-[10px] text-white/40">{client.businessName}</span>
                                  </div>
                                  <span className="text-[10px] text-white/30">{client.creditScoreRange}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between mb-0.5">
                                      <span className="text-[10px] text-white/30">{formatCurrency(client.approvedSoFar)} / {formatCurrency(client.targetFunding)}</span>
                                      <span className="text-[10px] text-white/40">{client.cardsApproved} cards</span>
                                    </div>
                                    <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                                      <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all"
                                        style={{ width: `${Math.min((client.approvedSoFar / client.targetFunding) * 100, 100)}%` }}
                                      />
                                    </div>
                                  </div>
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

          {/* Active Applications Tracker */}
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
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-left py-2 px-2">Client</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-left py-2 px-2">Bank / Product</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-right py-2 px-2">Requested</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-center py-2 px-2">Status</th>
                        <th className="text-[10px] text-white/30 uppercase tracking-wider text-right py-2 px-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allApps.filter(a => a.status === "pending").map((app, i) => (
                        <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                          <td className="text-xs text-white/60 py-2 px-2">{app.clientName}</td>
                          <td className="py-2 px-2">
                            <span className="text-xs text-white/70">{app.bank}</span>
                            <br />
                            <span className="text-[10px] text-white/30">{app.product}</span>
                          </td>
                          <td className="text-xs text-white/60 text-right py-2 px-2">{formatCurrency(app.amountRequested)}</td>
                          <td className="text-center py-2 px-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/[0.08] border border-amber-500/[0.12] text-[10px] text-amber-400">
                              <Clock className="h-2.5 w-2.5" /> Pending
                            </span>
                          </td>
                          <td className="text-[10px] text-white/40 text-right py-2 px-2">{app.dateSubmitted}</td>
                        </tr>
                      ))}
                      {allApps.filter(a => a.status === "approved").slice(0, 5).map((app, i) => (
                        <tr key={`a${i}`} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                          <td className="text-xs text-white/60 py-2 px-2">{app.clientName}</td>
                          <td className="py-2 px-2">
                            <span className="text-xs text-white/70">{app.bank}</span>
                            <br />
                            <span className="text-[10px] text-white/30">{app.product}</span>
                          </td>
                          <td className="text-xs text-white/60 text-right py-2 px-2">{formatCurrency(app.amountApproved)}</td>
                          <td className="text-center py-2 px-2">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/[0.12] text-[10px] text-emerald-400">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Approved
                            </span>
                          </td>
                          <td className="text-[10px] text-white/40 text-right py-2 px-2">{app.dateSubmitted}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Funding Products */}
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  Funding Strategies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FUNDING_PRODUCTS.map((product) => (
                    <div key={product.name} className={`p-3 rounded-xl border ${product.bgColor} transition-all hover:border-white/[0.15]`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{product.icon}</span>
                        <span className={`text-xs font-semibold ${product.color}`}>{product.name}</span>
                      </div>
                      <p className="text-[10px] text-white/40 mb-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-white/50 font-medium">{product.approvalRange}</span>
                      </div>
                      <p className="text-[10px] text-white/25 mt-1">{product.requirements}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerGrid>

        {/* Right Column */}
        <StaggerGrid className="space-y-4">
          {/* Recent Wins / Leaderboard */}
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-3.5 w-3.5 text-amber-400" />
                  Funding Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {stats.recentWins.slice(0, 8).map((client, i) => (
                    <div key={client.id} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                        i === 0 ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" :
                        i === 1 ? "bg-white/[0.06] text-white/50 border border-white/[0.1]" :
                        i === 2 ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" :
                        "bg-white/[0.03] text-white/30 border border-white/[0.06]"
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/70 font-medium truncate">{client.name}</p>
                        <p className="text-[10px] text-white/30 truncate">{client.businessName}</p>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400 shrink-0">{formatCurrency(client.approvedSoFar)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Revenue from Funding */}
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                  Funding Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/[0.1]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">Total Revenue (10% fee)</span>
                    <p className="text-xl font-semibold text-emerald-400 mt-1">{formatCurrency(stats.totalRevenue)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-500/[0.06] border border-cyan-500/[0.1]">
                    <span className="text-[10px] text-white/30 uppercase tracking-wider">This Month</span>
                    <p className="text-lg font-semibold text-cyan-400 mt-1">{formatCurrency(stats.monthlyRevenue)}</p>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Total Capital Deployed</span>
                      <span className="text-white/60 font-medium">{formatCurrency(stats.totalFunded)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Clients Funded</span>
                      <span className="text-white/60 font-medium">{stats.recentWins.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/40">Avg Revenue/Client</span>
                      <span className="text-white/60 font-medium">{formatCurrency(stats.avgFunding * 0.10)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          {/* Success Rate Visual */}
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-3.5 w-3.5 text-purple-400" />
                  Approval Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center py-4">
                  <div className="relative h-28 w-28">
                    <svg className="h-28 w-28 -rotate-90" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="10" />
                      <circle cx="60" cy="60" r="50" fill="none" stroke="url(#gradient)" strokeWidth="10"
                        strokeDasharray={`${stats.successRate * 3.14} ${314 - stats.successRate * 3.14}`}
                        strokeLinecap="round" />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white/90">{stats.successRate}%</span>
                      <span className="text-[10px] text-white/30">Approval Rate</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[
                    { label: "Approved", count: FUNDING_CLIENTS.flatMap(c => c.applications).filter(a => a.status === "approved").length, color: "text-emerald-400", icon: CheckCircle2 },
                    { label: "Pending", count: FUNDING_CLIENTS.flatMap(c => c.applications).filter(a => a.status === "pending").length, color: "text-amber-400", icon: Clock },
                    { label: "Denied", count: FUNDING_CLIENTS.flatMap(c => c.applications).filter(a => a.status === "denied").length, color: "text-red-400", icon: XCircle },
                  ].map(item => (
                    <div key={item.label} className="text-center p-2 rounded-lg bg-white/[0.02]">
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
    </PageTransition>
  );
}
