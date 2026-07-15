import nodemailer from "nodemailer";
import { logger } from "./logger";
import { SiteSettings } from "../models/SiteSettings";

/** Resolves where admin/owner notifications should be sent: the address
 * configured in the admin Settings page, falling back to ADMIN_EMAIL. */
export async function getNotificationEmail(): Promise<string> {
  try {
    const s = await SiteSettings.findOne();
    return s?.notificationEmail || process.env.ADMIN_EMAIL || "";
  } catch {
    return process.env.ADMIN_EMAIL || "";
  }
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "server222.web-hosting.com",
  port: Number(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER || "info@qirox.online",
    pass: process.env.SMTP_PASS || "",
  },
});

/** Public site origin used to build absolute asset URLs (logo images, etc.)
 * inside emails — inline SVG/CID images are unreliable across mail clients,
 * so we always link to a real hosted PNG instead. */
const SITE_URL = (process.env.PUBLIC_SITE_URL || "https://m-aldbani.site").replace(/\/$/, "");
/** Square gold-on-black brand mark — reads clearly on both the dark header
 * and the light footer since its own background is baked into the PNG. */
const LOGO_URL = `${SITE_URL}/logo.png`;

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: { filename: string; content: string; contentType?: string }[];
}): Promise<void> {
  if (!process.env.SMTP_PASS) {
    throw new Error("SMTP_PASS is not configured — cannot send email");
  }
  try {
    await transporter.sendMail({
      from: `"M-ALDBANI" <${process.env.SMTP_FROM || "info@qirox.online"}>`,
      replyTo: process.env.SMTP_FROM || "info@qirox.online",
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      attachments: opts.attachments,
    });
    logger.info({ to: opts.to, subject: opts.subject }, "Email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send email");
    throw err;
  }
}

/**
 * Builds a minimal RFC-5545 .ics calendar event. Used both as an email
 * attachment (Apple Mail/Outlook auto-detect it and offer "Add to Calendar")
 * and as a data-URI download link in the HTML body.
 */
