"use client";
import { Suspense } from "react";
import { AgentsContent } from "./agents-content";
import { LoadingCards } from "@/components/loading-cards";

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="pt-8"><LoadingCards count={6} /></div>}>
      <AgentsContent />
    </Suspense>
  );
}
