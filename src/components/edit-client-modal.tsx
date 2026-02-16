"use client";

import { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";

interface EditClientModalProps {
  client: Doc<"clients">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditClientModal({ client, open, onOpenChange }: EditClientModalProps) {
  const [name, setName] = useState(client.name);
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email);
  const [source, setSource] = useState(client.source);
  const [serviceLevel, setServiceLevel] = useState(client.serviceLevel);
  const [price, setPrice] = useState(String(client.price));
  const [notes, setNotes] = useState(client.notes);
  const [nextAction, setNextAction] = useState(client.nextAction);

  const updateClient = useMutation(api.clients.updateClient);

  useEffect(() => {
    setName(client.name);
    setPhone(client.phone);
    setEmail(client.email);
    setSource(client.source);
    setServiceLevel(client.serviceLevel);
    setPrice(String(client.price));
    setNotes(client.notes);
    setNextAction(client.nextAction);
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLevelLabel = serviceLevel === "vip_litigation" ? "VIP Advanced Litigation" : "4 Round Sweep";
    await updateClient({
      id: client._id,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      source: source.trim(),
      serviceLevel,
      serviceLevelLabel,
      price: Number(price) || 0,
      notes: notes.trim(),
      nextAction: nextAction.trim(),
    });
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md rounded-2xl bg-[#0a0a0f] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-sm font-semibold text-white/80">Edit Client</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Email</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Source</label>
              <Input value={source} onChange={e => setSource(e.target.value)} />
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
                <Input value={price} onChange={e => setPrice(e.target.value)} type="number" />
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Next Action</label>
              <Input value={nextAction} onChange={e => setNextAction(e.target.value)} />
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="flex w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white placeholder:text-white/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 min-h-[60px] resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
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