export function buildIcs(opts: {
  uid: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  location?: string;
}): string {
  const [y, m, d] = opts.date.split("-");
  const [h, min] = opts.time.split(":");
  const startH = parseInt(h, 10);
  const startM = parseInt(min, 10);
  const dur = opts.durationMinutes || 60;
  const endH = String(startH + Math.floor((startM + dur) / 60)).padStart(2, "0");
  const endM = String((startM + dur) % 60).padStart(2, "0");
  const dtStart = `${y}${m}${d}T${h}${min}00`;
  const dtEnd = `${y}${m}${d}T${endH}${endM}00`;
  const now = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const esc = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//M-ALDBANI//Consultation//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${opts.uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${esc(opts.title)}`,
    `DESCRIPTION:${esc(opts.description)}`,
    `LOCATION:${esc(opts.location || "Online")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

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
                     padding:40px 44px 34px;position:relative" align="${align}">

            <!-- Gold corner glow accent -->
            <div style="position:absolute;top:0;${dir === "rtl" ? "left" : "right"}:0;
                        width:160px;height:160px;
                        background:radial-gradient(circle,rgba(199,172,112,0.16),transparent 70%)"></div>

            <!-- Logo + brand row -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
              style="${dir === "rtl" ? "float:right" : ""}">
              <tr>
                <td style="padding-${dir === "rtl" ? "left" : "right"}:16px;vertical-align:middle">
                  <img src="${LOGO_URL}" width="52" height="52" alt="M-ALDBANI"
                    style="display:block;border-radius:14px;border:0;outline:none;
                           box-shadow:0 4px 14px rgba(0,0,0,0.35)"/>
                </td>
                <td style="vertical-align:middle">
                  <p style="margin:0;color:#FFFFFF;font-size:17px;font-weight:900;
                            letter-spacing:0.1em;font-family:Arial,sans-serif;line-height:1.2">
                    m&#8209;aldbani
                  </p>
                  <p style="margin:4px 0 0;color:#C7AC70;font-size:10px;
                            font-weight:600;letter-spacing:0.3em;text-transform:uppercase;
                            font-family:Arial,sans-serif">
                    ${lang === "ar" ? "محمد الدباني" : "Mohammed Al-Dabbani"}
                  </p>
                </td>
              </tr>
            </table>

            <!-- Decorative gradient separator -->
            <div style="height:2px;
                        background:linear-gradient(90deg,#C7AC70,rgba(37,99,235,0.7),rgba(124,58,237,0.7),transparent);
                        margin:28px 0 24px;clear:both;border-radius:2px"></div>

            <!-- Email title -->
            <h1 style="margin:0 0 10px;color:#FFFFFF;font-size:26px;font-weight:700;
                       font-family:Arial,sans-serif;line-height:1.3;letter-spacing:-0.01em">
              ${opts.title}
            </h1>

            <!-- Brand tagline -->
            <p style="margin:0;color:#C7AC70;font-size:8.5px;
                      letter-spacing:0.32em;text-transform:uppercase;font-family:Arial,sans-serif;
                      opacity:0.85">
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
                        background:linear-gradient(90deg,#C7AC70,#2563EB,#7C3AED)"></div>

            <!-- Logo row in footer -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"
              style="margin:0 auto 14px">
              <tr>
                <td style="vertical-align:middle">
                  <img src="${LOGO_URL}" width="26" height="26" alt="M-ALDBANI"
                    style="display:block;border-radius:7px;border:0;outline:none"/>
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
            <p style="margin:0 0 16px;color:#b8b3ac;font-size:9px;letter-spacing:0.22em;
                      text-transform:uppercase;font-family:Arial,sans-serif">
              EXPERIENCE &nbsp;·&nbsp; INNOVATION &nbsp;·&nbsp; IMPACT
            </p>

            <!-- Spam-folder notice -->
            <p style="margin:0;padding-top:14px;border-top:1px solid rgba(0,0,0,0.06);
                      color:#a8a29a;font-size:10.5px;line-height:1.7;font-family:Arial,sans-serif;
                      direction:${dir};text-align:center">
              ${lang === "ar"
                ? "إذا لم تصل رسائلنا القادمة إلى بريدك الرئيسي، تحقق من مجلد الرسائل غير المرغوب فيها (Spam/Junk) وأضف <strong>info@qirox.online</strong> إلى جهات الاتصال الموثوقة."
                : "If our emails ever land in Spam/Junk, please mark them as \"Not Spam\" and add <strong>info@qirox.online</strong> to your contacts."}
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
  icsUid?: string;
  /** Set to false when no user account exists yet for this email, so we can
   * invite them to create one and track their bookings going forward. */
  hasAccount?: boolean;
}): Promise<void> {
  const { clientEmail, clientName, type, date, time, duration, googleCalUrl, hasAccount } = opts;

  const uid = opts.icsUid || `booking-${Date.now()}@m-aldbani.site`;
  const icsContent = buildIcs({
    uid,
    title: `استشارة: ${type}`,
    description: `موعد استشارة مع محمد الدباني — ${type}`,
    date,
    time,
    durationMinutes: duration,
    location: "Online",
  });
  const icsDataUri = `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent)}`;

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

    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="direction:rtl;margin-bottom:24px">
      <tr>
        ${googleCalUrl ? `
        <td style="border-radius:10px;background:linear-gradient(135deg,#2563EB,#7C3AED);padding-left:10px">
          <a href="${googleCalUrl}" target="_blank"
             style="display:inline-block;padding:13px 22px;color:#ffffff;font-size:13px;
                    font-weight:700;font-family:Arial,sans-serif;text-decoration:none;
                    letter-spacing:0.02em">
            📅 Google Calendar
          </a>
        </td>` : ""}
        <td style="border-radius:10px;border:1.5px solid #C7AC70;background:#0F0F10">
          <a href="${icsDataUri}" download="consultation.ics"
             style="display:inline-block;padding:13px 22px;color:#C7AC70;font-size:13px;
                    font-weight:700;font-family:Arial,sans-serif;text-decoration:none;
                    letter-spacing:0.02em">
            🍎 Apple Calendar
          </a>
        </td>
      </tr>
    </table>
    <p style="margin:-10px 0 20px;color:#b0aaa4;font-size:11px;font-family:Arial,sans-serif;direction:rtl;text-align:right">
      تم أيضاً إرفاق دعوة التقويم (.ics) مع هذه الرسالة — يمكنك فتحها مباشرة لإضافة الموعد.
    </p>

    ${hasAccount === false ? `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="direction:rtl;margin-bottom:24px;background:linear-gradient(135deg,#0F0F10,#1a1060);
             border-radius:14px;border:1px solid #C7AC70">
      <tr>
        <td style="padding:20px 22px">
          <p style="margin:0 0 6px;color:#C7AC70;font-size:13px;font-weight:800;font-family:Arial,sans-serif">
            💡 أنشئ حسابك الآن
          </p>
          <p style="margin:0 0 16px;color:rgba(255,255,255,0.75);font-size:12.5px;line-height:1.7;font-family:Arial,sans-serif">
            لا تملك حساباً بعد على هذا البريد. أنشئ حسابك لتتابع حجوزاتك، تصل لملفاتك وتحصل على تحديثات فورية — لن تحتاج للبحث عن هذه الرسالة كل مرة.
          </p>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-radius:10px;background:#C7AC70">
                <a href="${SITE_URL}/auth/register?email=${encodeURIComponent(clientEmail)}"
                   style="display:inline-block;padding:12px 24px;color:#0F0F10;font-size:13px;
                          font-weight:800;font-family:Arial,sans-serif;text-decoration:none">
                  إنشاء حساب مجاني
                </a>
              </td>
            </tr>
          </table>
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
    attachments: [
      {
        filename: "consultation.ics",
        content: icsContent,
        contentType: "text/calendar; charset=utf-8; method=PUBLISH",
      },
    ],
  });
}

