import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("contentItems").collect();
  },
});

export const addContentItem = mutation({
  args: {
    title: v.string(),
    stage: v.string(),
    page: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentItems", args);
  },
});

export const updateContentStage = mutation({
  args: {
    id: v.id("contentItems"),
    stage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stage: args.stage });
  },
});
