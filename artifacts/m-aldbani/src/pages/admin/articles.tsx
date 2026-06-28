import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListArticles } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus, Pencil, Trash2 } from "lucide-react";

const EMPTY = { title: "", titleAr: "", category: "", excerpt: "", content: "", imageUrl: "", published: false };

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

export default function AdminArticles() {
  const { data: rawArticles, isLoading } = useListArticles();
  const articles = Array.isArray(rawArticles) ? rawArticles : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (a: any) => { setEditing(a); setForm({ ...a }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/articles/${editing.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      } else {
        await fetch("/api/admin/articles", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      }
      await qc.invalidateQueries({ queryKey: ["/api/articles"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const deleteArticle = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE", headers: authHeaders() });
      await qc.invalidateQueries({ queryKey: ["/api/articles"] });
    } finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Articles</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage blog posts and thought leadership content.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> Write Article</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Title (EN)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Title (AR)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">Loading articles…</TableCell></TableRow>
            ) : articles.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <FileText size={28} className="opacity-30" />
                  <p className="text-sm">No articles yet. Write your first one.</p>
                </div>
              </TableCell></TableRow>
            ) : articles.map((a: any) => (
              <TableRow key={a.id} className="hover:bg-muted/20">
                <TableCell className="font-medium text-foreground max-w-[180px] truncate">{a.title}</TableCell>
                <TableCell className="text-foreground/70 text-sm max-w-[160px] truncate" dir="rtl">{a.titleAr || "—"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{a.category || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={a.published ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                    {a.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2" onClick={() => openEdit(a)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 px-2" disabled={deleting === a.id} onClick={() => setDeleteConfirm(a)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Article" : "Write New Article"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Title (English) *</Label>
              <Input value={form.title} onChange={e => f("title", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Title (Arabic)</Label>
              <Input value={form.titleAr ?? ""} onChange={e => f("titleAr", e.target.value)} dir="rtl" />
            </div>
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Input value={form.category ?? ""} onChange={e => f("category", e.target.value)} placeholder="e.g. Business, Marketing" />
            </div>
            <div className="grid gap-1.5">
              <Label>Cover Image URL</Label>
              <Input value={form.imageUrl ?? ""} onChange={e => f("imageUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid gap-1.5">
              <Label>Excerpt</Label>
              <textarea value={form.excerpt ?? ""} onChange={e => f("excerpt", e.target.value)} rows={2} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid gap-1.5">
              <Label>Content (Markdown)</Label>
              <textarea value={form.content ?? ""} onChange={e => f("content", e.target.value)} rows={5} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pub" checked={!!form.published} onChange={e => f("published", e.target.checked)} className="w-4 h-4 accent-primary" />
              <Label htmlFor="pub">Publish immediately</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Publish"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Article</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete "<strong>{deleteConfirm?.title}</strong>"? This cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!!deleting} onClick={() => deleteArticle(deleteConfirm.id)}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
