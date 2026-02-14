"use client";
import { useSearchParams } from "next/navigation";
import { PageTransition, StaggerGrid, StaggerItem } from "@/components/motion-wrapper";
import { TabBar } from "@/components/tab-bar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Scale } from "lucide-react";
import { KNOWLEDGE_ITEMS } from "@/lib/credit-repair-data";

const tabs = [
  { id: "knowledge", label: "Knowledge Base", icon: <BookOpen className="h-3 w-3" /> },
  { id: "resources", label: "Resources", icon: <Scale className="h-3 w-3" /> },
];

const RESOURCES = [
  { name: "DisputeBee", description: "Automated dispute letter generation", category: "Software", url: "#" },
  { name: "IdentityIQ", description: "Credit monitoring & reports", category: "Monitoring", url: "#" },
  { name: "CFPB Portal", description: "Consumer Financial Protection Bureau complaints", category: "Government", url: "https://www.consumerfinance.gov/complaint/" },
  { name: "AnnualCreditReport.com", description: "Free annual credit reports", category: "Reports", url: "https://www.annualcreditreport.com" },
  { name: "Credit Karma", description: "Free credit score monitoring", category: "Monitoring", url: "https://www.creditkarma.com" },
  { name: "Nav.com", description: "Business credit scores & reports", category: "Business Credit", url: "https://www.nav.com" },
];

export function KnowledgeContent() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "knowledge";

  return (
    <PageTransition>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-white/90">Knowledge Base</h1>
          <p className="text-xs text-white/30 mt-0.5">Credit repair processes, law & resources</p>
        </div>
        <TabBar tabs={tabs} layoutId="knowledge-tab" />
      </div>

      {activeTab === "knowledge" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {KNOWLEDGE_ITEMS.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={
                    item.category === "Disputes" ? "danger" :
                    item.category === "Law" ? "purple" :
                    item.category === "Process" ? "info" :
                    item.category === "Funding" ? "success" :
                    item.category === "Sales" ? "warning" :
                    "default"
                  }>{item.category}</Badge>
                  <span className="text-[10px] text-white/20">{item.updated}</span>
                </div>
                <h3 className="text-sm font-medium text-white/80 mb-1">{item.title}</h3>
                <p className="text-xs text-white/40 mb-3 flex-1">{item.description}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded-md bg-white/[0.04] text-white/25">{tag}</span>
                  ))}
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}

      {activeTab === "resources" && (
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RESOURCES.map((r) => (
            <StaggerItem key={r.name}>
              <Card className="p-4 h-full">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="info">{r.category}</Badge>
                </div>
                <h3 className="text-sm font-medium text-white/80 mb-1">{r.name}</h3>
                <p className="text-xs text-white/40">{r.description}</p>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGrid>
      )}
    </PageTransition>
  );
}
