/**
 * Generates a static preview of the contact-form inquiry email using the REAL
 * `renderContactEmailHtml` renderer (the same code that runs in production),
 * so what you see here is byte-for-byte what lands in the inbox.
 *
 *   pnpm tsx scripts/preview-contact-email.ts
 *
 * Outputs into ./preview/:
 *   - contact-email.html   the email itself (logo embedded as data URI)
 *   - email-preview.html   wrapper: inbox-list mockup + the email in an iframe
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  renderContactEmailHtml,
  renderContactEmailText,
  buildPreheader,
  formatReceivedAt,
  type ContactEmailData,
} from "@/lib/contactEmail";

// ── Sample submission (realistic rail-maintenance inquiry) ───────────────────
const sample: ContactEmailData = {
  firstName: "Anna",
  lastName: "Kowalska",
  company: "PKP Intercity",
  email: "a.kowalska@pkp-intercity.pl",
  phone: "+48 22 473 1000",
  location: "warsaw-hq",
  subject: "Fleet maintenance partnership — 24 EN57 units",
  message:
    "Dzień dobry,\n\nWe are evaluating long-term maintenance partners for a " +
    "fleet of 24 EN57 electric multiple units operating out of Warszawa " +
    "Wschodnia. Scope would cover P3/P4 level overhauls, bogie refurbishment, " +
    "and on-site diagnostics.\n\nWe need a partner with UTK certification and " +
    "demonstrable EVN traceability. Could we arrange an introductory call next " +
    "week?\n\nBest regards,\nAnna Kowalska\nRolling Stock Procurement",
  // Fixed timestamp so the preview is deterministic.
  receivedAt: "2026-06-04T13:32:00.000Z",
  sourceDomain: "xapika.pl",
};

const root = process.cwd();
const outDir = resolve(root, "preview");
mkdirSync(outDir, { recursive: true });

// Embed the white wordmark as a data URI so the preview is self-contained.
const logoBuf = readFileSync(resolve(root, "public/logo-white.png"));
const logoSrc = `data:image/png;base64,${logoBuf.toString("base64")}`;

const emailHtml = renderContactEmailHtml(sample, {
  logoSrc,
  baseUrl: "https://xapika.pl",
});
writeFileSync(resolve(outDir, "contact-email.html"), emailHtml, "utf-8");

// Also drop the plain-text variant to eyeball the fallback.
writeFileSync(
  resolve(outDir, "contact-email.txt"),
  renderContactEmailText(sample),
  "utf-8"
);

// ── Wrapper page: inbox-list mockup + the live email in an iframe ─────────────
const preheader = buildPreheader(sample);
const inboxSubject = `[Contact] ${sample.subject}`;
const received = formatReceivedAt(sample.receivedAt);

const wrapper = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Contact email — preview</title>
<style>
  :root{--ink:#0B1F3A;--amber:#F6A317;--muted:#5B6B7F;--line:#E2E6EC;--paper:#EEF1F4;}
  *{box-sizing:border-box;}
  body{margin:0;background:var(--paper);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif;color:var(--ink);}
  .wrap{max-width:760px;margin:0 auto;padding:40px 20px 80px;}
  .eyebrow{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--amber);margin:0 0 6px;}
  h1{font-size:24px;font-weight:800;letter-spacing:-.01em;margin:0 0 4px;}
  .sub{font-size:14px;color:var(--muted);margin:0 0 28px;}
  .card{background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;margin-bottom:28px;box-shadow:0 1px 2px rgba(11,31,58,.05);}
  .card-head{display:flex;align-items:center;gap:8px;padding:13px 18px;border-bottom:1px solid var(--line);font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);}
  .dot{width:7px;height:7px;border-radius:50%;background:var(--amber);}
  /* inbox row */
  .inbox-row{display:flex;align-items:center;gap:14px;padding:16px 18px;}
  .avatar{width:40px;height:40px;border-radius:50%;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;flex:0 0 auto;}
  .inbox-main{min-width:0;flex:1;}
  .inbox-top{display:flex;align-items:baseline;justify-content:space-between;gap:12px;}
  .sender{font-weight:700;font-size:14px;color:var(--ink);}
  .time{font-size:12px;color:var(--muted);white-space:nowrap;flex:0 0 auto;}
  .inbox-subj{font-size:14px;color:var(--ink);margin-top:2px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .preheader{font-size:13px;color:var(--muted);margin-top:1px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .chip{display:inline-block;background:#FDF1DC;color:#8A5A00;font-size:11px;font-weight:700;border-radius:999px;padding:2px 9px;margin-left:8px;vertical-align:middle;}
  iframe{width:100%;border:0;display:block;background:var(--paper);}
  .meta{font-size:12px;color:var(--muted);padding:0 2px;line-height:1.7;}
  .meta b{color:var(--ink);}
  code{background:#fff;border:1px solid var(--line);border-radius:4px;padding:1px 6px;font-size:12px;}
</style>
</head>
<body>
  <div class="wrap">
    <p class="eyebrow">Email preview</p>
    <h1>Contact form → inbox</h1>
    <p class="sub">Rendered with the production <code>renderContactEmailHtml</code> — delivered to <b>info@xapika.pl</b>.</p>

    <!-- inbox list mockup -->
    <div class="card">
      <div class="card-head"><span class="dot"></span> Inbox preview · info@xapika.pl</div>
      <div class="inbox-row">
        <div class="avatar">X</div>
        <div class="inbox-main">
          <div class="inbox-top">
            <span class="sender">Xapika Contact <span class="chip">via Resend</span></span>
            <span class="time">${received}</span>
          </div>
          <div class="inbox-subj">${inboxSubject}</div>
          <div class="preheader">${preheader}</div>
        </div>
      </div>
    </div>

    <!-- the email itself -->
    <div class="card">
      <div class="card-head"><span class="dot"></span> Opened email</div>
      <iframe id="mail" src="./contact-email.html" title="Contact email" scrolling="no"></iframe>
    </div>

    <p class="meta">
      <b>From:</b> Xapika Contact &lt;noreply@xapika.pl&gt; &nbsp;·&nbsp;
      <b>To:</b> info@xapika.pl &nbsp;·&nbsp;
      <b>Reply-To:</b> ${sample.email}<br/>
      <b>Subject:</b> ${inboxSubject}
    </p>
  </div>

  <script>
    // Auto-size the iframe to its content so the whole email shows with no inner scrollbar.
    var f = document.getElementById('mail');
    function fit(){ try { f.style.height = (f.contentWindow.document.body.scrollHeight + 24) + 'px'; } catch(e){} }
    f.addEventListener('load', fit);
    window.addEventListener('resize', fit);
    setTimeout(fit, 200);
  </script>
</body>
</html>`;

writeFileSync(resolve(outDir, "email-preview.html"), wrapper, "utf-8");

console.log("Wrote:");
console.log("  preview/contact-email.html");
console.log("  preview/contact-email.txt");
console.log("  preview/email-preview.html");
