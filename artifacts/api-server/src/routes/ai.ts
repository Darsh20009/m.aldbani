import { Router, Request, Response } from "express";
import { requireAdmin, AuthRequest } from "../middlewares/auth";
import { moonshotChat, moonshotChatJSON, ChatMessage, ToolDefinition } from "../lib/moonshot";
import { Lead } from "../models/Lead";
import { User } from "../models/User";
import { Consultation } from "../models/Consultation";
import { Message } from "../models/Message";
import { Project } from "../models/Project";
import { Article } from "../models/Article";
import { Service } from "../models/Service";
import { logger } from "../lib/logger";

const router = Router();

/* ── Admin AI Tools ─────────────────────────────── */
const ADMIN_TOOLS: ToolDefinition[] = [
  {
    type: "function",
    function: {
      name: "get_dashboard_stats",
      description: "احصل على إحصائيات شاملة للوحة التحكم: العملاء المحتملون، العملاء، الاستشارات، المشاريع، المقالات، الخدمات",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "get_leads",
      description: "احصل على قائمة العملاء المحتملين مع إمكانية التصفية حسب الحالة",
      parameters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["new", "in-contact", "client", "rejected"],
            description: "تصفية حسب حالة العميل (اختياري)",
          },
          limit: { type: "number", description: "عدد النتائج الأقصى، افتراضي 10" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_clients",
      description: "احصل على قائمة العملاء المسجّلين في المنصة",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number", description: "عدد النتائج، افتراضي 10" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_consultations",
      description: "احصل على قائمة الاستشارات مع إمكانية التصفية حسب الحالة",
      parameters: {
        type: "object",
        properties: {
          status: { type: "string", enum: ["pending", "confirmed", "completed", "cancelled"] },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "create_lead",
      description: "أنشئ عميلاً محتملاً جديداً في النظام",
      parameters: {
        type: "object",
        required: ["name", "email"],
        properties: {
          name:   { type: "string" },
          email:  { type: "string" },
          phone:  { type: "string" },
          source: { type: "string" },
          notes:  { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_lead_status",
      description: "حدّث حالة عميل محتمل",
      parameters: {
        type: "object",
        required: ["id", "status"],
        properties: {
          id:     { type: "string" },
          status: { type: "string", enum: ["new", "in-contact", "client", "rejected"] },
          notes:  { type: "string" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_messages",
      description: "احصل على آخر رسائل العملاء في المنصة",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_recent_activity",
      description: "احصل على ملخص النشاط الأخير خلال عدد محدد من الأيام",
      parameters: {
        type: "object",
        properties: {
          days: { type: "number", description: "عدد الأيام للرجوع إليها، افتراضي 7" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "update_consultation_status",
      description: "حدّث حالة استشارة موجودة وأضف ملاحظات الأدمن",
      parameters: {
        type: "object",
        required: ["id", "status"],
        properties: {
          id:         { type: "string" },
          status:     { type: "string", enum: ["pending", "confirmed", "completed", "cancelled"] },
          adminNotes: { type: "string" },
          meetingLink:{ type: "string" },
        },
      },
    },
  },
];

async function executeAdminTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_dashboard_stats": {
      const [leadsCount, clientsCount, consultationsCount, projectsCount, articlesCount, servicesCount,
        pendingConsultations, newLeads] = await Promise.all([
        Lead.countDocuments(),
        User.countDocuments({ role: "client" }),
        Consultation.countDocuments(),
        Project.countDocuments(),
        Article.countDocuments(),
        Service.countDocuments(),
        Consultation.countDocuments({ status: "pending" }),
        Lead.countDocuments({ status: "new" }),
      ]);
      return {
        عملاء_محتملون: leadsCount,
        عملاء_جدد_بانتظار: newLeads,
        عملاء_مسجلون: clientsCount,
        استشارات_إجمالي: consultationsCount,
        استشارات_معلقة: pendingConsultations,
        مشاريع: projectsCount,
        مقالات: articlesCount,
        خدمات: servicesCount,
      };
    }
    case "get_leads": {
      const q: Record<string, unknown> = {};
      if (args.status) q.status = args.status;
      return Lead.find(q).limit(Number(args.limit) || 10).sort({ createdAt: -1 }).lean();
    }
    case "get_clients": {
      return User.find({ role: "client" })
        .limit(Number(args.limit) || 10)
        .sort({ createdAt: -1 })
        .select("-password")
        .lean();
    }
    case "get_consultations": {
      const q: Record<string, unknown> = {};
      if (args.status) q.status = args.status;
      return Consultation.find(q).limit(Number(args.limit) || 10).sort({ createdAt: -1 }).lean();
    }
    case "create_lead": {
      const lead = await Lead.create({
        name:   args.name,
        email:  args.email,
        phone:  args.phone || "",
        source: (args.source as string) || "admin-ai",
        notes:  args.notes || "",
        status: "new",
      });
      return lead.toObject();
    }
    case "update_lead_status": {
      const update: Record<string, unknown> = { status: args.status };
      if (args.notes) update.notes = args.notes;
      return Lead.findByIdAndUpdate(args.id, update, { new: true }).lean();
    }
    case "get_messages": {
      return Message.find().limit(Number(args.limit) || 10).sort({ createdAt: -1 }).lean();
    }
    case "get_recent_activity": {
      const days = Number(args.days) || 7;
      const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      const [newLeads, newClients, newConsultations] = await Promise.all([
        Lead.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).lean(),
        User.find({ role: "client", createdAt: { $gte: since } }).select("-password").sort({ createdAt: -1 }).lean(),
        Consultation.find({ createdAt: { $gte: since } }).sort({ createdAt: -1 }).lean(),
      ]);
      return { فترة: `${days} أيام`, عملاء_محتملون_جدد: newLeads, عملاء_جدد: newClients, استشارات_جديدة: newConsultations };
    }
    case "update_consultation_status": {
      const update: Record<string, unknown> = { status: args.status };
      if (args.adminNotes) update.adminNotes = args.adminNotes;
      if (args.meetingLink) update.meetingLink = args.meetingLink;
      return Consultation.findByIdAndUpdate(args.id, update, { new: true }).lean();
    }
    default:
      return { خطأ: "أداة غير معروفة" };
  }
}

/* ── System Prompts ─────────────────────────────── */
const ADMIN_SYSTEM = (): string =>
  `أنت "دباني AI"، المساعد الذكي الشخصي لمحمد الدباني على منصته الرقمية.
صلاحياتك كاملة على قاعدة البيانات — تستطيع الاستعلام والإنشاء والتحديث والتحليل.
تحدث بالعربية الخليجية الراقية فقط. لا تستخدم أي كلمة إنجليزية أو أجنبية إطلاقاً.
شخصيتك: ذكي، حاسم، احترافي، دقيق في الأرقام، يقدّر وقت محمد.
إذا طُلب منك تنفيذ مهمة، نفّذها فوراً ثم اشرح النتيجة بإيجاز.
إذا كانت البيانات أرقاماً، قدّمها بشكل منظّم وقابل للقراءة.
لا تذكر أسماء أدوات برمجية أو تقنيات، تحدث بلغة بشرية طبيعية.
التاريخ اليوم: ${new Date().toLocaleDateString("ar-SA", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

const CLIENT_SYSTEM = `أنت "مساعد الدباني"، المساعد الذكي الودود لمنصة محمد الدباني — خبير العلامات التجارية في قطاع الأغذية والمشروبات الخليجي.
تحدث بالعربية الخليجية الدافئة والراقية فقط. لا تستخدم أي كلمة إنجليزية أو أجنبية إطلاقاً.
مهمتك: الترحيب بالزوار والعملاء والإجابة على أسئلتهم بعفوية وثقة.
خدمات محمد الدباني:
• استراتيجية العلامة التجارية الشاملة
• تصميم الهوية البصرية الكاملة
• تحسين تجربة العملاء في المطاعم والمقاهي
• استشارات التخطيط والافتتاح لمشاريع الأغذية والمشروبات
• تحليل المنافسين والسوق
• التسويق الرقمي وإنشاء المحتوى
للحجز: وجّه العميل لصفحة الحجز في الموقع أو التواصل المباشر.
الاستشارة الأولى مجانية. الأسعار حسب طبيعة كل مشروع.
كن دافئاً، واثقاً، ومفيداً — أنت واجهة محمد الدباني نحو عملائه.`;

/* ── Client Chat: POST /api/ai/client-chat ───────── */
router.post("/client-chat", async (req: Request, res: Response) => {
  try {
    const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
    if (!messages?.length) { res.status(400).json({ error: "الرسائل مطلوبة" }); return; }

    const history: ChatMessage[] = [
      { role: "system", content: CLIENT_SYSTEM },
      ...messages.map(m => ({ role: m.role as ChatMessage["role"], content: m.content })),
    ];

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const streamRes = await moonshotChat(history, undefined, true);
    const reader = streamRes.body!.getReader();
    const decoder = new TextDecoder("utf-8");
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        const t = line.trim();
        if (!t.startsWith("data:")) continue;
        const p = t.slice(5).trim();
        if (p === "[DONE]") { res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`); break; }
        try {
          const chunk = JSON.parse(p);
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) res.write(`data: ${JSON.stringify({ type: "delta", content: delta })}\n\n`);
        } catch { /* skip */ }
      }
    }
    res.end();
  } catch (err) {
    logger.error({ err }, "client-chat error");
    try {
      res.write(`data: ${JSON.stringify({ type: "error", content: "عذراً، حدث خطأ مؤقت. حاول مجدداً." })}\n\n`);
      res.end();
    } catch { /* ignore */ }
  }
});

