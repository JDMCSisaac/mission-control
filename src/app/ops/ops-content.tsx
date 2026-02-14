"use client";
import { useCallback, useState } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import { useSearchParams } from "next/navigation";
import {
  Server, CheckCircle2, XCircle, Clock, AlertTriangle,
  Calendar, ListTodo, Activity, ChevronRight, Zap
} from "lucide-react";

const tabs = [
  { id: "operations", label: "Operations", icon: <Activity className="h-3 w-3" /> },
  { id: "tasks", label: "Tasks", icon: <ListTodo className="h-3 w-3" /> },
  { id: "calendar", label: "Calendar", icon: <Calendar className="h-3 w-3" /> },
];

async function fetchOps() {
  const [system, crons, tasks] = await Promise.all([
    fetch("/api/system-state").then(r => r.json()),
    fetch("/api/cron-health").then(r => r.json()),
    fetch("/api/suggested-tasks").then(r => r.json()),
  ]);
  return { system, crons, tasks };
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 7);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEMO_EVENTS = [
  { title: "Standup", day: 0, hour: 9, duration: 0.5, color: "bg-blue-500/20 border-blue-500/30 text-blue-400" },
  { title: "Client Call", day: 1, hour: 14, duration: 1, color: "bg-purple-500/20 border-purple-500/30 text-purple-400" },
  { title: "Deploy Window", day: 2, hour: 10, duration: 2, color: "bg-amber-500/20 border-amber-500/30 text-amber-400" },
  { title: "Sprint Review", day: 4, hour: 15, duration: 1, color: "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" },
  { title: "1:1", day: 3, hour: 11, duration: 0.5, color: "bg-rose-500/20 border-rose-500/30 text-rose-400" },
  { title: "Team Sync", day: 0, hour: 14, duration: 1, color: "bg-cyan-500/20 border-cyan-500/30 text-cyan-400" },
];

export function OpsContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "operations";
  const fetcher = useCallback(() => fetchOps(), []);
  const { data, loading } = useAutoRefresh(fetcher);
  const [taskAction, setTaskAction] = useState<Record<string, string>>({});

  if (loading || !data) return <div className="pt-8"><LoadingCards count={6} /></div>;

  const { system, crons, tasks } = data;

  const handleTask = async (id: string, action: string) => {
    setTaskAction(prev => ({ ...prev, [id]: action }));
    await fetch("/api/suggested-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: action }),
    });
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Operations</h1>
          <p className="text-xs text-white/30 mt-0.5">System health, tasks & scheduling</p>
        </div>
        <TabBar tabs={tabs} layoutId="ops-tab" />
      </div>

      {activeTab === "operations" && (
        <div className="space-y-6">
          <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StaggerItem>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Server className="h-3.5 w-3.5 text-emerald-400" />Services</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(system.services || []).map((s: any) => (
                      <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                        <div className="flex items-center gap-2.5">
                          {s.status === "up" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> : <XCircle className="h-3.5 w-3.5 text-red-400" />}
                          <span className="text-xs font-medium text-white/70">{s.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {s.port && <span className="text-[10px] font-mono text-white/20">:{s.port}</span>}
                          <Badge variant={s.status === "up" ? "success" : "danger"}>{s.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>

            <StaggerItem>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-blue-400" />Cron Jobs</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {(crons.jobs || []).map((j: any) => (
                      <div key={j.name} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
                        <div>
                          <span className="text-xs font-medium text-white/70">{j.name}</span>
                          <p className="text-[10px] font-mono text-white/20 mt-0.5">{j.schedule}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {j.consecutiveErrors > 0 && (
                            <span className="text-[10px] text-red-400">{j.consecutiveErrors} errors</span>
                          )}
                          <Badge variant={j.lastStatus === "ok" ? "success" : "danger"}>{j.lastStatus}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          </StaggerGrid>
        </div>
      )}

      {activeTab === "tasks" && (
        <div className="space-y-4">
          {["high", "medium", "low"].map((priority) => {
            const filtered = (tasks.tasks || []).filter((t: any) => t.priority === priority);
            if (filtered.length === 0) return null;
            return (
              <div key={priority}>
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${priority === "high" ? "bg-red-400" : priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />
                  {priority} priority
                </h3>
                <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filtered.map((t: any) => (
                    <StaggerItem key={t.id}>
                      <Card className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant={t.category === "Infrastructure" ? "info" : t.category === "Revenue" ? "success" : t.category === "Agent" ? "purple" : "warning"}>
                            {t.category}
                          </Badge>
                          <Badge variant={taskAction[t.id] === "approved" ? "success" : taskAction[t.id] === "rejected" ? "danger" : t.status === "approved" ? "success" : "default"}>
                            {taskAction[t.id] || t.status}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-medium text-white/80 mb-1">{t.title}</h4>
                        <p className="text-xs text-white/40 mb-1">{t.reasoning}</p>
                        <p className="text-xs text-white/30 mb-3 flex items-center gap-1"><ChevronRight className="h-3 w-3" />{t.nextAction}</p>
                        {!taskAction[t.id] && t.status === "pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="primary" onClick={() => handleTask(t.id, "approved")}>Approve</Button>
                            <Button size="sm" variant="ghost" onClick={() => handleTask(t.id, "rejected")}>Reject</Button>
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
                <>
                  <div key={`h-${h}`} className="border-b border-white/[0.04] p-2 text-right text-[10px] text-white/20 font-mono pr-3">
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
                </>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </PageTransition>
  );
}
