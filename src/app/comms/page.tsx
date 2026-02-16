import { Suspense } from "react";
import { CommsContent } from "./comms-content";

export const dynamic = "force-dynamic";

export default function CommsPage() {
  return (
    <Suspense fallback={<div className="pt-8 text-white/30 text-xs">Loading clients...</div>}>
      <CommsContent />
    </Suspense>
  );
}
