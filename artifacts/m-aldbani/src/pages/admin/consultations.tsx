import { useState } from "react";
import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListAllConsultations } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { CalendarDays, Pencil } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  upcoming: "bg-blue-50 text-blue-700 border-blue-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
};

function getToken() { return localStorage.getItem("token") ?? ""; }
const authHeaders = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` });

export default function AdminConsultations() {
  const { data: rawData, isLoading } = useListAllConsultations();
  const consultations = Array.isArray(rawData) ? rawData : [];
  const qc = useQueryClient();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [status, setStatus] = useState("");
  const [paid, setPaid] = useState(false);
  const [saving, setSaving] = useState(false);

  const openEdit = (c: any) => { setEditing(c); setStatus(c.status); setPaid(!!c.paid); setOpen(true); };

  const save = async () => {
    setSaving(true);
    try {
      await fetch(`/api/admin/consultations/${editing.id}`, {
        method: "PATCH", headers: authHeaders(), body: JSON.stringify({ status, paid }),
      });
      await qc.invalidateQueries({ queryKey: ["/api/admin/consultations"] });
      setOpen(false);
    } finally { setSaving(false); }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-foreground">Consultations</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage bookings, schedules, and meeting links.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Date & Time</TableHead>
              <TableHead className="text-muted-foreground font-medium">Client</TableHead>
              <TableHead className="text-muted-foreground font-medium">Type</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-muted-foreground font-medium">Payment</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground animate-pulse">Loading consultations…</TableCell></TableRow>
            ) : consultations.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <CalendarDays size={28} className="opacity-30" />
                  <p className="text-sm">No consultations yet.</p>
                </div>
              </TableCell></TableRow>
            ) : consultations.map((c: any) => (
              <TableRow key={c.id} className="hover:bg-muted/20">
                <TableCell>
                  <p className="font-medium text-foreground text-sm">{c.date}</p>
                  <p className="text-xs text-muted-foreground">{c.time}</p>
                </TableCell>
                <TableCell>
                  <p className="text-foreground font-medium text-sm">{c.clientName}</p>
                  <p className="text-xs text-muted-foreground">{c.clientEmail}</p>
                </TableCell>
                <TableCell className="text-foreground/80 text-sm">{c.type}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={STATUS_STYLES[c.status] ?? ""}>{c.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={c.paid ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                    {c.paid ? "Paid" : "Unpaid"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary h-8 px-2" onClick={() => openEdit(c)}>
                    <Pencil size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Update Consultation</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <Label>Status</Label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="border border-border rounded-md px-3 py-2 text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                {["upcoming", "pending", "completed", "cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="paid" checked={paid} onChange={e => setPaid(e.target.checked)} className="w-4 h-4 accent-primary" />
              <Label htmlFor="paid">Mark as Paid</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Update"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
