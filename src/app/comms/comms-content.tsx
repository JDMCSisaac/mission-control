"use client";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import { Users, MessageCircle, ExternalLink, Phone, Mail, Instagram } from "lucide-react";
import { PIPELINE_STAGES, SAMPLE_CLIENTS, IG_PAGES } from "@/lib/credit-repair-data";
import { formatCurrency } from "@/lib/utils";

const tabs = [
  { id: "crm", label: "CRM", icon: <Users className="h-3 w-3" /> },
  { id: "channels", label: "Channels", icon: <MessageCircle className="h-3 w-3" /> },
];

const CHANNELS = [
  { name: "Telegram", status: "connected", description: "Client onboarding groups", icon: MessageCircle, color: "text-blue-400", detail: "12 active groups" },
  { name: "Instagram DMs", status: "connected", description: "Lead acquisition", icon: Instagram, color: "text-pink-400", detail: "3 pages connected" },
  { name: "iMessage/SMS", status: "connected", description: "Referral follow-ups", icon: Phone, color: "text-emerald-400", detail: "Text referrals" },
  { name: "Email", status: "standby", description: "Document collection", icon: Mail, color: "text-amber-400", detail: "For credit reports" },
];

export function CommsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "crm";

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Clients & Communications</h1>
          <p className="text-xs text-white/30 mt-0.5">{SAMPLE_CLIENTS.length} clients · CRM & channels</p>
        </div>
        <TabBar tabs={tabs} layoutId="comms-tab" />
      </div>

      {activeTab === "crm" && (
        <div className="space-y-6">
          {/* Client Cards - Scrollable by stage */}
          {PIPELINE_STAGES.filter(s => SAMPLE_CLIENTS.some(c => c.stage === s.id)).map((stage) => {
            const clients = SAMPLE_CLIENTS.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className={`text-xs font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                  <Badge variant="default">{clients.length}</Badge>
                </div>
                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {clients.map((c, i) => (
                    <StaggerItem key={c.id}>
                      <Card className={`p-4 border ${stage.bg}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-medium text-white/80">{c.name}</h4>
                            <p className="text-[10px] text-white/30">{c.source}</p>
                          </div>
                          <Badge variant={c.serviceLevel === "vip_litigation" ? "purple" : "info"}>
                            {c.serviceLevelLabel}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 my-3 text-[10px]">
                          <div><span className="text-white/25">Phone:</span> <span className="text-white/50">{c.phone}</span></div>
                          <div><span className="text-white/25">Price:</span> <span className="text-amber-400/70 font-medium">{formatCurrency(c.price)}</span></div>
                          <div><span className="text-white/25">Partner:</span> <span className={c.assignedPartner === "Kim" ? "text-pink-400/70" : c.assignedPartner === "Victor" ? "text-purple-400/70" : "text-white/30"}>{c.assignedPartner}</span></div>
                          <div><span className="text-white/25">Last:</span> <span className="text-white/40">{c.lastInteraction}</span></div>
                        </div>

                        {c.onboardingProgress > 0 && c.onboardingProgress < 100 && (
                          <div className="mb-2">
                            <div className="flex justify-between text-[9px] text-white/25 mb-0.5">
                              <span>Onboarding</span><span>{c.onboardingProgress}%</span>
                            </div>
                            <div className="h-1 rounded-full bg-white/[0.04]">
                              <div className="h-full rounded-full bg-orange-400/60" style={{ width: `${c.onboardingProgress}%` }} />
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
                          <p className="text-[10px] text-white/35 flex-1">→ {c.nextAction}</p>
                          {c.telegramGroup && (
                            <a href={c.telegramGroup} target="_blank" rel="noreferrer" className="text-blue-400/50 hover:text-blue-400">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "channels" && (
        <div className="space-y-6">
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CHANNELS.map((ch) => (
              <StaggerItem key={ch.name}>
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <ch.icon className={`h-4 w-4 ${ch.color}`} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/80">{ch.name}</h3>
                        <p className="text-[10px] text-white/30">{ch.description}</p>
                      </div>
                    </div>
                    <Badge variant={ch.status === "connected" ? "success" : "default"}>{ch.status}</Badge>
                  </div>
                  <p className="text-[10px] text-white/40">{ch.detail}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* IG Pages */}
          <div>
            <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Instagram Pages</h3>
            <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {IG_PAGES.map((page) => (
                <StaggerItem key={page.name}>
                  <Card className="p-4">
                    <h4 className="text-sm font-medium text-pink-400 mb-2">{page.name}</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      <div><span className="text-white/25">Followers:</span> <span className="text-white/60">{page.followers.toLocaleString()}</span></div>
                      <div><span className="text-white/25">Posts:</span> <span className="text-white/60">{page.posts}</span></div>
                      <div><span className="text-white/25">Engagement:</span> <span className="text-emerald-400/70">{page.engagement}</span></div>
                      <div><span className="text-white/25">Leads/wk:</span> <span className="text-amber-400/70">{page.leads}</span></div>
                    </div>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </div>
      )}
    </PageTransition>
  );
}
