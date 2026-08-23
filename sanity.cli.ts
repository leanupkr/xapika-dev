// sanity.cli.ts
import { defineCliConfig } from "sanity/cli";
import { projectId, dataset } from "./src/sanity/env";

// Reads from the same env-backed source of truth as the rest of the app
// (src/sanity/env.ts) instead of a hardcoded placeholder — once
// NEXT_PUBLIC_SANITY_PROJECT_ID is set in .env.local (Day 1, after the
// Sanity project is created), `sanity dev` / `sanity deploy` pick it up
// with no edits to this file. This file is only read by the standalone
// `sanity` CLI, not by `next build`, so an empty projectId here has no
// effect on the Next.js build.
export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
});
