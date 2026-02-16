import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clients").collect();
  },
});

export const getById = query({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("clients").collect();

    const active = clients.filter(c => !["lead", "contacted", "complete"].includes(c.stage));
    const leads = clients.filter(c => ["lead", "contacted"].includes(c.stage));
    const onboarding = clients.filter(c => c.stage === "onboarding");
    const withKim = clients.filter(c => ["with_kim", "disputes_submitted"].includes(c.stage) && c.assignedPartner === "Kim");
    const withVictor = clients.filter(c => ["with_victor", "disputes_submitted"].includes(c.stage) && c.assignedPartner === "Victor");
    const l1Clients = clients.filter(c => c.serviceLevel === "4_round_sweep" && !["lead", "contacted"].includes(c.stage));
    const l2Clients = clients.filter(c => c.serviceLevel === "vip_litigation" && !["lead", "contacted"].includes(c.stage));
    const l1Revenue = l1Clients.reduce((sum, c) => sum + c.price, 0);
    const l2Revenue = l2Clients.reduce((sum, c) => sum + c.price, 0);

    const stageIds = ["lead", "contacted", "terms_agreed", "payment_received", "onboarding", "with_kim", "with_victor", "disputes_submitted", "complete"];
    const pipelineCounts: Record<string, number> = {};
    for (const sid of stageIds) {
      pipelineCounts[sid] = clients.filter(c => c.stage === sid).length;
    }

    return {
      activeClients: active.length,
      newLeadsThisWeek: leads.length,
      revenueThisMonth: l1Revenue + l2Revenue,
      pendingOnboarding: onboarding.length,
      withKim: withKim.length,
      withVictor: withVictor.length,
      l1: { clients: l1Clients.length, revenue: l1Revenue, avg: l1Clients.length ? Math.round(l1Revenue / l1Clients.length) : 0 },
      l2: { clients: l2Clients.length, revenue: l2Revenue, avg: l2Clients.length ? Math.round(l2Revenue / l2Clients.length) : 0 },
      pipelineCounts,
      totalRevenue: l1Revenue + l2Revenue,
      revenueGoal: 50000,
    };
  },
});

export const addClient = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    email: v.string(),
    source: v.string(),
    serviceLevel: v.union(v.literal("4_round_sweep"), v.literal("vip_litigation")),
    price: v.number(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    const serviceLevelLabel = args.serviceLevel === "vip_litigation" ? "VIP Advanced Litigation" : "4 Round Sweep";
    return await ctx.db.insert("clients", {
      ...args,
      serviceLevelLabel,
      stage: "lead",
      onboardingProgress: 0,
      assignedPartner: "Unassigned",
      telegramGroup: "",
      lastInteraction: "just now",
      nextAction: "Initial outreach",
      createdAt: new Date().toISOString().split("T")[0],
    });
  },
});

export const updateClient = mutation({
  args: {
    id: v.id("clients"),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    source: v.optional(v.string()),
    serviceLevel: v.optional(v.union(v.literal("4_round_sweep"), v.literal("vip_litigation"))),
    serviceLevelLabel: v.optional(v.string()),
    price: v.optional(v.number()),
    stage: v.optional(v.string()),
    onboardingProgress: v.optional(v.number()),
    assignedPartner: v.optional(v.union(v.literal("Kim"), v.literal("Victor"), v.literal("Unassigned"))),
    telegramGroup: v.optional(v.string()),
    lastInteraction: v.optional(v.string()),
    nextAction: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    // Filter out undefined values
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const moveStage = mutation({
  args: {
    id: v.id("clients"),
    newStage: v.string(),
  },
  handler: async (ctx, args) => {
    const updates: Record<string, unknown> = { stage: args.newStage };

    // Auto-assign partner when moving to with_kim or with_victor
    if (args.newStage === "with_kim") {
      updates.assignedPartner = "Kim";
    } else if (args.newStage === "with_victor") {
      updates.assignedPartner = "Victor";
    }

    await ctx.db.patch(args.id, updates);
  },
});

export const deleteClient = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
