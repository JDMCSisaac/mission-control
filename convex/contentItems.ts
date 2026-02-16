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
    platform: v.optional(v.string()),
    body: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentItems", args);
  },
});

export const updateContentItem = mutation({
  args: {
    id: v.id("contentItems"),
    title: v.optional(v.string()),
    stage: v.optional(v.string()),
    page: v.optional(v.string()),
    type: v.optional(v.string()),
    platform: v.optional(v.string()),
    body: v.optional(v.string()),
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

export const updateContentStage = mutation({
  args: {
    id: v.id("contentItems"),
    stage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { stage: args.stage });
  },
});

export const deleteContentItem = mutation({
  args: { id: v.id("contentItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
