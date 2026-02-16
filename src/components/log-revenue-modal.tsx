"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";

export function LogRevenueModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"credit-repair" | "funding">("credit-repair");
  const [serviceLevel, setServiceLevel] = useState("4_round_sweep");
  const [clientName, setClientName] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const addRevenue = useMutation(api.revenue.addRevenue);
  const clients = useQuery(api.clients.list);
  const fundingClients = useQuery(api.fundingClients.list);

  const allClientNames = [
    ...(clients || []).map(c => c.name),
    ...(fundingClients || []).map(c => c.name),
  ].filter((name, i, arr) => arr.indexOf(name) === i);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    await addRevenue({
      amount: Number(amount),
      type,
      serviceLevel: type === "credit-repair" ? serviceLevel : undefined,
      clientName: clientName || undefined,
      date,
      notes: notes.trim(),
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setAmount(""); setType("credit-repair"); setServiceLevel("4_round_sweep");
    setClientName(""); setDate(new Date().toISOString().split("T")[0]); setNotes("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Log Revenue</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Amount ($) *</label>
                <Input value={amount} onChange={e => setAmount(e.target.value)} placeholder="1200" type="number" min="0" step="0.01" required />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Type *</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as "credit-repair" | "funding")}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                >
                  <option value="credit-repair" className="bg-[#0a0a0f]">Credit Repair</option>
                  <option value="funding" className="bg-[#0a0a0f]">Funding</option>
                </select>
              </div>
            </div>
            {type === "credit-repair" && (
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Service Level</label>
                <select
                  value={serviceLevel}
                  onChange={e => setServiceLevel(e.target.value)}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                >
                  <option value="4_round_sweep" className="bg-[#0a0a0f]">4 Round Sweep</option>
                  <option value="vip_litigation" className="bg-[#0a0a0f]">VIP Litigation</option>
                </select>
              </div>
            )}
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Client (optional)</label>
              <select
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
              >
                <option value="" className="bg-[#0a0a0f]">— Select client —</option>
                {allClientNames.map(name => (
                  <option key={name} value={name} className="bg-[#0a0a0f]">{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Date *</label>
              <Input value={date} onChange={e => setDate(e.target.value)} type="date" required />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Payment details..."
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 min-h-[60px] resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" variant="primary" className="flex-1">Log Revenue</Button>
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
