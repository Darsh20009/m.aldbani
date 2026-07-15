import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListClients } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, Trash2, Send, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SarIcon } from "@/components/ui/SarIcon";

const API = "/api/admin";
const token = () => localStorage.getItem("token") ?? "";
const authFetch = (url: string, opts: RequestInit = {}) =>
  fetch(url, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}`, ...(opts.headers ?? {}) } });

type ProposalItem = { description: string; quantity: number; unitPrice: number };
type Proposal = {
  id: string; clientId: string; clientName: string; clientEmail: string;
  number: string; title: string; items: ProposalItem[];
  total: number; currency: string; status: string;
  validUntil: string; notes: string; sentAt: string | null; createdAt: string;
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft:    { label: "مسودة",    className: "bg-muted text-muted-foreground border-border" },
  sent:     { label: "مُرسل",   className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  viewed:   { label: "شُوهد",   className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  accepted: { label: "مقبول",   className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "مرفوض",  className: "bg-red-500/10 text-red-600 border-red-500/20" },
  expired:  { label: "منتهي",   className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

const EMPTY_ITEM: ProposalItem = { description: "", quantity: 1, unitPrice: 0 };

export default function AdminProposals() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientId: "", title: "", items: [{ ...EMPTY_ITEM }],
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
    notes: "",
  });

  const { data: rawClients } = useListClients();
  const clients: any[] = Array.isArray(rawClients) ? rawClients : [];

  const { data: proposals = [], isLoading, refetch } = useQuery<Proposal[]>({
    queryKey: ["admin-proposals"],
    queryFn: () => authFetch(`${API}/proposals`).then(r => r.json()),
  });

  const createMut = useMutation({
    mutationFn: (body: any) => authFetch(`${API}/proposals`, { method: "POST", body: JSON.stringify(body) }).then(r => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast({ title: "خطأ", description: res.error, variant: "destructive" }); return; }
      toast({ title: "تم إنشاء العرض ✓" });
      qc.invalidateQueries({ queryKey: ["admin-proposals"] });
      setOpen(false);
      setForm({ clientId: "", title: "", items: [{ ...EMPTY_ITEM }], validUntil: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10), notes: "" });
    },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => authFetch(`${API}/proposals/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { toast({ title: "تم الحذف" }); qc.invalidateQueries({ queryKey: ["admin-proposals"] }); },
  });

  const sendMut = useMutation({
    mutationFn: (id: string) => authFetch(`${API}/proposals/${id}/send`, { method: "POST" }).then(r => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast({ title: "فشل الإرسال", description: res.error, variant: "destructive" }); return; }
      toast({ title: "تم إرسال العرض بالبريد ✓" });
      qc.invalidateQueries({ queryKey: ["admin-proposals"] });
    },
  });

  const total = form.items.reduce((s, i) => s + (i.quantity * i.unitPrice || 0), 0);

  const updateItem = (idx: number, key: keyof ProposalItem, val: string | number) =>
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [key]: val } : it) }));

  const handleSubmit = () => {
    if (!form.clientId || !form.title.trim() || form.items.some(i => !i.description.trim())) {
      toast({ title: "يرجى تعبئة جميع الحقول المطلوبة", variant: "destructive" }); return;
    }
    createMut.mutate(form);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">عروض الأسعار</h1>
          <p className="text-sm text-muted-foreground mt-0.5">أنشئ وأرسل عروض الأسعار للعملاء</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()} className="border-border gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> تحديث
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> عرض جديد
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium w-8"></TableHead>
              <TableHead className="text-muted-foreground font-medium">رقم العرض</TableHead>
              <TableHead className="text-muted-foreground font-medium">العنوان</TableHead>
              <TableHead className="text-muted-foreground font-medium">العميل</TableHead>
              <TableHead className="text-muted-foreground font-medium">الإجمالي</TableHead>
              <TableHead className="text-muted-foreground font-medium">الحالة</TableHead>
              <TableHead className="text-muted-foreground font-medium">صالح حتى</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1,2,3].map(i => (
                <TableRow key={i} className="border-border">
                  {[1,2,3,4,5,6,7,8].map(j => <TableCell key={j}><div className="h-4 bg-muted/60 rounded animate-pulse" /></TableCell>)}
                </TableRow>
              ))
            ) : proposals.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="py-16 text-center">
                <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">لا توجد عروض أسعار بعد</p>
              </TableCell></TableRow>
            ) : proposals.map(p => (
              <>
                <TableRow key={p.id} className="border-border hover:bg-muted/20 cursor-pointer" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  <TableCell className="text-muted-foreground">
                    {expanded === p.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </TableCell>
                  <TableCell className="font-mono font-medium text-foreground text-sm">{p.number}</TableCell>
                  <TableCell className="font-medium text-foreground text-sm">{p.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{p.clientName}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <span className="inline-flex items-center gap-1">{p.total.toLocaleString("ar-SA")} <SarIcon size={13} className="text-muted-foreground" /></span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_LABELS[p.status]?.className ?? "bg-muted"}>
                      {STATUS_LABELS[p.status]?.label ?? p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(p.validUntil).toLocaleDateString("ar-SA")}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      {(p.status === "draft" || p.status === "viewed" || p.status === "sent") && (
                        <Button size="sm" variant="outline" onClick={() => sendMut.mutate(p.id)}
                          disabled={sendMut.isPending}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs h-7 px-2.5 gap-1">
                          <Send className="w-3 h-3" /> إرسال
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" onClick={() => { if (confirm("حذف العرض؟")) deleteMut.mutate(p.id); }}
                        className="text-muted-foreground hover:text-red-500 h-7 w-7 p-0">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expanded === p.id && (
                  <TableRow key={`${p.id}-detail`} className="bg-muted/10">
                    <TableCell colSpan={8} className="py-4 px-6">
                      <div className="rounded-xl border border-border overflow-hidden mb-3">
                        <table className="w-full text-sm" dir="rtl">
                          <thead><tr className="bg-muted/60">
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">الوصف</th>
                            <th className="py-2 px-4 text-center text-muted-foreground font-medium">الكمية</th>
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">سعر الوحدة</th>
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">الإجمالي</th>
                          </tr></thead>
                          <tbody>{p.items.map((it, idx) => (
                            <tr key={idx} className="border-t border-border">
                              <td className="py-2 px-4 text-foreground">{it.description}</td>
                              <td className="py-2 px-4 text-center text-muted-foreground">{it.quantity}</td>
                              <td className="py-2 px-4 text-foreground">{it.unitPrice.toLocaleString("ar-SA")} ر.س</td>
                              <td className="py-2 px-4 font-semibold text-foreground">{(it.quantity * it.unitPrice).toLocaleString("ar-SA")} ر.س</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                      {p.notes && <p className="text-sm text-muted-foreground">{p.notes}</p>}
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Create Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">عرض سعر جديد</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">العميل *</label>
                <Select value={form.clientId} onValueChange={v => setForm(f => ({ ...f, clientId: v }))}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="اختر العميل" /></SelectTrigger>
                  <SelectContent>
                    {clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">صالح حتى *</label>
                <Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} className="text-sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">عنوان العرض *</label>
              <Input placeholder="مثال: تصميم هوية بصرية كاملة" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="text-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">بنود العرض *</label>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium">الوصف</th>
                    <th className="py-2 px-3 text-center text-muted-foreground font-medium w-16">الكمية</th>
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium w-32">سعر الوحدة (ر.س)</th>
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium w-28">الإجمالي</th>
                    <th className="py-2 px-3 w-8"></th>
                  </tr></thead>
                  <tbody>
                    {form.items.map((it, idx) => (
                      <tr key={idx} className="border-t border-border">
                        <td className="py-1.5 px-2">
                          <Input value={it.description} onChange={e => updateItem(idx, "description", e.target.value)} placeholder="وصف البند" className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent" />
                        </td>
                        <td className="py-1.5 px-2">
                          <Input type="number" min={1} value={it.quantity} onChange={e => updateItem(idx, "quantity", Number(e.target.value))} className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent text-center w-16" />
                        </td>
                        <td className="py-1.5 px-2">
                          <Input type="number" min={0} value={it.unitPrice} onChange={e => updateItem(idx, "unitPrice", Number(e.target.value))} className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent" />
                        </td>
                        <td className="py-1.5 px-3 font-semibold text-foreground">{(it.quantity * it.unitPrice).toLocaleString("ar-SA")}</td>
                        <td className="py-1.5 px-2">
                          {form.items.length > 1 && (
                            <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-red-500">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }))} className="gap-1.5 text-xs border-dashed">
                <Plus className="w-3.5 h-3.5" /> إضافة بند
              </Button>
              <div className="flex justify-end items-center gap-2 pt-1">
                <span className="text-sm font-bold text-foreground">الإجمالي:</span>
                <span className="text-lg font-bold text-primary">{total.toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">ملاحظات</label>
              <Textarea placeholder="أي ملاحظات أو شروط إضافية..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} className="text-sm resize-none" />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit} disabled={createMut.isPending} className="gap-1.5">
                {createMut.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                إنشاء العرض
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
