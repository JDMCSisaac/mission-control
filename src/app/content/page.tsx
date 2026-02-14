"use client";
import { useCallback, useState } from "react";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingCards } from "@/components/loading-cards";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import { FileText, GripVertical, ArrowRight } from "lucide-react";

const STAGES = [
  { id: "draft", label: "Draft", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { id: "review", label: "Review", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "approved", label: "Approved", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { id: "published", label: "Published", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

async function fetchContent() {
  return fetch("/api/content-pipeline").then(r => r.json());
}

export default function ContentPage() {
  const fetcher = useCallback(() => fetchContent(), []);
  const { data, loading } = useAutoRefresh(fetcher);
  const [dragItem, setDragItem] = useState<string | null>(null);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={4} /></div>;

  const items = data.items || [];

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Content Pipeline</h1>
        <p className="text-xs text-white/30 mt-0.5">{items.length} items across {STAGES.length} stages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageItems = items.filter((it: any) => it.stage === stage.id);
          return (
            <div key={stage.id}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                <Badge variant="default">{stageItems.length}</Badge>
              </div>
              <div
                className="space-y-2 min-h-[200px] rounded-2xl p-2 bg-white/[0.01] border border-dashed border-white/[0.04]"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => setDragItem(null)}
              >
                {stageItems.length === 0 ? (
                  <EmptyState icon={<FileText className="h-5 w-5" />} title="Empty" className="py-8" />
                ) : (
                  stageItems.map((item: any, i: number) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      draggable
                      onDragStart={() => setDragItem(item.title)}
                      className={`group cursor-grab active:cursor-grabbing rounded-xl border p-3 transition-colors hover:bg-white/[0.04] ${stage.bg}`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="h-3.5 w-3.5 text-white/15 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                        <p className="text-xs text-white/70 leading-relaxed">{item.title}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
