# Xapika Website — Account Setup Guide

To go live and hand the new website over to you, we need **three accounts created under Xapika's own name** so that you fully own hosting, email, and content going forward. The first two below need about **10–15 minutes** of action from you, using a Google account. The third (Sanity, for news/press content) is set up for you using that same Google account — no separate signup needed on your end.

| Service | Purpose | Sign‑up | Cost |
|---|---|---|---|
| **Vercel** | Hosting the website (xapika.pl) | Continue with Google | **Pro — $20 / month** (required) |
| **Resend** | Delivering the contact‑form emails | Continue with Google | **Free** (upgrade later only if needed) |
| **Sanity** | Managing news/press articles (content management) | Continue with Google — set up for you, shared login | **Free** (upgrade later only if you need multiple individually-invited editors) |

> **Total to start: $20 / month** (Vercel Pro). Resend and Sanity both stay on their free plans.

---

## Step 0 — Create one dedicated Google account (recommended)

Please create a single **company Google account** dedicated to these services, for example **`engineering.xapika@gmail.com`** (or an address on your own domain if you use Google Workspace).

Why: Vercel, Resend, and Sanity all support **"Continue with Google,"** so one Google login covers all three. It keeps all credentials in one place and makes it easy to share access with us, your development partner.

> Keep the password safe — this single account controls the website hosting and email.

---

## Account 1 — Vercel (website hosting)

This is where the website actually runs.

### How to sign up
1. Go to **https://vercel.com/signup**
2. Click **"Continue with Google"** and use the Google account from Step 0.
3. When asked, choose a **personal/team name** (e.g. "Xapika Engineering").

### What to purchase — **Pro plan, $20 / month**
- On the website, please select the **Pro** plan.
- **This is required.** Vercel's free "Hobby" plan is for **personal, non‑commercial use only** — a company website on the free plan violates Vercel's terms and can be suspended. The Pro plan is the correct plan for a business website.
- Billing is **$20 per month, per member** who publishes updates. Additional people who only view (stakeholders) are **free**.
- You will be asked for a **credit card**.

### What we need from you
- After signing up, **invite us as a team member**: `admin@leanup.kr`
  *(Vercel → Settings → Members → Invite)*
- We will then deploy the website and connect your domain **xapika.pl**.

---

## Account 2 — Resend (contact‑form email)

When a visitor submits the contact form on the website, **Resend** delivers that message to your inbox. Without it, the contact form cannot send mail.

### How to sign up
1. Go to **https://resend.com/signup**
2. Click **"Continue with Google"** and use the same Google account from Step 0.
   *(If a Google button is not shown, "Continue with GitHub" or email sign‑up also works.)*

### What to purchase — **nothing, the Free plan is enough**
- The **Free** plan includes **3,000 emails / month** and **1 verified domain** — far more than a contact form needs.
- Only upgrade to **Pro ($20/month, 50,000 emails)** later if email volume grows significantly. **No purchase is needed now.**

### What we need from you
- **Invite us as a team member** (`admin@leanup.kr`) **or** share the **API key** with us securely.
- To send email from your domain (e.g. `no‑reply@xapika.pl`), Resend requires a few **DNS records** on **xapika.pl**. We will provide the exact values — you (or we, with access) add them at your domain registrar.

---

## Account 3 — Sanity (news & press content management)

This is where your team writes and publishes news articles for the `/news`
section of the site.

### How it's set up
Unlike Vercel and Resend above, **Sanity uses one shared login rather than
individually invited team members.** We set this up for you using your
**Google account from Step 0** (the same one already connected to your
domain, Vercel, and Resend) — everyone who works on news content, on your
side and ours, signs in with that one shared login. There is nothing for
you to sign up for separately.

### What to purchase — nothing, the Free plan is enough
- The Free plan covers everything the news section needs, comfortably
  within its limits.
- **Please never add a credit card to this Sanity account.** Leaving it
  card‑free is a deliberate safeguard — it makes it physically impossible
  for the plan to be upgraded or charged, by anyone, by accident, since
  Sanity's free plan simply has no billing to trigger without one.

### Four rules that come with a shared login
Because this is one shared account rather than separately invited members,
please make sure whoever writes news content follows these:
1. **No credit card on the Sanity account, ever** (see above).
2. **Only open `https://xapika.pl/studio`** when using this account for
   news content — never `sanity.io/manage`, and be careful with
   `vercel.com` too. The same login is the master account for your website
   hosting, domain, and email, so opening the wrong screen could
   accidentally change or break something outside the news section, up to
   and including taking the live site down.
3. **Keep 2‑factor authentication turned on** for this Google account — a
   shared login is worth the extra protection.
4. **If whoever manages news content changes, change the password right
   away.** There's no per‑person "remove access" toggle on a shared
   account, so a new password is the only way to fully cut off a previous
   person's access.

### If your team grows
If more people at Xapika (for example, colleagues at the Poland office)
need to write news articles later, we can switch from this one shared
login to individually invited accounts — still **free, for up to 20
people**. We're starting with the simpler shared login because typically
only one person manages this content day‑to‑day; just let us know if that
changes.

### What we need from you
- Nothing to sign up for. Just keep the Google account from Step 0 secure
  (2‑factor authentication on, password not shared beyond the people who
  actually need it) and follow the four rules above.

---

## What to have ready

- ✅ The **Google account** from Step 0 (login + password).
- ✅ A **credit card** for the Vercel Pro subscription.
- ✅ **Access to the domain `xapika.pl`** (the registrar/DNS where the domain is managed) — needed to point the domain at the new site and to verify email sending.

---

## Quick checklist

- [ ] Create the dedicated company Google account
- [ ] Sign up at **vercel.com** with Google → choose **Pro ($20/mo)** → invite `admin@leanup.kr`
- [ ] Sign up at **resend.com** with Google → stay on **Free** → invite `admin@leanup.kr` (or send API key)
- [ ] Sanity (news/press CMS) — nothing to sign up for; we set it up on the same Google account. Just keep 2‑factor authentication on and never add a card to it.
- [ ] Confirm you can access the **xapika.pl** domain/DNS settings

Once these are done, send us a quick note and we will deploy the website, connect **xapika.pl**, and activate the contact form. If anything is unclear, we're happy to do a short screen‑share and set it up together.

---

*Verified May 2026. Vercel supports Google sign‑in (Vercel changelog, May 2025). Vercel Pro is $20/member/month and required for commercial sites; the Hobby plan is non‑commercial only. Resend Free = 3,000 emails/month, 1 domain; Pro = $20/month, 50,000 emails.*
