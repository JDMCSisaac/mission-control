"use client";
import { Suspense } from "react";
import { ChatContent } from "./chat-content";
import { LoadingCards } from "@/components/loading-cards";

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="pt-8"><LoadingCards count={4} /></div>}>
      <ChatContent />
    </Suspense>
  );
}
