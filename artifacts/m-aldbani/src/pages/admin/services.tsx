import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListServices } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings, Plus, Pencil, Trash2 } from "lucide-react";

const EMPTY = { icon: "⚙️", title: "", titleAr: "", description: "", descriptionAr: "", price: "", duration: "" };

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

export default function AdminServices() {
  const { data: rawServices, isLoading } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (s: any) => { setEditing(s); setForm({ ...s }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/services/${editing.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      } else {
        await fetch("/api/admin/services", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      }
      await qc.invalidateQueries({ queryKey: ["/api/services"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const deleteService = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/admin/services/${id}`, { method: "DELETE", headers: authHeaders() });
      await qc.invalidateQueries({ queryKey: ["/api/services"] });
    } finally { setDeleting(null); setDeleteConfirm(null); }
  };

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage consulting offerings and pricing shown on the website.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> Add Service</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium w-14">Icon</TableHead>
              <TableHead className="text-muted-foreground font-medium">Title (EN)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Title (AR)</TableHead>
              <TableHead className="text-muted-foreground font-medium">Price</TableHead>
              <TableHead className="text-muted-foreground font-medium">Duration</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground animate-pulse">Loading services…</TableCell></TableRow>
            ) : services.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Settings size={28} className="opacity-30" />
                  <p className="text-sm">No services yet. Add your first one.</p>
                </div>
              </TableCell></TableRow>
            ) : services.map((s: any) => (
              <TableRow key={s.id} className="hover:bg-muted/20">
                <TableCell className="text-2xl">{s.icon}</TableCell>
                <TableCell className="font-semibold text-foreground">{s.title}</TableCell>
                <TableCell className="text-foreground/70 text-sm" dir="rtl">{s.titleAr || "—"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{s.price || "Custom"}</TableCell>
                <TableCell className="text-foreground/70 text-sm">{s.duration || "—"}</TableCell>
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
          <DialogHeader><DialogTitle>{editing ? "Edit Service" : "Add New Service"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            <div className="grid gap-1.5">
              <Label>Icon (Emoji)</Label>
              <Input value={form.icon} onChange={e => f("icon", e.target.value)} className="text-2xl w-20" />
            </div>
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
            <div className="grid gap-1.5">
              <Label>Description (English)</Label>
              <textarea value={form.description ?? ""} onChange={e => f("description", e.target.value)} rows={3} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid gap-1.5">
              <Label>Description (Arabic)</Label>
              <textarea value={form.descriptionAr ?? ""} onChange={e => f("descriptionAr", e.target.value)} rows={3} dir="rtl" className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <Label>Price (e.g. $500)</Label>
                <Input value={form.price ?? ""} onChange={e => f("price", e.target.value)} placeholder="Custom" />
              </div>
              <div className="grid gap-1.5">
                <Label>Duration (e.g. 2h)</Label>
                <Input value={form.duration ?? ""} onChange={e => f("duration", e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add Service"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Delete Service</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Delete "<strong>{deleteConfirm?.title}</strong>"? This will remove it from the website.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" disabled={!!deleting} onClick={() => deleteService(deleteConfirm.id)}>
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
