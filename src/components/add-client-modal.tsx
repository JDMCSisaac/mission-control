"use client";

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function AddClientModal({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [source, setSource] = useState("");
  const [serviceLevel, setServiceLevel] = useState<"4_round_sweep" | "vip_litigation">("4_round_sweep");
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const addClient = useMutation(api.clients.addClient);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await addClient({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source: source.trim() || "Direct",
      serviceLevel,
      price: Number(price) || 0,
      notes: notes.trim(),
    });
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setName(""); setPhone(""); setEmail(""); setSource("");
    setServiceLevel("4_round_sweep"); setPrice(""); setNotes("");
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Add New Client</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Name *</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(404) 555-0000" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Email</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Source</label>
              <Input value={source} onChange={e => setSource(e.target.value)} placeholder="@CreditKingsATL, Referral, etc." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Service Level</label>
                <select
                  value={serviceLevel}
                  onChange={e => setServiceLevel(e.target.value as "4_round_sweep" | "vip_litigation")}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20"
                >
                  <option value="4_round_sweep" className="bg-[#0a0a0f]">4 Round Sweep</option>
                  <option value="vip_litigation" className="bg-[#0a0a0f]">VIP Litigation</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Price ($)</label>
                <Input value={price} onChange={e => setPrice(e.target.value)} placeholder="1200" type="number" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Client details, credit issues..."
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
