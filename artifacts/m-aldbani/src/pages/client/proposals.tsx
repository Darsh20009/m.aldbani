import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SarIcon } from "@/components/ui/SarIcon";
import { FileText, CheckCircle2, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const token = () => localStorage.getItem("token") ?? "";
const authFetch = (url: string, opts: RequestInit = {}) =>
  fetch(url, { ...opts, headers: { "Content-Type": "application/json", Authorization: `Bearer ${token()}`, ...(opts.headers ?? {}) } });

type ProposalItem = { description: string; quantity: number; unitPrice: number };
type Proposal = {
  id: string; number: string; title: string;
  items: ProposalItem[]; total: number; currency: string;
  status: string; validUntil: string; notes: string; createdAt: string;
};

const STATUS: Record<string, { label: string; labelAr: string; className: string }> = {
  draft:    { label: "Draft",    labelAr: "مسودة",   className: "bg-muted text-muted-foreground border-border" },
  sent:     { label: "New",      labelAr: "جديد",    className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  viewed:   { label: "Viewed",   labelAr: "مُراجع",  className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  accepted: { label: "Accepted", labelAr: "مقبول",   className: "bg-green-500/10 text-green-600 border-green-500/20" },
  rejected: { label: "Rejected", labelAr: "مرفوض",  className: "bg-red-500/10 text-red-600 border-red-500/20" },
  expired:  { label: "Expired",  labelAr: "منتهي",   className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
};

export default function ClientProposals() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: proposals = [], isLoading } = useQuery<Proposal[]>({
    queryKey: ["client-proposals"],
    queryFn: () => authFetch("/api/client/proposals").then(r => r.json()),
  });

  const respondMut = useMutation({
    mutationFn: ({ id, decision }: { id: string; decision: "accepted" | "rejected" }) =>
      authFetch(`/api/client/proposals/${id}/respond`, { method: "POST", body: JSON.stringify({ decision }) }).then(r => r.json()),
    onSuccess: (_, vars) => {
      toast({ title: vars.decision === "accepted" ? t("Proposal accepted ✓", "تم قبول العرض ✓") : t("Proposal declined", "تم رفض العرض") });
      qc.invalidateQueries({ queryKey: ["client-proposals"] });
    },
  });

  const canRespond = (s: string) => s === "sent" || s === "viewed";

  return (
    <ClientLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-heading mb-1">{t("Price Proposals", "عروض الأسعار")}</h1>
        <p className="text-sm text-muted-foreground">{t("Review and respond to price proposals", "راجع عروض الأسعار المرسلة إليك وردّ عليها")}</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-muted/40 rounded-2xl animate-pulse" />)}
        </div>
      ) : proposals.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl py-20 flex flex-col items-center gap-3">
          <FileText className="w-14 h-14 text-muted-foreground/20" />
          <p className="text-muted-foreground font-medium">{t("No proposals yet", "لا توجد عروض أسعار بعد")}</p>
          <p className="text-muted-foreground/60 text-sm text-center max-w-xs">{t("When a proposal is sent to you, it will appear here.", "عندما يتم إرسال عرض سعر إليك، سيظهر هنا.")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {proposals.map(p => {
            const st = STATUS[p.status] ?? STATUS.draft;
            const isExpanded = expanded === p.id;
            const isExpired = new Date(p.validUntil) < new Date() && !["accepted","rejected"].includes(p.status);
            return (
              <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm transition-all">
                {/* Header */}
                <button className="w-full px-6 py-5 flex items-center gap-4 text-left rtl:text-right hover:bg-muted/30 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : p.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                      <span className="font-mono text-xs text-muted-foreground">{p.number}</span>
                      <Badge variant="outline" className={st.className + " text-xs"}>{t(st.label, st.labelAr)}</Badge>
                      {isExpired && <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20 text-xs">{t("Expired", "منتهي الصلاحية")}</Badge>}
                    </div>
                    <p className="font-semibold text-foreground truncate">{p.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Valid until", "صالح حتى")}: {new Date(p.validUntil).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right rtl:text-left flex-shrink-0">
                    <p className="text-xl font-bold text-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        {p.total.toLocaleString("ar-SA")} <SarIcon size={16} className="text-muted-foreground" />
                      </span>
                    </p>
                  </div>
                  <div className="text-muted-foreground ml-2 rtl:mr-2 rtl:ml-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-border px-6 py-5 space-y-5">
                    {/* Items table */}
                    <div className="rounded-xl border border-border overflow-hidden" dir="rtl">
                      <table className="w-full text-sm">
                        <thead><tr className="bg-muted/50">
                          <th className="py-2.5 px-4 text-right text-muted-foreground font-medium">{t("Description","الوصف")}</th>
                          <th className="py-2.5 px-4 text-center text-muted-foreground font-medium">{t("Qty","الكمية")}</th>
                          <th className="py-2.5 px-4 text-right text-muted-foreground font-medium">{t("Unit Price","سعر الوحدة")}</th>
                          <th className="py-2.5 px-4 text-right text-muted-foreground font-medium">{t("Total","الإجمالي")}</th>
                        </tr></thead>
                        <tbody>{p.items.map((it, i) => (
                          <tr key={i} className="border-t border-border">
                            <td className="py-2.5 px-4 text-foreground">{it.description}</td>
                            <td className="py-2.5 px-4 text-center text-muted-foreground">{it.quantity}</td>
                            <td className="py-2.5 px-4 text-foreground">{it.unitPrice.toLocaleString("ar-SA")} ر.س</td>
                            <td className="py-2.5 px-4 font-semibold text-foreground">{(it.quantity * it.unitPrice).toLocaleString("ar-SA")} ر.س</td>
                          </tr>
                        ))}</tbody>
                        <tfoot><tr className="bg-muted/30 border-t border-border">
                          <td colSpan={3} className="py-3 px-4 font-bold text-foreground text-right">{t("Grand Total","الإجمالي الكلي")}</td>
                          <td className="py-3 px-4 font-bold text-primary text-right">
                            <span className="inline-flex items-center gap-1.5">{p.total.toLocaleString("ar-SA")} <SarIcon size={14} /></span>
                          </td>
                        </tr></tfoot>
                      </table>
                    </div>

                    {p.notes && (
                      <div className="bg-muted/30 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed" dir="rtl">
                        {p.notes}
                      </div>
                    )}

                    {canRespond(p.status) && !isExpired && (
                      <div className="flex items-center gap-3 pt-1" dir="rtl">
                        <Button onClick={() => respondMut.mutate({ id: p.id, decision: "accepted" })}
                          disabled={respondMut.isPending}
                          className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                          <CheckCircle2 className="w-4 h-4" /> {t("Accept Proposal","قبول العرض")}
                        </Button>
                        <Button variant="outline" onClick={() => respondMut.mutate({ id: p.id, decision: "rejected" })}
                          disabled={respondMut.isPending}
                          className="gap-2 border-red-200 text-red-600 hover:bg-red-50">
                          <XCircle className="w-4 h-4" /> {t("Decline","رفض")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </ClientLayout>
  );
}
