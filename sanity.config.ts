// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { projectId, dataset } from "./src/sanity/env";

export default defineConfig({
  name: "default",
  title: "Xapika News",
  projectId,
  dataset,
  plugins: [structureTool()],
  schema: {
    // `schema.types` expects Sanity's internal `SchemaTypeDefinition[]`
    // type, which sanity@6.9.2's public entry point does not re-export
    // (verified directly against node_modules/sanity/lib/index.d.ts — see
    // src/sanity/schemaTypes/newsPost.ts for the full explanation).
    // `@sanity/types`, which does export it, is only a transitive
    // dependency here and is not resolvable via a bare import from this
    // file. `schemaTypes` is therefore a hand-typed plain array rather
    // than one built with `defineField`/`defineType`. This cast is the
    // single, explicit place that bridges it into Sanity's real (but
    // unreachable-by-name) config type — Studio only cares about the
    // plain object shape at runtime, so nothing is lost functionally.
    types: schemaTypes as any,
  },
});
