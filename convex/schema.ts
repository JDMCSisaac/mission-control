import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  clients: defineTable({
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    source: v.string(),
    serviceLevel: v.union(v.literal("4_round_sweep"), v.literal("vip_litigation")),
    serviceLevelLabel: v.string(),
    price: v.number(),
    stage: v.string(),
    onboardingProgress: v.number(),
    assignedPartner: v.union(v.literal("Kim"), v.literal("Victor"), v.literal("Unassigned")),
    telegramGroup: v.string(),
    lastInteraction: v.string(),
    nextAction: v.string(),
    notes: v.string(),
    createdAt: v.string(),
  }),

  fundingClients: defineTable({
    name: v.string(),
    businessName: v.string(),
    creditScoreRange: v.string(),
    targetFunding: v.number(),
    approvedSoFar: v.number(),
    stage: v.string(),
    cardsApproved: v.number(),
    totalApps: v.number(),
    source: v.string(),
    createdAt: v.string(),
    lastInteraction: v.string(),
    notes: v.string(),
  }),

  applications: defineTable({
    fundingClientId: v.id("fundingClients"),
    bank: v.string(),
    product: v.string(),
    amountRequested: v.number(),
    amountApproved: v.number(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    dateSubmitted: v.string(),
  }).index("by_fundingClient", ["fundingClientId"]),

  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    priority: v.string(),
    category: v.string(),
    nextAction: v.string(),
    status: v.string(),
  }),

  activity: defineTable({
    text: v.string(),
    type: v.string(),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),

  contentItems: defineTable({
    title: v.string(),
    stage: v.string(),
    page: v.string(),
    type: v.string(),
  }),
});
