"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

interface AddApplicationModalProps {
  children: React.ReactNode;
  preselectedClientId?: Id<"fundingClients">;
}

export function AddApplicationModal({ children, preselectedClientId }: AddApplicationModalProps) {
  const [open, setOpen] = useState(false);
  const [clientId, setClientId] = useState<string>(preselectedClientId || "");
  const [bank, setBank] = useState("");
  const [product, setProduct] = useState("");
  const [amountRequested, setAmountRequested] = useState("");
  const [dateSubmitted, setDateSubmitted] = useState(new Date().toISOString().split("T")[0]);
  const [bureau, setBureau] = useState("");
  const [notes, setNotes] = useState("");

  const addApplication = useMutation(api.applications.addApplication);
  const fundingClients = useQuery(api.fundingClients.list);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetClientId = preselectedClientId || clientId;
    if (!targetClientId || !bank.trim() || !product.trim()) return;
    await addApplication({
      fundingClientId: targetClientId as Id<"fundingClients">,
      bank: bank.trim(),
      product: product.trim(),
      amountRequested: Number(amountRequested) || 0,
      dateSubmitted,
      bureau: bureau ? (bureau as "experian" | "equifax" | "transunion") : undefined,
      notes: notes.trim() || undefined,
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    if (!preselectedClientId) setClientId("");
    setBank(""); setProduct(""); setAmountRequested("");
    setDateSubmitted(new Date().toISOString().split("T")[0]);
    setBureau(""); setNotes("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Add Application</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            {!preselectedClientId && (
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Client *</label>
                <select
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                  required
                >
                  <option value="" className="bg-[#0a0a0f]">— Select client —</option>
                  {(fundingClients || []).map(c => (
                    <option key={c._id} value={c._id} className="bg-[#0a0a0f]">{c.name} — {c.businessName}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Bank *</label>
                <Input value={bank} onChange={e => setBank(e.target.value)} placeholder="American Express" required />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Product *</label>
                <Input value={product} onChange={e => setProduct(e.target.value)} placeholder="Business Gold" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Amount ($)</label>
                <Input value={amountRequested} onChange={e => setAmountRequested(e.target.value)} placeholder="25000" type="number" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Bureau</label>
                <select
                  value={bureau}
                  onChange={e => setBureau(e.target.value)}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                >
                  <option value="" className="bg-[#0a0a0f]">— Select —</option>
                  <option value="experian" className="bg-[#0a0a0f]">Experian</option>
                  <option value="equifax" className="bg-[#0a0a0f]">Equifax</option>
                  <option value="transunion" className="bg-[#0a0a0f]">TransUnion</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Date Submitted</label>
              <Input value={dateSubmitted} onChange={e => setDateSubmitted(e.target.value)} type="date" />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Application details..."
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 min-h-[60px] resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Add Application</Button>
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
