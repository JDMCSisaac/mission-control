"use client";
import { Suspense } from "react";
import { CommsContent } from "./comms-content";
import { LoadingCards } from "@/components/loading-cards";

export default function CommsPage() {
  return (
    <Suspense fallback={<div className="pt-8"><LoadingCards count={6} /></div>}>
      <CommsContent />
    </Suspense>
  );
}
