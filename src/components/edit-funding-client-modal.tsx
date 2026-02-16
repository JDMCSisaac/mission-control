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
import { FUNDING_PIPELINE_STAGES } from "@/lib/funding-data";

interface EditFundingClientModalProps {
  client: Doc<"fundingClients">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFundingClientModal({ client, open, onOpenChange }: EditFundingClientModalProps) {
  const [name, setName] = useState(client.name);
  const [businessName, setBusinessName] = useState(client.businessName);
  const [creditScoreRange, setCreditScoreRange] = useState(client.creditScoreRange);
  const [targetFunding, setTargetFunding] = useState(String(client.targetFunding));
  const [stage, setStage] = useState(client.stage);
  const [source, setSource] = useState(client.source);
  const [notes, setNotes] = useState(client.notes);

  const updateFundingClient = useMutation(api.fundingClients.updateFundingClient);

  useEffect(() => {
    setName(client.name);
    setBusinessName(client.businessName);
    setCreditScoreRange(client.creditScoreRange);
    setTargetFunding(String(client.targetFunding));
    setStage(client.stage);
    setSource(client.source);
    setNotes(client.notes);
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateFundingClient({
        id: client._id,
        name: name.trim(),
        businessName: businessName.trim(),
        creditScoreRange: creditScoreRange.trim(),
        targetFunding: Number(targetFunding) || 0,
        stage,
        source: source.trim(),
        notes: notes.trim(),
      });
      toast.success(`${name} updated`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to update funding client");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl bg-[#0c0c12] border border-white/[0.08] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white/90">Edit Funding Client</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Business Name</label>
                <Input value={businessName} onChange={e => setBusinessName(e.target.value)} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Credit Score Range</label>
                <Input value={creditScoreRange} onChange={e => setCreditScoreRange(e.target.value)} placeholder="720-745" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Target Funding ($)</label>
                <Input value={targetFunding} onChange={e => setTargetFunding(e.target.value)} type="number" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Pipeline Stage</label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                >
                  {FUNDING_PIPELINE_STAGES.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Source</label>
                <Input value={source} onChange={e => setSource(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 min-h-[60px] resize-none transition-all"
              />
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
