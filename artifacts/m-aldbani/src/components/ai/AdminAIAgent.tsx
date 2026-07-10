import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, ChevronDown, Bot, CheckCircle2, Zap } from "lucide-react";

interface ChatMsg { role: "user" | "assistant"; content: string }
interface ToolStep { name: string; status: "running" | "done"; result?: unknown }

const TOOL_LABELS: Record<string, string> = {
  get_dashboard_stats:       "استعراض الإحصائيات الشاملة",
  get_leads:                 "جلب العملاء المحتملين",
  get_clients:               "جلب قائمة العملاء",
  get_consultations:         "استعراض الاستشارات",
  create_lead:               "إنشاء عميل محتمل جديد",
  update_lead_status:        "تحديث حالة العميل",
  get_messages:              "جلب الرسائل الواردة",
  get_recent_activity:       "تحليل النشاط الأخير",
  update_consultation_status:"تحديث حالة الاستشارة",
};

const SUGGESTIONS = [
  "اعطني إحصائيات اليوم",
  "عرض العملاء المحتملين الجدد",
  "الاستشارات المعلقة",
  "آخر رسائل العملاء",
  "نشاط الأسبوع الماضي",
  "أنشئ عميل محتمل جديد اسمه أحمد",
];

function ToolBadge({ step }: { step: ToolStep }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs my-1"
      style={{ background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)" }}>
      {step.status === "running" ? (
        <Loader2 size={11} className="animate-spin text-blue-500 flex-shrink-0" />
      ) : (
        <CheckCircle2 size={11} className="text-emerald-500 flex-shrink-0" />
      )}
      <span style={{ color: step.status === "done" ? "#059669" : "#2563EB" }}>
        {TOOL_LABELS[step.name] ?? step.name}
      </span>
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMsg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-end mb-3">
        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white leading-relaxed"
          style={{ background: "linear-gradient(135deg, #0F1E56, #2563EB)", boxShadow: "0 2px 12px rgba(37,99,235,0.25)" }}>
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-start mb-3">
      <div className="flex items-start gap-2 max-w-[90%]">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "linear-gradient(135deg, #0F1E56, #7C3AED)" }}>
          <Sparkles size={11} className="text-white" />
        </div>
        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
          style={{ background: "#F0F4FF", color: "#0F172A", border: "1px solid rgba(37,99,235,0.1)" }}>
          {msg.content}
        </div>
      </div>
    </div>
  );
}