/** Send a confirmation email to a visitor who submitted the contact form. */
export async function sendContactConfirmation(opts: {
  clientEmail: string;
  clientName: string;
  message: string;
}): Promise<void> {
  const { clientEmail, clientName, message } = opts;

  const bodyHtml = `
    <p style="margin:0 0 8px;color:#3a3733;font-size:15px;font-family:Arial,sans-serif;direction:rtl;text-align:right">
      مرحباً <strong>${clientName}</strong>،
    </p>
    <p style="margin:0 0 22px;color:#3a3733;font-size:15px;line-height:1.75;font-family:Arial,sans-serif;direction:rtl;text-align:right">
      تلقينا رسالتك بنجاح وسيتم الرد عليك خلال 24 ساعة.
    </p>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
      style="border:1px solid rgba(0,0,0,0.07);border-radius:14px;overflow:hidden;
             margin-bottom:24px;box-shadow:0 2px 8px rgba(0,0,0,0.04);direction:rtl">
      <tr style="background:#F5F3EE">
        <td style="padding:14px 18px">
          <p style="margin:0 0 6px;color:#8a8580;font-size:11px;font-family:Arial,sans-serif;letter-spacing:0.08em;text-transform:uppercase;font-weight:600">رسالتك</p>
          <p style="margin:0;color:#0F0F10;font-size:14px;font-family:Arial,sans-serif;line-height:1.7;white-space:pre-wrap">${message}</p>
        </td>
      </tr>
    </table>

    <p style="margin:0;color:#b0aaa4;font-size:12px;font-family:Arial,sans-serif;
              line-height:1.6;border-top:1px solid rgba(0,0,0,0.06);padding-top:20px;
              direction:rtl;text-align:right">
      إذا كان استفسارك عاجلاً، يمكنك حجز استشارة مباشرة من الموقع.
    </p>
  `;

  const html = emailShell({
    dir: "rtl", lang: "ar",
    title: "✅ تم استلام رسالتك",
    preheader: "شكراً لتواصلك معنا — سنرد عليك قريباً",
    bodyHtml,
  });

  await sendEmail({
    to: clientEmail,
    subject: "تم استلام رسالتك — M-ALDBANI",
    html,
    text: `مرحباً ${clientName}، تلقينا رسالتك وسنرد عليك خلال 24 ساعة.`,
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
