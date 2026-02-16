"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { Doc } from "../../convex/_generated/dataModel";

interface EditTaskModalProps {
  task: Doc<"tasks">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTaskModal({ task, open, onOpenChange }: EditTaskModalProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [nextAction, setNextAction] = useState(task.nextAction);
  const [status, setStatus] = useState(task.status);

  const updateTask = useMutation(api.tasks.updateTask);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setCategory(task.category);
    setNextAction(task.nextAction);
    setStatus(task.status);
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateTask({
        id: task._id,
        title: title.trim(),
        description: description.trim(),
        priority,
        category,
        nextAction: nextAction.trim(),
        status,
      });
      toast.success("Task updated");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update task");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 modal-overlay" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0c0c12] border border-white/[0.08] p-6 shadow-2xl modal-content">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white/90">Edit Task</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Title</label>
              <Input value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Description</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/30 min-h-[60px] resize-none transition-all"
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Priority</label>
                <select value={priority} onChange={e => setPriority(e.target.value)} className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/30">
                  <option value="high" className="bg-[#0a0a0f]">High</option>
                  <option value="medium" className="bg-[#0a0a0f]">Medium</option>
                  <option value="low" className="bg-[#0a0a0f]">Low</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/30">
                  <option value="Sales" className="bg-[#0a0a0f]">Sales</option>
                  <option value="Onboarding" className="bg-[#0a0a0f]">Onboarding</option>
                  <option value="Disputes" className="bg-[#0a0a0f]">Disputes</option>
                  <option value="Marketing" className="bg-[#0a0a0f]">Marketing</option>
                  <option value="Completion" className="bg-[#0a0a0f]">Completion</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500/30">
                  <option value="pending" className="bg-[#0a0a0f]">Pending</option>
                  <option value="done" className="bg-[#0a0a0f]">Done</option>
                  <option value="skipped" className="bg-[#0a0a0f]">Skipped</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Next Action</label>
              <Input value={nextAction} onChange={e => setNextAction(e.target.value)} />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Save Changes</Button>
              <Dialog.Close asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
