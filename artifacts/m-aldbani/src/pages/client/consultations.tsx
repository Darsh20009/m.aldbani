import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyConsultations } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CalendarDays, Video } from "lucide-react";

export default function ClientConsultations() {
  const { t } = useLanguage();
  const { data: rawConsultations, isLoading } = useGetMyConsultations();
  const consultations = Array.isArray(rawConsultations) ? rawConsultations : [];

  return (
    <ClientLayout>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold font-heading mb-1">{t("My Consultations", "استشاراتي")}</h1>
          <p className="text-sm text-muted-foreground">{t("Track your upcoming and past sessions", "تتبع جلساتك القادمة والسابقة")}</p>
        </div>
      </div>

      <div className="bg-card border border-border shadow-sm rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium h-12">{t("Date & Time", "التاريخ والوقت")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Type", "النوع")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Status", "الحالة")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12">{t("Price", "السعر")}</TableHead>
              <TableHead className="text-muted-foreground font-medium h-12 text-right">{t("Action", "إجراء")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3].map(i => (
                <TableRow key={i} className="border-border hover:bg-transparent">
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-24 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-32 animate-pulse" /></TableCell>
                  <TableCell><div className="h-6 bg-muted-foreground/10 rounded-full w-20 animate-pulse" /></TableCell>
                  <TableCell><div className="h-4 bg-muted-foreground/10 rounded w-16 animate-pulse" /></TableCell>
                  <TableCell><div className="h-8 bg-muted-foreground/10 rounded w-24 ml-auto animate-pulse" /></TableCell>
                </TableRow>
              ))
            ) : consultations.length === 0 ? (
              <TableRow className="border-border hover:bg-transparent">
                <TableCell colSpan={5} className="py-16 text-center">
                  <CalendarDays className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">{t("No consultations found.", "لم يتم العثور على استشارات.")}</p>
                </TableCell>
              </TableRow>
            ) : (
              consultations.map(c => (
                <TableRow key={c.id} className="border-border hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">
                    <div className="text-foreground">{c.date}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.time}</div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{c.type}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      c.status === 'upcoming' ? 'bg-primary/10 text-primary border-primary/20' :
                      c.status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                      c.status === 'cancelled' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                      'bg-muted text-muted-foreground border-border'
                    }>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{c.price ? `$${c.price}` : '-'}</TableCell>
                  <TableCell className="text-right">
                    {c.meetingLink ? (
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm w-full max-w-[120px]" asChild>
                        <a href={c.meetingLink} target="_blank" rel="noopener noreferrer">
                          <Video className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                          {t("Join", "انضم")}
                        </a>
                      </Button>
                    ) : c.status === 'pending' ? (
                      <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md inline-block">{t("Pending link", "في الانتظار")}</span>
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
