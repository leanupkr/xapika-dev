# Xapika News CMS — Editor Guide

This is the reference manual for publishing news articles on xapika.pl. It
assumes no coding knowledge. If a step ever looks different from what's
described here (a button moved, a label changed), that's normal — the
underlying tool (Sanity Studio) updates itself independently of this
document; the concepts below stay the same even when the exact pixels
don't.

A quick side-by-side of the English field labels you'll see on screen and
their Korean meaning is in `docs/NEWS_UI_KOREAN_GLOSSARY.md`.

---

## 0. Two things you must know before you touch anything

**⚠️ Warning 1 — "Publish" means the whole world can see it, forever, even
without a link.**
The moment you click **Publish**, that article becomes readable by anyone
on the internet through Sanity's public data API — regardless of whether
it's linked from any page on xapika.pl. Un-publishing later removes it from
the site, but does not undo the fact that it was public during that window.
**Never put anything in a news article that isn't meant to be permanently,
publicly visible** — no internal notes, no unannounced deals, no personal
contact details beyond what you'd put in a press release. If you're not
sure a piece is ready, leave it as a draft (see §3) instead of publishing
it "just to check how it looks."

**⚠️ Warning 2 — Undo only works for 3 days.**
Sanity keeps a change history per document, and you can roll back a mistake
(wrong edit, accidental delete) from that history — but only for **3 days**
after the change. After that, the history is gone and there is no "undo"
button left. This is why an automatic backup runs every day behind the
scenes (see `docs/NEWS_BACKUP.md`) — it's the safety net for anything older
than 3 days. If you ever delete something by accident, tell your developer
contact **as soon as possible**, ideally within 3 days, so the built-in undo
can still be used before falling back to the backup.

---

## 1. Logging in

1. Go to **`https://xapika.pl/studio`** (bookmark this — it's the only page
   you need).
