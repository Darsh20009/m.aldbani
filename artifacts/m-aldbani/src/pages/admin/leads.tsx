import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListLeads } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function AdminLeads() {
  const { data: leads = [], isLoading } = useListLeads();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white">Leads CRM</h1>
          <p className="text-foreground/60">Manage prospective clients and inquiries.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">Add Lead</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">Name</TableHead>
              <TableHead className="text-foreground/60">Contact</TableHead>
              <TableHead className="text-foreground/60">Source</TableHead>
              <TableHead className="text-foreground/60">Status</TableHead>
              <TableHead className="text-foreground/60">Value</TableHead>
              <TableHead className="text-foreground/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="text-center py-8 text-foreground/50 animate-pulse">Loading leads...</TableCell>
              </TableRow>
            ) : leads.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={6} className="text-center py-8 text-foreground/50">No leads found.</TableCell>
              </TableRow>
            ) : (
              leads.map((lead) => (
                <TableRow key={lead.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-medium text-white">{lead.name}</TableCell>
                  <TableCell>
                    <div className="text-white/80">{lead.email}</div>
                    <div className="text-xs text-foreground/50">{lead.phone}</div>
                  </TableCell>
                  <TableCell className="text-foreground/70 capitalize">{lead.source}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      lead.status === 'new' ? 'bg-blue-500/20 text-blue-400 border-blue-500/20' :
                      lead.status === 'in-contact' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                      lead.status === 'client' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                      'bg-red-500/20 text-red-400 border-red-500/20'
                    }>
                      {lead.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white/80">{lead.value ? `$${lead.value}` : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-white">Edit</Button>
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