/* ── Admin Agent: POST /api/ai/admin-chat ─────────── */
router.post("/admin-chat", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { messages } = req.body as { messages: Array<{ role: string; content: string }> };
    if (!messages?.length) { res.status(400).json({ error: "الرسائل مطلوبة" }); return; }

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const history: ChatMessage[] = [
      { role: "system", content: ADMIN_SYSTEM() },
      ...messages.map(m => ({ role: m.role as ChatMessage["role"], content: m.content })),
    ];

    let iterHistory = [...history];
    let maxIter = 6;

    while (maxIter-- > 0) {
      const result = await moonshotChatJSON(iterHistory, ADMIN_TOOLS);
      const choice = result.choices[0];
      const msg = choice.message;

      if (!msg.tool_calls?.length) {
        // Stream the final text response word-by-word for effect
        if (msg.content) {
          const chunks = msg.content.match(/.{1,4}/g) ?? [];
          for (const ch of chunks) {
            res.write(`data: ${JSON.stringify({ type: "delta", content: ch })}\n\n`);
            await new Promise(r => setTimeout(r, 15));
          }
        }
        break;
      }

      // Push assistant message with tool_calls
      iterHistory.push({
        role: "assistant",
        content: msg.content ?? "",
      });

      for (const tc of msg.tool_calls) {
        const toolName = tc.function.name;
        let toolArgs: Record<string, unknown> = {};
        try { toolArgs = JSON.parse(tc.function.arguments); } catch { /* ignore */ }

        res.write(`data: ${JSON.stringify({ type: "tool_start", name: toolName })}\n\n`);

        let toolResult: unknown;
        try {
          toolResult = await executeAdminTool(toolName, toolArgs);
        } catch (e) {
          toolResult = { خطأ: String(e) };
        }

        res.write(`data: ${JSON.stringify({ type: "tool_done", name: toolName, result: toolResult })}\n\n`);

        iterHistory.push({
          role: "tool",
          tool_call_id: tc.id,
          name: toolName,
          content: JSON.stringify(toolResult),
        });
      }
    }

    res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
    res.end();
  } catch (err) {
    logger.error({ err }, "admin-chat error");
    try {
      res.write(`data: ${JSON.stringify({ type: "error", content: "عذراً، حدث خطأ مؤقت." })}\n\n`);
      res.end();
    } catch { /* ignore */ }
  }
});

export default router;
