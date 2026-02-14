// Funding Division Sample Data

export const FUNDING_PIPELINE_STAGES = [
  { id: "lead", label: "Lead", color: "text-white/40", bg: "bg-white/[0.03] border-white/[0.06]" },
  { id: "consultation", label: "Consultation", color: "text-blue-400", bg: "bg-blue-500/[0.06] border-blue-500/[0.12]" },
  { id: "credit_review", label: "Credit Review", color: "text-cyan-400", bg: "bg-cyan-500/[0.06] border-cyan-500/[0.12]" },
  { id: "strategy_built", label: "Strategy Built", color: "text-amber-400", bg: "bg-amber-500/[0.06] border-amber-500/[0.12]" },
  { id: "apps_submitted", label: "Apps Submitted", color: "text-orange-400", bg: "bg-orange-500/[0.06] border-orange-500/[0.12]" },
  { id: "approvals_rolling", label: "Approvals Rolling In", color: "text-pink-400", bg: "bg-pink-500/[0.06] border-pink-500/[0.12]" },
  { id: "fully_funded", label: "Fully Funded", color: "text-purple-400", bg: "bg-purple-500/[0.06] border-purple-500/[0.12]" },
  { id: "complete", label: "Complete", color: "text-emerald-400", bg: "bg-emerald-500/[0.06] border-emerald-500/[0.12]" },
];

export interface FundingClient {
  id: string;
  name: string;
  businessName: string;
  creditScoreRange: string;
  targetFunding: number;
  approvedSoFar: number;
  stage: string;
  cardsApproved: number;
  totalApps: number;
  source: string;
  createdAt: string;
  lastInteraction: string;
  notes: string;
  applications: Application[];
}

export interface Application {
  bank: string;
  product: string;
  amountRequested: number;
  amountApproved: number;
  status: "pending" | "approved" | "denied";
  dateSubmitted: string;
}

