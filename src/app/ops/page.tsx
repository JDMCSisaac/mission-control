import { Suspense } from "react";
import { OpsContent } from "./ops-content";

export const dynamic = "force-dynamic";

export default function OpsPage() {
  return (
    <Suspense fallback={<div className="pt-8 text-white/30 text-xs">Loading pipeline...</div>}>
      <OpsContent />
    </Suspense>
  );
}
