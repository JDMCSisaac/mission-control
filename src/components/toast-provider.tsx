"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: "#0c0c12",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "rgba(255,255,255,0.8)",
          fontSize: "13px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      }}
      theme="dark"
    />
  );
}
