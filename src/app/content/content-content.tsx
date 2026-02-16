"use client";
import { useState } from "react";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/empty-state";
import { motion } from "framer-motion";
import { FileText, Plus, X, ChevronRight, ChevronLeft } from "lucide-react";
import { IG_PAGES } from "@/lib/credit-repair-data";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import * as Dialog from "@radix-ui/react-dialog";

const STAGES = [
  { id: "draft", label: "Draft", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  { id: "review", label: "Review", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  { id: "approved", label: "Approved", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  { id: "published", label: "Published", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
];

function AddContentModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [page, setPage] = useState(IG_PAGES[0]?.name || "");
  const [type, setType] = useState("carousel");
  const addContentItem = useMutation(api.contentItems.addContentItem);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addContentItem({ title: title.trim(), stage: "draft", page, type });
    setOpen(false);
    setTitle(""); setType("carousel");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Add Content</Dialog.Title>
            <Dialog.Close asChild><button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button></Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Title *</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Content title" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Page</label>
                <select value={page} onChange={e => setPage(e.target.value)} className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20">
                  {IG_PAGES.map(p => <option key={p.name} value={p.name} className="bg-[#0a0a0f]">{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20">
                  {["carousel", "reel", "story", "video", "infographic"].map(t => <option key={t} value={t} className="bg-[#0a0a0f]">{t}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Add Content</Button>
              <Dialog.Close asChild><Button type="button" variant="ghost">Cancel</Button></Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function ContentContent() {
  const contentItems = useQuery(api.contentItems.list);
  const updateContentStage = useMutation(api.contentItems.updateContentStage);

  if (!contentItems) {
    return (
      <PageTransition>
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-white/90">Instagram Content Pipeline</h1>
          <p className="text-xs text-white/30 mt-0.5">Loading...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map(s => (
            <div key={s.id}>
              <div className="h-6 mb-3 bg-white/[0.02] rounded animate-pulse" />
              <div className="min-h-[200px] rounded-2xl bg-white/[0.01] border border-dashed border-white/[0.04] animate-pulse" />
            </div>
          ))}
        </div>
      </PageTransition>
    );
  }

  const getNextStage = (current: string) => {
    const idx = STAGES.findIndex(s => s.id === current);
    return idx < STAGES.length - 1 ? STAGES[idx + 1].id : null;
  };
  const getPrevStage = (current: string) => {
    const idx = STAGES.findIndex(s => s.id === current);
    return idx > 0 ? STAGES[idx - 1].id : null;
  };

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Instagram Content Pipeline</h1>
          <p className="text-xs text-white/30 mt-0.5">
            {contentItems.length} items · {IG_PAGES.map(p => p.name).join(", ")}
          </p>
        </div>
        <AddContentModal>
          <Button variant="primary" size="sm">
            <Plus className="h-3 w-3 mr-1" /> Add Content
          </Button>
        </AddContentModal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STAGES.map((stage) => {
          const stageItems = contentItems.filter(it => it.stage === stage.id);
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
                  stageItems.map((item, i) => {
                    const nextStage = getNextStage(item.stage);
                    const prevStage = getPrevStage(item.stage);
                    return (
                      <motion.div
                        key={item._id}
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
                        <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {prevStage ? (
                            <button onClick={() => updateContentStage({ id: item._id, stage: prevStage })} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40 hover:text-white/70 transition-colors flex items-center gap-0.5">
                              <ChevronLeft className="h-2.5 w-2.5" /> Back
                            </button>
                          ) : <span />}
                          {nextStage && (
                            <button onClick={() => updateContentStage({ id: item._id, stage: nextStage })} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-white/40 hover:text-white/70 transition-colors flex items-center gap-0.5">
                              Advance <ChevronRight className="h-2.5 w-2.5" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
