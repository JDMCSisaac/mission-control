// Credit Repair Business Sample Data

export const PIPELINE_STAGES = [
  { id: "lead", label: "Lead", color: "text-white/40", bg: "bg-white/[0.03] border-white/[0.06]" },
  { id: "contacted", label: "Contacted", color: "text-blue-400", bg: "bg-blue-500/[0.06] border-blue-500/[0.12]" },
  { id: "terms_agreed", label: "Terms Agreed", color: "text-cyan-400", bg: "bg-cyan-500/[0.06] border-cyan-500/[0.12]" },
  { id: "payment_received", label: "Payment Received", color: "text-amber-400", bg: "bg-amber-500/[0.06] border-amber-500/[0.12]" },
  { id: "onboarding", label: "Onboarding", color: "text-orange-400", bg: "bg-orange-500/[0.06] border-orange-500/[0.12]" },
  { id: "with_kim", label: "With Kim (L1)", color: "text-pink-400", bg: "bg-pink-500/[0.06] border-pink-500/[0.12]" },
  { id: "with_victor", label: "With Victor (L2)", color: "text-purple-400", bg: "bg-purple-500/[0.06] border-purple-500/[0.12]" },
  { id: "disputes_submitted", label: "Disputes Filed", color: "text-indigo-400", bg: "bg-indigo-500/[0.06] border-indigo-500/[0.12]" },
  { id: "complete", label: "Complete", color: "text-emerald-400", bg: "bg-emerald-500/[0.06] border-emerald-500/[0.12]" },
];

export type ServiceLevel = "4_round_sweep" | "vip_litigation";

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  source: string;
  serviceLevel: ServiceLevel;
  serviceLevelLabel: string;
  price: number;
  stage: string;
  onboardingProgress: number;
  assignedPartner: "Kim" | "Victor" | "Unassigned";
  telegramGroup: string;
  lastInteraction: string;
  nextAction: string;
  createdAt: string;
  notes: string;
}

