import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListClients } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function AdminClients() {
  const { data: clients = [], isLoading } = useListClients();

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white">Clients</h1>
          <p className="text-foreground/60">Registered platform users and active clients.</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">Name</TableHead>
              <TableHead className="text-foreground/60">Email</TableHead>
              <TableHead className="text-foreground/60">Role</TableHead>
              <TableHead className="text-foreground/60">Joined</TableHead>
              <TableHead className="text-foreground/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell colSpan={5} className="text-center py-8 text-foreground/50 animate-pulse">Loading clients...</TableCell>
              </TableRow>
            ) : clients.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={5} className="text-center py-8 text-foreground/50">No clients found.</TableCell>
              </TableRow>
            ) : (
              clients.map((client) => (
                <TableRow key={client.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-medium text-white">{client.name}</TableCell>
                  <TableCell className="text-white/80">{client.email}</TableCell>
                  <TableCell className="text-foreground/70 capitalize">{client.role}</TableCell>
                  <TableCell className="text-foreground/70">{format(new Date(client.createdAt), 'MMM d, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-white">View Details</Button>
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
