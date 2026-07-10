import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Loader2, MessageCircle } from "lucide-react";
import { LogoBrandImage } from "../Logo";

interface ChatMsg { role: "user" | "assistant"; content: string }

const SUGGESTIONS = [
  "ما هي خدمات محمد الدباني؟",
  "كيف أحجز استشارة؟",
  "ما هو تخصص محمد؟",
  "كم تكلف الخدمات؟",
];

function Bubble({ msg }: { msg: ChatMsg }) {
  if (msg.role === "user") {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm text-white leading-relaxed"
          style={{ background: "linear-gradient(135deg, #0F1E56, #2563EB)", boxShadow: "0 2px 10px rgba(37,99,235,0.2)" }}>
          {msg.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex justify-end mb-3">
      <div className="max-w-[88%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
        style={{ background: "#F5F4F1", color: "#0F172A", border: "1px solid rgba(0,0,0,0.06)" }}>
        {msg.content}
      </div>
    </div>
  );
}

export function ClientAIChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState("");
  const [unread, setUnread] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(false);
      setTimeout(() => inputRef.current?.focus(), 350);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, currentResponse]);

  const streamChat = useCallback(async (userMessage: string) => {
    const newMessages: ChatMsg[] = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsStreaming(true);
    setCurrentResponse("");

    let assistantText = "";

    try {
      const response = await fetch("/api/ai/client-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) throw new Error("connection error");

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
            if (data.type === "delta") {
              assistantText += data.content;
              setCurrentResponse(assistantText);
            } else if (data.type === "done") {
              setMessages(p => [...p, { role: "assistant", content: assistantText }]);
              setCurrentResponse("");
              setIsStreaming(false);
              if (!open) setUnread(true);
            } else if (data.type === "error") {
              setMessages(p => [...p, { role: "assistant", content: data.content ?? "عذراً، حدث خطأ. حاول مجدداً." }]);
              setIsStreaming(false);
            }
          } catch { /* skip */ }
        }
      }
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "عذراً، لا أستطيع الرد الآن. حاول مجدداً لاحقاً." }]);
      setIsStreaming(false);
    }
  }, [messages, open]);

  const handleSend = () => {
    const val = inputVal.trim();
    if (!val || isStreaming) return;
    setInputVal("");
    streamChat(val);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" dir="rtl">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="flex flex-col overflow-hidden"
            style={{
              width: "clamp(300px, 90vw, 370px)",
              height: "clamp(400px, 60vh, 520px)",
              background: "#FFFFFF",
              borderRadius: 20,
              boxShadow: "0 20px 70px rgba(15,30,86,0.18), 0 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(37,99,235,0.1)",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3.5 shrink-0"
              style={{ background: "linear-gradient(135deg, #08102E 0%, #0F1E56 100%)", borderRadius: "20px 20px 0 0" }}>
              <LogoBrandImage size={30} style={{ filter: "drop-shadow(0 2px 8px rgba(37,99,235,0.5))" }} />
              <div className="flex-1">
                <p className="font-black text-white text-sm leading-none">مساعد الدباني</p>
                <p className="text-[10px] text-blue-300 mt-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  متاح الآن — تحدث معي بالعربي
                </p>
              </div>
              <button onClick={() => setOpen(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ overscrollBehavior: "contain" }}>
              {messages.length === 0 && !isStreaming && (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
                    style={{ background: "linear-gradient(135deg, #08102E, #0F1E56)", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}>
                    <Sparkles size={18} className="text-blue-300" />
                  </div>
                  <p className="font-bold text-slate-700 text-sm mb-1">أهلاً وسهلاً!</p>
                  <p className="text-xs text-slate-400 mb-4 max-w-[240px] leading-relaxed">
                    أنا مساعدك الذكي. تفضّل بالسؤال عن أي شيء يخص خدمات محمد الدباني.
                  </p>
                  <div className="w-full space-y-2">
                    {SUGGESTIONS.map((s, i) => (
                      <button key={i} onClick={() => { if (!isStreaming) streamChat(s); }}
                        className="w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-[1.01]"
                        style={{ background: "rgba(37,99,235,0.05)", color: "#1E3A8A", border: "1px solid rgba(37,99,235,0.1)" }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => <Bubble key={i} msg={msg} />)}

              {/* Streaming */}
              {currentResponse && (
                <div className="flex justify-end mb-3">
                  <div className="max-w-[88%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
                    style={{ background: "#F5F4F1", color: "#0F172A", border: "1px solid rgba(0,0,0,0.06)" }}>
                    {currentResponse}
                    <span className="inline-block w-0.5 h-4 bg-blue-500 align-middle mr-0.5 animate-pulse" />
                  </div>
                </div>
              )}

              {isStreaming && !currentResponse && (
                <div className="flex justify-end mb-3">
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm flex items-center gap-1.5"
                    style={{ background: "#F5F4F1" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 shrink-0 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="اكتب سؤالك هنا…"
                  disabled={isStreaming}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{
                    background: "#F8F7F4",
                    border: "1px solid rgba(0,0,0,0.08)",
                    color: "#0F172A",
                    direction: "rtl",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputVal.trim() || isStreaming}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-40"
                  style={{ background: "linear-gradient(135deg, #0F1E56, #2563EB)", boxShadow: "0 2px 8px rgba(37,99,235,0.3)" }}
                >
                  {isStreaming ? <Loader2 size={14} className="text-white animate-spin" /> : <Send size={14} className="text-white" />}
                </button>
              </div>
              <p className="text-center text-[9px] text-slate-400 mt-2">مدعوم بالذكاء الاصطناعي · منصة محمد الدباني</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.93 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #0F1E56, #2563EB, #7C3AED)",
          boxShadow: "0 8px 28px rgba(37,99,235,0.4), 0 0 0 4px rgba(37,99,235,0.1)",
        }}
        aria-label="فتح المساعد الذكي"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="x" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.2 }}>
              <X size={20} className="text-white" />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={20} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {/* Pulse */}
        {!open && <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-blue-500" />}
        {/* Unread dot */}
        {unread && !open && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-white" />
        )}
      </motion.button>
    </div>
  );
}
