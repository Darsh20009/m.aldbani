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

export async function notifyAdmin(opts: {
  adminEmail: string;
  subject: string;
  title: string;
  body: string;
  details?: Record<string, string>;
}): Promise<void> {
  const rows = opts.details
    ? Object.entries(opts.details)
        .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#6b7280;font-size:13px;border-bottom:1px solid #f3f4f6;white-space:nowrap">${k}</td><td style="padding:6px 12px;font-size:13px;color:#111827;border-bottom:1px solid #f3f4f6">${v}</td></tr>`)
        .join("")
    : "";

  const html = `
<!DOCTYPE html>
<html dir="ltr" lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
        <tr><td style="background:linear-gradient(135deg,#2563EB,#7C3AED);padding:28px 32px">
          <p style="margin:0;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;opacity:0.75">M-ALDBANI Platform</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">${opts.title}</h1>
        </td></tr>
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 20px;color:#374151;font-size:15px;line-height:1.6">${opts.body}</p>
          ${rows ? `<table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;margin-bottom:24px">${rows}</table>` : ""}
          <p style="margin:0;color:#9ca3af;font-size:12px">This is an automated notification from your M-ALDBANI platform.</p>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:16px 32px;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#9ca3af;font-size:11px;text-align:center">© ${new Date().getFullYear()} M-ALDBANI · Mohammed Al-Dabbani</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  await sendEmail({ to: opts.adminEmail, subject: opts.subject, html, text: opts.body });
}
