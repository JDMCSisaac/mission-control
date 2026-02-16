import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("revenue")
      .withIndex("by_date")
      .order("desc")
      .collect();
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("revenue").collect();

    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const lastMonth = now.getMonth() === 0
      ? `${now.getFullYear() - 1}-12`
      : `${now.getFullYear()}-${String(now.getMonth()).padStart(2, "0")}`;

    const totalRevenue = entries.reduce((sum, e) => sum + e.amount, 0);
    const thisMonthRevenue = entries
      .filter(e => e.date.startsWith(thisMonth))
      .reduce((sum, e) => sum + e.amount, 0);
    const lastMonthRevenue = entries
      .filter(e => e.date.startsWith(lastMonth))
      .reduce((sum, e) => sum + e.amount, 0);

    const creditRepairRevenue = entries
      .filter(e => e.type === "credit-repair")
      .reduce((sum, e) => sum + e.amount, 0);
    const fundingRevenue = entries
      .filter(e => e.type === "funding")
      .reduce((sum, e) => sum + e.amount, 0);

    return {
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      creditRepairRevenue,
      fundingRevenue,
      entryCount: entries.length,
    };
  },
});

export const addRevenue = mutation({
  args: {
    amount: v.number(),
    type: v.union(v.literal("credit-repair"), v.literal("funding")),
    serviceLevel: v.optional(v.string()),
    clientId: v.optional(v.string()),
    clientName: v.optional(v.string()),
    date: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("revenue", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const updateRevenue = mutation({
  args: {
    id: v.id("revenue"),
    amount: v.optional(v.number()),
    type: v.optional(v.union(v.literal("credit-repair"), v.literal("funding"))),
    serviceLevel: v.optional(v.string()),
    clientId: v.optional(v.string()),
    clientName: v.optional(v.string()),
    date: v.optional(v.string()),
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

export const deleteRevenue = mutation({
  args: { id: v.id("revenue") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