export const FUNDING_CLIENTS: FundingClient[] = [
  {
    id: "f1", name: "Marcus Johnson", businessName: "MJ Auto Detailing LLC", creditScoreRange: "720-745",
    targetFunding: 75000, approvedSoFar: 62000, stage: "approvals_rolling", cardsApproved: 4, totalApps: 6,
    source: "@CreditKingsATL", createdAt: "2026-01-05", lastInteraction: "2h ago", notes: "Strong profile. Amex & Chase approved fast.",
    applications: [
      { bank: "American Express", product: "Amex Blue Business Plus", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2026-01-20" },
      { bank: "Chase", product: "Chase Ink Business Unlimited", amountRequested: 20000, amountApproved: 15000, status: "approved", dateSubmitted: "2026-01-22" },
      { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-25" },
      { bank: "US Bank", product: "Business Triple Cash", amountRequested: 15000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-28" },
      { bank: "Wells Fargo", product: "Signify Business Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05" },
      { bank: "Citi", product: "Costco Business Visa", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08" },
    ]
  },
  {
    id: "f2", name: "Sarah Mitchell", businessName: "Glow Beauty Bar", creditScoreRange: "740-760",
    targetFunding: 100000, approvedSoFar: 82000, stage: "fully_funded", cardsApproved: 5, totalApps: 6,
    source: "Referral - Marcus J.", createdAt: "2025-12-15", lastInteraction: "1d ago", notes: "Excellent profile. Hit target fast.",
    applications: [
      { bank: "American Express", product: "Business Gold Card", amountRequested: 30000, amountApproved: 30000, status: "approved", dateSubmitted: "2025-12-28" },
      { bank: "Chase", product: "Ink Business Preferred", amountRequested: 25000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-02" },
      { bank: "Capital One", product: "Spark Miles", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-05" },
      { bank: "Bank of America", product: "Business Advantage Cash", amountRequested: 15000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-08" },
      { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-12" },
      { bank: "Wells Fargo", product: "Active Cash Business", amountRequested: 10000, amountApproved: 0, status: "denied", dateSubmitted: "2026-01-15" },
    ]
  },
  {
    id: "f3", name: "David Chen", businessName: "Chen Digital Marketing", creditScoreRange: "700-720",
    targetFunding: 50000, approvedSoFar: 47500, stage: "complete", cardsApproved: 4, totalApps: 5,
    source: "@StackYourCredit", createdAt: "2025-11-01", lastInteraction: "3d ago", notes: "Complete. Great testimonial potential.",
    applications: [
      { bank: "American Express", product: "Blue Business Cash", amountRequested: 20000, amountApproved: 20000, status: "approved", dateSubmitted: "2025-11-15" },
      { bank: "Chase", product: "Ink Business Cash", amountRequested: 15000, amountApproved: 12500, status: "approved", dateSubmitted: "2025-11-18" },
      { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-22" },
      { bank: "Citi", product: "Custom Cash", amountRequested: 5000, amountApproved: 5000, status: "approved", dateSubmitted: "2025-11-25" },
      { bank: "US Bank", product: "Business Cash", amountRequested: 10000, amountApproved: 0, status: "denied", dateSubmitted: "2025-11-28" },
    ]
  },
  {
    id: "f4", name: "Keisha Brown", businessName: "KB Consulting Group", creditScoreRange: "735-755",
    targetFunding: 125000, approvedSoFar: 45000, stage: "apps_submitted", cardsApproved: 3, totalApps: 7,
    source: "@CreditKingsATL", createdAt: "2026-01-20", lastInteraction: "4h ago", notes: "High target. Stacking aggressively.",
    applications: [
      { bank: "American Express", product: "Business Platinum", amountRequested: 35000, amountApproved: 25000, status: "approved", dateSubmitted: "2026-02-01" },
      { bank: "Chase", product: "Ink Business Preferred", amountRequested: 20000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-02-03" },
      { bank: "Capital One", product: "Spark 2% Cash Plus", amountRequested: 20000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-02-05" },
      { bank: "Bank of America", product: "Business Advantage Unlimited", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08" },
      { bank: "Citi", product: "Business AA Advantage", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-10" },
      { bank: "US Bank", product: "Business Triple Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-11" },
      { bank: "Wells Fargo", product: "Signify Business Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-12" },
    ]
  },
  {
    id: "f5", name: "Andre Williams", businessName: "Williams Construction Co", creditScoreRange: "690-710",
    targetFunding: 80000, approvedSoFar: 0, stage: "strategy_built", cardsApproved: 0, totalApps: 0,
    source: "@CreditFixPro", createdAt: "2026-02-05", lastInteraction: "6h ago", notes: "Strategy ready. Starting apps next week.",
    applications: []
  },
  {
    id: "f6", name: "Lisa Thompson", businessName: "Peach State Catering", creditScoreRange: "750-775",
    targetFunding: 60000, approvedSoFar: 60000, stage: "complete", cardsApproved: 4, totalApps: 4,
    source: "Referral - Sarah M.", createdAt: "2025-10-15", lastInteraction: "1w ago", notes: "Hit target perfectly. Wants to refer friends.",
    applications: [
      { bank: "American Express", product: "Business Gold", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2025-10-28" },
      { bank: "Chase", product: "Ink Business Unlimited", amountRequested: 15000, amountApproved: 15000, status: "approved", dateSubmitted: "2025-11-01" },
      { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-05" },
      { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-08" },
    ]
  },
  {
    id: "f7", name: "Jerome Foster", businessName: "Foster Fitness LLC", creditScoreRange: "680-700",
    targetFunding: 40000, approvedSoFar: 0, stage: "credit_review", cardsApproved: 0, totalApps: 0,
    source: "@StackYourCredit", createdAt: "2026-02-08", lastInteraction: "1d ago", notes: "Reviewing credit report. May need repair first.",
    applications: []
  },
  {
    id: "f8", name: "Natasha Rivera", businessName: "Rivera Real Estate Group", creditScoreRange: "760-780",
    targetFunding: 150000, approvedSoFar: 93000, stage: "approvals_rolling", cardsApproved: 5, totalApps: 8,
    source: "@CreditKingsATL", createdAt: "2025-12-20", lastInteraction: "3h ago", notes: "Premium client. Excellent approvals so far.",
    applications: [
      { bank: "American Express", product: "Business Platinum", amountRequested: 35000, amountApproved: 35000, status: "approved", dateSubmitted: "2026-01-05" },
      { bank: "Chase", product: "Ink Business Preferred", amountRequested: 25000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-08" },
      { bank: "Capital One", product: "Spark Miles Select", amountRequested: 15000, amountApproved: 15000, status: "approved", dateSubmitted: "2026-01-12" },
      { bank: "Bank of America", product: "Business Advantage Cash", amountRequested: 15000, amountApproved: 13000, status: "approved", dateSubmitted: "2026-01-15" },
      { bank: "US Bank", product: "Business Triple Cash", amountRequested: 12000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-20" },
      { bank: "Citi", product: "Business AA Advantage", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-01" },
      { bank: "Wells Fargo", product: "Active Cash Business", amountRequested: 12000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05" },
      { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08" },
    ]
  },
  {
    id: "f9", name: "Chris Taylor", businessName: "Taylor Tech Solutions", creditScoreRange: "710-730",
    targetFunding: 35000, approvedSoFar: 0, stage: "consultation", cardsApproved: 0, totalApps: 0,
    source: "Referral - David C.", createdAt: "2026-02-10", lastInteraction: "12h ago", notes: "Initial consultation scheduled for tomorrow.",
    applications: []
  },
  {
    id: "f10", name: "Diamond Jackson", businessName: "Diamond Lash Studio", creditScoreRange: "725-745",
    targetFunding: 55000, approvedSoFar: 32000, stage: "apps_submitted", cardsApproved: 2, totalApps: 5,
    source: "@CreditFixPro", createdAt: "2026-01-15", lastInteraction: "5h ago", notes: "Good progress. Waiting on remaining apps.",
    applications: [
      { bank: "American Express", product: "Blue Business Plus", amountRequested: 20000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-28" },
      { bank: "Chase", product: "Ink Business Cash", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-30" },
      { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05" },
      { bank: "Bank of America", product: "Business Advantage Unlimited", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-07" },
      { bank: "US Bank", product: "Business Cash", amountRequested: 8000, amountApproved: 0, status: "denied", dateSubmitted: "2026-02-03" },
    ]
  },
  {
    id: "f11", name: "Robert Lewis", businessName: "Lewis Logistics ATL", creditScoreRange: "695-715",
    targetFunding: 45000, approvedSoFar: 0, stage: "lead", cardsApproved: 0, totalApps: 0,
    source: "@StackYourCredit", createdAt: "2026-02-12", lastInteraction: "1d ago", notes: "New lead. Interested in business funding for fleet expansion.",
    applications: []
  },
  {
    id: "f12", name: "Monica Harris", businessName: "Harris Event Planning", creditScoreRange: "740-760",
    targetFunding: 70000, approvedSoFar: 70000, stage: "complete", cardsApproved: 5, totalApps: 5,
    source: "Referral - Lisa T.", createdAt: "2025-09-20", lastInteraction: "2w ago", notes: "100% success rate. Perfect case study.",
    applications: [
      { bank: "American Express", product: "Business Gold", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2025-10-05" },
      { bank: "Chase", product: "Ink Business Preferred", amountRequested: 20000, amountApproved: 18000, status: "approved", dateSubmitted: "2025-10-08" },
      { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 12000, amountApproved: 12000, status: "approved", dateSubmitted: "2025-10-12" },
      { bank: "Citi", product: "Custom Cash Business", amountRequested: 8000, amountApproved: 8000, status: "approved", dateSubmitted: "2025-10-15" },
      { bank: "Discover", product: "Business Card", amountRequested: 7000, amountApproved: 7000, status: "approved", dateSubmitted: "2025-10-18" },
    ]
  },
];

export const FUNDING_PRODUCTS = [
  { name: "Business Credit Cards", description: "Amex Business Gold/Platinum, Chase Ink, Capital One Spark, Citi Business", approvalRange: "$5K-$50K per card", requirements: "680+ credit score, EIN, 6+ months in business", color: "text-blue-400", bgColor: "bg-blue-500/[0.06] border-blue-500/[0.12]", icon: "💳" },
  { name: "Personal Cards for Business", description: "Amex Gold/Platinum, Chase Sapphire, Capital One Venture", approvalRange: "$3K-$30K per card", requirements: "700+ credit score, low utilization", color: "text-cyan-400", bgColor: "bg-cyan-500/[0.06] border-cyan-500/[0.12]", icon: "🏦" },
  { name: "Business Lines of Credit", description: "Kabbage, BlueVine, OnDeck, Fundbox", approvalRange: "$10K-$250K", requirements: "650+ score, $50K+ annual revenue, 1+ year in business", color: "text-amber-400", bgColor: "bg-amber-500/[0.06] border-amber-500/[0.12]", icon: "📊" },
  { name: "SBA Microloans", description: "SBA 7(a) Microloans, Community Advantage", approvalRange: "$5K-$50K", requirements: "640+ score, business plan, collateral may apply", color: "text-emerald-400", bgColor: "bg-emerald-500/[0.06] border-emerald-500/[0.12]", icon: "🏛️" },
  { name: "Revenue-Based Financing", description: "Clearco, Pipe, Capchase, Stripe Capital", approvalRange: "$10K-$500K", requirements: "Steady monthly revenue, 6+ months of bank statements", color: "text-purple-400", bgColor: "bg-purple-500/[0.06] border-purple-500/[0.12]", icon: "📈" },
];

export function getFundingStats() {
  const active = FUNDING_CLIENTS.filter(c => !["lead", "complete"].includes(c.stage));
  const totalFunded = FUNDING_CLIENTS.reduce((sum, c) => sum + c.approvedSoFar, 0);
  const fundedThisMonth = FUNDING_CLIENTS.filter(c => c.approvedSoFar > 0 && c.createdAt >= "2026-01-01").reduce((sum, c) => sum + c.approvedSoFar, 0);
  const fundedClients = FUNDING_CLIENTS.filter(c => c.approvedSoFar > 0);
  const avgFunding = fundedClients.length ? Math.round(totalFunded / fundedClients.length) : 0;
  const allApps = FUNDING_CLIENTS.flatMap(c => c.applications);
  const pendingApps = allApps.filter(a => a.status === "pending");
  const approvedApps = allApps.filter(a => a.status === "approved");
  const decidedApps = allApps.filter(a => a.status !== "pending");
  const successRate = decidedApps.length ? Math.round((approvedApps.length / decidedApps.length) * 100) : 0;

  const pipelineCounts = Object.fromEntries(
    FUNDING_PIPELINE_STAGES.map(s => [s.id, FUNDING_CLIENTS.filter(c => c.stage === s.id).length])
  );

  const feeRate = 0.10;
  const totalRevenue = totalFunded * feeRate;
  const monthlyRevenue = fundedThisMonth * feeRate;

  return {
    activeClients: active.length,
    totalFunded,
    fundedThisMonth,
    avgFunding,
    pendingApps: pendingApps.length,
    successRate,
    pipelineCounts,
    totalRevenue,
    monthlyRevenue,
    recentWins: FUNDING_CLIENTS.filter(c => c.approvedSoFar > 0).sort((a, b) => b.approvedSoFar - a.approvedSoFar),
  };
}
