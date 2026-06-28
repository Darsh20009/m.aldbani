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
import { Briefcase, Plus, Pencil, Trash2, Star } from "lucide-react";

const EMPTY = { title: "", titleAr: "", category: "", description: "", descriptionAr: "", imageUrl: "", logoUrl: "", client: "", year: new Date().getFullYear(), featured: false, order: 0 };

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

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

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (p: any) => { setEditing(p); setForm({ ...p }); setOpen(true); };

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

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Portfolio Projects</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage portfolio items, logos, and case studies shown on the website.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> Add Project</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Logo</TableHead>
              <TableHead className="text-muted-foreground font-medium">Title (EN)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Title (AR)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Category</TableHead>
              <TableHead className="text-muted-foreground font-medium">Year</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground animate-pulse">Loading projects…</TableCell></TableRow>
            ) : projects.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Briefcase size={28} className="opacity-30" />
                  <p className="text-sm">No projects yet. Add your first one.</p>
                </div>
              </TableCell></TableRow>
            ) : projects.map((p: any) => (
              <TableRow key={p.id} className="hover:bg-muted/20">
                <TableCell>
                  {p.logoUrl ? (
                    <img src={p.logoUrl} alt={p.title} className="w-9 h-9 rounded-lg object-cover border border-border/60" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground"><Briefcase size={14} /></div>
                  )}
                </TableCell>
                <TableCell className="font-semibold text-foreground">{p.title}</TableCell>
                <TableCell className="text-foreground/70 text-sm" dir="rtl">{p.titleAr || "—"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{p.category}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{p.year || "—"}</TableCell>
                <TableCell>
                  {p.featured ? (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1"><Star size={10} /> Featured</Badge>
                  ) : (
                    <Badge variant="outline" className="bg-muted text-muted-foreground border-border">Standard</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2" onClick={() => openEdit(p)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 px-2" disabled={deleting === p.id} onClick={() => setDeleteConfirm(p)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit Project" : "Add New Project"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Title (English) *</Label>
                <Input value={form.title} onChange={e => f("title", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label>Title (Arabic)</Label>
                <Input value={form.titleAr ?? ""} onChange={e => f("titleAr", e.target.value)} dir="rtl" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Category</Label>
                <Input value={form.category ?? ""} onChange={e => f("category", e.target.value)} placeholder="F&B, Retail…" />
              </div>
              <div className="grid gap-1.5">
                <Label>Year</Label>
                <Input type="number" value={form.year ?? ""} onChange={e => f("year", +e.target.value)} />
              </div>
            </div>
            <div className="grid gap-1.5">
              <Label>Client / Brand Name</Label>
              <Input value={form.client ?? ""} onChange={e => f("client", e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label>Logo URL (shown in portfolio)</Label>
              <Input value={form.logoUrl ?? ""} onChange={e => f("logoUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid gap-1.5">
              <Label>Cover Image URL</Label>
              <Input value={form.imageUrl ?? ""} onChange={e => f("imageUrl", e.target.value)} placeholder="https://..." />
            </div>
            <div className="grid gap-1.5">
              <Label>Description (English)</Label>
              <textarea value={form.description ?? ""} onChange={e => f("description", e.target.value)} rows={3} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid gap-1.5">
              <Label>Description (Arabic)</Label>
              <textarea value={form.descriptionAr ?? ""} onChange={e => f("descriptionAr", e.target.value)} rows={3} dir="rtl" className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="feat" checked={!!form.featured} onChange={e => f("featured", e.target.checked)} className="w-4 h-4 accent-primary" />
                <Label htmlFor="feat">Featured Project</Label>
              </div>
              <div className="grid gap-1.5">
                <Label>Display Order</Label>
                <Input type="number" value={form.order ?? 0} onChange={e => f("order", +e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add Project"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Project</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete "<strong>{deleteConfirm?.title}</strong>"? This will remove it from the portfolio.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!!deleting} onClick={() => deleteProject(deleteConfirm.id)}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
