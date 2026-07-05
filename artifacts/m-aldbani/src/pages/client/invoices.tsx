import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyInvoices } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { SarIcon } from "@/components/ui/SarIcon";
import { Receipt, Download } from "lucide-react";

export default function ClientInvoices() {
  const { t } = useLanguage();
  const { data: rawInvoices, isLoading } = useGetMyInvoices();
  const invoices = Array.isArray(rawInvoices) ? rawInvoices : [];

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1">{t("Invoices", "الفواتير")}</h1>
        <p className="text-sm text-muted-foreground">{t("View and download your billing history", "عرض وتحميل سجل الفواتير الخاص بك")}</p>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium h-12">{t("Invoice #", "رقم الفاتورة")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Date", "التاريخ")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Amount", "المبلغ")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Status", "الحالة")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12 text-right">{t("Action", "إجراء")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="border-border hover:bg-transparent">
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-24 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-16 animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 bg-muted-foreground/10 rounded-full w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-8 bg-muted-foreground/10 rounded w-28 ml-auto animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : invoices.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center">
                  <Receipt className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("No invoices found.", "لم يتم العثور على فواتير.")}</p>
                </TableCell>
              </TableRow>
            ) : (
              invoices.map(inv => (
                <TableRow key={inv.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-mono font-medium text-foreground">{inv.number}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(inv.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="font-bold text-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      {inv.amount.toLocaleString("ar-SA")} <SarIcon size={14} className="text-muted-foreground" />
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      inv.status === 'paid' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      inv.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }>
                      {inv.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" className="border-border hover:bg-primary/5 hover:text-primary transition-colors text-xs">
                      <Download className="w-3.5 h-3.5 mr-1.5 rtl:ml-1.5 rtl:mr-0" />
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
