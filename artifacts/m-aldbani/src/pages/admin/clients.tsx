import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListClients } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { format } from "date-fns";

export default function AdminClients() {
  const { data: rawClients, isLoading } = useListClients();
  const clients = Array.isArray(rawClients) ? rawClients : [];

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-foreground">Clients</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Registered platform users and active clients.</p>
      </div>

      <div className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-muted-foreground font-medium">Name</TableHead>
              <TableHead className="text-muted-foreground font-medium">Email</TableHead>
              <TableHead className="text-muted-foreground font-medium">Role</TableHead>
              <TableHead className="text-muted-foreground font-medium">Joined</TableHead>
              <TableHead className="text-muted-foreground font-medium text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10 text-muted-foreground animate-pulse">Loading clients…</TableCell></TableRow>
            ) : clients.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-10">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Users size={28} className="opacity-30" />
                  <p className="text-sm">No clients yet.</p>
                </div>
              </TableCell></TableRow>
            ) : clients.map((client: any) => (
              <TableRow key={client.id} className="hover:bg-muted/20">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {(client.name ?? "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-semibold text-foreground">{client.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-foreground/80 text-sm">{client.email}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={client.role === "admin" ? "bg-violet-50 text-violet-700 border-violet-200" : "bg-blue-50 text-blue-700 border-blue-200"}>
                    {client.role}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {client.createdAt ? format(new Date(client.createdAt), "MMM d, yyyy") : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary text-xs">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
