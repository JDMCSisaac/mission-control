"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  confirmLabel?: string;
  variant?: "danger" | "warning";
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title = "Are you sure?",
  description,
  itemName,
  onConfirm,
  confirmLabel = "Delete",
  variant = "danger",
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm rounded-2xl bg-[#0c0c12] border border-white/[0.08] p-6 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-4 ${
              variant === "danger" ? "bg-red-500/10 border border-red-500/20" : "bg-amber-500/10 border border-amber-500/20"
            }`}>
              <AlertTriangle className={`h-6 w-6 ${variant === "danger" ? "text-red-400" : "text-amber-400"}`} />
            </div>
            <Dialog.Title className="text-base font-semibold text-white/90 mb-2">{title}</Dialog.Title>
            {description && <p className="text-sm text-white/50 mb-1">{description}</p>}
            {itemName && (
              <p className="text-sm text-white/70 font-medium bg-white/[0.04] rounded-lg px-3 py-1.5 mb-4 border border-white/[0.06]">
                {itemName}
              </p>
            )}
            <div className="flex gap-3 w-full mt-4">
              <Dialog.Close asChild>
                <Button variant="ghost" className="flex-1">Cancel</Button>
              </Dialog.Close>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => { onConfirm(); onOpenChange(false); }}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    Deleting...
                  </span>
                ) : confirmLabel}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
