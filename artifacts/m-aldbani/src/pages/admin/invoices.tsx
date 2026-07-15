import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListClients } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Receipt, Plus, Trash2, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SarIcon } from "@/components/ui/SarIcon";

const API = "/api/admin";
const token = () => localStorage.getItem("token") ?? "";
const authFetch = (url: string, opts: RequestInit = {}) =>
  fetch(url, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}`, ...(opts.headers ?? {}) } });

type InvItem = { description: string; quantity: number; price: number };
type Invoice = {
  id: string; clientId: string; clientName: string; clientEmail: string;
  number: string; amount: number; currency: string; status: string;
  dueDate: string; paidAt: string | null; items: InvItem[]; createdAt: string;
};

const STATUS: Record<string, { label: string; className: string }> = {
  pending:   { label: "معلق",    className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  paid:      { label: "مدفوع",   className: "bg-green-500/10 text-green-600 border-green-500/20" },
  overdue:   { label: "متأخر",   className: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "ملغي",    className: "bg-muted text-muted-foreground border-border" },
};

const EMPTY_ITEM: InvItem = { description: "", quantity: 1, price: 0 };

export default function AdminInvoices() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const [form, setForm] = useState({
    clientId: "", items: [{ ...EMPTY_ITEM }],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
  });

  const { data: rawClients } = useListClients();
  const clients: any[] = Array.isArray(rawClients) ? rawClients : [];

  const { data: invoices = [], isLoading, refetch } = useQuery<Invoice[]>({
    queryKey: ["admin-invoices"],
    queryFn: () => authFetch(`${API}/invoices`).then(r => r.json()),
  });

  const createMut = useMutation({
    mutationFn: (body: any) => authFetch(`${API}/invoices`, { method: "POST", body: JSON.stringify(body) }).then(r => r.json()),
    onSuccess: (res) => {
      if (res.error) { toast({ title: "خطأ", description: res.error, variant: "destructive" }); return; }
      toast({ title: "تم إنشاء الفاتورة ✓" });
      qc.invalidateQueries({ queryKey: ["admin-invoices"] });
      setOpen(false);
      setForm({ clientId: "", items: [{ ...EMPTY_ITEM }], dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10) });
    },
  });

  const patchMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      authFetch(`${API}/invoices/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }).then(r => r.json()),
    onSuccess: () => { toast({ title: "تم التحديث ✓" }); qc.invalidateQueries({ queryKey: ["admin-invoices"] }); },
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => authFetch(`${API}/invoices/${id}`, { method: "DELETE" }).then(r => r.json()),
    onSuccess: () => { toast({ title: "تم الحذف" }); qc.invalidateQueries({ queryKey: ["admin-invoices"] }); },
  });

  const total = form.items.reduce((s, i) => s + (i.quantity * i.price || 0), 0);
  const updateItem = (idx: number, key: keyof InvItem, val: string | number) =>
    setForm(f => ({ ...f, items: f.items.map((it, i) => i === idx ? { ...it, [key]: val } : it) }));

  const handleSubmit = () => {
    if (!form.clientId || form.items.some(i => !i.description.trim())) {
      toast({ title: "يرجى تعبئة جميع الحقول", variant: "destructive" }); return;
    }
    createMut.mutate(form);
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">الفواتير</h1>
          <p className="text-sm text-muted-foreground mt-0.5">إدارة فواتير العملاء</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => refetch()} className="border-border gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> تحديث
          </Button>
          <Button size="sm" onClick={() => setOpen(true)} className="gap-1.5 text-xs">
            <Plus className="w-3.5 h-3.5" /> فاتورة جديدة
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="w-8"></TableHead>
              <TableHead className="text-muted-foreground font-medium">رقم الفاتورة</TableHead>
              <TableHead className="text-muted-foreground font-medium">العميل</TableHead>
              <TableHead className="text-muted-foreground font-medium">المبلغ</TableHead>
              <TableHead className="text-muted-foreground font-medium">الحالة</TableHead>
              <TableHead className="text-muted-foreground font-medium">تاريخ الاستحقاق</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1,2,3].map(i => (
                <TableRow key={i}>{[1,2,3,4,5,6,7].map(j => <TableCell key={j}><div className="h-4 bg-muted/60 rounded animate-pulse" /></TableCell>)}</TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="py-16 text-center">
                <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">لا توجد فواتير بعد</p>
              </TableCell></TableRow>
            ) : invoices.map(inv => (
              <>
                <TableRow key={inv.id} className="border-border hover:bg-muted/20 cursor-pointer" onClick={() => setExpanded(expanded === inv.id ? null : inv.id)}>
                  <TableCell className="text-muted-foreground">
                    {expanded === inv.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </TableCell>
                  <TableCell className="font-mono font-medium text-sm">{inv.number}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{inv.clientName}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <span className="inline-flex items-center gap-1">{inv.amount.toLocaleString("ar-SA")} <SarIcon size={13} className="text-muted-foreground" /></span>
                  </TableCell>
                  <TableCell>
                    <Select value={inv.status} onValueChange={s => patchMut.mutate({ id: inv.id, status: s })}
                      disabled={patchMut.isPending}>
                      <SelectTrigger className="h-7 w-28 text-xs border-0 shadow-none p-0 focus:ring-0">
                        <Badge variant="outline" className={STATUS[inv.status]?.className}>{STATUS[inv.status]?.label ?? inv.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS).map(([v, s]) => <SelectItem key={v} value={v}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(inv.dueDate).toLocaleDateString("ar-SA")}</TableCell>
                  <TableCell className="text-right" onClick={e => e.stopPropagation()}>
                    <Button size="sm" variant="ghost" onClick={() => { if (confirm("حذف الفاتورة؟")) deleteMut.mutate(inv.id); }}
                      className="text-muted-foreground hover:text-red-500 h-7 w-7 p-0">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded === inv.id && (
                  <TableRow key={`${inv.id}-d`} className="bg-muted/10">
                    <TableCell colSpan={7} className="py-4 px-6">
                      <div className="rounded-xl border border-border overflow-hidden" dir="rtl">
                        <table className="w-full text-sm">
                          <thead><tr className="bg-muted/60">
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">الوصف</th>
                            <th className="py-2 px-4 text-center text-muted-foreground font-medium">الكمية</th>
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">السعر</th>
                            <th className="py-2 px-4 text-right text-muted-foreground font-medium">الإجمالي</th>
                          </tr></thead>
                          <tbody>{inv.items?.map((it, idx) => (
                            <tr key={idx} className="border-t border-border">
                              <td className="py-2 px-4 text-foreground">{it.description}</td>
                              <td className="py-2 px-4 text-center text-muted-foreground">{it.quantity}</td>
                              <td className="py-2 px-4 text-foreground">{it.price?.toLocaleString("ar-SA")} ر.س</td>
                              <td className="py-2 px-4 font-semibold text-foreground">{(it.quantity * it.price).toLocaleString("ar-SA")} ر.س</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">فاتورة جديدة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">العميل *</label>
                <Select value={form.clientId} onValueChange={v => setForm(f => ({ ...f, clientId: v }))}>
                  <SelectTrigger className="text-sm"><SelectValue placeholder="اختر العميل" /></SelectTrigger>
                  <SelectContent>{clients.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} — {c.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">تاريخ الاستحقاق *</label>
                <Input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} className="text-sm" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">البنود *</label>
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/60">
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium">الوصف</th>
                    <th className="py-2 px-3 text-center text-muted-foreground font-medium w-16">الكمية</th>
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium w-32">السعر (ر.س)</th>
                    <th className="py-2 px-3 text-right text-muted-foreground font-medium w-28">الإجمالي</th>
                    <th className="py-2 px-3 w-8"></th>
                  </tr></thead>
                  <tbody>{form.items.map((it, idx) => (
                    <tr key={idx} className="border-t border-border">
                      <td className="py-1.5 px-2"><Input value={it.description} onChange={e => updateItem(idx, "description", e.target.value)} placeholder="وصف البند" className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                      <td className="py-1.5 px-2"><Input type="number" min={1} value={it.quantity} onChange={e => updateItem(idx, "quantity", Number(e.target.value))} className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent text-center w-16" /></td>
                      <td className="py-1.5 px-2"><Input type="number" min={0} value={it.price} onChange={e => updateItem(idx, "price", Number(e.target.value))} className="text-sm h-8 border-0 shadow-none focus-visible:ring-0 bg-transparent" /></td>
                      <td className="py-1.5 px-3 font-semibold">{(it.quantity * it.price).toLocaleString("ar-SA")}</td>
                      <td className="py-1.5 px-2">{form.items.length > 1 && <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }))} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              <Button variant="outline" size="sm" onClick={() => setForm(f => ({ ...f, items: [...f.items, { ...EMPTY_ITEM }] }))} className="gap-1.5 text-xs border-dashed">
                <Plus className="w-3.5 h-3.5" /> إضافة بند
              </Button>
              <div className="flex justify-end items-center gap-2 pt-1">
                <span className="text-sm font-bold">الإجمالي:</span>
                <span className="text-lg font-bold text-primary">{total.toLocaleString("ar-SA")} ر.س</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit} disabled={createMut.isPending} className="gap-1.5">
                {createMut.isPending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                إنشاء الفاتورة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
