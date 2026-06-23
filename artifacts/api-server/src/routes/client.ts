import { Router, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { Consultation } from "../models/Consultation";
import { Message } from "../models/Message";
import { SharedFile } from "../models/SharedFile";
import { Invoice } from "../models/Invoice";
import { Notification } from "../models/Notification";
import { logger } from "../lib/logger";

const router = Router();
router.use(requireAuth);

const fmt = (doc: any) => {
  const obj = doc.toObject ? doc.toObject() : doc;
  return { ...obj, id: obj._id?.toString() ?? obj.id, _id: undefined, __v: undefined };
};

router.get("/consultations", async (req: AuthRequest, res: Response) => {
  try {
    const consultations = await Consultation.find({ clientId: req.user!.id }).sort({ createdAt: -1 });
    res.json(consultations.map(fmt));
  } catch (err) {
    logger.error({ err }, "Get my consultations error");
    res.json([]);
  }
});

router.get("/messages", async (req: AuthRequest, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.user!.id }, { receiverId: req.user!.id }],
    }).sort({ createdAt: 1 });
    res.json(messages.map(fmt));
  } catch (err) {
    logger.error({ err }, "Get messages error");
    res.json([]);
  }
});

router.post("/messages", async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) { res.status(400).json({ error: "Content required" }); return; }
    const msg = await Message.create({
      senderId: req.user!.id,
      senderName: req.user!.name,
      content,
      read: false,
    });
    res.status(201).json(fmt(msg));
  } catch (err) {
    logger.error({ err }, "Send message error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/files", async (req: AuthRequest, res: Response) => {
  try {
    const files = await SharedFile.find({ clientId: req.user!.id }).sort({ createdAt: -1 });
    res.json(files.map((f) => ({
      ...fmt(f),
      uploadedAt: f.createdAt,
    })));
  } catch (err) {
    logger.error({ err }, "Get files error");
    res.json([]);
  }
});

router.get("/invoices", async (req: AuthRequest, res: Response) => {
  try {
    const invoices = await Invoice.find({ clientId: req.user!.id }).sort({ createdAt: -1 });
    res.json(invoices.map((inv) => ({
      ...fmt(inv),
      dueDate: inv.dueDate?.toISOString(),
      paidAt: inv.paidAt?.toISOString() ?? null,
    })));
  } catch (err) {
    logger.error({ err }, "Get invoices error");
    res.json([]);
  }
});

router.get("/notifications", async (req: AuthRequest, res: Response) => {
  try {
    const notifications = await Notification.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50);
    res.json(notifications.map(fmt));
  } catch (err) {
    logger.error({ err }, "Get notifications error");
    res.json([]);
  }
});

export default router;
