import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyInvoices } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ClientInvoices() {
  const { t } = useLanguage();
  const { data: invoices = [], isLoading } = useGetMyInvoices();

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-2">{t("Invoices", "الفواتير")}</h1>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-foreground/60">{t("Invoice #", "رقم الفاتورة")}</TableHead>
              <TableHead className="text-foreground/60">{t("Date", "التاريخ")}</TableHead>
              <TableHead className="text-foreground/60">{t("Amount", "المبلغ")}</TableHead>
              <TableHead className="text-foreground/60">{t("Status", "الحالة")}</TableHead>
              <TableHead className="text-foreground/60 text-right">{t("Action", "إجراء")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="border-border hover:bg-primary/5">
                  <TableCell><div className="h-4 bg-primary/10 rounded w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-primary/10 rounded w-24 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-primary/10 rounded w-16 animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 bg-primary/10 rounded-full w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-8 bg-primary/10 rounded w-20 ml-auto animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-foreground/50">
                  {t("No invoices found.", "لم يتم العثور على فواتير.")}
                </TableCell>
              </TableRow>
            ) : (
              invoices.map(inv => (
                <TableRow key={inv.id} className="border-border hover:bg-primary/5">
                  <TableCell className="font-mono font-medium">{inv.number}</TableCell>
                  <TableCell className="text-white/80">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold">{inv.amount} {inv.currency}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inv.status === 'paid' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                      inv.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/20' :
                      'bg-white/10 text-foreground/70 border-border'
                    }>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-border">
                      {t("Download PDF", "تحميل PDF")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </ClientLayout>
  );
}
