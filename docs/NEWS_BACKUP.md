# News CMS — Backup Workflows

Two separate GitHub Actions workflows back up the Sanity news dataset.
They're deliberately different in size, schedule, and retention — this
document explains why, and how to use each one, including how to restore
from them (short version — full restore steps live in
`docs/NEWS_RECOVERY_PROCEDURE.md`).

## Why two workflows instead of one

A single daily backup that includes every uploaded photo sounds simpler,
but the math doesn't work for a free-tier setup: every run re-exports the
**entire** dataset from scratch (not just what changed since last time),
so a scheduled full export, run automatically forever, grows without
bound. At realistic upload volumes for this site, two kept full exports
alone would cross GitHub's free private-repo storage allowance (500MB) in
roughly a month and a half — see `NEWS_CMS_PLAN.md` §11 (checklist item ⑧)
for the full calculation. So the design splits the job in two:

| | `sanity-backup-daily.yml` | `sanity-backup-full.yml` |
|---|---|---|
| Runs | Automatically, every day (03:00 KST) | Manually only — someone clicks "Run workflow" |
| Contains | Article text/fields only (`--no-assets`) | Everything, including uploaded photos |
| Typical size | A few hundred KB | Grows with photo volume — can be tens/hundreds of MB |
| Kept for | 14 days (as a GitHub Actions artifact) | 7 days (as a GitHub Actions artifact) — **must be downloaded elsewhere immediately**, see below |
| Defends against | "I deleted one article and it's been more than 3 days" (the common case) | Total data loss — dataset or project deleted, or one article's *photos* need recovering |

The daily one is cheap enough to run forever unattended. The full one is
run by a person, on purpose, a few times a year — see the trigger list
below.

## When to manually run the full backup

There's no automatic schedule for this one, so someone has to remember to
click it:

- Right before doing anything risky in `sanity.io/manage` (deleting a test
  project, changing dataset settings, etc.).
- As part of the quarterly self-check described in `NEWS_CMS_PLAN.md`
  §11-⑫.
- Any time a large batch of new photos has just been added and it's been
  a while since the last full backup.

**Immediately after it finishes, download the resulting archive and store
it somewhere that isn't GitHub's 7-day artifact retention** — a local
computer, or `info@xapika.pl`'s Google Drive. The 7-day window exists so a
forgotten artifact doesn't sit around consuming storage forever, not as a
long-term archive.

## How to run it manually

1. GitHub repository → **Actions** tab.
2. Left sidebar → **Sanity dataset backup (full, manual trigger only)**.
3. **Run workflow** button (top right of the runs list) → **Run workflow**
   (confirm) → wait for the green checkmark.
4. Open the finished run → **Artifacts** section at the bottom →
   download `sanity-backup-full-<run id>.zip`.
5. Unzip it (it contains one `production-full-YYYY-MM-DD.tar.gz`) and
   move that file to long-term storage (§ above).

The daily workflow can also be run manually the same way, mainly useful
for testing that it still works after any change to secrets/tokens.

## One-time setup this depends on

Both workflows need two things configured in the GitHub repository
(**Settings → Secrets and variables → Actions**), done once during
`NEWS_CMS_PLAN.md` §10 Day 3:

| Name | Type | Value | Where to get it |
|---|---|---|---|
| `SANITY_AUTH_TOKEN` | **Secret** | A Sanity API token with **Viewer** permission (read-only is enough — export never needs to write) | `sanity.io/manage` → the project → **API → Tokens → Add API token** → name it e.g. `github-actions-backup` |
| `SANITY_PROJECT_ID` | **Variable** | The project's 8-character Project ID | `sanity.io/manage` → the project's overview page |

If either is missing, both workflows fail immediately with a clear
`::error::` message naming exactly which one is missing, instead of
failing later with a confusing authentication error — check the failed
run's log if a workflow ever goes red.

Also confirm (once, and again during the quarterly self-check):
**GitHub → account Settings → Billing → Spending limit is set to `$0`**
for the account that owns this repository. This means that even if a
runaway workflow (from a bug, a bad edit, anything) somehow tried to
consume more Actions minutes or storage than the free tier allows, GitHub
would simply refuse the extra usage rather than generating a real charge.
See `NEWS_CMS_PLAN.md` §11-⑨ for why this matters as a third,
independent cost-safety layer alongside the Vercel and Sanity ones.

## Restoring from a backup

Short version — see `docs/NEWS_RECOVERY_PROCEDURE.md` for the full,
scenario-by-scenario walkthrough (which one to use, single-article vs.
full restore, re-pointing the app to a new project ID, etc.):

```bash
# Full restore of a downloaded backup into a (new or existing) dataset
# named "production". Requires a WRITE-capable API token — the read-only
# github-actions-backup token above is not enough for this step.
npx sanity datasets import \
  production-full-YYYY-MM-DD.tar.gz \
  production \
  -p <project id>
```

Command name note: the correct modern CLI subcommand is plural —
`sanity datasets export` / `sanity datasets import` — not the singular
`sanity dataset export/import` that shows up in some older examples. If a
command ever fails with an "unknown command" error, run
`npx sanity datasets --help` to confirm the exact syntax for whatever CLI
version happens to be installed at the time; this has already changed
once and may change again.

## Failure notifications

GitHub notifies the account that owns the repository by default whenever
a scheduled workflow run fails — confirm this is still turned on under
that account's **Settings → Notifications**. This matters specifically for
the daily workflow: because nobody is watching it run every night, a
silent, months-long failure (e.g., an expired token) would otherwise go
unnoticed until the day someone actually needs a backup that was never
being made. Checking this is part of Day 3 setup and the quarterly
self-check (`NEWS_CMS_PLAN.md` §11-⑪).
