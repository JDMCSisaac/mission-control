/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as activity from "../activity.js";
import type * as applications from "../applications.js";
import type * as clients from "../clients.js";
import type * as contentItems from "../contentItems.js";
import type * as fundingClients from "../fundingClients.js";
import type * as seed from "../seed.js";
import type * as tasks from "../tasks.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  activity: typeof activity;
  applications: typeof applications;
  clients: typeof clients;
  contentItems: typeof contentItems;
  fundingClients: typeof fundingClients;
  seed: typeof seed;
  tasks: typeof tasks;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
