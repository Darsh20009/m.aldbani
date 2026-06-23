import { Router, Request, Response } from "express";
import { requireAuth, AuthRequest } from "../middlewares/auth";
import { CommunityPost } from "../models/CommunityPost";
import { logger } from "../lib/logger";
import mongoose from "mongoose";

const router = Router();

const formatPost = (post: any, userId?: string) => {
  const obj = post.toObject ? post.toObject() : post;
  const reactions = (obj.reactions || []).map((r: any) => ({
    emoji: r.emoji,
    count: r.users?.length || 0,
    userReacted: userId ? r.users?.some((u: any) => u.toString() === userId) : false,
  }));
  const comments = (obj.comments || []).map((c: any) => ({
    id: c._id?.toString(),
    authorName: c.authorName,
    content: c.content,
    createdAt: c.createdAt,
  }));
  return {
    id: obj._id?.toString(),
    title: obj.title,
    content: obj.content,
    type: obj.type,
    image: obj.image ?? null,
    reactions,
    comments,
    seenCount: obj.seenBy?.length || 0,
    publishedAt: obj.publishedAt,
  };
};

router.get("/posts", async (req: Request, res: Response) => {
  try {
    const { limit } = req.query;
    let query = CommunityPost.find().sort({ publishedAt: -1 });
    if (limit) query = query.limit(Number(limit));
    const posts = await query;
    res.json(posts.map((p) => formatPost(p)));
  } catch (err) {
    logger.error({ err }, "List community posts error");
    res.json([]);
  }
});

router.post("/posts", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    if (req.user?.role !== "admin") {
      res.status(403).json({ error: "Admin only" });
      return;
    }
    const post = await CommunityPost.create({ ...req.body, reactions: [], comments: [], seenBy: [] });
    res.status(201).json(formatPost(post, req.user?.id));
  } catch (err) {
    logger.error({ err }, "Create community post error");
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/posts/:id", async (req: Request, res: Response) => {
  try {
    const post = await CommunityPost.findById(req.params.id);
    if (!post) { res.status(404).json({ error: "Not found" }); return; }
    res.json(formatPost(post));
  } catch (err) {
    logger.error({ err }, "Get community post error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/posts/:id/reactions", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { emoji } = req.body;
    const userId = new mongoose.Types.ObjectId(req.user!.id);
    const post = await CommunityPost.findById(req.params.id);
    if (!post) { res.status(404).json({ error: "Not found" }); return; }

    const existing = post.reactions.find((r) => r.emoji === emoji);
    if (existing) {
      const idx = existing.users.findIndex((u) => u.toString() === req.user!.id);
      if (idx > -1) {
        existing.users.splice(idx, 1);
      } else {
        existing.users.push(userId);
      }
    } else {
      post.reactions.push({ emoji, users: [userId] });
    }
    await post.save();
    res.json({ message: "Reaction updated" });
  } catch (err) {
    logger.error({ err }, "React to post error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/posts/:id/comments", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    if (!content) { res.status(400).json({ error: "Content required" }); return; }
    const post = await CommunityPost.findById(req.params.id);
    if (!post) { res.status(404).json({ error: "Not found" }); return; }

    const comment = {
      _id: new mongoose.Types.ObjectId(),
      authorId: new mongoose.Types.ObjectId(req.user!.id),
      authorName: req.user!.name,
      content,
      createdAt: new Date(),
    };
    post.comments.push(comment as any);
    await post.save();

    res.status(201).json({
      id: comment._id.toString(),
      authorName: comment.authorName,
      content: comment.content,
      createdAt: comment.createdAt,
    });
  } catch (err) {
    logger.error({ err }, "Comment on post error");
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/posts/:id/seen", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user!.id);
    await CommunityPost.findByIdAndUpdate(req.params.id, {
      $addToSet: { seenBy: userId },
    });
    res.json({ message: "Marked as seen" });
  } catch (err) {
    logger.error({ err }, "Mark seen error");
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
