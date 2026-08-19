# News CMS — Accidental Deletion & Recovery Procedure

Audience: primarily the developer/agency handling a recovery request, but
written so a non-developer client contact can also follow the "what do I
do right now" steps at the top. For the everyday quick-reference version,
see `docs/뉴스_CMS_요약_국문.md` §10.

> **The core fact everything below depends on**: Sanity's built-in
> "undo" (document History) only covers the **last 3 days**. After that,
> the only way back is the GitHub Actions backup described in
> `docs/NEWS_BACKUP.md`. Which path applies depends entirely on how long
> ago the mistake happened — check that first, always.

---

## Step 0 — Figure out which scenario you're in

| What happened | How long ago | → Go to |
|---|---|---|
| One article was accidentally deleted or badly edited | Within 3 days | §1 (History panel — self-serve, no developer needed) |
| One article was accidentally deleted or badly edited | More than 3 days | §2 (restore that one article from a backup file) |
| The whole dataset (all articles) got deleted or corrupted | Any time | §3 (full dataset restore) |
| The entire Sanity project got deleted | Any time | §3, then re-point env vars (§3.4) |

---

## §1. Within 3 days — self-serve undo (no developer needed)

1. Log into `https://xapika.pl/studio`.
2. If the article still shows in the **News Post** list: open it → click
   the clock/**History** icon near the top of the document → pick the
   version from before the mistake → **Restore**.
3. If the article was fully **deleted** and no longer shows in the list:
   Sanity still keeps deleted-document history for the same 3-day window.
   Search is not always reliable for fully-deleted documents through the
   Studio UI alone — if you (the client contact) can't find a way to
   restore it yourself within a couple of minutes, stop and escalate to
   the developer contact immediately, citing the exact article title and
   roughly when it was deleted. Time matters here — every hour that
   passes eats into the 3-day window.

`[screenshot: History panel on a News Post document — placeholder, to be
captured during the Day 12 delete/recovery dry run per NEWS_CMS_PLAN.md
§10]`

---

## §2. More than 3 days — restore a single article from a backup

The daily backup workflow (`sanity-backup-daily.yml`, see
`docs/NEWS_BACKUP.md`) exports the entire dataset's documents (not images)
every day, and keeps 14 days of these exports as GitHub Actions artifacts.

1. Go to the GitHub repository → **Actions** tab → **Sanity dataset backup
   (daily, docs only)** → find a run from **before** the deletion (ideally
   the most recent one before it happened) → download the
   `sanity-backup-daily-<run id>` artifact → unzip it. Inside is a
   `production-docs-YYYY-MM-DD.tar.gz`.
2. Extract that `.tar.gz`. It contains the dataset as NDJSON
   (`data.ndjson`) plus an `assets.json` manifest (no actual image files —
   this is the docs-only backup).
3. Find the missing article's JSON object inside `data.ndjson` by its
   `title` or `slug` (a plain-text search works — each line is one JSON
   document).
4. The safest way to bring back a single document without disturbing
   anything else that changed since the backup: create a new document of
   the same shape in `/studio` by hand, copying the field values across
   from the recovered JSON (title, slug, excerpt, category, body, etc.).
   For a text-only article this is usually faster and safer than a full
   dataset import, which would also roll back every *other* article to
   the backup's state.
5. If the deleted article had a **cover image or gallery photos**, those
   asset files are not in the docs-only backup — pull them from the most
   recent **full** backup instead (see §3.1) and re-upload them onto the
   recreated document.

---

## §3. Whole dataset or project lost — full restore

Use this when many/all articles are gone, not just one — or when the
Sanity project itself was deleted from `sanity.io/manage`.

### 3.1 Get the most recent full backup

Full backups (`sanity-backup-full.yml`) are **manually triggered only**
(see `docs/NEWS_BACKUP.md` for why) and are not guaranteed to exist for
every week. They are also only kept as a GitHub Actions artifact for
**7 days** — per the checklist in `NEWS_CMS_PLAN.md` §11-⑩, whoever runs a
full backup is expected to immediately download it to a computer or to
`info@xapika.pl`'s Google Drive. So:

1. First check GitHub → Actions → **Sanity dataset backup (full, manual
   trigger only)** for a recent run with a still-downloadable artifact.
2. If nothing usable is left in GitHub, check the external copies
   mentioned above (local machine / Drive) for the most recent
   `production-full-YYYY-MM-DD.tar.gz`.
3. If truly nothing is available, fall back to the daily docs-only
   backups (§2) for text, and accept that any images from articles
   published since the last full backup are unrecoverable — this is the
   reason full backups should be run periodically (quarterly self-check,
   `NEWS_CMS_PLAN.md` §11-⑫) even though they're manual.

### 3.2 If the dataset was deleted but the project still exists

1. In `sanity.io/manage`, recreate a dataset named exactly **`production`**
   (the codebase hardcodes this name — see `.env.local.example`).
2. Restore into it:
   ```bash
   npx sanity datasets import \
     production-full-YYYY-MM-DD.tar.gz \
     production \
     -p <project id>
   ```
   (Command name note: like the export command, the correct modern
   subcommand is `sanity datasets import`, plural. If this errors with an
   unknown-command message, run `npx sanity datasets --help` first to
   confirm the exact current syntax — CLI flags can change between
   versions.) You'll need an API token with write access for this — the
   read-only `github-actions-backup` token used for the automated backups
   is **not** sufficient; generate a new one with write permission in
   `sanity.io/manage` → API → Tokens, use it once, then delete it.

### 3.3 If the entire project was deleted

1. Create a brand-new Sanity project (same process as
   `NEWS_CMS_PLAN.md` §10 Day 1 — organization `info@xapika.pl`, dataset
   named `production`).
2. Note the new **Project ID**.
3. Follow §3.2 above to import the backup into the new `production`
   dataset.
4. Continue to §3.4 — the new project ID must be re-wired into the app.

### 3.4 Re-pointing the app at a new/restored project

Only needed if the project ID changed (i.e., a brand-new project was
created in §3.3 — not needed if you only recreated a dataset inside the
*same* project in §3.2):

1. Update `NEXT_PUBLIC_SANITY_PROJECT_ID` in Vercel → the project →
   Settings → Environment Variables (Production + Preview) to the new ID.
2. Update the same value in the GitHub repository's Actions **variable**
   `SANITY_PROJECT_ID` (Settings → Secrets and variables → Actions →
   Variables) so the backup workflows keep working.
3. Re-issue a read-only backup token for the new project and update the
   `SANITY_AUTH_TOKEN` GitHub secret.
4. Re-create the revalidate webhook in the new project's
   `sanity.io/manage` → API → Webhooks (see `.env.local.example` and
   `src/app/api/revalidate/route.ts` for the exact settings).
5. Redeploy the site (a normal `git push` to `main` triggers this) so the
   new environment variables take effect.

---

## Deletion confirmation strength (for context, not a how-to)

`NEWS_CMS_PLAN.md` §10 (Day 12) calls for an actual dry run — creating a
disposable dummy Sanity project and clicking through its real delete flow
— to record exactly how strong the confirmation step is (e.g., whether it
requires retyping the project name). That has not been executed yet as of
this document's writing; this section and the screenshot placeholder below
are to be filled in once that dry run happens.

`[screenshot: project-deletion confirmation dialog in sanity.io/manage —
placeholder, pending Day 12 dry run]`

---

## The one thing to repeat to whoever is asking

> "Publishing an article makes it public forever, even without a link on
> the site — un-publishing removes it from the site but does not undo the
> fact it was public. Undo/history only works for 3 days. After that we
> restore from backup, which is why it's important to report a mistake as
> soon as you notice it, not a week later."

See `docs/NEWS_CMS_GUIDE.md` §0 for the full version of this warning aimed
at the day-to-day editor, and `docs/뉴스_CMS_요약_국문.md` for the Korean
version.
