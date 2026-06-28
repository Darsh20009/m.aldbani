import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListLeads } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Plus, Pencil, Trash2 } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  "in-contact": "bg-amber-50 text-amber-700 border-amber-200",
  client: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const EMPTY = { name: "", email: "", phone: "", source: "", status: "new", value: "", notes: "" };

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

export default function AdminLeads() {
  const { data: rawLeads, isLoading } = useListLeads();
  const leads = Array.isArray(rawLeads) ? rawLeads : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const openAdd = () => { setEditing(null); setForm(EMPTY); setOpen(true); };
  const openEdit = (lead: any) => { setEditing(lead); setForm({ ...lead }); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      if (editing) {
        await fetch(`/api/admin/leads/${editing.id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify(form) });
      } else {
        await fetch("/api/admin/leads", { method: "POST", headers: authHeaders(), body: JSON.stringify(form) });
      }
      await qc.invalidateQueries({ queryKey: ["/api/admin/leads"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  const deleteLead = async (id: string) => {
    setDeleting(id);
    try {
      await fetch(`/api/admin/leads/${id}`, { method: "DELETE", headers: authHeaders() });
      await qc.invalidateQueries({ queryKey: ["/api/admin/leads"] });
    } finally { setDeleting(null); }
  };

  const f = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">Leads CRM</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage prospective clients and inquiries.</p>
        </div>
        <Button onClick={openAdd} className="gap-2"><Plus size={15} /> Add Lead</Button>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Contact</TableHead>
              <TableHead className="text-muted-foreground font-medium">Source</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Value</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground animate-pulse">Loading leads…</TableCell></TableRow>
            ) : leads.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Target size={28} className="opacity-30" />
                  <p className="text-sm">No leads yet. Add your first lead.</p>
                </div>
              </TableCell></TableRow>
            ) : leads.map((lead: any) => (
              <TableRow key={lead.id} className="hover:bg-muted/20">
                <TableCell className="font-semibold text-foreground">{lead.name}</TableCell>
                <TableCell>
                  <p className="text-foreground/80 text-sm">{lead.email}</p>
                  <p className="text-xs text-muted-foreground">{lead.phone}</p>
                </TableCell>
                <TableCell className="text-foreground/70 capitalize text-sm">{lead.source || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_STYLES[lead.status] ?? ""}>{lead.status}</Badge>
                </TableCell>
                <TableCell className="text-foreground/80 text-sm">{lead.value ? `$${lead.value}` : "—"}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2" onClick={() => openEdit(lead)}><Pencil size={14} /></Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-8 px-2" disabled={deleting === lead.id} onClick={() => deleteLead(lead.id)}><Trash2 size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>{editing ? "Edit Lead" : "Add New Lead"}</DialogTitle></DialogHeader>
          <div className="grid gap-3 py-2">
            {[["Name *", "name", "text"], ["Email", "email", "email"], ["Phone", "phone", "tel"], ["Source", "source", "text"], ["Deal Value ($)", "value", "number"]].map(([label, key, type]) => (
              <div key={key} className="grid gap-1.5">
                <Label className="text-sm">{label}</Label>
                <Input type={type} value={form[key] ?? ""} onChange={e => f(key, e.target.value)} />
              </div>
            ))}
            <div className="grid gap-1.5">
              <Label className="text-sm">Status</Label>
              <select value={form.status} onChange={e => f("status", e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                {["new", "in-contact", "client", "rejected"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : editing ? "Update" : "Add Lead"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
