import nodemailer from "nodemailer";
import { logger } from "./logger";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "server222.web-hosting.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "info@qirox.online",
    pass: process.env.SMTP_PASS || "",
  },
});

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not configured — cannot send email");
  }
  try {
    await transporter.sendMail({
      from: `"M-ALDBANI Platform" <${process.env.SMTP_FROM || "info@qirox.online"}>`,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
    });
    logger.info({ to: opts.to, subject: opts.subject }, "Email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send email");
    throw err;
  }
}

/** Inline SVG of the MD monogram mark, embeddable directly in HTML emails (no external image request needed). */
const LOGO_SVG = `<svg width="40" height="31" viewBox="0 0 130 101" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block">
  <polyline points="7,94 7,7 48,58 89,7 89,94" stroke="#C7AC70" stroke-width="13" stroke-linecap="square" stroke-linejoin="miter" fill="none"/>
  <path d="M89,7 C89,7 124,7 124,50.5 C124,94 89,94 89,94" stroke="#C7AC70" stroke-width="13" stroke-linecap="square" stroke-linejoin="round" fill="none"/>
</svg>`;

/** Shared branded email shell — reusable across notifyAdmin and any other transactional email.
 * Exported so other routes (e.g. admin broadcast emails) render with the same brand identity. */
export function renderBrandedEmail(opts: { dir?: "ltr" | "rtl" | "auto"; lang?: "en" | "ar"; title: string; bodyHtml: string; preheader?: string }): string {
  return emailShell(opts);
}

/** Shared branded email shell — dark charcoal header with the MD mark, gold accents, editorial type. */
function emailShell(opts: { dir?: "ltr" | "rtl" | "auto"; lang?: "en" | "ar"; title: string; bodyHtml: string; preheader?: string }): string {
  const dir = opts.dir || "ltr";
  const lang = opts.lang || "en";
  return `
<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light" />
</head>
<body style="margin:0;padding:0;background:#EDEBE6;font-family:Georgia,'Times New Roman',serif">
  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#EDEBE6;padding:48px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#FAF8F4;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(15,15,16,0.12)">

        <!-- Header: dark, MD mark + wordmark -->
        <tr><td style="background:#0F0F10;padding:36px 36px 28px" align="${dir === "rtl" ? "right" : "left"}">
          <table cellpadding="0" cellspacing="0" ${dir === "rtl" ? 'align="right"' : ""}>
            <tr>
              <td style="padding-${dir === "rtl" ? "left" : "right"}:12px;vertical-align:middle">${LOGO_SVG}</td>
              <td style="vertical-align:middle">
                <p style="margin:0;color:#F5F5F3;font-size:14px;font-weight:700;letter-spacing:0.06em;font-family:Arial,sans-serif">M-ALDBANI</p>
                <p style="margin:0;color:#C7AC70;font-size:10px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;font-family:Arial,sans-serif">${lang === "ar" ? "محمد الدباني" : "Mohammed Al-Dabbani"}</p>
              </td>
            </tr>
          </table>
          <div style="height:1px;background:linear-gradient(90deg,rgba(199,172,112,0.5),transparent);margin-top:24px"></div>
          <h1 style="margin:20px 0 0;color:#F5F5F3;font-size:24px;font-weight:400;font-family:Georgia,serif">${opts.title}</h1>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px 36px" align="${dir === "rtl" ? "right" : "left"}">
          ${opts.bodyHtml}
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#EDEBE6;padding:20px 36px;border-top:1px solid rgba(15,15,16,0.08)" align="center">
          <p style="margin:0;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.04em">
            © ${new Date().getFullYear()} M-ALDBANI · ${lang === "ar" ? "محمد الدباني" : "Mohammed Al-Dabbani"}
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function notifyAdmin(opts: {
  adminEmail: string;
  subject: string;
  title: string;
  body: string;
  details?: Record<string, string>;
}): Promise<void> {
  const rows = opts.details
    ? Object.entries(opts.details)
        .map(
          ([k, v]) =>
            `<tr><td style="padding:9px 14px;color:#8a8580;font-size:12px;font-family:Arial,sans-serif;letter-spacing:0.03em;text-transform:uppercase;border-bottom:1px solid rgba(15,15,16,0.06);white-space:nowrap">${k}</td><td style="padding:9px 14px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;border-bottom:1px solid rgba(15,15,16,0.06)">${v}</td></tr>`,
        )
        .join("")
    : "";

  const bodyHtml = `
    <p style="margin:0 0 20px;color:#3a3733;font-size:15px;line-height:1.7;font-family:Arial,sans-serif">${opts.body}</p>
    ${rows ? `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid rgba(15,15,16,0.08);border-radius:12px;overflow:hidden;margin-bottom:24px">${rows}</table>` : ""}
    <p style="margin:0;color:#a8a29a;font-size:12px;font-family:Arial,sans-serif">This is an automated notification from your M-ALDBANI platform.</p>
  `;

  const html = emailShell({ title: opts.title, bodyHtml });

  await sendEmail({ to: opts.adminEmail, subject: opts.subject, html, text: opts.body });
}
