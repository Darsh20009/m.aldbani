import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListAllConsultations } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminConsultations() {
  const { data: rawConsultations, isLoading } = useListAllConsultations();
  const consultations = Array.isArray(rawConsultations) ? rawConsultations : [];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white">Consultations</h1>
          <p className="text-foreground/60">Manage bookings, schedules, and meeting links.</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">Date & Time</TableHead>
              <TableHead className="text-foreground/60">Client</TableHead>
              <TableHead className="text-foreground/60">Type</TableHead>
              <TableHead className="text-foreground/60">Status</TableHead>
              <TableHead className="text-foreground/60">Payment</TableHead>
              <TableHead className="text-foreground/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="text-center py-8 text-foreground/50 animate-pulse">Loading consultations...</TableCell>
              </TableRow>
            ) : consultations.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="text-center py-8 text-foreground/50">No consultations found.</TableCell>
              </TableRow>
            ) : (
              consultations.map((c) => (
                <TableRow key={c.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-medium">
                    <div className="text-white">{c.date}</div>
                    <div className="text-xs text-foreground/50">{c.time}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-white">{c.clientName}</div>
                    <div className="text-xs text-foreground/50">{c.clientEmail}</div>
                  </TableCell>
                  <TableCell className="text-white/80">{c.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      c.status === 'upcoming' ? 'bg-primary/20 text-primary border-primary/20' :
                      c.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                      c.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/20'
                    }>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={c.paid ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                      {c.paid ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-white">Manage</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
