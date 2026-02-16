// Re-export convex hooks with safe fallbacks for when provider is missing (during SSR/build)
export { useQuery, useMutation } from "convex/react";