2. Sign in with the **shared Google account `info@xapika.pl`** ("Continue
   with Google"), using the credentials your developer contact gave you.
   This one login is shared company-wide — everyone who works on news
   articles (you, and anyone at leanup who helps with setup) signs in with
   the exact same account. There are no separate per-person logins for this
   project.
3. You'll land on the **News Post** list — every article, published and
   draft, lives here.

**Because this login is shared, four rules come with it — please follow all
of them:**

- **Never add a credit card to this Sanity account.** If any screen ever
  asks for payment details, stop and contact your developer instead of
  entering anything. The account is kept deliberately card-free so that no
  plan change or charge can happen by accident, from any screen, by anyone
  who has this login.
- **Only ever open `/studio`.** This same login is also the master account
  for the company's website hosting (Vercel), domain, and outgoing email —
  not just Sanity. Opening any other screen with it, especially
  `sanity.io/manage` or `vercel.com`, risks changing or deleting things
  outside this news CMS, and in the worst case **could take the live
  website down.** If a link or instruction ever points you somewhere else,
  stop and check with your developer contact first.
- **Keep 2‑factor authentication turned on** for this Google account. A
  shared login is a bigger target than a personal one, so this isn't
  optional.
- **If the person handling news articles changes, the password gets
  changed immediately.** There is no per-person "remove access" button on a
  shared account — changing the password is the only way to cut off the
  previous person's access. Tell your developer contact as soon as a
  handover happens so this can be done.

You do **not** need, and should never need, `sanity.io/manage`. That's a
separate, more powerful control panel meant for developers — it has
account- and project-deletion buttons that `/studio` intentionally does not
expose. If a link or instruction ever tells you to go there, stop and check
with your developer contact first.

---

## 2. Writing a new article

Click **News Post** → the **+ Create** (or **+**) button in the top-left of
the list. A new blank document opens.

The very first field is **Article type**, and it changes what the rest of
the form looks like:

- **Own article (written by us)** — you write the full text yourself,
  directly in the Studio.
- **External press coverage (link out)** — someone else (a newspaper, a
  trade publication) wrote about Xapika, and you're adding a short summary
  card that links out to their original article. You do **not** paste
  their full article text in — just a short summary and a link.

### 2.1 Own article

Fill in, top to bottom:

| Field on screen | What to put there |
|---|---|
| **Title (English — required)** | The headline. English only — this field is always required, even if you also fill in the Korean version later. Max 120 characters. |
| **URL slug** | Auto-fills from the title (click **Generate**). This becomes the web address, e.g. `xapika.pl/news/your-slug`. Leave it as generated unless you have a specific reason to change it. |
| **Excerpt (English — required)** | A 1–3 sentence summary. This shows up on the news list cards and is also used as the search-engine description, so keep it short and clear (max 240 characters). |
| **Category** | Pick one: Company News, Project Update, Press Release, or Media Coverage. |
| **Published date** | Defaults to right now. You can backdate or schedule a future date here — the list sorts by this field. |
| **Cover image** | The big photo shown on the article and on its card. Drag and drop a photo in, or click to browse. See §3 below for upload tips. |
| **Alt text** (inside Cover image) | A short plain-text description of the photo, for screen readers and search engines — e.g. "Xapika technicians inspecting an EMU bogie at the Warsaw depot." **Required whenever a cover image is set** — the form will not let you publish without it. |
| **Body (English)** | The full article text. Use the toolbar to add headings, bold/italic, bullet lists, links, and inline photos. |
| **Gallery** | Optional extra photos shown below the article (not the cover photo). |

Optional at the bottom:

| Field | Purpose |
|---|---|
| **Pin to top of list** | Toggle on to keep this article at the very top of `/news`, above newer articles. Use sparingly — for one important announcement at a time. |
| **Title (Korean — optional)** / **Excerpt (Korean — optional)** / **Body (Korean — optional)** | See §6 — filling these in adds a Korean-language toggle to the article's page. Leave all three blank if you don't need a Korean version. |
| **SEO title override** / **SEO description override** | Only touch these if a search engine's search-result text needs to say something different from the Title/Excerpt above. Almost never needed — leave blank by default. |

### 2.2 External press coverage

Same top section (Title, URL slug, Excerpt, Category, Published date, Cover
image), but instead of a Body you'll see:

| Field | What to put there |
|---|---|
| **External article URL** | The full link to the original article (must start with `http://` or `https://`). |
| **Source name (e.g. Rynek Kolejowy)** | The name of the publication, e.g. "Rynek Kolejowy," "Railway Gazette." |

The site shows your excerpt plus a clearly-labeled "Read the full article
at [Source name] →" link — it never copies or displays the outlet's full
text, and it never redirects visitors away from xapika.pl automatically.
Visitors land on your summary page first and choose to click through.

---

## 3. Uploading photos

- Drag a photo directly onto the **Cover image** (or **Gallery**) field, or
  click it to open a file picker.
- Regular phone photos (JPEG) work without any preparation.
- **iPhone photos in HEIC format**: most recent uploads handle this fine
  automatically. If you ever get an upload error specifically on an iPhone
  photo, go to iPhone **Settings → Camera → Formats** and switch to **"Most
  Compatible"** (this saves future photos as JPEG instead of HEIC), or use
  the **Share → Save as JPEG**-style option some Photos apps offer before
  uploading. Ask your developer contact to confirm the current behavior if
  this comes up — it was verified once during setup but image tooling does
  change over time.
- After uploading, click the image to open the **hotspot** editor — drag
  the circle onto the most important part of the photo (a face, a logo) so
  it stays centered no matter what size the photo is shown at.
- Don't forget the **Alt text** field described above — publishing is
  blocked without it whenever a cover image is set.

---

## 4. Draft vs. Publish

At the bottom-right of every article there are two relevant states:

- **Save as draft** (or simply not clicking Publish) — your changes are
  saved automatically as you type, but the article stays private. Only
  people logged into Studio can see it. Use this while you're still
  writing or waiting for approval.
- **Publish** — makes the article live on `/news` immediately (see the
  latency note in §7). Re-read Warning 1 above before you click this.

You can go back and forth freely: publish, then edit again (edits go to a
draft copy until you re-publish), or un-publish a live article back to
draft at any time.

---

## 5. Editing and deleting

- **Editing**: open the article from the News Post list, make your
  changes. If the article was already published, you'll see a **Publish**
  button light up once you have unsaved changes — click it to push the
  edit live. Until you click it, the live site keeps showing the old
  version.
- **Deleting**: open the article → the **⋯** (more actions) menu near the
  top → **Delete**. You'll get a confirmation prompt. Remember Warning 2 —
  you have 3 days to undo this from the document's history panel (the clock
  icon near the top of the document) before it's gone for good.

