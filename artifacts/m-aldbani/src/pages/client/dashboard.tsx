import { ClientLayout } from "../../components/layout/ClientLayout";
import { useLanguage } from "../../hooks/use-language";
import { useGetMyConsultations, useGetMyMessages, useGetMyNotifications } from "@workspace/api-client-react";
import { Link } from "wouter";
import { CalendarDays, MessageSquare, Bell, ArrowRight, Video } from "lucide-react";

export default function ClientDashboard() {
  const { language, t } = useLanguage();
  
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
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />)}
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border shadow-sm p-6 rounded-xl flex items-start justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{t("Upcoming Consultations", "استشارات قادمة")}</h3>
            <p className="text-3xl font-bold font-heading">{upcomingConsultations.length}</p>
          </div>
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <CalendarDays className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-card border border-border shadow-sm p-6 rounded-xl flex items-start justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{t("Unread Messages", "رسائل غير مقروءة")}</h3>
            <p className="text-3xl font-bold font-heading">{unreadMessages.length}</p>
          </div>
          <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>
        
        <div className="bg-card border border-border shadow-sm p-6 rounded-xl flex items-start justify-between">
          <div>
            <h3 className="text-muted-foreground text-sm font-medium mb-1">{t("Notifications", "إشعارات")}</h3>
            <p className="text-3xl font-bold font-heading">{unreadNotifications.length}</p>
          </div>
          <div className="p-3 bg-accent/10 text-accent rounded-lg">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-card border border-border shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold font-heading">{t("Next Consultation", "الاستشارة القادمة")}</h2>
            <Link href="/client/consultations" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t("View all", "عرض الكل")}
            </Link>
          </div>
          
          {upcomingConsultations.length > 0 ? (
            <div className="p-5 bg-muted/30 rounded-xl border border-border/50">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="font-bold text-base mb-1">{upcomingConsultations[0].type}</p>
                  <p className="text-muted-foreground text-sm">{upcomingConsultations[0].date} at {upcomingConsultations[0].time}</p>
                </div>
                <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">
                  {upcomingConsultations[0].status}
                </span>
              </div>
              {upcomingConsultations[0].meetingLink ? (
                <a href={upcomingConsultations[0].meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
                  <Video className="w-4 h-4" />
                  {t("Join Meeting", "انضم للاجتماع")}
                </a>
              ) : (
                <div className="text-center py-2.5 bg-background border border-border text-muted-foreground rounded-lg font-medium text-sm">
                  {t("Meeting link pending", "رابط الاجتماع قيد الانتظار")}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-xl border border-border/50 text-muted-foreground text-sm">
              <CalendarDays className="w-8 h-8 mx-auto mb-3 opacity-20" />
              {t("No upcoming consultations.", "لا توجد استشارات قادمة.")}
            </div>
          )}
        </div>

        <div className="bg-card border border-border shadow-sm rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold font-heading">{t("Recent Messages", "أحدث الرسائل")}</h2>
            <Link href="/client/messages" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t("Go to chat", "الذهاب للمحادثة")}
            </Link>
          </div>
          
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.slice(0, 3).map(msg => (
                <div key={msg.id} className="p-4 bg-muted/30 rounded-xl border border-border/50 flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary text-sm font-bold">
                    {msg.senderName.charAt(0)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-medium text-sm text-foreground">{msg.senderName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(msg.createdAt).toLocaleDateString()}</p>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-muted/30 rounded-xl border border-border/50 text-muted-foreground text-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-20" />
              {t("No messages.", "لا توجد رسائل.")}
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
