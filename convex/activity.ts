import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("activity")
      .withIndex("by_createdAt")
      .order("desc")
      .take(20);
  },
});

export const addActivity = mutation({
  args: {
    text: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("activity", {
      ...args,
      createdAt: Date.now(),
    });
  },
});
