/**
 * Contact-form inquiry notification email.
 *
 * Renders the HTML + plain-text email delivered to the Xapika inbox whenever
 * the website contact form is submitted. Table-based, inline-styled markup for
 * broad email-client compatibility (Gmail, Outlook, Apple Mail), built on the
 * site brand tokens — ink #0B1F3A, amber #F6A317, Space Grotesk / Pretendard
 * fall back to a safe system stack since email clients can't load web fonts.
 */

import { locationLabel } from "@/lib/contactSchema";

export type ContactEmailData = {
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  phone?: string;
  /** Office id from the form select (e.g. "warsaw-hq"). */
  location: string;
  subject: string;
  message: string;
  /** ISO timestamp of submission. */
  receivedAt: string;
};

export type ContactEmailOptions = {
  /**
   * Absolute URL of the white wordmark shown in the header, e.g.
   * `https://xapika.co.kr/logo-white.png`. Pass a data: URI for self-contained
   * previews. When omitted, the header falls back to a styled text wordmark.
   */
  logoSrc?: string;
  /** Site origin used for footer links. Defaults to https://xapika.co.kr. */
  baseUrl?: string;
};

// ── Brand tokens (email-safe solid hex; no rgba, no CSS variables) ────────────
const INK = "#0B1F3A";
const AMBER = "#F6A317";
const PAPER = "#EEF1F4";
const CARD = "#FFFFFF";
const PANEL = "#F7F8FA";
const HAIRLINE = "#E2E6EC";
const MUTED = "#5B6B7F";
const CHIP_BG = "#FDF1DC";
const CHIP_INK = "#8A5A00";
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Helvetica,Arial,sans-serif";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** "4 Jun 2026, 14:32 UTC" — stable, locale-independent, UTC. */
export function formatReceivedAt(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ` +
    `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} UTC`
  );
}

/** Inbox preview text (preheader) shown beside the subject in most clients. */
export function buildPreheader(data: ContactEmailData): string {
  const name = `${data.firstName} ${data.lastName}`.trim();
  return `New inquiry from ${name} · ${data.company} · ${data.subject}`;
}

// ── Plain-text fallback ───────────────────────────────────────────────────────

export function renderContactEmailText(data: ContactEmailData): string {
  const phoneLine = data.phone ? `\nPhone:   ${data.phone}` : "";
  return [
    "XAPIKA ENGINEERING — NEW CONTACT INQUIRY",
    "========================================",
    "",
    data.subject,
    "",
    `From:    ${data.firstName} ${data.lastName}`,
    `Company: ${data.company}`,
    `Email:   ${data.email}${phoneLine}`,
    `Office:  ${locationLabel(data.location)}`,
    "",
    "Message",
    "-------",
    data.message,
    "",
    "—",
    `Reply directly to this email to respond to ${data.firstName}.`,
    `Submitted ${formatReceivedAt(data.receivedAt)} via xapika.co.kr/contact`,
  ].join("\n");
}

// ── HTML email ────────────────────────────────────────────────────────────────

function metaRow(label: string, valueHtml: string): string {
  return `<tr>
    <td style="padding:11px 16px 11px 0;vertical-align:top;white-space:nowrap;color:${MUTED};font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;font-family:${FONT};">${escapeHtml(
      label
    )}</td>
    <td style="padding:11px 0;vertical-align:top;color:${INK};font-size:15px;line-height:1.45;font-family:${FONT};">${valueHtml}</td>
  </tr>`;
}

export function renderContactEmailHtml(
  data: ContactEmailData,
  options: ContactEmailOptions = {}
): string {
  const baseUrl = (options.baseUrl ?? "https://xapika.co.kr").replace(/\/$/, "");
  const fullName = `${data.firstName} ${data.lastName}`.trim();
  const office = locationLabel(data.location);
  const preheader = buildPreheader(data);
  const messageHtml = escapeHtml(data.message).replace(/\n/g, "<br/>");
  const replyHref = `mailto:${escapeHtml(data.email)}?subject=${encodeURIComponent(
    `Re: ${data.subject}`
  )}`;

  const logoBlock = options.logoSrc
    ? `<img src="${escapeHtml(
        options.logoSrc
      )}" width="132" height="auto" alt="Xapika Engineering" style="display:block;border:0;outline:none;height:auto;width:132px;max-width:132px;" />`
    : `<span style="font-family:${FONT};font-size:22px;font-weight:800;letter-spacing:0.04em;color:#FFFFFF;">XAPIKA</span>`;

  const phoneRow = data.phone
    ? metaRow(
        "Phone",
        `<a href="tel:${escapeHtml(
          data.phone
        )}" style="color:${INK};text-decoration:none;">${escapeHtml(
          data.phone
        )}</a>`
      )
    : "";

  return `<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<title>New contact inquiry — ${escapeHtml(data.subject)}</title>
</head>
<body style="margin:0;padding:0;background:${PAPER};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <!-- preheader (hidden inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${PAPER};opacity:0;">
    ${escapeHtml(preheader)}
    &#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PAPER};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${CARD};border-radius:16px;overflow:hidden;box-shadow:0 1px 2px rgba(11,31,58,0.06);">

          <!-- header -->
          <tr>
            <td style="background:${INK};padding:26px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align:middle;">${logoBlock}</td>
                  <td align="right" style="vertical-align:middle;color:#9FB0C4;font-family:${FONT};font-size:10px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase;">Contact&nbsp;form</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- amber rule -->
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${AMBER};">&nbsp;</td></tr>

          <!-- body -->
          <tr>
            <td style="padding:34px 32px 8px 32px;">
              <!-- eyebrow -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:8px;"><span style="display:inline-block;width:22px;height:2px;background:${AMBER};vertical-align:middle;"></span></td>
                  <td style="vertical-align:middle;color:${AMBER};font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;">New inquiry</td>
                </tr>
              </table>

              <h1 style="margin:14px 0 8px 0;font-family:${FONT};font-size:24px;line-height:1.25;font-weight:800;letter-spacing:-0.01em;color:${INK};">${escapeHtml(
    data.subject
  )}</h1>
              <p style="margin:0 0 22px 0;font-family:${FONT};font-size:14px;line-height:1.55;color:${MUTED};">
                From <strong style="color:${INK};font-weight:700;">${escapeHtml(
    fullName
  )}</strong> at <strong style="color:${INK};font-weight:700;">${escapeHtml(
    data.company
  )}</strong>
                &nbsp;·&nbsp;
                <span style="display:inline-block;background:${CHIP_BG};color:${CHIP_INK};font-size:12px;font-weight:700;letter-spacing:0.01em;border-radius:999px;padding:4px 11px;">${escapeHtml(
    office
  )}</span>
              </p>

              <!-- meta -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid ${HAIRLINE};border-bottom:1px solid ${HAIRLINE};margin:0 0 24px 0;">
                ${metaRow(
                  "Email",
                  `<a href="mailto:${escapeHtml(
                    data.email
                  )}" style="color:${INK};text-decoration:none;font-weight:600;">${escapeHtml(
                    data.email
                  )}</a>`
                )}
                ${phoneRow}
                ${metaRow("Company", escapeHtml(data.company))}
                ${metaRow("Office", escapeHtml(office))}
              </table>

              <!-- message -->
              <div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${MUTED};margin:0 0 10px 0;">Message</div>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${PANEL};border:1px solid ${HAIRLINE};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;border-left:3px solid ${AMBER};border-radius:10px;font-family:${FONT};font-size:15px;line-height:1.7;color:${INK};">
                    ${messageHtml}
                  </td>
                </tr>
              </table>

              <!-- reply CTA -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:26px 0 8px 0;">
                <tr>
                  <td style="border-radius:8px;background:${INK};">
                    <a href="${replyHref}" style="display:inline-block;padding:13px 26px;font-family:${FONT};font-size:14px;font-weight:700;color:#FFFFFF;text-decoration:none;border-radius:8px;letter-spacing:0.01em;">Reply to ${escapeHtml(
    data.firstName
  )} &rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:6px 0 26px 0;font-family:${FONT};font-size:12px;line-height:1.5;color:${MUTED};">Or just reply to this email — it goes straight to ${escapeHtml(
    data.firstName
  )}.</p>
            </td>
          </tr>

          <!-- footer -->
          <tr>
            <td style="background:${PANEL};border-top:1px solid ${HAIRLINE};padding:20px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;font-family:${FONT};font-size:11px;line-height:1.5;color:${MUTED};">
                    <strong style="color:${INK};">Xapika Engineering</strong><br/>
                    Submitted ${escapeHtml(formatReceivedAt(data.receivedAt))}
                  </td>
                  <td align="right" style="vertical-align:middle;font-family:${FONT};font-size:11px;color:${MUTED};">
                    <a href="${baseUrl}/contact" style="color:${MUTED};text-decoration:none;">xapika.co.kr/contact</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <div style="font-family:${FONT};font-size:10px;color:#9FB0C4;margin-top:18px;">This is an automated notification from the Xapika website contact form.</div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
