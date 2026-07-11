import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { HelpCircle, Plus, Pencil, Trash2, MessageSquareQuote } from "lucide-react";

const EMPTY = { question: "", questionAr: "", answer: "", answerAr: "", source: "manual", published: true, order: 0 };

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

async function fetchAdminFaqs() {
  const res = await fetch("/api/admin/faqs", { headers: authHeaders() });
  if (!res.ok) return [];
  return res.json();
}

export default function AdminFaqs() {
  const { data: rawFaqs, isLoading } = useQuery({ queryKey: ["/api/admin/faqs"], queryFn: fetchAdminFaqs });
  const faqs = Array.isArray(rawFaqs) ? rawFaqs : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const invalidate = () => Promise.all([
    qc.invalidateQueries({ queryKey: ["/api/admin/faqs"] }),
    qc.invalidateQueries({ queryKey: ["/api/faqs"] }),
  ]);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ ...s }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/faqs/${editing.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      } else {
        await fetch("/api/admin/faqs", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      }
      await invalidate();
      setOpen(false);
    } finally { setSaving(false); }
  };

  const togglePublished = async (faq: any) => {
    await fetch(`/api/admin/faqs/${faq.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ published: !faq.published }) });
    await invalidate();
  };

  const deleteFaq = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/admin/faqs/${id}`, { method: "DELETE", headers: authHeaders() });
      await invalidate();
    } finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Frequently Asked Questions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage the FAQ section shown at the bottom of the homepage — turn common client feedback into public answers.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> Add FAQ</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Question (EN)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Question (AR)</TableHead>
              <TableHead className="text-muted-foreground font-medium w-24">Source</TableHead>
              <TableHead className="text-muted-foreground font-medium w-24">Published</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">Loading FAQs…</TableCell></TableRow>
            ) : faqs.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <HelpCircle size={28} className="opacity-30" />
                  <p className="text-sm">No FAQs yet. Add your first one, or turn client feedback into an answer.</p>
                </div>
              </TableCell></TableRow>
            ) : faqs.map((s: any) => (
              <TableRow key={s.id} className="hover:bg-muted/20">
                <TableCell className="font-semibold text-foreground max-w-xs truncate">{s.question}</TableCell>
                <TableCell className="text-foreground/70 text-sm max-w-xs truncate" dir="rtl">{s.questionAr || "—"}</TableCell>
                <TableCell className="text-xs">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${s.source === "feedback" ? "bg-amber-100 text-amber-800" : "bg-muted text-muted-foreground"}`}>
                    {s.source === "feedback" && <MessageSquareQuote size={11} />}
                    {s.source === "feedback" ? "Feedback" : "Manual"}
                  </span>
                </TableCell>
                <TableCell><Switch checked={s.published} onCheckedChange={() => togglePublished(s)} /></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2" onClick={() => openEdit(s)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 px-2" disabled={deleting === s.id} onClick={() => setDeleteConfirm(s)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "Add New FAQ"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Question (English) *</Label>
              <Input value={form.question} onChange={e => f("question", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>السؤال (عربي) *</Label>
              <Input value={form.questionAr ?? ""} onChange={e => f("questionAr", e.target.value)} dir="rtl" />
            </div>
            <div className="grid gap-1.5">
              <Label>Answer (English) *</Label>
              <textarea value={form.answer ?? ""} onChange={e => f("answer", e.target.value)} rows={3} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid gap-1.5">
              <Label>الإجابة (عربي) *</Label>
              <textarea value={form.answerAr ?? ""} onChange={e => f("answerAr", e.target.value)} rows={3} dir="rtl" className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3 items-end">
              <div className="grid gap-1.5">
                <Label>Source</Label>
                <select value={form.source} onChange={e => f("source", e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground">
                  <option value="manual">Manual</option>
                  <option value="feedback">From client feedback</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pb-2">
                <Switch checked={form.published} onCheckedChange={(v: boolean) => f("published", v)} />
                <Label>Published</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add FAQ"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete FAQ</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete "<strong>{deleteConfirm?.question}</strong>"? This will remove it from the website.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!!deleting} onClick={() => deleteFaq(deleteConfirm.id)}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
