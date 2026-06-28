import { Router, Request, Response } from "express";
import { Project } from "../models/Project";
import { Service } from "../models/Service";
import { Article } from "../models/Article";
import { Consultation } from "../models/Consultation";
import { Lead } from "../models/Lead";
import { SiteSettings } from "../models/SiteSettings";
import { logger } from "../lib/logger";

const router = Router();

const formatDoc = (doc: any) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString() ?? obj.id, _id: undefined, __v: undefined };
};

// Projects
router.get("/projects", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const projects = await Project.find(filter).sort({ order: 1, createdAt: -1 });
    res.json(projects.map(formatDoc));
  } catch (err) {
    logger.error({ err }, "List projects error");
    res.json([]);
  }
});

router.get("/projects/:id", async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatDoc(project));
  } catch (err) {
    logger.error({ err }, "Get project error");
    res.status(500).json({ error: "Server error" });
  }
});

// Services
router.get("/services", async (_req: Request, res: Response) => {
  try {
    const services = await Service.find().sort({ order: 1 });
    res.json(services.map(formatDoc));
  } catch (err) {
    logger.error({ err }, "List services error");
    res.json([]);
  }
});

// Articles
router.get("/articles", async (req: Request, res: Response) => {
  try {
    const { category, limit } = req.query;
    const filter: any = { published: true };
    if (category) filter.category = category;
    let query = Article.find(filter).sort({ publishedAt: -1, createdAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const articles = await query;
    res.json(articles.map(formatDoc));
  } catch (err) {
    logger.error({ err }, "List articles error");
    res.json([]);
  }
});

router.get("/articles/:slug", async (req: Request, res: Response) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug, published: true });
    if (!article) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatDoc(article));
  } catch (err) {
    logger.error({ err }, "Get article error");
    res.status(500).json({ error: "Server error" });
  }
});

// Contact
router.post("/contact", async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Name, email, and message are required" });
      return;
    }
    // Create a lead from the contact submission
    await Lead.create({ name, email, source: "contact-form", status: "new", notes: message });
    res.json({ message: "Message received. We'll be in touch soon." });
  } catch (err) {
    logger.error({ err }, "Contact error");
    res.status(500).json({ error: "Server error" });
  }
});

// Consultation booking
router.post("/consultations/book", async (req: Request, res: Response) => {
  try {
    const { clientName, clientEmail, clientPhone, type, date, time, duration, notes } = req.body;
    if (!clientName || !clientEmail || !clientPhone || !type || !date || !time || !duration) {
      res.status(400).json({ error: "Missing required booking fields" });
      return;
    }
    const consultation = await Consultation.create({
      clientName, clientEmail, clientPhone, type, date, time,
      duration: Number(duration), notes, status: "pending", paid: false,
    });
    // Also create a lead
    await Lead.findOneAndUpdate(
      { email: clientEmail },
      { $setOnInsert: { name: clientName, email: clientEmail, phone: clientPhone, source: "booking", status: "new" } },
      { upsert: true }
    );
    res.status(201).json(formatDoc(consultation));
  } catch (err) {
    logger.error({ err }, "Book consultation error");
    res.status(500).json({ error: "Server error" });
  }
});

// Available slots (simple implementation)
router.get("/consultations/slots", async (req: Request, res: Response) => {
  try {
    const { date } = req.query as { date: string };
    if (!date) { res.status(400).json({ error: "Date is required" }); return; }
    const booked = await Consultation.find({ date }).select("time");
    const bookedTimes = new Set(booked.map((c) => c.time));
    const allSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
    const available = allSlots.filter((s) => !bookedTimes.has(s));
    res.json(available);
  } catch (err) {
    logger.error({ err }, "Get slots error");
    res.json(["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]);
  }
});

// Public site settings (no auth required)
router.get("/settings", async (_req: Request, res: Response) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    const obj = settings.toObject();
    res.json({ ...obj, _id: undefined, __v: undefined });
  } catch (err) {
    logger.error({ err }, "Get public settings error");
    res.json({});
  }
});

export default router;
