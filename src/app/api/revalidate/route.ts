// src/app/api/revalidate/route.ts
//
// Receives Sanity's webhook on newsPost create/update/delete and invalidates
// the Next.js cache so published changes show up without waiting for the
// `revalidate = 3600` safety-net timer on the News pages.
//
// Security note (the bug this file exists to NOT reproduce): an earlier
// draft called `isValidSignature(body, signature, SECRET)` without `await`.
// `isValidSignature` is an async function, so `!Promise{}` evaluates to
// `false` unconditionally — every request "passed" signature verification
// regardless of the actual signature. `next-sanity/webhook`'s `parseBody()`
// performs `await isValidSignature(...)` internally, so that class of bug
// is not reachable from this file's code at all.
import { revalidatePath, revalidateTag } from "next/cache";
import { parseBody } from "next-sanity/webhook";
import type { NextRequest } from "next/server";

const SECRET = process.env.SANITY_REVALIDATE_SECRET;

type WebhookPayload = {
  _type?: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest): Promise<Response> {
  if (!SECRET) {
    // No secret configured means this endpoint cannot verify anyone's
    // signature. Respond exactly like an invalid-signature request (401,
    // same body shape) rather than a distinct 500 — a caller probing this
    // route learns nothing about *why* it was rejected, only that it was.
    console.error(
      "[news] SANITY_REVALIDATE_SECRET is not set — rejecting webhook request",
    );
    return new Response("Invalid signature", { status: 401 });
  }

  // parseBody performs `await isValidSignature(...)` internally — see the
  // module comment above for why that `await` is the whole point of using
  // this helper instead of calling `isValidSignature` directly.
  const { isValidSignature, body } = await parseBody<WebhookPayload>(
    req,
    SECRET,
    false, // Skip waiting for Content Lake eventual consistency: this
    // handler never re-queries Sanity, it only invalidates Next's cache,
    // so there is nothing for the wait to protect against here — it would
    // only add ~3s of latency to every webhook delivery.
  );

  if (!isValidSignature) {
    return new Response("Invalid signature", { status: 401 });
  }
  if (!body) {
    return new Response("Empty payload", { status: 400 });
  }

  // Next.js 16: revalidateTag requires the second argument — the
  // single-argument form is deprecated. "max" gives stale-while-revalidate
  // semantics (the *next* visitor still gets the old page while a fresh
  // one is fetched in the background), which is wrong for a webhook: the
  // whole point is that the newly published article is visible immediately.
  // { expire: 0 } is the documented pattern for exactly this case ("For
  // webhooks or third-party services that need immediate expiration, you
  // can pass { expire: 0 }" — next/dist/docs/.../revalidateTag.md).
  revalidateTag("news", { expire: 0 });

  // Route Handlers can't call updateTag (Server Actions only), so
  // revalidatePath is the other half of the invalidation: it marks each of
  // these paths so the *next* request rebuilds them instead of serving a
  // cached copy (next/dist/docs/.../revalidatePath.md).
  revalidatePath("/news");
  revalidatePath("/"); // Homepage News preview rail
  revalidatePath("/news/rss.xml");
  if (body.slug?.current) {
    revalidatePath(`/news/${body.slug.current}`);
  }
  // Deliberately not revalidating "/sitemap.xml": src/app/sitemap.ts calls
  // getRequestOrigin() (-> headers()), which makes it a Request-time/dynamic
  // route already — there's no cached entry for revalidatePath to mark.

  return Response.json({ revalidated: true, now: Date.now() });
}
