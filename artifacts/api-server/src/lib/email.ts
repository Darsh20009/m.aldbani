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

/**
 * Premium inline SVG logo — dark navy circle with white M and blue D,
 * matching the actual brand logo colors. Fully inline, no external deps.
 */
const LOGO_SVG = `<table cellpadding="0" cellspacing="0" style="margin:0 auto 0 0">
  <tr>
    <td style="width:56px;height:56px;border-radius:14px;background:linear-gradient(135deg,#0b1437,#1a1060);text-align:center;vertical-align:middle;line-height:0;padding:0">
      <svg width="34" height="26" viewBox="0 0 130 101" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block;vertical-align:middle">
        <polyline points="7,94 7,7 48,58 89,7 89,94" stroke="#FFFFFF" stroke-width="13" stroke-linecap="square" stroke-linejoin="miter" fill="none"/>
        <path d="M89,7 C89,7 124,7 124,50.5 C124,94 89,94 89,94" stroke="#93c5fd" stroke-width="13" stroke-linecap="square" stroke-linejoin="round" fill="none"/>
      </svg>
    </td>
  </tr>
</table>`;

/** Shared branded email shell — exported for reuse across all transactional emails. */
export function renderBrandedEmail(opts: {
  dir?: "ltr" | "rtl" | "auto";
  lang?: "en" | "ar";
  title: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  return emailShell(opts);
}

/**
 * Premium M-ALDBANI email shell.
 * Deep navy gradient header · brand SVG logo · clean editorial body · professional footer.
 */
function emailShell(opts: {
  dir?: "ltr" | "rtl" | "auto";
  lang?: "en" | "ar";
  title: string;
  bodyHtml: string;
  preheader?: string;
}): string {
  const dir  = opts.dir  || "ltr";
  const lang = opts.lang || "en";
  const align = dir === "rtl" ? "right" : "left";
  const year  = new Date().getFullYear();

  return `<!DOCTYPE html>
<html dir="${dir}" lang="${lang}">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="color-scheme" content="light"/>
  <!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
</head>
<body style="margin:0;padding:0;background:#E8E5DF;font-family:Arial,Helvetica,sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%">

  ${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;font-size:1px;color:#E8E5DF;line-height:1px;max-width:0;opacity:0">${opts.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ""}

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background:#E8E5DF;padding:48px 16px 56px">
    <tr><td align="center" valign="top">

      <!-- Card -->
      <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0"
        style="background:#FFFFFF;border-radius:24px;overflow:hidden;
               box-shadow:0 2px 4px rgba(0,0,0,0.04),0 8px 24px rgba(0,0,0,0.08),0 32px 72px rgba(0,0,0,0.1);
               max-width:580px;width:100%">

        <!-- ═══════════ HEADER ═══════════ -->
        <tr>
          <td style="background:linear-gradient(150deg,#08102E 0%,#0F1E56 45%,#1a1060 100%);
                     padding:40px 44px 36px" align="${align}">

            <!-- Logo + brand row -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
              style="${dir === "rtl" ? "float:right" : ""}">
              <tr>
                <td style="padding-${dir === "rtl" ? "left" : "right"}:16px;vertical-align:middle">
                  ${LOGO_SVG}
                </td>
                <td style="vertical-align:middle">
                  <p style="margin:0;color:#FFFFFF;font-size:17px;font-weight:900;
                            letter-spacing:0.1em;font-family:Arial,sans-serif;line-height:1.2">
                    m&#8209;aldbani
                  </p>
                  <p style="margin:4px 0 0;color:rgba(255,255,255,0.5);font-size:10px;
                            font-weight:600;letter-spacing:0.3em;text-transform:uppercase;
                            font-family:Arial,sans-serif">
                    ${lang === "ar" ? "محمد الدباني" : "Mohammed Al-Dabbani"}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Decorative gradient separator -->
            <div style="height:1px;
                        background:linear-gradient(90deg,rgba(37,99,235,0.7),rgba(124,58,237,0.7),transparent);
                        margin:28px 0 24px;clear:both"></div>

            <!-- Email title -->
            <h1 style="margin:0 0 10px;color:#FFFFFF;font-size:26px;font-weight:700;
                       font-family:Arial,sans-serif;line-height:1.3;letter-spacing:-0.01em">
              ${opts.title}
            </h1>

            <!-- Brand tagline -->
            <p style="margin:0;color:rgba(255,255,255,0.28);font-size:8.5px;
                      letter-spacing:0.32em;text-transform:uppercase;font-family:Arial,sans-serif">
              EXPERIENCE &nbsp;·&nbsp; INNOVATION &nbsp;·&nbsp; IMPACT
            </p>

          </td>
        </tr>

        <!-- ═══════════ BODY ═══════════ -->
        <tr>
          <td style="padding:36px 44px 32px;background:#FFFFFF" align="${align}">
            ${opts.bodyHtml}
          </td>
        </tr>

        <!-- ═══════════ FOOTER ═══════════ -->
        <tr>
          <td style="background:#F5F3EE;padding:24px 44px 28px;
                     border-top:1px solid rgba(0,0,0,0.06)" align="center">

            <!-- Short gradient accent -->
            <div style="width:36px;height:2px;border-radius:2px;margin:0 auto 18px;
                        background:linear-gradient(90deg,#2563EB,#7C3AED)"></div>

            <!-- Logo row in footer -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
              style="margin:0 auto 14px">
              <tr>
                <td style="width:28px;height:28px;border-radius:7px;
                           background:linear-gradient(135deg,#0b1437,#1a1060);
                           text-align:center;vertical-align:middle;padding:0">
                  <svg width="17" height="13" viewBox="0 0 130 101" fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style="display:inline-block;vertical-align:middle;margin-top:2px">
                    <polyline points="7,94 7,7 48,58 89,7 89,94"
                      stroke="#FFFFFF" stroke-width="14" stroke-linecap="square"
                      stroke-linejoin="miter" fill="none"/>
                    <path d="M89,7 C89,7 124,7 124,50.5 C124,94 89,94 89,94"
                      stroke="#93c5fd" stroke-width="14" stroke-linecap="square"
                      stroke-linejoin="round" fill="none"/>
                  </svg>
                </td>
                <td style="padding-left:10px;vertical-align:middle">
                  <p style="margin:0;color:#0F0F10;font-size:12px;font-weight:800;
                            letter-spacing:0.12em;font-family:Arial,sans-serif">M-ALDBANI</p>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 4px;color:#9a9590;font-size:11px;font-family:Arial,sans-serif;
                      letter-spacing:0.04em">
              &copy; ${year} M-ALDBANI &nbsp;&middot;&nbsp;
              ${lang === "ar" ? "محمد الدباني" : "Mohammed Al-Dabbani"}
            </p>
            <p style="margin:0;color:#b8b3ac;font-size:9px;letter-spacing:0.22em;
                      text-transform:uppercase;font-family:Arial,sans-serif">
              EXPERIENCE &nbsp;·&nbsp; INNOVATION &nbsp;·&nbsp; IMPACT
            </p>

          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td></tr>
  </table>

</body>
</html>`;
}

/** Send booking confirmation email to the client (Arabic). */
export async function sendClientBookingConfirmation(opts: {
  clientEmail: string;
  clientName: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  notes?: string;
  googleCalUrl?: string;
}): Promise<void> {
  const { clientEmail, clientName, type, date, time, duration, googleCalUrl } = opts;

  const bodyHtml = `
    <p style="margin:0 0 8px;color:#3a3733;font-size:15px;font-family:Arial,sans-serif;direction:rtl;text-align:right">
      مرحباً <strong>${clientName}</strong>،
    </p>
    <p style="margin:0 0 24px;color:#3a3733;font-size:15px;line-height:1.75;font-family:Arial,sans-serif;direction:rtl;text-align:right">
      تم تأكيد حجز استشارتك بنجاح. إليك تفاصيل موعدك:
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid rgba(0,0,0,0.07);border-radius:14px;overflow:hidden;
             margin-bottom:28px;box-shadow:0 2px 8px rgba(0,0,0,0.04);direction:rtl">
      <tr style="background:#F5F3EE">
        <td style="padding:11px 16px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(0,0,0,0.05);white-space:nowrap;font-weight:600">نوع الاستشارة</td>
        <td style="padding:11px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;border-bottom:1px solid rgba(0,0,0,0.05);font-weight:500">${type}</td>
      </tr>
      <tr style="background:#FFFFFF">
        <td style="padding:11px 16px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(0,0,0,0.05);white-space:nowrap;font-weight:600">التاريخ</td>
        <td style="padding:11px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;border-bottom:1px solid rgba(0,0,0,0.05);font-weight:500">${date}</td>
      </tr>
      <tr style="background:#F5F3EE">
        <td style="padding:11px 16px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;border-bottom:1px solid rgba(0,0,0,0.05);white-space:nowrap;font-weight:600">الوقت</td>
        <td style="padding:11px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;border-bottom:1px solid rgba(0,0,0,0.05);font-weight:500">${time}</td>
      </tr>
      <tr style="background:#FFFFFF">
        <td style="padding:11px 16px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;font-weight:600">المدة</td>
        <td style="padding:11px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;font-weight:500">${duration} دقيقة</td>
      </tr>
    </table>

    ${googleCalUrl ? `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="direction:rtl;margin-bottom:24px">
      <tr>
        <td style="border-radius:10px;background:linear-gradient(135deg,#2563EB,#7C3AED)">
          <a href="${googleCalUrl}" target="_blank"
             style="display:inline-block;padding:13px 28px;color:#ffffff;font-size:14px;
                    font-weight:700;font-family:Arial,sans-serif;text-decoration:none;
                    letter-spacing:0.03em">
            📅 أضف للتقويم — Google Calendar
          </a>
        </td>
      </tr>
    </table>` : ""}

    <p style="margin:24px 0 0;color:#b0aaa4;font-size:12px;font-family:Arial,sans-serif;
              line-height:1.6;border-top:1px solid rgba(0,0,0,0.06);padding-top:20px;
              direction:rtl;text-align:right">
      سيتواصل معك فريق محمد الدباني قريباً لتأكيد رابط الاجتماع.
      إذا كان لديك أي استفسار تواصل معنا عبر البريد الإلكتروني.
    </p>
  `;

  const html = emailShell({
    dir: "rtl", lang: "ar",
    title: "✅ تم تأكيد حجز استشارتك",
    preheader: `حجزك بتاريخ ${date} الساعة ${time} مؤكد`,
    bodyHtml,
  });

  await sendEmail({
    to: clientEmail,
    subject: `تم تأكيد استشارتك بتاريخ ${date}`,
    html,
    text: `مرحباً ${clientName}، تم تأكيد استشارتك بتاريخ ${date} الساعة ${time}.`,
  });
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
          ([k, v], i) =>
            `<tr style="background:${i % 2 === 0 ? "#FAFAF8" : "#FFFFFF"}">
              <td style="padding:11px 16px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;
                         letter-spacing:0.08em;text-transform:uppercase;
                         border-bottom:1px solid rgba(0,0,0,0.05);white-space:nowrap;
                         font-weight:600">${k}</td>
              <td style="padding:11px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;
                         border-bottom:1px solid rgba(0,0,0,0.05);font-weight:500">${v}</td>
            </tr>`,
        )
        .join("")
    : "";

  const bodyHtml = `
    <p style="margin:0 0 24px;color:#3a3733;font-size:15px;line-height:1.75;font-family:Arial,sans-serif">
      ${opts.body}
    </p>
    ${rows
      ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="border:1px solid rgba(0,0,0,0.07);border-radius:14px;overflow:hidden;
                  margin-bottom:28px;box-shadow:0 2px 8px rgba(0,0,0,0.04)">
           ${rows}
         </table>`
      : ""}
    <p style="margin:0;color:#b0aaa4;font-size:12px;font-family:Arial,sans-serif;
              line-height:1.6;border-top:1px solid rgba(0,0,0,0.06);padding-top:20px">
      This is an automated notification from your M-ALDBANI platform dashboard.
    </p>
  `;

  const html = emailShell({ title: opts.title, bodyHtml });
  await sendEmail({ to: opts.adminEmail, subject: opts.subject, html, text: opts.body });
}
