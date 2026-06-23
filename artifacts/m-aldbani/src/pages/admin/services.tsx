import { AdminLayout } from "../../components/layout/AdminLayout";
import { useListServices } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function AdminServices() {
  const { data: rawServices, isLoading } = useListServices();
  const services = Array.isArray(rawServices) ? rawServices : [];

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading mb-2 text-white">Services</h1>
          <p className="text-foreground/60">Manage consulting offerings and pricing.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-white">Add Service</Button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">Icon</TableHead>
              <TableHead className="text-foreground/60">Title</TableHead>
              <TableHead className="text-foreground/60">Price</TableHead>
              <TableHead className="text-foreground/60 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="border-border">
                <TableCell colSpan={4} className="text-center py-8 text-foreground/50 animate-pulse">Loading services...</TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow className="border-border">
                <TableCell colSpan={4} className="text-center py-8 text-foreground/50">No services found.</TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id} className="border-border hover:bg-primary/5">
                  <TableCell className="text-2xl">{service.icon}</TableCell>
                  <TableCell className="font-medium text-white">{service.title}</TableCell>
                  <TableCell className="text-foreground/70">{service.price || "Custom"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-foreground/60 hover:text-white">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">Delete</Button>
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
