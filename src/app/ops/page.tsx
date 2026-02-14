"use client";
import { Suspense } from "react";
import { OpsContent } from "./ops-content";
import { LoadingCards } from "@/components/loading-cards";

export default function OpsPage() {
  return (
    <Suspense fallback={<div className="pt-8"><LoadingCards count={6} /></div>}>
      <OpsContent />
    </Suspense>
  );
}