export const SAMPLE_CLIENTS: Client[] = [
  { id: "c1", name: "Marcus Johnson", phone: "(404) 555-0123", email: "marcus.j@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1200, stage: "with_kim", onboardingProgress: 100, assignedPartner: "Kim", telegramGroup: "https://t.me/+abc123", lastInteraction: "2h ago", nextAction: "Round 2 dispute letters due", createdAt: "2026-01-15", notes: "3 collections, 2 charge-offs. Equifax 520." },
  { id: "c2", name: "Tasha Williams", phone: "(678) 555-0456", email: "tasha.w@email.com", source: "@CreditFixPro", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 5500, stage: "with_victor", onboardingProgress: 100, assignedPartner: "Victor", telegramGroup: "https://t.me/+def456", lastInteraction: "1h ago", nextAction: "Awaiting creditor response to demand letter", createdAt: "2026-01-08", notes: "Identity theft case. FCRA violations identified." },
  { id: "c3", name: "DeAndre Smith", phone: "(770) 555-0789", email: "deandre.s@email.com", source: "Referral - Marcus J.", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "onboarding", onboardingProgress: 60, assignedPartner: "Kim", telegramGroup: "https://t.me/+ghi789", lastInteraction: "5h ago", nextAction: "Waiting for credit reports upload", createdAt: "2026-02-10", notes: "Referred by Marcus. 4 negative items." },
  { id: "c4", name: "Keisha Brown", phone: "(404) 555-1234", email: "keisha.b@email.com", source: "@CreditKingsATL", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 7500, stage: "disputes_submitted", onboardingProgress: 100, assignedPartner: "Victor", telegramGroup: "https://t.me/+jkl012", lastInteraction: "3h ago", nextAction: "30-day dispute window closes Feb 28", createdAt: "2025-12-20", notes: "12 items across all 3 bureaus. FDCPA violations." },
  { id: "c5", name: "Jordan Davis", phone: "(678) 555-5678", email: "jordan.d@email.com", source: "@CreditFixPro", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 750, stage: "payment_received", onboardingProgress: 0, assignedPartner: "Unassigned", telegramGroup: "", lastInteraction: "1d ago", nextAction: "Create Telegram group & send welcome checklist", createdAt: "2026-02-13", notes: "Just paid. 2 late payments to dispute." },
  { id: "c6", name: "Brittany Moore", phone: "(470) 555-9012", email: "brittany.m@email.com", source: "@StackYourCredit", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1500, stage: "with_kim", onboardingProgress: 100, assignedPartner: "Kim", telegramGroup: "https://t.me/+mno345", lastInteraction: "4h ago", nextAction: "Review Round 3 results", createdAt: "2025-11-15", notes: "Round 3 in progress. 4 of 6 items deleted." },
  { id: "c7", name: "Anthony Garcia", phone: "(404) 555-3456", email: "anthony.g@email.com", source: "Referral - Keisha B.", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 4500, stage: "terms_agreed", onboardingProgress: 0, assignedPartner: "Unassigned", telegramGroup: "", lastInteraction: "6h ago", nextAction: "Send payment link", createdAt: "2026-02-13", notes: "Potential lawsuit against Midland Credit." },
  { id: "c8", name: "Jasmine Taylor", phone: "(678) 555-7890", email: "jasmine.t@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "complete", onboardingProgress: 100, assignedPartner: "Kim", telegramGroup: "https://t.me/+pqr678", lastInteraction: "2d ago", nextAction: "Ask for referral & testimonial", createdAt: "2025-09-01", notes: "All 5 items removed! 540 → 712." },
  { id: "c9", name: "Robert Lee", phone: "(770) 555-2345", email: "robert.l@email.com", source: "@CreditFixPro", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 6000, stage: "with_victor", onboardingProgress: 100, assignedPartner: "Victor", telegramGroup: "https://t.me/+stu901", lastInteraction: "30m ago", nextAction: "Review CFPB complaint draft", createdAt: "2026-01-02", notes: "Filing CFPB complaint against Portfolio Recovery." },
  { id: "c10", name: "Aaliyah Washington", phone: "(404) 555-6789", email: "aaliyah.w@email.com", source: "@StackYourCredit", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 850, stage: "contacted", onboardingProgress: 0, assignedPartner: "Unassigned", telegramGroup: "", lastInteraction: "12h ago", nextAction: "Follow up — she asked about pricing", createdAt: "2026-02-12", notes: "Needs score for apartment lease." },
  { id: "c11", name: "Chris Thompson", phone: "(678) 555-0147", email: "chris.t@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1200, stage: "disputes_submitted", onboardingProgress: 100, assignedPartner: "Kim", telegramGroup: "https://t.me/+vwx234", lastInteraction: "1d ago", nextAction: "Check bureau responses (Round 1 sent Jan 20)", createdAt: "2026-01-10", notes: "Round 1 disputes sent. Waiting on responses." },
  { id: "c12", name: "Monica Harris", phone: "(470) 555-8901", email: "monica.h@email.com", source: "Referral - Jasmine T.", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 3500, stage: "onboarding", onboardingProgress: 30, assignedPartner: "Victor", telegramGroup: "https://t.me/+yza567", lastInteraction: "8h ago", nextAction: "Needs to upload ID and utility bill", createdAt: "2026-02-09", notes: "Medical debt in collections — HIPAA angle." },
  { id: "c13", name: "Tyler Jackson", phone: "(404) 555-4567", email: "tyler.j@email.com", source: "@CreditFixPro", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "lead", onboardingProgress: 0, assignedPartner: "Unassigned", telegramGroup: "", lastInteraction: "2d ago", nextAction: "DM back — asked about services", createdAt: "2026-02-12", notes: "New lead from IG. Seems motivated." },
  { id: "c14", name: "Diamond Foster", phone: "(770) 555-8523", email: "diamond.f@email.com", source: "@StackYourCredit", serviceLevel: "vip_litigation", serviceLevelLabel: "VIP Advanced Litigation", price: 5000, stage: "complete", onboardingProgress: 100, assignedPartner: "Victor", telegramGroup: "https://t.me/+bcd890", lastInteraction: "1w ago", nextAction: "Send final credit report comparison", createdAt: "2025-08-15", notes: "Won case against Cavalry SPV. +180 points." },
  { id: "c15", name: "James Wilson", phone: "(678) 555-3698", email: "james.w@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep", serviceLevelLabel: "4 Round Sweep", price: 900, stage: "lead", onboardingProgress: 0, assignedPartner: "Unassigned", telegramGroup: "", lastInteraction: "1d ago", nextAction: "Respond to DM about timeline", createdAt: "2026-02-13", notes: "Wants to know how fast results come." },
];

export function getStats() {
  const active = SAMPLE_CLIENTS.filter(c => !["lead", "contacted", "complete"].includes(c.stage));
  const leads = SAMPLE_CLIENTS.filter(c => ["lead", "contacted"].includes(c.stage));
  const onboarding = SAMPLE_CLIENTS.filter(c => c.stage === "onboarding");
  const withKim = SAMPLE_CLIENTS.filter(c => ["with_kim", "disputes_submitted"].includes(c.stage) && c.assignedPartner === "Kim");
  const withVictor = SAMPLE_CLIENTS.filter(c => ["with_victor", "disputes_submitted"].includes(c.stage) && c.assignedPartner === "Victor");
  const l1Clients = SAMPLE_CLIENTS.filter(c => c.serviceLevel === "4_round_sweep" && !["lead", "contacted"].includes(c.stage));
  const l2Clients = SAMPLE_CLIENTS.filter(c => c.serviceLevel === "vip_litigation" && !["lead", "contacted"].includes(c.stage));
  const l1Revenue = l1Clients.reduce((sum, c) => sum + c.price, 0);
  const l2Revenue = l2Clients.reduce((sum, c) => sum + c.price, 0);
  return {
    activeClients: active.length,
    newLeadsThisWeek: leads.length,
    revenueThisMonth: l1Revenue + l2Revenue,
    pendingOnboarding: onboarding.length,
    withKim: withKim.length,
    withVictor: withVictor.length,
    l1: { clients: l1Clients.length, revenue: l1Revenue, avg: l1Clients.length ? Math.round(l1Revenue / l1Clients.length) : 0 },
    l2: { clients: l2Clients.length, revenue: l2Revenue, avg: l2Clients.length ? Math.round(l2Revenue / l2Clients.length) : 0 },
    pipelineCounts: Object.fromEntries(PIPELINE_STAGES.map(s => [s.id, SAMPLE_CLIENTS.filter(c => c.stage === s.id).length])),
    totalRevenue: l1Revenue + l2Revenue,
    revenueGoal: 50000,
  };
}

export const RECENT_ACTIVITY = [
  { time: "30m ago", text: "Robert Lee — CFPB complaint draft ready for review", type: "action" },
  { time: "1h ago", text: "Tasha Williams — creditor responded to demand letter", type: "update" },
  { time: "2h ago", text: "Marcus Johnson — Round 2 dispute letters sent by Kim", type: "success" },
  { time: "3h ago", text: "Keisha Brown — 30-day window update from Victor", type: "update" },
  { time: "4h ago", text: "Brittany Moore — 2 more items deleted! (Round 3)", type: "success" },
  { time: "5h ago", text: "DeAndre Smith — uploaded Experian report", type: "update" },
  { time: "6h ago", text: "Anthony Garcia — agreed to VIP Litigation ($4,500)", type: "success" },
  { time: "8h ago", text: "Monica Harris — Telegram group created", type: "action" },
  { time: "12h ago", text: "Aaliyah Washington — follow-up DM sent", type: "action" },
  { time: "1d ago", text: "Jordan Davis — payment received ($750)", type: "success" },
];

export const CREDIT_REPAIR_TASKS = [
  { id: "t1", title: "Follow up with Tyler Jackson", description: "DM'd 2 days ago on @CreditFixPro. Hot lead.", priority: "high", category: "Sales", nextAction: "Send follow-up DM with testimonial", status: "pending" },
  { id: "t2", title: "Create Telegram group for Jordan Davis", description: "Payment received. Needs onboarding group.", priority: "high", category: "Onboarding", nextAction: "Create group, add checklist, request docs", status: "pending" },
  { id: "t3", title: "Send payment link to Anthony Garcia", description: "Terms agreed at $4,500 VIP. Ready to pay.", priority: "high", category: "Sales", nextAction: "Send Zelle/CashApp link", status: "pending" },
  { id: "t4", title: "Check bureau responses for Chris Thompson", description: "Round 1 sent Jan 20. Should have responses.", priority: "medium", category: "Disputes", nextAction: "Check DisputeBee status", status: "pending" },
  { id: "t5", title: "Review CFPB draft for Robert Lee", description: "Complaint against Portfolio Recovery.", priority: "medium", category: "Disputes", nextAction: "Review and approve before filing", status: "pending" },
  { id: "t6", title: "Follow up with Aaliyah Washington", description: "Asked about pricing 12h ago.", priority: "medium", category: "Sales", nextAction: "Send pricing & success stories", status: "pending" },
  { id: "t7", title: "Ask Jasmine Taylor for testimonial", description: "Case complete — 540 to 712!", priority: "low", category: "Marketing", nextAction: "Ask for video testimonial for IG", status: "pending" },
  { id: "t8", title: "Post credit tip on all IG pages", description: "Weekly content due.", priority: "low", category: "Marketing", nextAction: "Create carousel about utilization", status: "pending" },
  { id: "t9", title: "Chase Monica Harris for documents", description: "Needs ID and utility bill.", priority: "medium", category: "Onboarding", nextAction: "Send Telegram reminder", status: "pending" },
  { id: "t10", title: "Send Diamond Foster final report", description: "Won against Cavalry SPV.", priority: "low", category: "Completion", nextAction: "Generate before/after comparison", status: "pending" },
];

export const IG_PAGES = [
  { name: "@CreditKingsATL", followers: 12400, posts: 342, engagement: "4.2%", leads: 5 },
  { name: "@CreditFixPro", followers: 8900, posts: 218, engagement: "3.8%", leads: 3 },
  { name: "@StackYourCredit", followers: 6200, posts: 156, engagement: "5.1%", leads: 2 },
];

export const KNOWLEDGE_ITEMS = [
  { title: "Dispute Letter Templates", category: "Disputes", description: "FCRA Section 611 dispute letters, validation letters, intent to sue notices", updated: "1d ago", tags: ["disputes", "templates", "FCRA"] },
  { title: "FCRA Consumer Rights", category: "Law", description: "Fair Credit Reporting Act — key sections for disputes", updated: "1w ago", tags: ["FCRA", "law", "rights"] },
  { title: "FDCPA Violation Guide", category: "Law", description: "Fair Debt Collection Practices Act violations checklist", updated: "2w ago", tags: ["FDCPA", "collections"] },
  { title: "Onboarding Checklist", category: "Process", description: "New client onboarding: documents, Telegram setup, initial audit", updated: "3d ago", tags: ["onboarding", "checklist"] },
  { title: "Credit Bureau Contacts", category: "Reference", description: "Equifax, Experian, TransUnion — addresses, fax, portals", updated: "1m ago", tags: ["bureaus", "contact"] },
  { title: "4 Round Sweep Process", category: "Process", description: "Kim's L1: audit → Round 1 → 30 days → repeat ×4", updated: "5d ago", tags: ["L1", "Kim"] },
  { title: "VIP Litigation Process", category: "Process", description: "Victor's L2: audit → demand letters → CFPB → litigation", updated: "3d ago", tags: ["L2", "Victor"] },
  { title: "Credit Card Stacking", category: "Funding", description: "Business & personal card stacking post-repair", updated: "2w ago", tags: ["stacking", "funding"] },
  { title: "Small Business Funding", category: "Funding", description: "SBA loans, microloans, startup funding options", updated: "1m ago", tags: ["funding", "SBA"] },
  { title: "DM Scripts & Closing", category: "Sales", description: "Instagram outreach scripts, objection handling", updated: "4d ago", tags: ["scripts", "sales"] },
  { title: "Pricing & Packages", category: "Sales", description: "L1: $750-$1,500 | L2: $3,000-$7,500", updated: "1w ago", tags: ["pricing", "tiers"] },
  { title: "Referral Program", category: "Marketing", description: "Client referral incentives and tracking", updated: "2w ago", tags: ["referrals", "growth"] },
];

export const CONTENT_ITEMS = [
  { title: "Credit Score Myths Debunked (Carousel)", stage: "published", page: "@CreditKingsATL", type: "carousel" },
  { title: "Client Testimonial — Jasmine Taylor", stage: "approved", page: "@CreditKingsATL", type: "video" },
  { title: "5 Things Killing Your Credit Score", stage: "review", page: "@CreditFixPro", type: "reel" },
  { title: "Before & After Score Reveal", stage: "draft", page: "@StackYourCredit", type: "reel" },
  { title: "Why You Need a 720+ Score", stage: "published", page: "@CreditFixPro", type: "carousel" },
  { title: "Business Credit 101", stage: "draft", page: "@StackYourCredit", type: "carousel" },
  { title: "Credit Utilization Explained", stage: "review", page: "@CreditKingsATL", type: "infographic" },
  { title: "How We Removed 12 Items in 90 Days", stage: "approved", page: "@CreditFixPro", type: "story" },
  { title: "Funding Your First Business", stage: "draft", page: "@StackYourCredit", type: "carousel" },
  { title: "DM Me for Free Consultation", stage: "published", page: "@CreditKingsATL", type: "story" },
];