export function AdminAIAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [toolSteps, setToolSteps] = useState<ToolStep[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse, toolSteps]);

  const streamChat = useCallback(async (userMessage: string) => {
    const newMessages: ChatMsg[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsStreaming(true);
    setCurrentResponse("");
    setToolSteps([]);

    let assistantText = "";

    try {
      const response = await fetch("/api/ai/admin-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("فشل الاتصال بالمساعد");

      const reader = response.body!.getReader();
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
          try {
            const data = JSON.parse(t.slice(5).trim());
            if (data.type === "tool_start") {
              setToolSteps(p => [...p, { name: data.name, status: "running" }]);
            } else if (data.type === "tool_done") {
              setToolSteps(p => p.map(s => s.name === data.name ? { ...s, status: "done", result: data.result } : s));
            } else if (data.type === "delta") {
              assistantText += data.content;
              setCurrentResponse(assistantText);
            } else if (data.type === "done") {
              if (assistantText) {
                setMessages(p => [...p, { role: "assistant", content: assistantText }]);
              }
              setCurrentResponse("");
              setIsStreaming(false);
            } else if (data.type === "error") {
              setMessages(p => [...p, { role: "assistant", content: data.content ?? "عذراً، حدث خطأ مؤقت." }]);
              setIsStreaming(false);
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "عذراً، لا يمكن الوصول للمساعد حالياً. تأكد من ضبط مفتاح MOONSHOT_API_KEY." }]);
      setIsStreaming(false);
    }
  }, [messages]);

  const handleSend = () => {
    const val = inputVal.trim();
    if (!val || isStreaming) return;
    setInputVal("");
    streamChat(val);
  };

  const handleSuggestion = (s: string) => {
    if (isStreaming) return;
    streamChat(s);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
        style={{
          background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
          boxShadow: "0 8px 32px rgba(37,99,235,0.45), 0 0 0 4px rgba(37,99,235,0.12)",
        }}
        aria-label="مساعد الذكاء الاصطناعي"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={22} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot size={22} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20"
            style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)" }} />
        )}
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed bottom-24 left-6 z-50 flex flex-col overflow-hidden"
            style={{
              width: "clamp(320px, 90vw, 440px)",
              height: "clamp(420px, 70vh, 600px)",
              background: "#FFFFFF",
              borderRadius: 20,
              boxShadow: "0 24px 80px rgba(15,30,86,0.22), 0 4px 16px rgba(37,99,235,0.12)",
              border: "1px solid rgba(37,99,235,0.12)",
            }}
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ background: "linear-gradient(135deg, #08102E 0%, #0F1E56 100%)", borderRadius: "20px 20px 0 0" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(37,99,235,0.3)" }}>
                <Sparkles size={17} className="text-blue-200" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-sm leading-none">دباني AI</p>
                <p className="text-[10px] text-blue-300 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  مساعدك الذكي — صلاحيات كاملة
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-0.5" style={{ overscrollBehavior: "contain" }}>
              {messages.length === 0 && !isStreaming && (
                <div className="h-full flex flex-col items-center justify-center text-center py-6">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: "linear-gradient(135deg, #08102E, #0F1E56)", boxShadow: "0 4px 20px rgba(37,99,235,0.3)" }}>
                    <Zap size={22} className="text-blue-300" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm mb-1">مرحباً محمد</p>
                  <p className="text-xs text-slate-400 mb-5 max-w-[260px] leading-relaxed">
                    أنا دباني AI — صلاحياتي كاملة على النظام. ما الذي تريد تنفيذه؟
                  </p>
                  <div className="w-full space-y-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => handleSuggestion(s)}
                        className="w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.01]"
                        style={{ background: "rgba(37,99,235,0.06)", color: "#1E3A8A", border: "1px solid rgba(37,99,235,0.12)" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}

              {/* Tool steps */}
              {toolSteps.length > 0 && (
                <div className="mb-2">
                  {toolSteps.map((step, i) => <ToolBadge key={i} step={step} />)}
                </div>
              )}

              {/* Streaming response */}
              {currentResponse && (
                <div className="flex justify-start mb-3">
                  <div className="flex items-start gap-2 max-w-[90%]">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: "linear-gradient(135deg, #0F1E56, #7C3AED)" }}>
                      <Sparkles size={11} className="text-white" />
                    </div>
                    <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                      style={{ background: "#F0F4FF", color: "#0F172A", border: "1px solid rgba(37,99,235,0.1)" }}>
                      {currentResponse}
                      <span className="inline-block w-0.5 h-4 bg-blue-500 align-middle ml-0.5 animate-pulse" />
                    </div>
                  </div>
                </div>
              )}

              {isStreaming && !currentResponse && toolSteps.every(t => t.status === "done") && (
                <div className="flex items-center gap-2 px-3 py-1.5">
                  <Loader2 size={13} className="animate-spin text-blue-500" />
                  <span className="text-xs text-slate-400">يُعالج الطلب…</span>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 shrink-0 border-t" style={{ borderColor: "rgba(37,99,235,0.08)" }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="اكتب أمراً أو سؤالاً…"
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#F8FAFF",
                    border: "1px solid rgba(37,99,235,0.12)",
                    color: "#0F172A",
                    direction: "rtl",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputVal.trim() || isStreaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background: "linear-gradient(135deg, #0F1E56, #2563EB)",
                    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                  }}
                >
                  {isStreaming ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
