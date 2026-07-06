import { Router, Request, Response } from "express";
import { requireAdmin, AuthRequest } from "../middlewares/auth";
import { User } from "../models/User";
import { Project } from "../models/Project";
import { Service } from "../models/Service";
import { Article } from "../models/Article";
import { Consultation } from "../models/Consultation";
import { Lead } from "../models/Lead";
import { SiteSettings } from "../models/SiteSettings";
import { logger } from "../lib/logger";
import { sendEmail } from "../lib/email";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
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

    const html = `
<!DOCTYPE html>
<html dir="auto" lang="ar">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:Inter,Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)">
        <tr><td style="background:linear-gradient(135deg,#2563EB,#7C3AED);padding:28px 36px">
          <p style="margin:0;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;opacity:0.75">M-ALDBANI Platform</p>
          <h1 style="margin:8px 0 0;color:#fff;font-size:22px;font-weight:800">${subject}</h1>
        </td></tr>
        <tr><td style="padding:32px 36px">
          <div style="color:#374151;font-size:15px;line-height:1.8;white-space:pre-wrap">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        </td></tr>
        <tr><td style="background:#f9fafb;padding:20px 36px;border-top:1px solid #e5e7eb;text-align:center">
          <p style="margin:0;color:#9ca3af;font-size:11px">© ${new Date().getFullYear()} M-ALDBANI · Mohammed Al-Dabbani</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

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
