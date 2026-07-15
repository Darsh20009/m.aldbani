import { Router, Request, Response } from "express";
import { requireAdmin, AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Service } from "../models/Service";
import { Article } from "../models/Article";
import { Consultation } from "../models/Consultation";
import { Lead } from "../models/Lead";
import { SiteSettings } from "../models/SiteSettings";
import { Faq } from "../models/Faq";
import { logger } from "../lib/logger";
import { sendEmail, renderBrandedEmail } from "../lib/email";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Invoice } from "../models/Invoice";
import { Proposal } from "../models/Proposal";
import { mkdirSync } from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.resolve(__dirname, "../../uploads");
try { mkdirSync(uploadsDir, { recursive: true }); } catch {}

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "image/svg+xml": ".svg",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = ALLOWED_TYPES[file.mimetype] ?? path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) { cb(null, true); }
  else { cb(new Error(`File type not allowed: ${file.mimetype}`)); }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });

const router = Router();
router.use(requireAdmin);

const fmt = (doc: any) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString() ?? obj.id, _id: undefined, __v: undefined };
};

// File upload
router.post("/upload", upload.single("file"), (req: Request, res: Response) => {
  if (!req.file) { res.status(400).json({ error: "No file uploaded" }); return; }
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Stats
router.get("/stats", async (_req: Request, res: Response) => {
  try {
    const [totalClients, totalConsultations, leads, consultations, paidConsultations] = await Promise.all([
      User.countDocuments({ role: "client" }),
      Consultation.countDocuments(),
      Lead.find(),
      Consultation.find(),
      Consultation.find({ paid: true }),
    ]);

    const totalRevenue = paidConsultations.reduce((sum, c) => sum + (c.price || 0), 0);
    const pendingConsultations = consultations.filter((c) => c.status === "pending").length;
    const newLeads = leads.filter((l) => l.status === "new").length;

    // Monthly revenue (last 6 months)
    const now = new Date();
    const monthlyRevenue = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = d.toLocaleString("en", { month: "short", year: "2-digit" });
      const revenue = paidConsultations
        .filter((c) => {
          const cd = new Date(c.createdAt);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        })
        .reduce((sum, c) => sum + (c.price || 0), 0);
      monthlyRevenue.push({ month, revenue });
    }

    // Consultations by type
    const typeMap: Record<string, number> = {};
    for (const c of consultations) {
      typeMap[c.type] = (typeMap[c.type] || 0) + 1;
    }
    const consultationsByType = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

    // Leads by status
    const statusMap: Record<string, number> = {};
    for (const l of leads) {
      statusMap[l.status] = (statusMap[l.status] || 0) + 1;
    }
    const leadsByStatus = Object.entries(statusMap).map(([type, count]) => ({ type, count }));

    res.json({
      totalVisitors: 12480,
      totalClients,
      totalConsultations,
      totalRevenue,
      pendingConsultations,
      newLeads,
      monthlyRevenue,
      consultationsByType,
      leadsByStatus,
    });
  } catch (err) {
    logger.error({ err }, "Admin stats error");
    res.status(500).json({ error: "Server error" });
  }
});

// Leads CRUD
router.get("/leads", async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const filter: Record<string, string> = status ? { status } : {};
    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads.map(fmt));
  } catch (err) {
    logger.error({ err }, "List leads error");
    res.json([]);
  }
});

router.post("/leads", async (req: Request, res: Response) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(fmt(lead));
  } catch (err) {
    logger.error({ err }, "Create lead error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/leads/:id", async (req: Request, res: Response) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(lead));
  } catch (err) {
    logger.error({ err }, "Update lead error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/leads/:id", async (req: Request, res: Response) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ message: "Lead deleted" });
  } catch (err) {
    logger.error({ err }, "Delete lead error");
    res.status(500).json({ error: "Server error" });
  }
});

// FAQs CRUD (admin — includes drafts sourced from client feedback)
router.get("/faqs", async (_req: Request, res: Response) => {
  try {
    const faqs = await Faq.find().sort({ order: 1, createdAt: -1 });
    res.json(faqs.map(fmt));
  } catch (err) {
    logger.error({ err }, "List faqs error");
    res.json([]);
  }
});

