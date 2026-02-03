import { treaty } from "@elysiajs/eden";
import type { App } from "@/app/api/[[...slugs]]/route";

// Use same-origin in production (Vercel) and in dev.
// Hard-coding localhost breaks when deployed.
export const client = treaty<App>("").api;