---

## 6. Korean toggle

By default, every article is English-only, and the site shows no language
switch at all. If you fill in **Title (Korean)**, **Excerpt (Korean)**, and
(for your own articles) **Body (Korean)**, the article's page automatically
grows an **EN / KO** toggle so visitors can switch. You don't need to fill
in all three at once — filling in even just the title is enough to make the
toggle appear, though for a good reader experience try to fill in all of
them together.

There's nothing to configure beyond typing into those three optional
fields — the toggle, the URL behavior, and the fallback to English when a
Korean field is empty are all automatic.

---

## 7. Publishing → seeing it on the live site

After you click Publish, the article usually appears on `xapika.pl/news`
within a few seconds — but it is **normal** for it to take a short moment,
and it's normal to need to **refresh the page once or twice** before the
new content shows up (this is due to how the site's caching keeps pages
fast for everyone else in the meantime). If it still hasn't appeared after
a minute or two, that's worth flagging to your developer contact — but a
few seconds' delay and a needed refresh are expected, not a bug.

---

## 8. Inviting a new teammate

Only your **developer contact or the account owner** (`info@xapika.pl`)
can send invites — this isn't something you do yourself from `/studio`.
When someone new needs to write articles:

1. Ask the account owner to invite them from `sanity.io/manage` → the
   project → **Members → Invite**, with the role **Administrator** (scoped
   to this one news project only — it does not give access to billing, the
   company's other systems, or anything outside this project).
2. They accept the invite with their own Google account (or email/password
   if Google sign-in doesn't work for them) and get their own `/studio`
   login exactly like this one.
3. Give them this guide and `docs/NEWS_UI_KOREAN_GLOSSARY.md`.

If your company reaches the point where you need someone who can **write
but not delete or manage members**, that's a different (paid) tier — ask
your developer contact about it rather than deciding informally; see
`HARIKA_ACCOUNT_SETUP.md` for the cost/decision process.

---

## 9. Troubleshooting

| Problem | What to do |
|---|---|
| "Publish" button is greyed out / disabled | A required field is missing — scroll up, red markers show which field(s) still need attention (commonly: Alt text on the cover image, or the Body for an own article). |
| Photo won't upload | Check the file is a common photo format (JPEG/PNG); for HEIC iPhone photos see §3. Very large files (dozens of MB) can also be slow — try a smaller export from your phone if it seems stuck. |
| I can't find an article I know I published | Use the search box at the top of the News Post list. If it's truly missing, check the **Trash/Deleted** area, or see the 3-day undo window in Warning 2 above. |
| The site still shows my old text after publishing | Wait a few seconds and refresh (see §7). If it persists past a couple of minutes, contact your developer. |
| I accidentally deleted an article | Open the document (if still findable) or contact your developer immediately — see Warning 2. Recovery is very likely within 3 days, harder after. |
| I see a screen with "Delete project" or billing information | You've ended up in `sanity.io/manage` instead of `/studio` — close it and go back to `https://xapika.pl/studio`. Don't click anything there; ask your developer contact if you got there by accident and aren't sure why. |
| I forgot my password / can't log in | Use the "Continue with Google" button if you have one connected; otherwise use the "forgot password" link on the Sanity login screen tied to the email your invite was sent to. |

---

## 10. Support scope

What this setup **does** cover, hands-off, without needing a developer:

- Writing, editing, publishing, and deleting news articles.
- Uploading and managing photos.
- Adding a Korean version of any article.
- Pinning one article to the top of the list.
- Inviting/removing teammates on this one project (account owner only).

What **requires your developer contact**:

- Anything in `sanity.io/manage` (billing, plan changes, project/dataset
  deletion, API tokens).
- Changing how the news section looks or behaves on the site itself
  (layout, categories list, new fields).
- Restoring from a backup after the 3-day undo window has passed (see
  `docs/NEWS_RECOVERY_PROCEDURE.md`).
- Anything related to the site's domain, hosting (Vercel), or the contact
  form — those are separate systems from this CMS.
