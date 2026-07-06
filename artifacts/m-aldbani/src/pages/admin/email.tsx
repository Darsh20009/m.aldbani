import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useLanguage } from "../../hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { useListClients, useListLeads } from "@workspace/api-client-react";
import { Mail, Send, Users, User, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Recipient = { email: string; name: string };

export default function AdminEmail() {
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: clientsData } = useListClients();
  const { data: leadsData } = useListLeads();

  const [to, setTo] = useState<Recipient[]>([]);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [customEmail, setCustomEmail] = useState("");
  const [customName, setCustomName] = useState("");

  const clients: Recipient[] = (clientsData ?? []).map((c: any) => ({ email: c.email, name: c.name }));
  const leads: Recipient[] = (leadsData ?? []).map((l: any) => ({ email: l.email, name: l.name }));
  const allContacts = [...clients, ...leads].filter(
    (c, i, arr) => arr.findIndex((x) => x.email === c.email) === i
  );

  const addRecipient = (r: Recipient) => {
    if (!to.find((x) => x.email === r.email)) setTo([...to, r]);
    setShowPicker(false);
  };

  const addCustom = () => {
    if (!customEmail.includes("@")) return;
    addRecipient({ email: customEmail.trim(), name: customName.trim() || customEmail.trim() });
    setCustomEmail("");
    setCustomName("");
  };

  const removeRecipient = (email: string) => setTo(to.filter((r) => r.email !== email));

  const handleSend = async () => {
    if (!to.length) { toast({ title: t("No recipients", "لا يوجد مستلمون"), variant: "destructive" }); return; }
    if (!subject.trim()) { toast({ title: t("Subject required", "العنوان مطلوب"), variant: "destructive" }); return; }
    if (!body.trim()) { toast({ title: t("Message required", "الرسالة مطلوبة"), variant: "destructive" }); return; }

    setSending(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ to, subject, body }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed");
      toast({ title: t("Email sent!", "تم الإرسال!"), description: t(`Sent to ${to.length} recipient(s).`, `أُرسل إلى ${to.length} مستلم.`) });
      setTo([]);
      setSubject("");
      setBody("");
    } catch (err: any) {
      toast({ title: t("Send failed", "فشل الإرسال"), description: err.message, variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Mail size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{t("Send Email", "إرسال بريد إلكتروني")}</h1>
            <p className="text-sm text-muted-foreground">{t("Send emails to clients and leads", "أرسل رسائل للعملاء والمهتمين")}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden">
          {/* To */}
          <div className="p-5 border-b border-border/40">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {t("To", "إلى")}
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {to.map((r) => (
                  <motion.span
                    key={r.email}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20"
                  >
                    <User size={12} />
                    {r.name}
                    <button onClick={() => removeRecipient(r.email)} className="hover:text-destructive transition-colors ml-1">
                      <X size={12} />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowPicker(!showPicker)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-dashed border-border hover:border-primary hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all"
              >
                <Users size={15} />
                {t("Add recipient", "إضافة مستلم")}
                <ChevronDown size={14} className={`transition-transform ${showPicker ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 top-full mt-2 z-20 w-80 bg-white border border-border rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Custom email */}
                    <div className="p-3 border-b border-border/50 space-y-2">
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{t("Custom email", "بريد مخصص")}</p>
                      <input
                        type="text"
                        placeholder={t("Name (optional)", "الاسم (اختياري)")}
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <input
                          type="email"
                          placeholder={t("email@example.com", "email@example.com")}
                          value={customEmail}
                          onChange={(e) => setCustomEmail(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addCustom()}
                          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg outline-none focus:border-primary"
                        />
                        <button
                          onClick={addCustom}
                          className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          {t("Add", "إضافة")}
                        </button>
                      </div>
                    </div>

                    {/* Contacts list */}
                    <div className="max-h-52 overflow-y-auto">
                      {allContacts.length === 0 ? (
                        <p className="text-center text-sm text-muted-foreground py-4">{t("No contacts found", "لا يوجد جهات اتصال")}</p>
                      ) : (
                        allContacts.map((c) => (
                          <button
                            key={c.email}
                            onClick={() => addRecipient(c)}
                            disabled={!!to.find((x) => x.email === c.email)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                              {c.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold truncate">{c.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Subject */}
          <div className="p-5 border-b border-border/40">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {t("Subject", "الموضوع")}
            </label>
            <input
              type="text"
              placeholder={t("Email subject…", "موضوع الرسالة…")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Body */}
          <div className="p-5 border-b border-border/40">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block">
              {t("Message", "نص الرسالة")}
            </label>
            <textarea
              placeholder={t("Write your message here…", "اكتب رسالتك هنا…")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 text-sm border border-border rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="p-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {to.length > 0
                ? t(`${to.length} recipient(s) selected`, `${to.length} مستلم محدد`)
                : t("No recipients selected", "لم يتم تحديد مستلمين")}
            </p>
            <motion.button
              onClick={handleSend}
              disabled={sending || !to.length || !subject.trim() || !body.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ background: "linear-gradient(135deg, #2563EB, #7C3AED)", boxShadow: "0 4px 16px rgba(37,99,235,0.3)" }}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("Sending…", "جاري الإرسال…")}
                </>
              ) : (
                <>
                  <Send size={15} />
                  {t("Send Email", "إرسال")}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
