import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListAdminProjects } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "../../components/ui/ImageUpload";
import {
  Briefcase, Plus, Pencil, Trash2, Star, Globe, Instagram, Twitter, Linkedin, Link as LinkIcon,
} from "lucide-react";

const EMPTY = {
  title: "", titleAr: "", category: "", description: "", descriptionAr: "",
  logoUrl: "", image: "", videoUrl: "",
  websiteUrl: "", instagramUrl: "", twitterUrl: "", linkedinUrl: "",
  client: "", year: new Date().getFullYear(), featured: false, order: 0,
};

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="grid gap-1.5">
    <Label className="text-sm">{label}</Label>
    {children}
  </div>
);

export default function AdminProjects() {
  const { data: rawProjects, isLoading } = useListAdminProjects();
  const projects = Array.isArray(rawProjects) ? rawProjects : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"info" | "media" | "links">("info");

  const openAdd = () => { setEditing(null); setForm(EMPTY); setActiveTab("info"); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p }); setActiveTab("info"); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/projects/${editing.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      } else {
        await fetch("/api/admin/projects", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      }
      await qc.invalidateQueries({ queryKey: ["/api/projects"] });
      await qc.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const deleteProject = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/admin/projects/${id}`, { method: "DELETE", headers: authHeaders() });
      await qc.invalidateQueries({ queryKey: ["/api/projects"] });
      await qc.invalidateQueries({ queryKey: ["/api/admin/projects"] });
    } finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const TABS = [
    { id: "info",  label: "المعلومات الأساسية" },
    { id: "media", label: "الصور والفيديو" },
    { id: "links", label: "الروابط" },
  ] as const;

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">المشاريع والبراندات</h1>
          <p className="text-sm text-muted-foreground mt-0.5">أضف وعدّل البراندات والمشاريع التي تظهر في الموقع</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> إضافة براند / مشروع</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead>الشعار</TableHead>
              <TableHead>الاسم (EN)</TableHead>
              <TableHead>الاسم (AR)</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>السنة</TableHead>
              <TableHead>الروابط</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-10 animate-pulse text-muted-foreground">جاري التحميل…</TableCell></TableRow>
            ) : projects.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-12">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Briefcase size={28} className="opacity-30" />
                  <p className="text-sm">لا توجد مشاريع بعد. أضف أول مشروع.</p>
                </div>
              </TableCell></TableRow>
            ) : projects.map((p: any) => (
              <TableRow key={p.id} className="hover:bg-muted/20">
                <TableCell>
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-border/60" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Briefcase size={14} /></div>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-foreground">{p.title}</TableCell>
                <TableCell className="text-foreground/70 text-sm" dir="rtl">{p.titleAr || "—"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{p.category || "—"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{p.year || "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {p.websiteUrl  && <a href={p.websiteUrl}  target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground"><Globe size={14} /></a>}
                    {p.instagramUrl && <a href={p.instagramUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-pink-500"><Instagram size={14} /></a>}
                    {p.twitterUrl  && <a href={p.twitterUrl}  target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-sky-500"><Twitter size={14} /></a>}
                    {p.linkedinUrl && <a href={p.linkedinUrl} target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-blue-600"><Linkedin size={14} /></a>}
                    {!p.websiteUrl && !p.instagramUrl && !p.twitterUrl && !p.linkedinUrl && <span className="text-xs text-muted-foreground">—</span>}
                  </div>
                </TableCell>
                <TableCell>
                  {p.featured ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Star size={10} /> مميز</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">عادي</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-destructive" disabled={deleting === p.id} onClick={() => setDeleteConfirm(p)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "تعديل المشروع / البراند" : "إضافة براند / مشروع جديد"}</DialogTitle>
          </DialogHeader>

          {/* Dialog Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg mb-4">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-all ${activeTab === t.id ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── INFO ── */}
          {activeTab === "info" && (
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-3">
                <Field label="الاسم (إنجليزي) *"><Input value={form.title ?? ""} onChange={e => f("title", e.target.value)} /></Field>
                <Field label="الاسم (عربي)"><Input value={form.titleAr ?? ""} onChange={e => f("titleAr", e.target.value)} dir="rtl" /></Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="التصنيف"><Input value={form.category ?? ""} onChange={e => f("category", e.target.value)} placeholder="F&B، Retail…" /></Field>
                <Field label="السنة"><Input type="number" value={form.year ?? ""} onChange={e => f("year", +e.target.value)} /></Field>
              </div>
              <Field label="اسم العميل / البراند"><Input value={form.client ?? ""} onChange={e => f("client", e.target.value)} /></Field>
              <Field label="الوصف (إنجليزي)">
                <textarea value={form.description ?? ""} onChange={e => f("description", e.target.value)} rows={3}
                  className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </Field>
              <Field label="الوصف (عربي)">
                <textarea value={form.descriptionAr ?? ""} onChange={e => f("descriptionAr", e.target.value)} rows={3} dir="rtl"
                  className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="feat" checked={!!form.featured} onChange={e => f("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
                  <Label htmlFor="feat">مشروع مميز</Label>
                </div>
                <Field label="ترتيب العرض"><Input type="number" value={form.order ?? 0} onChange={e => f("order", +e.target.value)} /></Field>
              </div>
            </div>
          )}

          {/* ── MEDIA ── */}
          {activeTab === "media" && (
            <div className="grid gap-4">
              <ImageUpload
                label="شعار البراند (Logo)"
                value={form.logoUrl ?? ""}
                onChange={v => f("logoUrl", v)}
                placeholder="اسحب وأفلت الشعار أو انقر للرفع"
              />
              <ImageUpload
                label="صورة الغلاف (Cover)"
                value={form.image ?? form.imageUrl ?? ""}
                onChange={v => { f("image", v); f("imageUrl", v); }}
                placeholder="اسحب وأفلت صورة الغلاف أو انقر للرفع"
              />
              <ImageUpload
                label="فيديو البراند (اختياري)"
                value={form.videoUrl ?? ""}
                onChange={v => f("videoUrl", v)}
                accept="video/*,image/*"
                placeholder="اسحب وأفلت فيديو أو صورة"
              />
            </div>
          )}

          {/* ── LINKS ── */}
          {activeTab === "links" && (
            <div className="grid gap-3">
              <Field label="الموقع الإلكتروني">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-muted-foreground flex-shrink-0" />
                  <Input value={form.websiteUrl ?? ""} onChange={e => f("websiteUrl", e.target.value)} placeholder="https://..." />
                </div>
              </Field>
              <Field label="إنستغرام">
                <div className="flex items-center gap-2">
                  <Instagram size={16} className="text-pink-500 flex-shrink-0" />
                  <Input value={form.instagramUrl ?? ""} onChange={e => f("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." />
                </div>
              </Field>
              <Field label="تويتر / X">
                <div className="flex items-center gap-2">
                  <Twitter size={16} className="text-sky-500 flex-shrink-0" />
                  <Input value={form.twitterUrl ?? ""} onChange={e => f("twitterUrl", e.target.value)} placeholder="https://x.com/..." />
                </div>
              </Field>
              <Field label="لينكد إن">
                <div className="flex items-center gap-2">
                  <Linkedin size={16} className="text-blue-600 flex-shrink-0" />
                  <Input value={form.linkedinUrl ?? ""} onChange={e => f("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/..." />
                </div>
              </Field>
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
            <Button onClick={save} disabled={saving}>{saving ? "جاري الحفظ…" : editing ? "تحديث" : "إضافة"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>حذف المشروع</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">حذف "<strong>{deleteConfirm?.title}</strong>"؟ لا يمكن التراجع عن هذا.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>إلغاء</Button>
            <Button variant="destructive" disabled={!!deleting} onClick={() => deleteProject(deleteConfirm.id)}>
              {deleting ? "جاري الحذف…" : "حذف"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