router.post("/faqs", async (req: Request, res: Response) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(fmt(faq));
  } catch (err) {
    logger.error({ err }, "Create faq error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/faqs/:id", async (req: Request, res: Response) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!faq) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(faq));
  } catch (err) {
    logger.error({ err }, "Update faq error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/faqs/:id", async (req: Request, res: Response) => {
  try {
    await Faq.findByIdAndDelete(req.params.id);
    res.json({ message: "FAQ deleted" });
  } catch (err) {
    logger.error({ err }, "Delete faq error");
    res.status(500).json({ error: "Server error" });
  }
});

// Clients
router.get("/clients", async (_req: Request, res: Response) => {
  try {
    const clients = await User.find({ role: "client" }).select("-password").sort({ createdAt: -1 });
    res.json(clients.map(fmt));
  } catch (err) {
    logger.error({ err }, "List clients error");
    res.json([]);
  }
});

// Consultations
router.get("/consultations", async (req: Request, res: Response) => {
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const filter: Record<string, string> = status ? { status } : {};
    const consultations = await Consultation.find(filter).sort({ createdAt: -1 });
    res.json(consultations.map(fmt));
  } catch (err) {
    logger.error({ err }, "List all consultations error");
    res.json([]);
  }
});

router.patch("/consultations/:id", async (req: Request, res: Response) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!consultation) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(consultation));
  } catch (err) {
    logger.error({ err }, "Update consultation error");
    res.status(500).json({ error: "Server error" });
  }
});

// Projects CRUD
router.get("/projects", async (_req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects.map(fmt));
  } catch (err) {
    logger.error({ err }, "List admin projects error");
    res.json([]);
  }
});

router.post("/projects", async (req: Request, res: Response) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(fmt(project));
  } catch (err) {
    logger.error({ err }, "Create project error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/projects/:id", async (req: Request, res: Response) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(project));
  } catch (err) {
    logger.error({ err }, "Update project error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/projects/:id", async (req: Request, res: Response) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    logger.error({ err }, "Delete project error");
    res.status(500).json({ error: "Server error" });
  }
});

// Articles CRUD
router.post("/articles", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.published && !body.publishedAt) body.publishedAt = new Date();
    const article = await Article.create(body);
    res.status(201).json(fmt(article));
  } catch (err) {
    logger.error({ err }, "Create article error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/articles/:id", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (body.published && !body.publishedAt) body.publishedAt = new Date();
    const article = await Article.findByIdAndUpdate(req.params.id, body, { new: true });
    if (!article) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(article));
  } catch (err) {
    logger.error({ err }, "Update article error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/articles/:id", async (req: Request, res: Response) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article deleted" });
  } catch (err) {
    logger.error({ err }, "Delete article error");
    res.status(500).json({ error: "Server error" });
  }
});

// Services CRUD
router.post("/services", async (req: Request, res: Response) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(fmt(service));
  } catch (err) {
    logger.error({ err }, "Create service error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/services/:id", async (req: Request, res: Response) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) { res.status(404).json({ error: "Not found" }); return; }
    res.json(fmt(service));
  } catch (err) {
    logger.error({ err }, "Update service error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/services/:id", async (req: Request, res: Response) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    logger.error({ err }, "Delete service error");
    res.status(500).json({ error: "Server error" });
  }
});

// Site Settings
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    const obj = settings.toObject();
    res.json({ ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined });
  } catch (err) {
    logger.error({ err }, "Get site settings error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/settings", async (req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    Object.assign(settings, req.body);
    await settings.save();
    const obj = settings.toObject();
    res.json({ ...obj, id: obj._id?.toString(), _id: undefined, __v: undefined });
  } catch (err) {
    logger.error({ err }, "Update site settings error");
    res.status(500).json({ error: "Server error" });
  }
});

