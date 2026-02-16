import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByClient = query({
  args: { fundingClientId: v.id("fundingClients") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("applications")
      .withIndex("by_fundingClient", (q) => q.eq("fundingClientId", args.fundingClientId))
      .collect();
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("applications").collect();
  },
});

export const addApplication = mutation({
  args: {
    fundingClientId: v.id("fundingClients"),
    bank: v.string(),
    product: v.string(),
    amountRequested: v.number(),
    dateSubmitted: v.string(),
    bureau: v.optional(v.union(v.literal("experian"), v.literal("equifax"), v.literal("transunion"))),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const appId = await ctx.db.insert("applications", {
      ...args,
      amountApproved: 0,
      status: "pending",
    });

    // Update the funding client's totalApps count
    const client = await ctx.db.get(args.fundingClientId);
    if (client) {
      await ctx.db.patch(args.fundingClientId, {
        totalApps: client.totalApps + 1,
      });
    }

    return appId;
  },
});

export const updateApplicationStatus = mutation({
  args: {
    id: v.id("applications"),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("denied")),
    amountApproved: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) return;

    const updates: Record<string, unknown> = { status: args.status };
    if (args.amountApproved !== undefined) {
      updates.amountApproved = args.amountApproved;
    }
    await ctx.db.patch(args.id, updates);

    // Update the funding client's approvedSoFar and cardsApproved
    const client = await ctx.db.get(app.fundingClientId);
    if (client) {
      const allApps = await ctx.db
        .query("applications")
        .withIndex("by_fundingClient", (q) => q.eq("fundingClientId", app.fundingClientId))
        .collect();

      // Recalculate from all apps (including the one we just updated)
      let totalApproved = 0;
      let cardsApproved = 0;
      for (const a of allApps) {
        const isCurrentApp = a._id === args.id;
        const status = isCurrentApp ? args.status : a.status;
        const approved = isCurrentApp ? (args.amountApproved ?? a.amountApproved) : a.amountApproved;
        if (status === "approved") {
          totalApproved += approved;
          cardsApproved++;
        }
      }

      await ctx.db.patch(app.fundingClientId, {
        approvedSoFar: totalApproved,
        cardsApproved,
      });
    }
  },
});

export const deleteApplication = mutation({
  args: { id: v.id("applications") },
  handler: async (ctx, args) => {
    const app = await ctx.db.get(args.id);
    if (!app) return;

    await ctx.db.delete(args.id);

    // Recalculate funding client totals
    const client = await ctx.db.get(app.fundingClientId);
    if (client) {
      const remaining = await ctx.db
        .query("applications")
        .withIndex("by_fundingClient", (q) => q.eq("fundingClientId", app.fundingClientId))
        .collect();

      let totalApproved = 0;
      let cardsApproved = 0;
      for (const a of remaining) {
        if (a.status === "approved") {
          totalApproved += a.amountApproved;
          cardsApproved++;
        }
      }

      await ctx.db.patch(app.fundingClientId, {
        approvedSoFar: totalApproved,
        cardsApproved,
        totalApps: remaining.length,
      });
    }
  },
});
