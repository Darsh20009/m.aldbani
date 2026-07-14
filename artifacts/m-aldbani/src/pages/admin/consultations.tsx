import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListAllConsultations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Search, Clock, Phone, Mail, User, Link2,
  CheckCircle2, XCircle, AlertCircle, RotateCcw, ExternalLink,
  Copy, Check, Calendar, DollarSign, FileText, ChevronDown
} from "lucide-react";

const STATUS_CONFIG: Record<string, { label: string; labelAr: string; icon: any; bg: string; text: string; border: string }> = {
  pending:   { label: "Pending",   labelAr: "قيد الانتظار", icon: AlertCircle,   bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
  confirmed: { label: "Confirmed", labelAr: "مؤكد",         icon: CheckCircle2,  bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  completed: { label: "Completed", labelAr: "مكتمل",        icon: CheckCircle2,  bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  cancelled: { label: "Cancelled", labelAr: "ملغى",         icon: XCircle,       bg: "bg-red-50",     text: "text-red-700",     border: "border-red-200" },
};

const TYPE_LABELS: Record<string, string> = {
  tech: "استشارة تقنية", systems: "أنظمة إدارية", ai: "ذكاء اصطناعي",
  analysis: "تحليل أعمال", pm: "إدارة مشاريع", general: "عامة",
};

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

function buildGoogleCalUrl(c: any) {
  const [y, m, d] = c.date.split("-");
  const [h, min] = c.time.split(":");
  const start = `${y}${m}${d}T${h}${min}00`;
  const endH = String(parseInt(h) + Math.floor((c.duration || 60) / 60)).padStart(2, "0");
  const endM = String((parseInt(min) + (c.duration || 60) % 60) % 60).padStart(2, "0");
  const end = `${y}${m}${d}T${endH}${endM}00`;
  const title = encodeURIComponent(`استشارة مع محمد الدباني — ${c.clientName}`);
  const details = encodeURIComponent(`نوع الاستشارة: ${TYPE_LABELS[c.type] ?? c.type}\nالعميل: ${c.clientName}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=Online`;
}

function initials(name: string) {
  return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("ar-SA", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
  } catch { return dateStr; }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function AdminConsultations() {
  const { data: rawData, isLoading } = useListAllConsultations();
  const consultations: any[] = Array.isArray(rawData) ? rawData : [];
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState(false);
  const [meetingLink, setMeetingLink] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [price, setPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const openEdit = (c: any) => {
    setEditing(c); setStatus(c.status); setPaid(!!c.paid);
    setMeetingLink(c.meetingLink || ""); setAdminNotes(c.adminNotes || "");
    setPrice(c.price ? String(c.price) : ""); setOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/consultations/${editing.id}`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify({ status, paid, meetingLink, adminNotes, price: price ? Number(price) : undefined }),
      });
      await qc.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const quickStatus = async (id: string, s: string) => {
    await fetch(`/api/admin/consultations/${id}`, {
      method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status: s }),
    });
    await qc.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
  };

  const quickPaid = async (id: string, p: boolean) => {
    await fetch(`/api/admin/consultations/${id}`, {
      method: "PATCH", headers: authHeaders(), body: JSON.stringify({ paid: p }),
    });
    await qc.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
  };

  const filtered = consultations.filter(c => {
    const matchStatus = filterStatus === "all" || c.status === filterStatus;
    const q = search.toLowerCase();
    const matchSearch = !q || c.clientName?.toLowerCase().includes(q) || c.clientEmail?.toLowerCase().includes(q) || c.type?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const counts = {
    all: consultations.length,
    pending: consultations.filter(c => c.status === "pending").length,
    confirmed: consultations.filter(c => c.status === "confirmed").length,
    completed: consultations.filter(c => c.status === "completed").length,
    cancelled: consultations.filter(c => c.status === "cancelled").length,
  };

  const tabs = [
    { key: "all", label: "الكل", count: counts.all },
    { key: "pending", label: "انتظار", count: counts.pending },
    { key: "confirmed", label: "مؤكد", count: counts.confirmed },
    { key: "completed", label: "مكتمل", count: counts.completed },
    { key: "cancelled", label: "ملغى", count: counts.cancelled },
  ];

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">الاستشارات</h1>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة المواعيد والحجوزات</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-xl px-4 py-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{counts.all}</span> استشارة إجمالية
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "قيد الانتظار", value: counts.pending, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-50" },
          { label: "مؤكدة", value: counts.confirmed, icon: CheckCircle2, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "مكتملة", value: counts.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
          { label: "ملغاة", value: counts.cancelled, icon: XCircle, color: "text-red-400", bg: "bg-red-50" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-xl border border-border/60 p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-4.5 h-4.5 ${s.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter + Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex gap-1.5 bg-muted/50 rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                filterStatus === tab.key
                  ? "bg-white text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${filterStatus === tab.key ? "bg-primary/10 text-primary" : "bg-muted"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="ابحث بالاسم أو البريد..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="ps-9 h-9 text-sm bg-white border-border rounded-xl"
          />
        </div>
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-border/60 p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/3" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-muted-foreground">
          <CalendarDays className="w-12 h-12 opacity-20" />
          <p className="text-sm">لا توجد استشارات</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((c: any) => {
              const st = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending;
              const StIcon = st.icon;
              const isExpanded = expandedId === c.id;

              return (
                <motion.div
                  key={c.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="bg-white rounded-2xl border border-border/60 shadow-sm overflow-hidden"
                >
                  {/* Main row */}
                  <div className="p-4 md:p-5">
                    <div className="flex gap-3 items-start">
                      {/* Avatar */}
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/20 to-violet-500/20 flex items-center justify-center shrink-0 font-bold text-primary text-sm">
                        {initials(c.clientName || "؟")}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div>
                            <p className="font-bold text-foreground text-sm">{c.clientName}</p>
                            <div className="flex flex-wrap gap-2 mt-0.5">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Mail className="w-3 h-3" />{c.clientEmail}
                              </span>
                              {c.clientPhone && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Phone className="w-3 h-3" />{c.clientPhone}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status badge — clickable */}
                          <div className="relative group">
                            <Badge variant="outline" className={`${st.bg} ${st.text} ${st.border} flex items-center gap-1 cursor-pointer select-none`}>
                              <StIcon className="w-3 h-3" />
                              {st.labelAr}
                              <ChevronDown className="w-3 h-3 opacity-50" />
                            </Badge>
                            <div className="absolute start-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg z-10 py-1 min-w-[120px] hidden group-hover:block">
                              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                <button
                                  key={key}
                                  onClick={() => quickStatus(c.id, key)}
                                  className={`w-full text-start px-3 py-1.5 text-xs font-medium hover:bg-muted flex items-center gap-2 ${c.status === key ? "text-primary" : "text-foreground"}`}
                                >
                                  <cfg.icon className="w-3 h-3" />{cfg.labelAr}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Date/Time/Type row */}
                        <div className="flex flex-wrap gap-3 mt-3">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/60 rounded-lg px-2.5 py-1.5">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            {formatDate(c.date)}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground bg-muted/60 rounded-lg px-2.5 py-1.5">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {c.time} ({c.duration || 60} د)
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-foreground/70 bg-muted/40 rounded-lg px-2.5 py-1.5">
                            {TYPE_LABELS[c.type] ?? c.type}
                          </div>
                          <button
                            onClick={() => quickPaid(c.id, !c.paid)}
                            className={`flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5 transition-colors ${
                              c.paid
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            {c.paid ? "مدفوع" : "غير مدفوع"}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/40 flex-wrap">
                      <a
                        href={buildGoogleCalUrl(c)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/20"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        أضف للتقويم
                      </a>

                      {c.meetingLink && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/50 rounded-lg px-2.5 py-1.5">
                          <Link2 className="w-3 h-3 text-primary" />
                          <span className="max-w-[100px] truncate">{c.meetingLink}</span>
                          <CopyButton text={c.meetingLink} />
                          <a href={c.meetingLink} target="_blank" rel="noopener noreferrer" className="p-1 hover:text-primary">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      <button
                        onClick={() => setExpandedId(isExpanded ? null : c.id)}
                        className="ms-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {isExpanded ? "إخفاء" : "التفاصيل"}
                      </button>

                      <Button
                        size="sm"
                        onClick={() => openEdit(c)}
                        className="h-7 px-3 text-xs bg-primary/10 text-primary hover:bg-primary/20 border-0"
                      >
                        تعديل
                      </Button>
                    </div>

                    {/* Expanded notes */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-3 mt-1 space-y-2">
                            {c.notes && (
                              <div className="bg-muted/40 rounded-xl p-3">
                                <p className="text-xs font-semibold text-muted-foreground mb-1">ملاحظات العميل</p>
                                <p className="text-sm text-foreground">{c.notes}</p>
                              </div>
                            )}
                            {c.adminNotes && (
                              <div className="bg-primary/5 border border-primary/10 rounded-xl p-3">
                                <p className="text-xs font-semibold text-primary mb-1">ملاحظات الأدمن</p>
                                <p className="text-sm text-foreground">{c.adminNotes}</p>
                              </div>
                            )}
                            {c.price && (
                              <div className="text-xs text-muted-foreground">
                                السعر: <span className="font-bold text-foreground">{c.price} ريال</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              {editing?.clientName}
            </DialogTitle>
            <p className="text-xs text-muted-foreground">{editing?.date} · {editing?.time}</p>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            {/* Status */}
            <div className="grid gap-1.5">
              <Label>الحالة</Label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setStatus(key)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                        status === key
                          ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                          : "border-border text-muted-foreground hover:border-border hover:bg-muted/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {cfg.labelAr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Payment + Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="mb-1.5 block">الدفع</Label>
                <button
                  type="button"
                  onClick={() => setPaid(!paid)}
                  className={`w-full flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-medium transition-all ${
                    paid
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                      : "bg-red-50 text-red-600 border-red-200"
                  }`}
                >
                  <DollarSign className="w-4 h-4" />
                  {paid ? "مدفوع ✓" : "غير مدفوع"}
                </button>
              </div>
              <div>
                <Label className="mb-1.5 block">السعر (ريال)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  placeholder="0"
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            {/* Meeting Link */}
            <div className="grid gap-1.5">
              <Label className="flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-primary" />
                رابط الاجتماع
              </Label>
              <div className="flex gap-2">
                <Input
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/..."
                  className="h-10 rounded-xl flex-1"
                />
                {meetingLink && <CopyButton text={meetingLink} />}
              </div>
              <p className="text-xs text-muted-foreground">سيظهر للعميل بعد الحفظ</p>
            </div>

            {/* Admin Notes */}
            <div className="grid gap-1.5">
              <Label className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-primary" />
                ملاحظات الأدمن (داخلية)
              </Label>
              <Textarea
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="ملاحظات داخلية..."
                className="min-h-[80px] rounded-xl resize-none text-sm"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setOpen(false)} className="rounded-xl">إلغاء</Button>
            <Button onClick={save} disabled={saving} className="rounded-xl bg-primary text-white">
              {saving ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                  حفظ...
                </span>
              ) : "حفظ التغييرات"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