// Analytics
router.get("/analytics", async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const dailyVisitors = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      dailyVisitors.push({
        date: d.toISOString().split("T")[0],
        visitors: Math.floor(Math.random() * 300) + 100,
      });
    }
    res.json({
      pageViews: 48920,
      uniqueVisitors: 12480,
      avgSessionDuration: 4.2,
      bounceRate: 38.5,
      topPages: [
        { path: "/", views: 8420 },
        { path: "/portfolio", views: 5310 },
        { path: "/services", views: 4100 },
        { path: "/articles", views: 3200 },
        { path: "/contact", views: 2100 },
      ],
      trafficSources: [
        { type: "Direct", count: 4200 },
        { type: "Google", count: 3800 },
        { type: "LinkedIn", count: 2100 },
        { type: "Twitter/X", count: 1200 },
        { type: "Referral", count: 1180 },
      ],
      dailyVisitors,
    });
  } catch (err) {
    logger.error({ err }, "Analytics error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── INVOICES (admin manage) ──────────────────────────────────────────────────
router.get("/invoices", async (_req: Request, res: Response) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 }).populate("clientId", "name email");
    res.json(invoices.map((inv: any) => ({
      id: inv._id.toString(),
      clientId: inv.clientId?._id?.toString() ?? inv.clientId?.toString(),
      clientName: inv.clientId?.name ?? "",
      clientEmail: inv.clientId?.email ?? "",
      number: inv.number,
      amount: inv.amount,
      currency: inv.currency,
      status: inv.status,
      dueDate: inv.dueDate?.toISOString(),
      paidAt: inv.paidAt?.toISOString() ?? null,
      items: inv.items,
      createdAt: inv.createdAt?.toISOString(),
    })));
  } catch (err) {
    logger.error({ err }, "Admin get invoices error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/invoices", async (req: Request, res: Response) => {
  try {
    const { clientId, items, dueDate, notes } = req.body as {
      clientId: string;
      items: { description: string; quantity: number; price: number }[];
      dueDate: string;
      notes?: string;
    };
    if (!clientId || !items?.length || !dueDate) {
      res.status(400).json({ error: "clientId, items, and dueDate are required" });
      return;
    }
    const count = await Invoice.countDocuments();
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const amount = items.reduce((s, i) => s + i.quantity * i.price, 0);
    const inv = await Invoice.create({ clientId, number, amount, items, dueDate: new Date(dueDate), status: "pending" });
    res.json({ id: inv._id.toString(), number: inv.number, amount: inv.amount, status: inv.status });
  } catch (err) {
    logger.error({ err }, "Create invoice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/invoices/:id", async (req: Request, res: Response) => {
  try {
    const inv = await Invoice.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inv) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ id: inv._id.toString(), status: inv.status });
  } catch (err) {
    logger.error({ err }, "Update invoice error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/invoices/:id", async (req: Request, res: Response) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Delete invoice error");
    res.status(500).json({ error: "Server error" });
  }
});

// ── PROPOSALS ────────────────────────────────────────────────────────────────
router.get("/proposals", async (_req: Request, res: Response) => {
  try {
    const proposals = await Proposal.find().sort({ createdAt: -1 }).populate("clientId", "name email");
    res.json(proposals.map((p: any) => ({
      id: p._id.toString(),
      clientId: p.clientId?._id?.toString() ?? p.clientId?.toString(),
      clientName: p.clientId?.name ?? "",
      clientEmail: p.clientId?.email ?? "",
      number: p.number,
      title: p.title,
      items: p.items,
      total: p.total,
      currency: p.currency,
      status: p.status,
      validUntil: p.validUntil?.toISOString(),
      notes: p.notes ?? "",
      sentAt: p.sentAt?.toISOString() ?? null,
      createdAt: p.createdAt?.toISOString(),
    })));
  } catch (err) {
    logger.error({ err }, "Get proposals error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/proposals", async (req: Request, res: Response) => {
  try {
    const { clientId, title, items, validUntil, notes } = req.body as {
      clientId: string; title: string;
      items: { description: string; quantity: number; unitPrice: number }[];
      validUntil: string; notes?: string;
    };
    if (!clientId || !title || !items?.length || !validUntil) {
      res.status(400).json({ error: "clientId, title, items, and validUntil are required" });
      return;
    }
    const count = await Proposal.countDocuments();
    const number = `PRO-${new Date().getFullYear()}-${String(count + 1).padStart(3, "0")}`;
    const total = items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
    const proposal = await Proposal.create({ clientId, number, title, items, total, validUntil: new Date(validUntil), notes, status: "draft" });
    res.json({ id: proposal._id.toString(), number: proposal.number, total: proposal.total });
  } catch (err) {
    logger.error({ err }, "Create proposal error");
    res.status(500).json({ error: "Server error" });
  }
});

router.patch("/proposals/:id", async (req: Request, res: Response) => {
  try {
    const update = { ...req.body };
    if (update.items) update.total = update.items.reduce((s: number, i: any) => s + i.quantity * i.unitPrice, 0);
    const p = await Proposal.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!p) { res.status(404).json({ error: "Not found" }); return; }
    res.json({ id: p._id.toString(), status: p.status, total: p.total });
  } catch (err) {
    logger.error({ err }, "Update proposal error");
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/proposals/:id", async (req: Request, res: Response) => {
  try {
    await Proposal.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Delete proposal error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/proposals/:id/send", async (req: Request, res: Response) => {
  try {
    const p = await Proposal.findById(req.params.id).populate<{ clientId: { name: string; email: string } }>("clientId", "name email");
    if (!p) { res.status(404).json({ error: "Not found" }); return; }

    const itemsHtml = p.items.map((it, i) =>
      `<tr style="background:${i % 2 === 0 ? "#F5F3EE" : "#FFFFFF"}">
        <td style="padding:10px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif">${it.description}</td>
        <td style="padding:10px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;text-align:center">${it.quantity}</td>
        <td style="padding:10px 16px;font-size:14px;color:#0F0F10;font-family:Arial,sans-serif;text-align:right">${it.unitPrice.toLocaleString("ar-SA")} ر.س</td>
        <td style="padding:10px 16px;font-size:14px;font-weight:700;color:#0F0F10;font-family:Arial,sans-serif;text-align:right">${(it.quantity * it.unitPrice).toLocaleString("ar-SA")} ر.س</td>
      </tr>`
    ).join("");

    const bodyHtml = `
      <p style="margin:0 0 20px;color:#3a3733;font-size:15px;font-family:Arial,sans-serif;direction:rtl;text-align:right">
        مرحباً <strong>${(p.clientId as any).name}</strong>،<br/>
        يسعدنا إرسال عرض السعر التالي إليكم.
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        style="border:1px solid rgba(0,0,0,0.07);border-radius:14px;overflow:hidden;margin-bottom:24px;direction:rtl">
        <thead>
          <tr style="background:#0F0F10">
            <th style="padding:10px 16px;color:#FAF8F4;font-size:11px;font-family:Arial,sans-serif;text-align:right;font-weight:600;letter-spacing:0.05em">الوصف</th>
            <th style="padding:10px 16px;color:#FAF8F4;font-size:11px;font-family:Arial,sans-serif;text-align:center;font-weight:600">الكمية</th>
            <th style="padding:10px 16px;color:#FAF8F4;font-size:11px;font-family:Arial,sans-serif;text-align:right;font-weight:600">سعر الوحدة</th>
            <th style="padding:10px 16px;color:#FAF8F4;font-size:11px;font-family:Arial,sans-serif;text-align:right;font-weight:600">الإجمالي</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr style="background:linear-gradient(135deg,#0F0F10,#1a1060)">
            <td colspan="3" style="padding:14px 16px;color:#C7AC70;font-size:13px;font-weight:700;font-family:Arial,sans-serif;text-align:right;direction:rtl">الإجمالي الكلي</td>
            <td style="padding:14px 16px;color:#C7AC70;font-size:16px;font-weight:900;font-family:Arial,sans-serif;text-align:right">${p.total.toLocaleString("ar-SA")} ر.س</td>
          </tr>
        </tfoot>
      </table>
      <p style="margin:0 0 6px;color:#8a8580;font-size:12px;font-family:Arial,sans-serif;direction:rtl;text-align:right">
        صالح حتى: <strong style="color:#0F0F10">${new Date(p.validUntil).toLocaleDateString("ar-SA")}</strong>
      </p>
      ${p.notes ? `<p style="margin:16px 0 0;color:#3a3733;font-size:13px;font-family:Arial,sans-serif;line-height:1.7;direction:rtl;text-align:right;border-top:1px solid rgba(0,0,0,0.06);padding-top:14px">${p.notes}</p>` : ""}
    `;

    const html = renderBrandedEmail({ dir: "rtl", lang: "ar", title: `عرض سعر: ${p.title}`, preheader: `إجمالي العرض: ${p.total.toLocaleString("ar-SA")} ر.س`, bodyHtml });
    await sendEmail({ to: (p.clientId as any).email, subject: `عرض سعر ${p.number} — ${p.title}`, html, text: `عرض سعر ${p.number}: ${p.title} — الإجمالي: ${p.total.toLocaleString("ar-SA")} ر.س` });
    await Proposal.findByIdAndUpdate(p._id, { status: "sent", sentAt: new Date() });
    res.json({ ok: true });
  } catch (err) {
    logger.error({ err }, "Send proposal error");
    res.status(500).json({ error: "Server error" });
  }
});

// POST /admin/send-email — send email to one or more recipients
router.post("/send-email", async (req: Request, res: Response) => {
  try {
    const { to, subject, body } = req.body as {
      to: { email: string; name: string }[];
      subject: string;
      body: string;
    };

    if (!Array.isArray(to) || to.length === 0) {
      res.status(400).json({ error: "At least one recipient required" });
      return;
    }
    if (!subject?.trim()) {
      res.status(400).json({ error: "Subject is required" });
      return;
    }
    if (!body?.trim()) {
      res.status(400).json({ error: "Body is required" });
      return;
    }

    const safeBody = body.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const html = renderBrandedEmail({
      dir: "auto",
      lang: "ar",
      title: subject,
      bodyHtml: `<div style="color:#3a3733;font-size:15px;line-height:1.8;white-space:pre-wrap;font-family:Arial,sans-serif">${safeBody}</div>`,
    });

    const errors: string[] = [];
    for (const recipient of to) {
      try {
        await sendEmail({ to: recipient.email, subject, html, text: body });
      } catch (err) {
        logger.error({ err, email: recipient.email }, "Failed to send to recipient");
        errors.push(recipient.email);
      }
    }

    if (errors.length === to.length) {
      res.status(500).json({ error: "All emails failed to send" });
      return;
    }

    res.json({
      sent: to.length - errors.length,
      failed: errors.length,
      failedEmails: errors,
    });
  } catch (err) {
    logger.error({ err }, "Send email error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
