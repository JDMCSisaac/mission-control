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
import { motion } from "framer-motion";
import { Radio, Users, MessageCircle, Mail, Phone } from "lucide-react";

const tabs = [
  { id: "comms", label: "Comms", icon: <Radio className="h-3 w-3" /> },
  { id: "crm", label: "CRM", icon: <Users className="h-3 w-3" /> },
];

const CRM_STAGES = [
  { id: "prospect", label: "Prospect", color: "text-white/40", bg: "bg-white/[0.03] border-white/[0.06]" },
  { id: "contacted", label: "Contacted", color: "text-blue-400", bg: "bg-blue-500/[0.06] border-blue-500/[0.12]" },
  { id: "meeting", label: "Meeting", color: "text-amber-400", bg: "bg-amber-500/[0.06] border-amber-500/[0.12]" },
  { id: "proposal", label: "Proposal", color: "text-purple-400", bg: "bg-purple-500/[0.06] border-purple-500/[0.12]" },
  { id: "active", label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/[0.06] border-emerald-500/[0.12]" },
];

const CHANNELS = [
  { name: "Telegram", status: "connected", messages: 142, unread: 3, icon: MessageCircle, color: "text-blue-400" },
  { name: "Discord", status: "connected", messages: 89, unread: 0, icon: MessageCircle, color: "text-indigo-400" },
  { name: "Email", status: "connected", messages: 24, unread: 7, icon: Mail, color: "text-amber-400" },
  { name: "Voice", status: "standby", messages: 0, unread: 0, icon: Phone, color: "text-white/30" },
];

async function fetchComms() {
  return fetch("/api/clients").then(r => r.json());
}

export function CommsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "comms";
  const fetcher = useCallback(() => fetchComms(), []);
  const { data, loading } = useAutoRefresh(fetcher);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={5} /></div>;

  const clients = data.clients || [];

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Communications</h1>
          <p className="text-xs text-white/30 mt-0.5">Channels & client management</p>
        </div>
        <TabBar tabs={tabs} layoutId="comms-tab" />
      </div>

      {activeTab === "comms" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CHANNELS.map((ch) => (
            <StaggerItem key={ch.name}>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-xl bg-white/[0.04] flex items-center justify-center`}>
                      <ch.icon className={`h-4 w-4 ${ch.color}`} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/80">{ch.name}</h3>
                      <p className="text-[10px] text-white/30">{ch.messages} messages</p>
                    </div>
                  </div>
                  <Badge variant={ch.status === "connected" ? "success" : "default"}>{ch.status}</Badge>
                </div>
                {ch.unread > 0 && (
                  <div className="flex items-center gap-2 mt-2 px-2.5 py-1.5 rounded-lg bg-blue-500/[0.06] border border-blue-500/[0.1]">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-[10px] text-blue-400">{ch.unread} unread</span>
                  </div>
                )}
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}

      {activeTab === "crm" && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto">
          {CRM_STAGES.map((stage) => {
            const stageClients = clients.filter((c: any) => c.stage === stage.id);
            return (
              <div key={stage.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className={`text-[10px] font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                  <Badge variant="default">{stageClients.length}</Badge>
                </div>
                <div className="space-y-2 min-h-[200px] rounded-2xl p-2 bg-white/[0.01] border border-dashed border-white/[0.04]">
                  {stageClients.length === 0 ? (
                    <EmptyState icon={<Users className="h-4 w-4" />} title="Empty" className="py-6" />
                  ) : (
                    stageClients.map((c: any, i: number) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-xl border p-3 ${stage.bg}`}
                      >
                        <h4 className="text-xs font-medium text-white/70 mb-1">{c.name}</h4>
                        <p className="text-[10px] text-white/35 line-clamp-2">{c.content}</p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
