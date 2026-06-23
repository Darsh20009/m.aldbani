import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyConsultations, useGetMyMessages, useGetMyNotifications } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function ClientDashboard() {
  const { t } = useLanguage();
  
  const { data: consultationsData, isLoading: loadingConsultations } = useGetMyConsultations();
  const { data: messagesData, isLoading: loadingMessages } = useGetMyMessages();
  const { data: notificationsData } = useGetMyNotifications();

  const consultations = Array.isArray(consultationsData) ? consultationsData : [];
  const messages = Array.isArray(messagesData) ? messagesData : [];
  const notifications = Array.isArray(notificationsData) ? notificationsData : [];

  const upcomingConsultations = consultations.filter(c => c.status === "upcoming" || c.status === "pending");
  const unreadMessages = messages.filter(m => !m.read);
  const unreadNotifications = notifications.filter(n => !n.read);

  if (loadingConsultations || loadingMessages) {
    return (
      <ClientLayout>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-primary">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">{t("Upcoming Consultations", "استشارات قادمة")}</h3>
          <p className="text-3xl font-bold font-mono">{upcomingConsultations.length}</p>
        </div>
        
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-secondary">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">{t("Unread Messages", "رسائل غير مقروءة")}</h3>
          <p className="text-3xl font-bold font-mono">{unreadMessages.length}</p>
        </div>
        
        <div className="glass-card p-6 rounded-xl border-l-4 border-l-white/20">
          <h3 className="text-foreground/60 text-sm font-medium mb-2">{t("Notifications", "إشعارات")}</h3>
          <p className="text-3xl font-bold font-mono">{unreadNotifications.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">{t("Next Consultation", "الاستشارة القادمة")}</h2>
            <Link href="/client/consultations" className="text-sm text-primary hover:underline">
              {t("View all", "عرض الكل")}
            </Link>
          </div>
          
          {upcomingConsultations.length > 0 ? (
            <div className="p-4 bg-white/5 rounded-lg border border-border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-lg mb-1">{upcomingConsultations[0].type}</p>
                  <p className="text-foreground/60 text-sm">{upcomingConsultations[0].date} at {upcomingConsultations[0].time}</p>
                </div>
                <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded font-medium">
                  {upcomingConsultations[0].status}
                </span>
              </div>
              {upcomingConsultations[0].meetingLink ? (
                <a href={upcomingConsultations[0].meetingLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-2 bg-primary text-white rounded font-medium text-sm hover:bg-primary/90 transition-colors">
                  {t("Join Meeting", "انضم للاجتماع")}
                </a>
              ) : (
                <div className="text-center py-2 bg-white/5 text-foreground/50 rounded font-medium text-sm">
                  {t("Meeting link pending", "رابط الاجتماع قيد الانتظار")}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-white/40">
              {t("No upcoming consultations.", "لا توجد استشارات قادمة.")}
            </div>
          )}
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-heading">{t("Recent Messages", "أحدث الرسائل")}</h2>
            <Link href="/client/messages" className="text-sm text-primary hover:underline">
              {t("Go to chat", "الذهاب للمحادثة")}
            </Link>
          </div>
          
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.slice(0, 3).map(msg => (
                <div key={msg.id} className="p-3 bg-white/5 rounded-lg border border-border/50 flex gap-3">
                  <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center shrink-0 text-primary text-xs">
                    {msg.senderName.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-sm">{msg.senderName}</p>
                      <p className="text-xs text-white/40">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-foreground/70 truncate">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-white/40">
              {t("No messages.", "لا توجد رسائل.")}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
