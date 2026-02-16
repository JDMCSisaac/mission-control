import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fundingClients").collect();
  },
});

export const listWithApplications = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("fundingClients").collect();
    const result = [];
    for (const client of clients) {
      const applications = await ctx.db
        .query("applications")
        .withIndex("by_fundingClient", (q) => q.eq("fundingClientId", client._id))
        .collect();

      // Compute bureau pull counts
      const bureauCounts = { experian: 0, equifax: 0, transunion: 0 };
      for (const app of applications) {
        if (app.bureau) {
          bureauCounts[app.bureau]++;
        }
      }

      result.push({ ...client, applications, bureauCounts });
    }
    return result;
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const clients = await ctx.db.query("fundingClients").collect();
    const allApps = await ctx.db.query("applications").collect();

    const active = clients.filter(c => !["lead", "complete"].includes(c.stage));
    const totalFunded = clients.reduce((sum, c) => sum + c.approvedSoFar, 0);
    const fundedThisMonth = clients
      .filter(c => c.approvedSoFar > 0 && c.createdAt >= "2026-01-01")
      .reduce((sum, c) => sum + c.approvedSoFar, 0);
    const fundedClients = clients.filter(c => c.approvedSoFar > 0);
    const avgFunding = fundedClients.length ? Math.round(totalFunded / fundedClients.length) : 0;

    const pendingApps = allApps.filter(a => a.status === "pending");
    const approvedApps = allApps.filter(a => a.status === "approved");
    const decidedApps = allApps.filter(a => a.status !== "pending");
    const successRate = decidedApps.length ? Math.round((approvedApps.length / decidedApps.length) * 100) : 0;

    const stageIds = ["lead", "consultation", "credit_review", "strategy_built", "apps_submitted", "approvals_rolling", "fully_funded", "complete"];
    const pipelineCounts: Record<string, number> = {};
    for (const sid of stageIds) {
      pipelineCounts[sid] = clients.filter(c => c.stage === sid).length;
    }

    const feeRate = 0.10;
    const totalRevenue = totalFunded * feeRate;
    const monthlyRevenue = fundedThisMonth * feeRate;

    const recentWins = clients
      .filter(c => c.approvedSoFar > 0)
      .sort((a, b) => b.approvedSoFar - a.approvedSoFar);

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
      recentWins,
    };
  },
});

export const addFundingClient = mutation({
  args: {
    name: v.string(),
    businessName: v.string(),
    creditScoreRange: v.string(),
    targetFunding: v.number(),
    source: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fundingClients", {
      ...args,
      approvedSoFar: 0,
      stage: "lead",
      cardsApproved: 0,
      totalApps: 0,
      createdAt: new Date().toISOString().split("T")[0],
      lastInteraction: "just now",
    });
  },
});

export const updateFundingClient = mutation({
  args: {
    id: v.id("fundingClients"),
    name: v.optional(v.string()),
    businessName: v.optional(v.string()),
    creditScoreRange: v.optional(v.string()),
    targetFunding: v.optional(v.number()),
    approvedSoFar: v.optional(v.number()),
    stage: v.optional(v.string()),
    cardsApproved: v.optional(v.number()),
    totalApps: v.optional(v.number()),
    source: v.optional(v.string()),
    lastInteraction: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const updates: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates[key] = value;
      }
    }
    await ctx.db.patch(id, updates);
  },
});

export const deleteFundingClient = mutation({
  args: { id: v.id("fundingClients") },
  handler: async (ctx, args) => {
    // Delete all associated applications first
    const apps = await ctx.db
      .query("applications")
      .withIndex("by_fundingClient", (q) => q.eq("fundingClientId", args.id))
      .collect();
    for (const app of apps) {
      await ctx.db.delete(app._id);
    }
    await ctx.db.delete(args.id);
  },
});
