import { internalMutation } from "./_generated/server";

const SAMPLE_CLIENTS = [
  { name: "Marcus Johnson", phone: "(404) 555-0123", email: "marcus.j@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1200, stage: "with_kim", onboardingProgress: 100, assignedPartner: "Kim" as const, telegramGroup: "https://t.me/+abc123", lastInteraction: "2h ago", nextAction: "Round 2 dispute letters due", createdAt: "2026-01-15", notes: "3 collections, 2 charge-offs. Equifax 520." },
  { name: "Tasha Williams", phone: "(678) 555-0456", email: "tasha.w@email.com", source: "@CreditFixPro", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 5500, stage: "with_victor", onboardingProgress: 100, assignedPartner: "Victor" as const, telegramGroup: "https://t.me/+def456", lastInteraction: "1h ago", nextAction: "Awaiting creditor response to demand letter", createdAt: "2026-01-08", notes: "Identity theft case. FCRA violations identified." },
  { name: "DeAndre Smith", phone: "(770) 555-0789", email: "deandre.s@email.com", source: "Referral - Marcus J.", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "onboarding", onboardingProgress: 60, assignedPartner: "Kim" as const, telegramGroup: "https://t.me/+ghi789", lastInteraction: "5h ago", nextAction: "Waiting for credit reports upload", createdAt: "2026-02-10", notes: "Referred by Marcus. 4 negative items." },
  { name: "Keisha Brown", phone: "(404) 555-1234", email: "keisha.b@email.com", source: "@CreditKingsATL", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 7500, stage: "disputes_submitted", onboardingProgress: 100, assignedPartner: "Victor" as const, telegramGroup: "https://t.me/+jkl012", lastInteraction: "3h ago", nextAction: "30-day dispute window closes Feb 28", createdAt: "2025-12-20", notes: "12 items across all 3 bureaus. FDCPA violations." },
  { name: "Jordan Davis", phone: "(678) 555-5678", email: "jordan.d@email.com", source: "@CreditFixPro", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 750, stage: "payment_received", onboardingProgress: 0, assignedPartner: "Unassigned" as const, telegramGroup: "", lastInteraction: "1d ago", nextAction: "Create Telegram group & send welcome checklist", createdAt: "2026-02-13", notes: "Just paid. 2 late payments to dispute." },
  { name: "Brittany Moore", phone: "(470) 555-9012", email: "brittany.m@email.com", source: "@StackYourCredit", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1500, stage: "with_kim", onboardingProgress: 100, assignedPartner: "Kim" as const, telegramGroup: "https://t.me/+mno345", lastInteraction: "4h ago", nextAction: "Review Round 3 results", createdAt: "2025-11-15", notes: "Round 3 in progress. 4 of 6 items deleted." },
  { name: "Anthony Garcia", phone: "(404) 555-3456", email: "anthony.g@email.com", source: "Referral - Keisha B.", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 4500, stage: "terms_agreed", onboardingProgress: 0, assignedPartner: "Unassigned" as const, telegramGroup: "", lastInteraction: "6h ago", nextAction: "Send payment link", createdAt: "2026-02-13", notes: "Potential lawsuit against Midland Credit." },
  { name: "Jasmine Taylor", phone: "(678) 555-7890", email: "jasmine.t@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "complete", onboardingProgress: 100, assignedPartner: "Kim" as const, telegramGroup: "https://t.me/+pqr678", lastInteraction: "2d ago", nextAction: "Ask for referral & testimonial", createdAt: "2025-09-01", notes: "All 5 items removed! 540 → 712." },
  { name: "Robert Lee", phone: "(770) 555-2345", email: "robert.l@email.com", source: "@CreditFixPro", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 6000, stage: "with_victor", onboardingProgress: 100, assignedPartner: "Victor" as const, telegramGroup: "https://t.me/+stu901", lastInteraction: "30m ago", nextAction: "Review CFPB complaint draft", createdAt: "2026-01-02", notes: "Filing CFPB complaint against Portfolio Recovery." },
  { name: "Aaliyah Washington", phone: "(404) 555-6789", email: "aaliyah.w@email.com", source: "@StackYourCredit", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 850, stage: "contacted", onboardingProgress: 0, assignedPartner: "Unassigned" as const, telegramGroup: "", lastInteraction: "12h ago", nextAction: "Follow up — she asked about pricing", createdAt: "2026-02-12", notes: "Needs score for apartment lease." },
  { name: "Chris Thompson", phone: "(678) 555-0147", email: "chris.t@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1200, stage: "disputes_submitted", onboardingProgress: 100, assignedPartner: "Kim" as const, telegramGroup: "https://t.me/+vwx234", lastInteraction: "1d ago", nextAction: "Check bureau responses (Round 1 sent Jan 20)", createdAt: "2026-01-10", notes: "Round 1 disputes sent. Waiting on responses." },
  { name: "Monica Harris", phone: "(470) 555-8901", email: "monica.h@email.com", source: "Referral - Jasmine T.", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 3500, stage: "onboarding", onboardingProgress: 30, assignedPartner: "Victor" as const, telegramGroup: "https://t.me/+yza567", lastInteraction: "8h ago", nextAction: "Needs to upload ID and utility bill", createdAt: "2026-02-09", notes: "Medical debt in collections — HIPAA angle." },
  { name: "Tyler Jackson", phone: "(404) 555-4567", email: "tyler.j@email.com", source: "@CreditFixPro", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 1000, stage: "lead", onboardingProgress: 0, assignedPartner: "Unassigned" as const, telegramGroup: "", lastInteraction: "2d ago", nextAction: "DM back — asked about services", createdAt: "2026-02-12", notes: "New lead from IG. Seems motivated." },
  { name: "Diamond Foster", phone: "(770) 555-8523", email: "diamond.f@email.com", source: "@StackYourCredit", serviceLevel: "vip_litigation" as const, serviceLevelLabel: "VIP Advanced Litigation", price: 5000, stage: "complete", onboardingProgress: 100, assignedPartner: "Victor" as const, telegramGroup: "https://t.me/+bcd890", lastInteraction: "1w ago", nextAction: "Send final credit report comparison", createdAt: "2025-08-15", notes: "Won case against Cavalry SPV. +180 points." },
  { name: "James Wilson", phone: "(678) 555-3698", email: "james.w@email.com", source: "@CreditKingsATL", serviceLevel: "4_round_sweep" as const, serviceLevelLabel: "4 Round Sweep", price: 900, stage: "lead", onboardingProgress: 0, assignedPartner: "Unassigned" as const, telegramGroup: "", lastInteraction: "1d ago", nextAction: "Respond to DM about timeline", createdAt: "2026-02-13", notes: "Wants to know how fast results come." },
];

const FUNDING_CLIENTS_DATA = [
  { name: "Marcus Johnson", businessName: "MJ Auto Detailing LLC", creditScoreRange: "720-745", targetFunding: 75000, approvedSoFar: 62000, stage: "approvals_rolling", cardsApproved: 4, totalApps: 6, source: "@CreditKingsATL", createdAt: "2026-01-05", lastInteraction: "2h ago", notes: "Strong profile. Amex & Chase approved fast." },
  { name: "Sarah Mitchell", businessName: "Glow Beauty Bar", creditScoreRange: "740-760", targetFunding: 100000, approvedSoFar: 82000, stage: "fully_funded", cardsApproved: 5, totalApps: 6, source: "Referral - Marcus J.", createdAt: "2025-12-15", lastInteraction: "1d ago", notes: "Excellent profile. Hit target fast." },
  { name: "David Chen", businessName: "Chen Digital Marketing", creditScoreRange: "700-720", targetFunding: 50000, approvedSoFar: 47500, stage: "complete", cardsApproved: 4, totalApps: 5, source: "@StackYourCredit", createdAt: "2025-11-01", lastInteraction: "3d ago", notes: "Complete. Great testimonial potential." },
  { name: "Keisha Brown", businessName: "KB Consulting Group", creditScoreRange: "735-755", targetFunding: 125000, approvedSoFar: 45000, stage: "apps_submitted", cardsApproved: 3, totalApps: 7, source: "@CreditKingsATL", createdAt: "2026-01-20", lastInteraction: "4h ago", notes: "High target. Stacking aggressively." },
  { name: "Andre Williams", businessName: "Williams Construction Co", creditScoreRange: "690-710", targetFunding: 80000, approvedSoFar: 0, stage: "strategy_built", cardsApproved: 0, totalApps: 0, source: "@CreditFixPro", createdAt: "2026-02-05", lastInteraction: "6h ago", notes: "Strategy ready. Starting apps next week." },
  { name: "Lisa Thompson", businessName: "Peach State Catering", creditScoreRange: "750-775", targetFunding: 60000, approvedSoFar: 60000, stage: "complete", cardsApproved: 4, totalApps: 4, source: "Referral - Sarah M.", createdAt: "2025-10-15", lastInteraction: "1w ago", notes: "Hit target perfectly. Wants to refer friends." },
  { name: "Jerome Foster", businessName: "Foster Fitness LLC", creditScoreRange: "680-700", targetFunding: 40000, approvedSoFar: 0, stage: "credit_review", cardsApproved: 0, totalApps: 0, source: "@StackYourCredit", createdAt: "2026-02-08", lastInteraction: "1d ago", notes: "Reviewing credit report. May need repair first." },
  { name: "Natasha Rivera", businessName: "Rivera Real Estate Group", creditScoreRange: "760-780", targetFunding: 150000, approvedSoFar: 93000, stage: "approvals_rolling", cardsApproved: 5, totalApps: 8, source: "@CreditKingsATL", createdAt: "2025-12-20", lastInteraction: "3h ago", notes: "Premium client. Excellent approvals so far." },
  { name: "Chris Taylor", businessName: "Taylor Tech Solutions", creditScoreRange: "710-730", targetFunding: 35000, approvedSoFar: 0, stage: "consultation", cardsApproved: 0, totalApps: 0, source: "Referral - David C.", createdAt: "2026-02-10", lastInteraction: "12h ago", notes: "Initial consultation scheduled for tomorrow." },
  { name: "Diamond Jackson", businessName: "Diamond Lash Studio", creditScoreRange: "725-745", targetFunding: 55000, approvedSoFar: 32000, stage: "apps_submitted", cardsApproved: 2, totalApps: 5, source: "@CreditFixPro", createdAt: "2026-01-15", lastInteraction: "5h ago", notes: "Good progress. Waiting on remaining apps." },
  { name: "Robert Lewis", businessName: "Lewis Logistics ATL", creditScoreRange: "695-715", targetFunding: 45000, approvedSoFar: 0, stage: "lead", cardsApproved: 0, totalApps: 0, source: "@StackYourCredit", createdAt: "2026-02-12", lastInteraction: "1d ago", notes: "New lead. Interested in business funding for fleet expansion." },
  { name: "Monica Harris", businessName: "Harris Event Planning", creditScoreRange: "740-760", targetFunding: 70000, approvedSoFar: 70000, stage: "complete", cardsApproved: 5, totalApps: 5, source: "Referral - Lisa T.", createdAt: "2025-09-20", lastInteraction: "2w ago", notes: "100% success rate. Perfect case study." },
];

const APPLICATIONS_DATA: Record<string, Array<{ bank: string; product: string; amountRequested: number; amountApproved: number; status: "pending" | "approved" | "denied"; dateSubmitted: string; bureau?: "experian" | "equifax" | "transunion" }>> = {
  "Marcus Johnson": [
    { bank: "American Express", product: "Amex Blue Business Plus", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2026-01-20", bureau: "experian" },
    { bank: "Chase", product: "Chase Ink Business Unlimited", amountRequested: 20000, amountApproved: 15000, status: "approved", dateSubmitted: "2026-01-22", bureau: "experian" },
    { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-25", bureau: "transunion" },
    { bank: "US Bank", product: "Business Triple Cash", amountRequested: 15000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-28", bureau: "experian" },
    { bank: "Wells Fargo", product: "Signify Business Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05", bureau: "equifax" },
    { bank: "Citi", product: "Costco Business Visa", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08", bureau: "equifax" },
  ],
  "Sarah Mitchell": [
    { bank: "American Express", product: "Business Gold Card", amountRequested: 30000, amountApproved: 30000, status: "approved", dateSubmitted: "2025-12-28", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Preferred", amountRequested: 25000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-02", bureau: "experian" },
    { bank: "Capital One", product: "Spark Miles", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-05", bureau: "transunion" },
    { bank: "Bank of America", product: "Business Advantage Cash", amountRequested: 15000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-08", bureau: "equifax" },
    { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-12", bureau: "transunion" },
    { bank: "Wells Fargo", product: "Active Cash Business", amountRequested: 10000, amountApproved: 0, status: "denied", dateSubmitted: "2026-01-15", bureau: "experian" },
  ],
  "David Chen": [
    { bank: "American Express", product: "Blue Business Cash", amountRequested: 20000, amountApproved: 20000, status: "approved", dateSubmitted: "2025-11-15", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Cash", amountRequested: 15000, amountApproved: 12500, status: "approved", dateSubmitted: "2025-11-18", bureau: "experian" },
    { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-22", bureau: "transunion" },
    { bank: "Citi", product: "Custom Cash", amountRequested: 5000, amountApproved: 5000, status: "approved", dateSubmitted: "2025-11-25", bureau: "equifax" },
    { bank: "US Bank", product: "Business Cash", amountRequested: 10000, amountApproved: 0, status: "denied", dateSubmitted: "2025-11-28", bureau: "experian" },
  ],
  "Keisha Brown": [
    { bank: "American Express", product: "Business Platinum", amountRequested: 35000, amountApproved: 25000, status: "approved", dateSubmitted: "2026-02-01", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Preferred", amountRequested: 20000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-02-03", bureau: "experian" },
    { bank: "Capital One", product: "Spark 2% Cash Plus", amountRequested: 20000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-02-05", bureau: "transunion" },
    { bank: "Bank of America", product: "Business Advantage Unlimited", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08", bureau: "equifax" },
    { bank: "Citi", product: "Business AA Advantage", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-10", bureau: "equifax" },
    { bank: "US Bank", product: "Business Triple Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-11", bureau: "experian" },
    { bank: "Wells Fargo", product: "Signify Business Cash", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-12", bureau: "experian" },
  ],
  "Natasha Rivera": [
    { bank: "American Express", product: "Business Platinum", amountRequested: 35000, amountApproved: 35000, status: "approved", dateSubmitted: "2026-01-05", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Preferred", amountRequested: 25000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-08", bureau: "experian" },
    { bank: "Capital One", product: "Spark Miles Select", amountRequested: 15000, amountApproved: 15000, status: "approved", dateSubmitted: "2026-01-12", bureau: "transunion" },
    { bank: "Bank of America", product: "Business Advantage Cash", amountRequested: 15000, amountApproved: 13000, status: "approved", dateSubmitted: "2026-01-15", bureau: "equifax" },
    { bank: "US Bank", product: "Business Triple Cash", amountRequested: 12000, amountApproved: 10000, status: "approved", dateSubmitted: "2026-01-20", bureau: "experian" },
    { bank: "Citi", product: "Business AA Advantage", amountRequested: 15000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-01", bureau: "equifax" },
    { bank: "Wells Fargo", product: "Active Cash Business", amountRequested: 12000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05", bureau: "experian" },
    { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-08", bureau: "transunion" },
  ],
  "Diamond Jackson": [
    { bank: "American Express", product: "Blue Business Plus", amountRequested: 20000, amountApproved: 20000, status: "approved", dateSubmitted: "2026-01-28", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Cash", amountRequested: 15000, amountApproved: 12000, status: "approved", dateSubmitted: "2026-01-30", bureau: "experian" },
    { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-05", bureau: "transunion" },
    { bank: "Bank of America", product: "Business Advantage Unlimited", amountRequested: 10000, amountApproved: 0, status: "pending", dateSubmitted: "2026-02-07", bureau: "equifax" },
    { bank: "US Bank", product: "Business Cash", amountRequested: 8000, amountApproved: 0, status: "denied", dateSubmitted: "2026-02-03", bureau: "experian" },
  ],
  "Lisa Thompson": [
    { bank: "American Express", product: "Business Gold", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2025-10-28", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Unlimited", amountRequested: 15000, amountApproved: 15000, status: "approved", dateSubmitted: "2025-11-01", bureau: "experian" },
    { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-05", bureau: "transunion" },
    { bank: "Discover", product: "Business Card", amountRequested: 10000, amountApproved: 10000, status: "approved", dateSubmitted: "2025-11-08", bureau: "transunion" },
  ],
  "Monica Harris": [
    { bank: "American Express", product: "Business Gold", amountRequested: 25000, amountApproved: 25000, status: "approved", dateSubmitted: "2025-10-05", bureau: "experian" },
    { bank: "Chase", product: "Ink Business Preferred", amountRequested: 20000, amountApproved: 18000, status: "approved", dateSubmitted: "2025-10-08", bureau: "experian" },
    { bank: "Capital One", product: "Spark Cash Plus", amountRequested: 12000, amountApproved: 12000, status: "approved", dateSubmitted: "2025-10-12", bureau: "transunion" },
    { bank: "Citi", product: "Custom Cash Business", amountRequested: 8000, amountApproved: 8000, status: "approved", dateSubmitted: "2025-10-15", bureau: "equifax" },
    { bank: "Discover", product: "Business Card", amountRequested: 7000, amountApproved: 7000, status: "approved", dateSubmitted: "2025-10-18", bureau: "transunion" },
  ],
};

const CREDIT_REPAIR_TASKS = [
  { title: "Follow up with Tyler Jackson", description: "DM'd 2 days ago on @CreditFixPro. Hot lead.", priority: "high", category: "Sales", nextAction: "Send follow-up DM with testimonial", status: "pending" },
  { title: "Create Telegram group for Jordan Davis", description: "Payment received. Needs onboarding group.", priority: "high", category: "Onboarding", nextAction: "Create group, add checklist, request docs", status: "pending" },
  { title: "Send payment link to Anthony Garcia", description: "Terms agreed at $4,500 VIP. Ready to pay.", priority: "high", category: "Sales", nextAction: "Send Zelle/CashApp link", status: "pending" },
  { title: "Check bureau responses for Chris Thompson", description: "Round 1 sent Jan 20. Should have responses.", priority: "medium", category: "Disputes", nextAction: "Check DisputeBee status", status: "pending" },
  { title: "Review CFPB draft for Robert Lee", description: "Complaint against Portfolio Recovery.", priority: "medium", category: "Disputes", nextAction: "Review and approve before filing", status: "pending" },
  { title: "Follow up with Aaliyah Washington", description: "Asked about pricing 12h ago.", priority: "medium", category: "Sales", nextAction: "Send pricing & success stories", status: "pending" },
  { title: "Ask Jasmine Taylor for testimonial", description: "Case complete — 540 to 712!", priority: "low", category: "Marketing", nextAction: "Ask for video testimonial for IG", status: "pending" },
  { title: "Post credit tip on all IG pages", description: "Weekly content due.", priority: "low", category: "Marketing", nextAction: "Create carousel about utilization", status: "pending" },
  { title: "Chase Monica Harris for documents", description: "Needs ID and utility bill.", priority: "medium", category: "Onboarding", nextAction: "Send Telegram reminder", status: "pending" },
  { title: "Send Diamond Foster final report", description: "Won against Cavalry SPV.", priority: "low", category: "Completion", nextAction: "Generate before/after comparison", status: "pending" },
];

const RECENT_ACTIVITY = [
  { text: "Robert Lee — CFPB complaint draft ready for review", type: "action" },
  { text: "Tasha Williams — creditor responded to demand letter", type: "update" },
  { text: "Marcus Johnson — Round 2 dispute letters sent by Kim", type: "success" },
  { text: "Keisha Brown — 30-day window update from Victor", type: "update" },
  { text: "Brittany Moore — 2 more items deleted! (Round 3)", type: "success" },
  { text: "DeAndre Smith — uploaded Experian report", type: "update" },
  { text: "Anthony Garcia — agreed to VIP Litigation ($4,500)", type: "success" },
  { text: "Monica Harris — Telegram group created", type: "action" },
  { text: "Aaliyah Washington — follow-up DM sent", type: "action" },
  { text: "Jordan Davis — payment received ($750)", type: "success" },
];

const CONTENT_ITEMS = [
  { title: "Credit Score Myths Debunked (Carousel)", stage: "published", page: "@CreditKingsATL", type: "carousel", platform: "instagram" },
  { title: "Client Testimonial — Jasmine Taylor", stage: "approved", page: "@CreditKingsATL", type: "video", platform: "instagram" },
  { title: "5 Things Killing Your Credit Score", stage: "review", page: "@CreditFixPro", type: "reel", platform: "instagram" },
  { title: "Before & After Score Reveal", stage: "draft", page: "@StackYourCredit", type: "reel", platform: "instagram" },
  { title: "Why You Need a 720+ Score", stage: "published", page: "@CreditFixPro", type: "carousel", platform: "instagram" },
  { title: "Business Credit 101", stage: "draft", page: "@StackYourCredit", type: "carousel", platform: "instagram" },
  { title: "Credit Utilization Explained", stage: "review", page: "@CreditKingsATL", type: "infographic", platform: "instagram" },
  { title: "How We Removed 12 Items in 90 Days", stage: "approved", page: "@CreditFixPro", type: "story", platform: "instagram" },
  { title: "Funding Your First Business", stage: "draft", page: "@StackYourCredit", type: "carousel", platform: "tiktok" },
  { title: "DM Me for Free Consultation", stage: "published", page: "@CreditKingsATL", type: "story", platform: "instagram" },
];

const REVENUE_ENTRIES = [
  { amount: 1200, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "Marcus Johnson", date: "2026-01-15", notes: "4 Round Sweep payment" },
  { amount: 5500, type: "credit-repair" as const, serviceLevel: "vip_litigation", clientName: "Tasha Williams", date: "2026-01-08", notes: "VIP Litigation payment" },
  { amount: 1000, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "DeAndre Smith", date: "2026-02-10", notes: "4 Round Sweep payment — referral" },
  { amount: 7500, type: "credit-repair" as const, serviceLevel: "vip_litigation", clientName: "Keisha Brown", date: "2025-12-20", notes: "VIP Litigation — 12 items case" },
  { amount: 750, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "Jordan Davis", date: "2026-02-13", notes: "4 Round Sweep — 2 items" },
  { amount: 1500, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "Brittany Moore", date: "2025-11-15", notes: "4 Round Sweep payment" },
  { amount: 1000, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "Jasmine Taylor", date: "2025-09-01", notes: "Complete case — 540 to 712" },
  { amount: 6000, type: "credit-repair" as const, serviceLevel: "vip_litigation", clientName: "Robert Lee", date: "2026-01-02", notes: "VIP Litigation — CFPB case" },
  { amount: 1200, type: "credit-repair" as const, serviceLevel: "4_round_sweep", clientName: "Chris Thompson", date: "2026-01-10", notes: "4 Round Sweep payment" },
  { amount: 3500, type: "credit-repair" as const, serviceLevel: "vip_litigation", clientName: "Monica Harris", date: "2026-02-09", notes: "VIP Litigation — HIPAA angle" },
  { amount: 5000, type: "credit-repair" as const, serviceLevel: "vip_litigation", clientName: "Diamond Foster", date: "2025-08-15", notes: "VIP Litigation — won against Cavalry SPV" },
  { amount: 6200, type: "funding" as const, clientName: "Marcus Johnson", date: "2026-01-20", notes: "10% fee on $62K approved" },
  { amount: 8200, type: "funding" as const, clientName: "Sarah Mitchell", date: "2026-01-15", notes: "10% fee on $82K approved" },
  { amount: 4750, type: "funding" as const, clientName: "David Chen", date: "2025-11-28", notes: "10% fee on $47.5K approved" },
  { amount: 4500, type: "funding" as const, clientName: "Keisha Brown", date: "2026-02-05", notes: "10% fee on $45K approved so far" },
  { amount: 6000, type: "funding" as const, clientName: "Lisa Thompson", date: "2025-11-08", notes: "10% fee on $60K approved" },
  { amount: 9300, type: "funding" as const, clientName: "Natasha Rivera", date: "2026-01-20", notes: "10% fee on $93K approved" },
  { amount: 3200, type: "funding" as const, clientName: "Diamond Jackson", date: "2026-01-30", notes: "10% fee on $32K approved so far" },
  { amount: 7000, type: "funding" as const, clientName: "Monica Harris", date: "2025-10-18", notes: "10% fee on $70K approved" },
];

export const seedDatabase = internalMutation({
  args: {},
  handler: async (ctx) => {
    // Check if already seeded
    const existingClients = await ctx.db.query("clients").first();
    if (existingClients) {
      console.log("Database already seeded, skipping...");
      return;
    }

    // Seed clients
    for (const client of SAMPLE_CLIENTS) {
      await ctx.db.insert("clients", client);
    }

    // Seed funding clients and their applications
    for (const fc of FUNDING_CLIENTS_DATA) {
      const fcId = await ctx.db.insert("fundingClients", fc);
      const apps = APPLICATIONS_DATA[fc.name] || [];
      for (const app of apps) {
        await ctx.db.insert("applications", {
          fundingClientId: fcId,
          bank: app.bank,
          product: app.product,
          amountRequested: app.amountRequested,
          amountApproved: app.amountApproved,
          status: app.status,
          dateSubmitted: app.dateSubmitted,
          bureau: app.bureau,
        });
      }
    }

    // Seed tasks
    for (const task of CREDIT_REPAIR_TASKS) {
      await ctx.db.insert("tasks", task);
    }

    // Seed activity
    const now = Date.now();
    for (let i = 0; i < RECENT_ACTIVITY.length; i++) {
      await ctx.db.insert("activity", {
        ...RECENT_ACTIVITY[i],
        createdAt: now - i * 3600000,
      });
    }

    // Seed content items
    for (const item of CONTENT_ITEMS) {
      await ctx.db.insert("contentItems", item);
    }

    // Seed revenue
    for (const entry of REVENUE_ENTRIES) {
      await ctx.db.insert("revenue", {
        ...entry,
        createdAt: new Date(entry.date).getTime(),
      });
    }

    console.log("Database seeded successfully!");
  },
});
