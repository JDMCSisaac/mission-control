"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { AddClientModal } from "@/components/add-client-modal";
import { EditClientModal } from "@/components/edit-client-modal";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { motion } from "framer-motion";
import { Users, MessageCircle, ExternalLink, Phone, Mail, Instagram, Plus, Pencil, Trash2 } from "lucide-react";
import { PIPELINE_STAGES, IG_PAGES } from "@/lib/credit-repair-data";
import { formatCurrency } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";
import type { Doc, Id } from "../../../convex/_generated/dataModel";

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

  const clients = useQuery(api.clients.list);
  const moveStage = useMutation(api.clients.moveStage);
  const deleteClient = useMutation(api.clients.deleteClient);

  const [editingClient, setEditingClient] = useState<Doc<"clients"> | null>(null);
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: Id<"clients">; name: string } | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteClient({ id: deleteTarget.id });
      toast.success(`${deleteTarget.name} deleted`);
    } catch {
      toast.error("Failed to delete");
    }
    setDeleteTarget(null);
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold text-white/90 tracking-tight">Clients & Communications</h1>
          <p className="text-xs text-white/40 mt-1">{clients?.length ?? "..."} clients · CRM & channels</p>
        </div>
        <div className="flex items-center gap-2">
          {activeTab === "crm" && (
            <AddClientModal>
              <Button variant="primary" size="sm">
                <Plus className="h-3 w-3 mr-1" /> Add Client
              </Button>
            </AddClientModal>
          )}
          <TabBar tabs={tabs} layoutId="comms-tab" />
        </div>
      </div>

      {activeTab === "crm" && (
        <div className="space-y-6">
          {!clients ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[1,2,3,4,5,6].map(i => (
                <Card key={i} className="p-4"><div className="h-32 rounded-lg animate-shimmer" /></Card>
              ))}
            </div>
          ) : (
            PIPELINE_STAGES.filter(s => clients.some(c => c.stage === s.id)).map((stage) => {
              const stageClients = clients.filter(c => c.stage === stage.id);
              return (
                <div key={stage.id}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`h-2 w-2 rounded-full ${stage.color.replace('text-', 'bg-').replace('/40', '')}`} />
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                    <span className="h-5 min-w-[20px] px-1 flex items-center justify-center rounded-full bg-white/[0.06] text-white/40 text-[10px] font-bold">
                      {stageClients.length}
                    </span>
                  </div>
                  <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {stageClients.map((c) => {
                      const isExpanded = expandedClient === c._id;
                      return (
                        <StaggerItem key={c._id}>
                          <Card
                            className={`p-4 border ${stage.bg} cursor-pointer transition-all duration-200 hover:scale-[1.01]`}
                            onClick={() => setExpandedClient(isExpanded ? null : c._id)}
                          >
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
                                  <div className="h-full rounded-full bg-orange-400/60 transition-all duration-700" style={{ width: `${c.onboardingProgress}%` }} />
                                </div>
                              </div>
                            )}

                            {/* Expanded details */}
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-3 pt-3 border-t border-white/[0.06] space-y-3"
                                onClick={e => e.stopPropagation()}
                              >
                                {c.email && <div className="text-[10px]"><span className="text-white/25">Email:</span> <span className="text-white/50">{c.email}</span></div>}
                                {c.notes && <div className="text-[10px]"><span className="text-white/25">Notes:</span> <span className="text-white/40">{c.notes}</span></div>}
                                <div>
                                  <label className="text-[9px] text-white/25 block mb-0.5">Stage</label>
                                  <select
                                    value={c.stage}
                                    onChange={e => {
                                      moveStage({ id: c._id, newStage: e.target.value });
                                      toast.success(`Moved to ${PIPELINE_STAGES.find(s => s.id === e.target.value)?.label}`);
                                    }}
                                    className="w-full text-[10px] rounded-lg bg-white/[0.04] border border-white/[0.08] px-2 py-1 text-white/60 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                                  >
                                    {PIPELINE_STAGES.map(s => (
                                      <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.label}</option>
                                    ))}
                                  </select>
                                </div>
                              </motion.div>
                            )}

                            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-white/[0.04]">
                              <p className="text-[10px] text-white/35 flex-1">→ {c.nextAction}</p>
                              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                                {c.telegramGroup && (
                                  <a href={c.telegramGroup} target="_blank" rel="noreferrer" className="text-blue-400/50 hover:text-blue-400 transition-colors">
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                )}
                                <button
                                  onClick={() => setEditingClient(c)}
                                  className="text-white/30 hover:text-blue-400 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setDeleteTarget({ id: c._id, name: c.name })}
                                  className="text-white/30 hover:text-red-400 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          </Card>
                        </StaggerItem>
                      );
                    })}
                  </StaggerGrid>
                </div>
              );
            })
          )}
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

          <div>
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Instagram Pages</h3>
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

      {/* Modals */}
      {editingClient && (
        <EditClientModal client={editingClient} open={!!editingClient} onOpenChange={(open) => { if (!open) setEditingClient(null); }} />
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="Delete Client?"
        description="This action cannot be undone."
        itemName={deleteTarget?.name}
        onConfirm={handleDelete}
      />
    </PageTransition>
  );
}
