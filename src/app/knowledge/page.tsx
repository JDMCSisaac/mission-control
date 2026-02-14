"use client";
import { Suspense } from "react";
import { KnowledgeContent } from "./knowledge-content";
import { LoadingCards } from "@/components/loading-cards";

export default function KnowledgePage() {
  return (
    <Suspense fallback={<div className="pt-8"><LoadingCards count={6} /></div>}>
      <KnowledgeContent />
    </Suspense>
  );
}
