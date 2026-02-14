"use client";
import { useState } from "react";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import { FileText, GripVertical, Instagram } from "lucide-react";
import { CONTENT_ITEMS, IG_PAGES } from "@/lib/credit-repair-data";

const STAGES = [
  { id: "draft", label: "Draft", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { id: "review", label: "Review", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "approved", label: "Approved", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { id: "published", label: "Published", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

export default function ContentPage() {
  const [dragItem, setDragItem] = useState<string | null>(null);

  return (
    <PageTransition>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-white/90">Instagram Content Pipeline</h1>
        <p className="text-xs text-white/30 mt-0.5">
          {CONTENT_ITEMS.length} items · {IG_PAGES.map(p => p.name).join(", ")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageItems = CONTENT_ITEMS.filter(it => it.stage === stage.id);
          return (
            <div key={stage.id}>
              <div className="flex items-center justify-between mb-3">
                <h3 className={`text-xs font-medium uppercase tracking-wider ${stage.color}`}>{stage.label}</h3>
                <Badge variant="default">{stageItems.length}</Badge>
              </div>
              <div className="space-y-2 min-h-[200px] rounded-2xl p-2 bg-white/[0.01] border border-dashed border-white/[0.04]">
                {stageItems.length === 0 ? (
                  <EmptyState icon={<FileText className="h-5 w-5" />} title="Empty" className="py-8" />
                ) : (
                  stageItems.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group rounded-xl border p-3 transition-colors hover:bg-white/[0.04] ${stage.bg}`}
                    >
                      <p className="text-xs text-white/70 leading-relaxed mb-1.5">{item.title}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-pink-400/60">{item.page}</span>
                        <Badge variant="default" className="text-[8px]">{item.type}</Badge>
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
