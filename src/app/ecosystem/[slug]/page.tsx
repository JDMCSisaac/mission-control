"use client";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { useAutoRefresh } from "@/hooks/use-auto-refresh";
import { PageTransition } from "@/components/motion-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingCards } from "@/components/loading-cards";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, BookOpen, Code2, FileText, Settings } from "lucide-react";
import Link from "next/link";

const DETAIL_TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "docs", label: "Docs", icon: FileText },
  { id: "integration", label: "Integration", icon: Code2 },
  { id: "config", label: "Config", icon: Settings },
];

export default function EcosystemDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState("overview");
  const fetcher = useCallback(() => fetch(`/api/ecosystem/${slug}`).then(r => r.json()), [slug]);
  const { data, loading } = useAutoRefresh(fetcher, 60000);

  if (loading || !data) return <div className="pt-8"><LoadingCards count={3} /></div>;

  return (
    <PageTransition>
      <div className="mb-6">
        <Link href="/knowledge?tab=ecosystem" className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/50 transition-colors mb-3">
          <ArrowLeft className="h-3 w-3" /> Back to Ecosystem
        </Link>
        <h1 className="text-lg font-semibold text-white/90 capitalize">{slug}</h1>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] w-fit mb-6">
        {DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${activeTab === tab.id ? "text-white" : "text-white/40 hover:text-white/60"}`}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="eco-tab" className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.08]" transition={{ type: "spring", bounce: 0.15, duration: 0.4 }} />
            )}
            <span className="relative z-10 flex items-center gap-1.5"><tab.icon className="h-3 w-3" />{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <Card>
          <CardContent className="p-6 prose prose-invert prose-sm max-w-none">
            <div className="text-xs text-white/60 whitespace-pre-wrap leading-relaxed">{data.content || "No content available."}</div>
            {data.meta && Object.keys(data.meta).length > 0 && (
              <div className="mt-6 pt-4 border-t border-white/[0.06]">
                <h3 className="text-xs font-medium text-white/40 uppercase mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(data.meta).map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1">
                      <span className="text-white/30">{k}</span>
                      <span className="text-white/60">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "docs" && (
        <Card><CardContent className="p-6"><p className="text-xs text-white/40">Documentation for {slug}. Connect to external docs API for live content.</p></CardContent></Card>
      )}

      {activeTab === "integration" && (
        <Card><CardContent className="p-6">
          <h3 className="text-sm font-medium text-white/70 mb-3">Integration Guide</h3>
          <div className="bg-white/[0.03] rounded-xl p-4 font-mono text-xs text-white/50">
            <p className="text-white/30 mb-2"># Install</p>
            <p>npm install {slug}</p>
            <p className="text-white/30 mt-4 mb-2"># Import</p>
            <p>{`import { ${slug} } from '${slug}';`}</p>
          </div>
        </CardContent></Card>
      )}

      {activeTab === "config" && (
        <Card><CardContent className="p-6">
          <h3 className="text-sm font-medium text-white/70 mb-3">Configuration</h3>
          <p className="text-xs text-white/40">Environment variables and configuration for {slug}.</p>
          <div className="mt-3 bg-white/[0.03] rounded-xl p-4 font-mono text-xs text-white/50 space-y-1">
            <p>{`${slug.toUpperCase().replace(/-/g, "_")}_API_KEY=sk-...`}</p>
            <p>{`${slug.toUpperCase().replace(/-/g, "_")}_ENABLED=true`}</p>
          </div>
        </CardContent></Card>
      )}
    </PageTransition>
  );
}
