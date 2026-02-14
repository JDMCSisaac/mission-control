"use client";
import { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import {
  Activity, ListTodo, Calendar, ChevronRight, Users
} from "lucide-react";
import { PIPELINE_STAGES, SAMPLE_CLIENTS, CREDIT_REPAIR_TASKS } from "@/lib/credit-repair-data";

const tabs = [
  { id: "operations", label: "Pipeline", icon: <Activity className="h-3 w-3" /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo className="h-3 w-3" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-3 w-3" /> },
];

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_EVENTS = [
  { title: "Check Dispute Status", day: 0, hour: 9, duration: 1, color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
  { title: "Kim Sync", day: 1, hour: 10, duration: 0.5, color: "bg-pink-500/20 border-pink-500/30 text-pink-400" },
  { title: "Victor Case Review", day: 2, hour: 14, duration: 1, color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
  { title: "IG Content Post", day: 3, hour: 11, duration: 0.5, color: "bg-amber-500/20 border-amber-500/30 text-amber-400" },
  { title: "New Lead Follow-ups", day: 4, hour: 9, duration: 1, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { title: "Client Onboarding Calls", day: 0, hour: 14, duration: 1, color: "bg-orange-500/20 border-orange-500/30 text-orange-400" },
  { title: "Bureau Response Check", day: 3, hour: 15, duration: 0.5, color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" },
];

export function OpsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "operations";
  const [taskAction, setTaskAction] = useState<Record<string, string>>({});

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Pipeline & Operations</h1>
          <p className="text-xs text-white/30 mt-0.5">Client pipeline, tasks & scheduling</p>
        </div>
        <TabBar tabs={tabs} layoutId="ops-tab" />
      </div>

      {activeTab === "operations" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-2 overflow-x-auto">
          {PIPELINE_STAGES.map((stage) => {
            const clients = SAMPLE_CLIENTS.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="min-w-[160px]">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-[10px] font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                  <Badge variant="default">{clients.length}</Badge>
                </div>
                <div className="space-y-2 min-h-[200px] rounded-2xl p-1.5 bg-white/[0.01] border border-dashed border-white/[0.04]">
                  {clients.length === 0 ? (
                    <EmptyState icon={<Users className="h-3 w-3" />} title="" className="py-4" />
                  ) : (
                    clients.map((c, i) => (
                      <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-xl border p-2.5 ${stage.bg}`}
                      >
                        <h4 className="text-[11px] font-medium text-white/70 mb-1">{c.name}</h4>
                        <Badge variant={c.serviceLevel === "vip_litigation" ? "purple" : "info"} className="text-[8px] mb-1.5">
                          {c.serviceLevel === "vip_litigation" ? "L2 VIP" : "L1 Sweep"}
                        </Badge>
                        <p className="text-[9px] text-white/30 line-clamp-2">{c.nextAction}</p>
                        {c.assignedPartner !== "Unassigned" && (
                          <p className="text-[9px] text-white/20 mt-1">→ {c.assignedPartner}</p>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          {["high", "medium", "low"].map((priority) => {
            const filtered = CREDIT_REPAIR_TASKS.filter(t => t.priority === priority);
            if (filtered.length === 0) return null;
            return (
              <div key={priority}>
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${priority === "high" ? "bg-red-400" : priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />
                  {priority} priority
                </h3>
                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((t) => (
                    <StaggerItem key={t.id}>
                      <Card className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={t.category === "Sales" ? "warning" : t.category === "Disputes" ? "info" : t.category === "Onboarding" ? "success" : t.category === "Marketing" ? "purple" : "default"}>
                            {t.category}
                          </Badge>
                          <Badge variant={taskAction[t.id] === "done" ? "success" : "default"}>
                            {taskAction[t.id] || t.status}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium text-white/80 mb-1">{t.title}</h4>
                        <p className="text-xs text-white/40 mb-1">{t.description}</p>
                        <p className="text-xs text-white/30 mb-3 flex items-center gap-1"><ChevronRight className="h-3 w-3" />{t.nextAction}</p>
                        {!taskAction[t.id] && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="primary" onClick={() => setTaskAction(prev => ({ ...prev, [t.id]: "done" }))}>Done</Button>
                            <Button size="sm" variant="ghost" onClick={() => setTaskAction(prev => ({ ...prev, [t.id]: "skipped" }))}>Skip</Button>
                          </div>
                        )}
                      </Card>
                    </StaggerItem>
                  ))}
                </StaggerGrid>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "calendar" && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-[48px_repeat(7,1fr)] text-xs">
              <div className="border-b border-white/[0.04] p-2" />
              {DAYS.map(d => (
                <div key={d} className="border-b border-white/[0.04] border-l border-white/[0.04] p-2 text-center text-white/40 font-medium">{d}</div>
              ))}
              {HOURS.map(h => (
                <div key={`row-${h}`} className="contents">
                  <div className="border-b border-white/[0.04] p-2 text-right text-[10px] text-white/20 font-mono pr-3">
                    {h.toString().padStart(2, "0")}:00
                  </div>
                  {DAYS.map((_, di) => {
                    const event = DEMO_EVENTS.find(e => e.day === di && e.hour === h);
                    return (
                      <div key={`${h}-${di}`} className="border-b border-white/[0.04] border-l border-white/[0.04] p-0.5 relative min-h-[36px]">
                        {event && (
                          <div className={`absolute inset-x-0.5 top-0.5 rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${event.color}`}
                            style={{ height: `${event.duration * 36}px` }}>
                            {event.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageTransition>
  );
}
