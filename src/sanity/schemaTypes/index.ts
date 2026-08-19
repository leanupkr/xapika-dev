// src/sanity/schemaTypes/index.ts
//
// No `SchemaTypeDefinition[]` type annotation here — that type is not
// exported by sanity@6.9.2's public entry point. See the detailed
// explanation in ./newsPost.ts and in ../../../sanity.config.ts (the one
// place this array crosses into Sanity's real, unreachable-by-name config
// type).
import { newsPost } from "./newsPost";

export const schemaTypes = [newsPost];
