"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

export function AddFundingClientModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [creditScoreRange, setCreditScoreRange] = useState("");
  const [targetFunding, setTargetFunding] = useState("");
  const [source, setSource] = useState("");
  const [notes, setNotes] = useState("");

  const addFundingClient = useMutation(api.fundingClients.addFundingClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !businessName.trim()) return;
    await addFundingClient({
      name: name.trim(),
      businessName: businessName.trim(),
      creditScoreRange: creditScoreRange.trim(),
      targetFunding: Number(targetFunding) || 0,
      source: source.trim() || "Direct",
      notes: notes.trim(),
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(""); setBusinessName(""); setCreditScoreRange("");
    setTargetFunding(""); setSource(""); setNotes("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Add Funding Client</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Name *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Business Name *</label>
              <Input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Business LLC" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Credit Score Range</label>
                <Input value={creditScoreRange} onChange={e => setCreditScoreRange(e.target.value)} placeholder="720-745" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Target Funding ($)</label>
                <Input value={targetFunding} onChange={e => setTargetFunding(e.target.value)} placeholder="75000" type="number" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Source</label>
              <Input value={source} onChange={e => setSource(e.target.value)} placeholder="@CreditKingsATL, Referral, etc." />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Client details..."
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 min-h-[60px] resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Add Client</Button>
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
