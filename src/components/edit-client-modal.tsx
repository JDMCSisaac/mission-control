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
import { PIPELINE_STAGES } from "@/lib/credit-repair-data";

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
  const [stage, setStage] = useState(client.stage);
  const [assignedPartner, setAssignedPartner] = useState(client.assignedPartner);

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
    setStage(client.stage);
    setAssignedPartner(client.assignedPartner);
  }, [client]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const serviceLevelLabel = serviceLevel === "vip_litigation" ? "VIP Advanced Litigation" : "4 Round Sweep";
    try {
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
        stage,
        assignedPartner,
      });
      toast.success(`${name} updated`);
      onOpenChange(false);
    } catch {
      toast.error("Failed to update client");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg rounded-2xl bg-[#0c0c12] border border-white/[0.08] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <Dialog.Title className="text-base font-semibold text-white/90">Edit Client</Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-white/30 hover:text-white/60 transition-colors"><X className="h-4 w-4" /></button>
            </Dialog.Close>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Phone</label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Email</label>
                <Input value={email} onChange={e => setEmail(e.target.value)} type="email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Source</label>
                <Input value={source} onChange={e => setSource(e.target.value)} />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Assigned Partner</label>
                <select
                  value={assignedPartner}
                  onChange={e => setAssignedPartner(e.target.value as "Kim" | "Victor" | "Unassigned")}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                >
                  <option value="Unassigned" className="bg-[#0a0a0f]">Unassigned</option>
                  <option value="Kim" className="bg-[#0a0a0f]">Kim (L1)</option>
                  <option value="Victor" className="bg-[#0a0a0f]">Victor (L2)</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Service Level</label>
                <select
                  value={serviceLevel}
                  onChange={e => setServiceLevel(e.target.value as "4_round_sweep" | "vip_litigation")}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                >
                  <option value="4_round_sweep" className="bg-[#0a0a0f]">4 Round Sweep</option>
                  <option value="vip_litigation" className="bg-[#0a0a0f]">VIP Litigation</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Price ($)</label>
                <Input value={price} onChange={e => setPrice(e.target.value)} type="number" />
              </div>
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Pipeline Stage</label>
                <select
                  value={stage}
                  onChange={e => setStage(e.target.value)}
                  className="flex h-9 w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30"
                >
                  {PIPELINE_STAGES.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#0a0a0f]">{s.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block font-medium">Next Action</label>
              <Input value={nextAction} onChange={e => setNextAction(e.target.value)} />
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
