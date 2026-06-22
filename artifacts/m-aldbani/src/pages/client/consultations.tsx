import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyConsultations } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export default function ClientConsultations() {
  const { t } = useLanguage();
  const { data: consultations = [], isLoading } = useGetMyConsultations();

  return (
    <ClientLayout>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold font-heading">{t("My Consultations", "استشاراتي")}</h1>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-white/60">{t("Date & Time", "التاريخ والوقت")}</TableHead>
              <TableHead className="text-white/60">{t("Type", "النوع")}</TableHead>
              <TableHead className="text-white/60">{t("Status", "الحالة")}</TableHead>
              <TableHead className="text-white/60">{t("Price", "السعر")}</TableHead>
              <TableHead className="text-white/60 text-right">{t("Action", "إجراء")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="border-white/10 hover:bg-white/5">
                  <TableCell><div className="h-4 bg-white/10 rounded w-24 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-white/10 rounded w-32 animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 bg-white/10 rounded-full w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-white/10 rounded w-16 animate-pulse" /></TableCell>
                  <TableCell><div className="h-8 bg-white/10 rounded w-24 ml-auto animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : consultations.length === 0 ? (
              <TableRow className="border-white/10 hover:bg-transparent">
                <TableCell colSpan={5} className="text-center py-8 text-white/50">
                  {t("No consultations found.", "لم يتم العثور على استشارات.")}
                </TableCell>
              </TableRow>
            ) : (
              consultations.map(c => (
                <TableRow key={c.id} className="border-white/10 hover:bg-white/5">
                  <TableCell className="font-medium">
                    <div className="text-white">{c.date}</div>
                    <div className="text-sm text-white/50">{c.time}</div>
                  </TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      c.status === 'upcoming' ? 'bg-primary/20 text-primary border-primary/20' :
                      c.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/20' :
                      c.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border-red-500/20' :
                      'bg-white/10 text-white/70 border-white/20'
                    }>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{c.price ? `$${c.price}` : '-'}</TableCell>
                  <TableCell className="text-right">
                    {c.meetingLink ? (
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white" asChild>
                        <a href={c.meetingLink} target="_blank" rel="noopener noreferrer">
                          {t("Join", "انضم")}
                        </a>
                      </Button>
                    ) : c.status === 'pending' ? (
                      <span className="text-sm text-white/40">{t("Pending link", "في الانتظار")}</span>
                    ) : null}
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
